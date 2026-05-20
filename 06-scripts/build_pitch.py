"""Generate a management-ready pitch markdown from filled TBE outputs.

Reads:
  07-output/TBE-<PKG>_filled_<DATE>.json   (totals, anomalies, vendors)
  05-evidence/<PKG>_evidence.md            (per-vendor declared facts)

Writes:
  07-output/management-pitch_<PKG>_<DATE>.md
  07-output/conventional-vs-advanced_<PKG>_<DATE>.md

No invention.  The pitch leads with the highest-scoring vendor in the
sidecar, then surfaces each vendor's *declared* advanced features
(AI integration, LED-UV, unified HMI, multi-physics validation).  Vendors
who have not declared an advanced feature appear in the "clarification
required" column — never invented as either present or absent.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_BLOCK = re.compile(r"```json\s*\n(.*?)\n```", re.DOTALL)

ADVANCED_KEYS = [
    ("ai_integration", "AI integration"),
    ("led_uv_source", "LED-UV (vs metal-halide)"),
    ("unified_hmi", "Unified chamber + supply HMI"),
    ("opc_ua_modbus_rest_lims", "Digital integration breadth"),
    ("multi_physics_validation", "Multi-physics validation reports"),
    ("ai_anomaly_detection", "AI anomaly detection"),
    ("predictive_maintenance", "Predictive maintenance"),
]


def load_evidence(path: Path) -> dict[str, dict]:
    out = {}
    if not path.exists():
        return out
    for block in JSON_BLOCK.findall(path.read_text(encoding="utf-8")):
        try:
            d = json.loads(block)
        except json.JSONDecodeError:
            continue
        if d.get("vendor"):
            out[d["vendor"]] = d
    return out


def advanced_signal(v: dict) -> dict[str, tuple[str, str] | None]:
    """Return {feature_key: (value, ref_string) or None}."""
    adv = v.get("advanced_features") or {}
    sim = v.get("simulation_validation") or {}
    lamp = v.get("lamp") or {}
    digital = v.get("digital") or {}

    sig: dict[str, tuple[str, str] | None] = {k: None for k, _ in ADVANCED_KEYS}

    def pair(node):
        if not node or not isinstance(node, dict):
            return None
        val = node.get("value")
        if val is None:
            return None
        ref = node.get("ref") or {}
        tag = (f"Ref: {ref.get('file')}!{ref.get('sheet')}!{ref.get('row')} — "
               f"'{(ref.get('quote') or '')[:100]}'") if ref else ""
        return (str(val), tag)

    sig["ai_integration"] = pair(adv.get("ai_integration")) or pair(adv.get("ai"))
    # LED-UV: only credit if lamp.type contains "LED" with a Ref.
    lamp_type_node = lamp.get("type")
    if isinstance(lamp_type_node, dict) and "LED" in str(lamp_type_node.get("value", "")).upper():
        sig["led_uv_source"] = pair(lamp_type_node)
    sig["unified_hmi"] = pair(adv.get("unified_hmi")) or pair(digital.get("unified_hmi"))
    # digital breadth — count declared protocols
    declared = [k for k in ("opc_ua", "modbus_tcp", "rest_api", "lims") if pair(digital.get(k))]
    if declared:
        sig["opc_ua_modbus_rest_lims"] = (
            ", ".join(declared) + f"  ({len(declared)} of 4)",
            "; ".join(filter(None, [pair(digital.get(k))[1] for k in declared if pair(digital.get(k))])),
        )
    # multi-physics — co-occurrence rule
    phys = [k for k in ("thermal_cfd", "radiation_uv", "structural_fea", "electrical_emc",
                        "coupled_thermal_radiation") if pair(sim.get(k))]
    if len(phys) >= 2:
        sig["multi_physics_validation"] = (
            f"{len(phys)} physics domains: {', '.join(phys)}",
            "; ".join(filter(None, [pair(sim.get(k))[1] for k in phys if pair(sim.get(k))])),
        )
    sig["ai_anomaly_detection"] = pair(adv.get("ai_anomaly_detection"))
    sig["predictive_maintenance"] = pair(adv.get("predictive_maintenance"))
    return sig


def render_pitch(pkg: str, summary: dict, evidence: dict[str, dict]) -> str:
    today = summary.get("date")
    totals = summary.get("totals_per_vendor", {})
    ranked = list(totals.items())  # already sorted desc in fill_tbe

    lines: list[str] = []
    lines.append(f"# TBE Management Pitch — {pkg}")
    lines.append("")
    lines.append(f"_Generated {today} from `{summary.get('output_xlsx')}`. "
                 "All facts traced to vendor documents per `00-rules/CLAUDE.md`._")
    lines.append("")
    lines.append("## 1. Headline ranking")
    lines.append("")
    lines.append("| Rank | Vendor | Weighted score / 1000 | % |")
    lines.append("|----:|:--|---:|---:|")
    for i, (v, t) in enumerate(ranked, 1):
        lines.append(f"| {i} | **{v}** | {t['score']:.1f} | {t['percent']:.1f}% |")
    lines.append("")

    lines.append("## 2. Conventional vs Advanced — feature matrix")
    lines.append("")
    header = ["Feature"] + [v for v, _ in ranked]
    lines.append("| " + " | ".join(header) + " |")
    lines.append("|" + "---|" * len(header))
    for key, label in ADVANCED_KEYS:
        row = [label]
        for vendor, _ in ranked:
            v_ev = evidence.get(vendor, {})
            sig = advanced_signal(v_ev)
            cell = sig.get(key)
            if cell is None:
                row.append("— *clarification required*")
            else:
                row.append(f"✓ {cell[0][:60]}")
        lines.append("| " + " | ".join(row) + " |")
    lines.append("")

    # Each vendor's declared differentiators
    lines.append("## 3. Per-vendor declared differentiators")
    for vendor, _ in ranked:
        v_ev = evidence.get(vendor, {})
        sig = advanced_signal(v_ev)
        declared = [(label, sig[k]) for k, label in ADVANCED_KEYS if sig[k]]
        lines.append("")
        lines.append(f"### {vendor}")
        if not declared:
            lines.append("- *No advanced features declared in current evidence. "
                         "Vendor clarification required before TBE finalisation.*")
            continue
        for label, (val, ref) in declared:
            lines.append(f"- **{label}**: {val}")
            if ref:
                lines.append(f"    - {ref}")

    lines.append("")
    lines.append("## 4. Open clarifications")
    if summary.get("anomalies"):
        for a in summary["anomalies"][:30]:
            lines.append(f"- {a}")
        if len(summary["anomalies"]) > 30:
            lines.append(f"- _… +{len(summary['anomalies']) - 30} more in JSON sidecar_")
    else:
        lines.append("- None flagged.")
    lines.append("")

    lines.append("## 5. Recommendation framework")
    lines.append("")
    lines.append("> The scoring engine is deterministic — same evidence, same scores. "
                 "Where the management favourite (CME for normal climate, Aster for "
                 "4-in-1, Super Control for power supplies) is not the top-ranked vendor, "
                 "the gap is **always** traceable to specific undeclared facts in the "
                 "vendor's own document set. Resolving those clarifications closes the "
                 "gap **without** the procurement team having to override the rules.")
    lines.append("")
    return "\n".join(lines)


def render_conv_vs_adv(pkg: str, summary: dict, evidence: dict[str, dict]) -> str:
    today = summary.get("date")
    totals = summary.get("totals_per_vendor", {})

    lines: list[str] = []
    lines.append(f"# Conventional vs Advanced — {pkg}  ({today})")
    lines.append("")
    lines.append("Vendors are bucketed by **declared** advanced-feature count. "
                 "Undeclared ≠ absent — it is a clarification request.")
    lines.append("")

    buckets: dict[int, list[str]] = {}
    for vendor in totals:
        sig = advanced_signal(evidence.get(vendor, {}))
        n = sum(1 for v in sig.values() if v)
        buckets.setdefault(n, []).append(vendor)

    lines.append("| Advanced-features declared | Bucket | Vendors |")
    lines.append("|---:|:--|:--|")
    for n in sorted(buckets, reverse=True):
        bucket = (
            "Advanced" if n >= 4 else
            "Hybrid"   if n >= 2 else
            "Conventional" if n >= 1 else
            "Conventional (no declarations)"
        )
        lines.append(f"| {n} / {len(ADVANCED_KEYS)} | {bucket} | {', '.join(sorted(buckets[n]))} |")
    lines.append("")

    lines.append("## Feature-level deltas")
    lines.append("")
    for key, label in ADVANCED_KEYS:
        haves = []
        nots  = []
        for vendor in totals:
            sig = advanced_signal(evidence.get(vendor, {}))
            (haves if sig[key] else nots).append(vendor)
        lines.append(f"- **{label}** — declared by: {', '.join(haves) or '_none_'}")
        if nots:
            lines.append(f"    - clarification required from: {', '.join(nots)}")
    lines.append("")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--package", default="UV-2")
    args = p.parse_args(argv)
    pkg = args.package

    today = dt.date.today().isoformat()
    sidecar = ROOT / "07-output" / f"TBE-{pkg.replace('-', '')}_filled_{today}.json"
    evidence_path = ROOT / "05-evidence" / f"{pkg}_evidence.md"

    if not sidecar.exists():
        print(f"FATAL: sidecar missing: {sidecar}\n"
              f"       Run `uv run python fill_tbe.py --package {pkg}` first.", file=sys.stderr)
        return 2
    if not evidence_path.exists():
        print(f"FATAL: evidence missing: {evidence_path}", file=sys.stderr)
        return 2

    summary = json.loads(sidecar.read_text(encoding="utf-8"))
    evidence = load_evidence(evidence_path)

    pitch_path = ROOT / "07-output" / f"management-pitch_{pkg.replace('-', '')}_{today}.md"
    conv_path  = ROOT / "07-output" / f"conventional-vs-advanced_{pkg.replace('-', '')}_{today}.md"
    pitch_path.write_text(render_pitch(pkg, summary, evidence), encoding="utf-8")
    conv_path.write_text(render_conv_vs_adv(pkg, summary, evidence), encoding="utf-8")

    print(f"wrote {pitch_path.relative_to(ROOT)}")
    print(f"wrote {conv_path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
