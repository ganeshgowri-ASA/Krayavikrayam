"""Pinecone Assistant retrieval stub.

This script does NOT have an API key in this remote sandbox. It is wired up so
that, given `PINECONE_API_KEY` and `PINECONE_ASSISTANT_NAME` in the env, it can
fetch vendor documents for a given package and emit them as additional fenced
`json` blocks appendable to `05-evidence/<PKG>_evidence.md`.

The retrieval contract:
  - One query per (package, vendor) — keeps the response bounded.
  - Returns only documents that contain the package code AND the vendor name
    (case-insensitive substring match in title or content snippet).
  - Verbatim quotes only — no paraphrase. The `quote` field is the literal
    snippet returned by Pinecone, trimmed to ≤200 chars.
  - Refusal mode: if Pinecone returns nothing, the script writes a
    "Not declared — Pinecone returned no match for '<vendor>' in '<pkg>'" entry,
    preserving the no-invention rule.

Usage (when API key is set):
    PINECONE_API_KEY=... PINECONE_ASSISTANT_NAME=pv-test-equipment-comparison-tbe-queies \
        uv run python 06-scripts/pinecone_client.py --package UV-2 --vendor Zenitek

Without an API key it prints a diagnostic and exits non-zero.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def fetch_vendor(package: str, vendor: str) -> dict | None:
    """Return a vendor evidence dict, or None if no key / no results.

    The actual HTTP call to Pinecone Assistant is left intentionally as a TODO
    so that this script cannot leak secrets or fabricate data in environments
    where the API is unreachable. Wire it up to `pinecone-client` once a key is
    configured in the deploy env.
    """
    api_key = os.environ.get("PINECONE_API_KEY")
    assistant = os.environ.get("PINECONE_ASSISTANT_NAME")
    if not api_key or not assistant:
        print(
            "ERROR: PINECONE_API_KEY and/or PINECONE_ASSISTANT_NAME not set.\n"
            "      Skill cannot retrieve documents in this environment.",
            file=sys.stderr,
        )
        return None

    # TODO(integration): replace with the real Pinecone Assistant chat call.
    # Pseudocode:
    #
    #   from pinecone.assistant import Assistant
    #   a = Assistant(api_key=api_key, name=assistant)
    #   q = (
    #       f"Extract a structured TBE evidence record for vendor '{vendor}' "
    #       f"in package '{package}'. Use ONLY verbatim quotes from indexed "
    #       f"documents. Schema fields: fc_pc_nc, lamp, reliability, spares, "
    #       f"service, digital, advanced_features, simulation_validation, "
    #       f"oem_profile, ctq. Each leaf MUST include {{value, ref{{file,"
    #       f"sheet,row,quote}}}} or null."
    #   )
    #   resp = a.chat(query=q)
    #   return json.loads(resp.json_block)
    print(
        f"NOTE: pinecone_client.py is a stub.  Real call for ({package}, {vendor}) "
        f"would go here.  See SKILL.md for the contract.",
        file=sys.stderr,
    )
    return None


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Fetch a vendor evidence block from Pinecone Assistant (stub).")
    p.add_argument("--package", required=True)
    p.add_argument("--vendor", required=True)
    args = p.parse_args(argv)

    result = fetch_vendor(args.package, args.vendor)
    if result is None:
        return 2
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
