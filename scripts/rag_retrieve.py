"""RAG retrieval layer.

Connects to the Pinecone Assistant
``pv-test-equipment-comparison-tbe-queies`` (note the spelling -- this is
the actual assistant name the procurement team created), runs the eight
standard per-equipment queries (plus the two sun-simulator queries when
applicable), and merges any user-supplied facts before persisting evidence
to ``evidence/<package>/<vendor>.json``.

The retrieval layer never invents values. When the Assistant does not
return a parseable JSON object for a given field, the field is recorded
as ``"Not declared"`` and the downstream TBE writer applies the prescribed
penalty (see ``scripts.scoring``).

Usage::

    python -m scripts.rag_retrieve --package UV2 --vendor Atlas \\
        --facts facts/atlas.json

If the ``PINECONE_API_KEY`` env var is missing, retrieval falls back to
``--facts`` only (so the rest of the pipeline can be exercised offline);
in that case every Pinecone-derived field is recorded as
``"Not declared"`` with ``provenance = "no-pinecone"``.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from .packages import NOT_DECLARED, Package, by_key
from .queries import Query, queries_for


log = logging.getLogger("rag_retrieve")

ASSISTANT_NAME = "pv-test-equipment-comparison-tbe-queies"
EVIDENCE_ROOT = Path("evidence")


# ---------------------------------------------------------------------------
# Pinecone Assistant wrapper
# ---------------------------------------------------------------------------


@dataclass
class AssistantClient:
    """Thin wrapper around the Pinecone Assistant.

    Kept thin on purpose: tests inject a fake by passing ``client=...``
    to :func:`retrieve_for_vendor`.
    """

    name: str = ASSISTANT_NAME
    _impl: Any = None  # actual ``pinecone.Pinecone().assistant.Assistant``

    def __post_init__(self) -> None:
        if self._impl is not None:
            return
        api_key = os.environ.get("PINECONE_API_KEY")
        if not api_key:
            log.warning("PINECONE_API_KEY not set; Pinecone retrieval disabled.")
            return
        try:
            from pinecone import Pinecone  # type: ignore[import-not-found]
        except ImportError:
            log.warning("pinecone package not installed; Pinecone retrieval disabled.")
            return
        pc = Pinecone(api_key=api_key)
        self._impl = pc.assistant.Assistant(assistant_name=self.name)

    def available(self) -> bool:
        return self._impl is not None

    def ask(self, prompt: str) -> str:
        """Return raw Assistant response text for ``prompt``."""
        if not self.available():
            raise RuntimeError("Pinecone Assistant unavailable")
        from pinecone_plugins.assistant.models.chat import Message  # type: ignore[import-not-found]

        msg = Message(role="user", content=prompt)
        resp = self._impl.chat(messages=[msg])
        # Newer plugin versions return an object with .message.content;
        # older versions return a dict. Handle both.
        if isinstance(resp, dict):
            return (
                resp.get("message", {}).get("content")
                or resp.get("choices", [{}])[0].get("message", {}).get("content", "")
            )
        return getattr(resp.message, "content", "") or ""


# ---------------------------------------------------------------------------
# Response parsing
# ---------------------------------------------------------------------------


def _parse_json_block(text: str) -> dict[str, Any] | None:
    """Extract the first JSON object from ``text``. Returns ``None`` on
    failure -- we never raise, because a malformed response must surface
    downstream as ``Not declared`` rather than crash the pipeline."""
    if not text:
        return None
    # Strip markdown fences if present.
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```", 2)[1]
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
    # Find the outermost JSON object.
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        return json.loads(cleaned[start : end + 1])
    except json.JSONDecodeError:
        return None


def _coerce_field(payload: dict[str, Any] | None, schema: Iterable[str]) -> dict[str, Any]:
    """Coerce a parsed payload into the canonical evidence shape.

    Missing keys become ``"Not declared"``. Mandatory provenance keys
    (``source_file``, ``sheet``, ``row``, ``verbatim_quote``) are always
    present in the output, even if the response omitted them.
    """
    out: dict[str, Any] = {}
    payload = payload or {}
    for key in schema:
        v = payload.get(key, NOT_DECLARED)
        if v is None or v == "":
            v = NOT_DECLARED
        out[key] = v
    for prov in ("source_file", "sheet", "row", "verbatim_quote"):
        out.setdefault(prov, NOT_DECLARED)
    return out


# ---------------------------------------------------------------------------
# Evidence assembly
# ---------------------------------------------------------------------------


def _run_query(client: AssistantClient, query: Query, package: Package, vendor: str) -> dict[str, Any]:
    prompt = query.prompt.format(package=package.display_name, vendor=vendor)
    if not client.available():
        return {
            "value": _coerce_field(None, query.schema),
            "retrieved_at": _now(),
            "provenance": "no-pinecone",
        }
    try:
        raw = client.ask(prompt)
    except Exception as exc:  # network, rate-limit, plugin error
        log.error("Pinecone query %s failed: %s", query.key, exc)
        return {
            "value": _coerce_field(None, query.schema),
            "retrieved_at": _now(),
            "provenance": f"error:{type(exc).__name__}",
        }
    parsed = _parse_json_block(raw)
    return {
        "value": _coerce_field(parsed, query.schema),
        "retrieved_at": _now(),
        "provenance": "pinecone",
        "raw_response": raw,
    }


def _now() -> str:
    return datetime.now(tz=timezone.utc).isoformat(timespec="seconds")


def _merge_user_facts(evidence: dict[str, Any], facts: dict[str, Any]) -> dict[str, Any]:
    """Overlay user-supplied facts on top of Pinecone evidence.

    The user can override any field; the overlay is tagged
    ``provenance: "user"`` so reviewers can always tell which values were
    declared by the procurement team and which came from the Assistant.
    """
    if not facts:
        return evidence
    for key, value in facts.items():
        if key not in evidence:
            evidence[key] = {
                "value": value,
                "retrieved_at": _now(),
                "provenance": "user",
            }
            continue
        prev = evidence[key]
        # If user provided a dict, merge into the value; else replace value.
        if isinstance(value, dict) and isinstance(prev.get("value"), dict):
            merged = {**prev["value"], **value}
            evidence[key] = {
                "value": merged,
                "retrieved_at": _now(),
                "provenance": "user+" + prev.get("provenance", "pinecone"),
            }
        else:
            evidence[key] = {
                "value": value,
                "retrieved_at": _now(),
                "provenance": "user",
            }
    return evidence


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def retrieve_for_vendor(
    package_key: str,
    vendor: str,
    facts: dict[str, Any] | None = None,
    client: AssistantClient | None = None,
    out_root: Path = EVIDENCE_ROOT,
) -> Path:
    """Run all applicable queries for ``vendor`` on ``package_key`` and
    persist evidence to ``<out_root>/<package_key>/<vendor>.json``.

    Returns the path written.
    """
    package = by_key(package_key)
    client = client or AssistantClient()

    evidence: dict[str, Any] = {
        "_meta": {
            "package": package.key,
            "vendor": vendor,
            "assistant": ASSISTANT_NAME if client.available() else None,
            "generated_at": _now(),
        }
    }

    plan = queries_for(package.is_sun_simulator)
    for query in plan:
        evidence[query.key] = _run_query(client, query, package, vendor)

    if facts:
        _merge_user_facts(evidence, facts)

    out_dir = out_root / package.key
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{_safe(vendor)}.json"
    out_path.write_text(json.dumps(evidence, indent=2, sort_keys=True))
    log.info("Wrote evidence: %s", out_path)
    return out_path


def _safe(name: str) -> str:
    return "".join(c if c.isalnum() or c in "-_." else "_" for c in name)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def _load_facts(arg: str | None) -> dict[str, Any]:
    if not arg:
        if not sys.stdin.isatty():
            data = sys.stdin.read().strip()
            if data:
                return json.loads(data)
        return {}
    p = Path(arg)
    if not p.exists():
        raise FileNotFoundError(arg)
    return json.loads(p.read_text())


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    parser = argparse.ArgumentParser(description="RAG retrieval for TBE evidence.")
    parser.add_argument("--package", required=True, help="Package key, e.g. UV2, DH20, PID20")
    parser.add_argument("--vendor", required=True, help="Vendor name, e.g. Atlas, Zenitek")
    parser.add_argument(
        "--facts",
        help="Path to JSON file with user-supplied facts (or pipe JSON on stdin).",
    )
    parser.add_argument("--out", default=str(EVIDENCE_ROOT), help="Output root directory")
    args = parser.parse_args(argv)

    facts = _load_facts(args.facts)
    path = retrieve_for_vendor(
        package_key=args.package,
        vendor=args.vendor,
        facts=facts,
        out_root=Path(args.out),
    )
    print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
