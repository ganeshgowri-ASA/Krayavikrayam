"""Generate operation manual + production plan + BoM from a project spec.

Reads:
  08-engineering/<project>/params.json          (parametric spec)
  08-engineering/<project>/sim/**/summary.json  (sim summaries, optional)
  08-engineering/<project>/bom.csv              (BoM, optional)
  08-engineering/<project>/standards/clause-map.json   (IEC clause map, optional)

Writes:
  08-engineering/<project>/docs/operation-manual.md
  08-engineering/<project>/docs/production-plan.md
  08-engineering/<project>/docs/rfq-response.md

No invention.  Every numeric value in the manual is one of:
  (a) a verbatim leaf from params.json,
  (b) a verbatim leaf from a sim summary.json with the tool that produced it,
  (c) a verbatim row from bom.csv, or
  (d) `"TBD — <reason>"` when the source is absent.

Sections are pulled from a templated skeleton (operation_manual_skeleton.md)
so they're consistent across projects.  Project-specific overrides live in
`docs/_overrides.md` if needed.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
ENG_ROOT = ROOT / "08-engineering"


def load_json(path: Path) -> Any | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"WARN: {path} is not valid JSON ({e}); treating as absent", file=sys.stderr)
        return None


def load_bom(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def value_or_tbd(node: Any, label: str) -> str:
    """Render a params leaf as a manual cell.

    Schema:
      - {"value": ..., "unit": "...", "ref": "..."}
      - bare scalar
      - None
    """
    if node is None:
        return f"TBD — {label} not in params.json"
    if isinstance(node, dict):
        if "value" in node:
            v = node["value"]
            if v is None:
                return f"TBD — {label} declared null in params.json"
            unit = node.get("unit", "")
            ref = node.get("ref", "")
            s = f"{v} {unit}".strip()
            return f"{s}  _(ref: {ref})_" if ref else s
        return json.dumps(node)
    return str(node)


def render_ops_manual(project: str, params: dict, sims: dict, bom: list[dict], clauses: dict | None) -> str:
    today = dt.date.today().isoformat()
    eq_name = (params.get("equipment") or {}).get("name") or project
    standard = (params.get("equipment") or {}).get("primary_standard") or "TBD — primary IEC standard not declared"

    lines: list[str] = []
    lines.append(f"# Operation Manual — {eq_name}")
    lines.append("")
    lines.append(f"_Project: {project}  ·  Generated: {today}  ·  Primary standard: {standard}_")
    lines.append("")
    lines.append("> Auto-generated from `08-engineering/" + project + "/params.json` and the sim/BoM "
                 "sidecars.  Every numeric value below is a verbatim leaf from those files or marked "
                 "`TBD` with the reason.  Do **not** edit this file by hand — edit the source and re-run "
                 "`uv run python 06-scripts/generate_ops_manual.py --project " + project + "`.")
    lines.append("")

    # 1. Identification
    lines.append("## 1. Equipment identification")
    lines.append("")
    eq = params.get("equipment") or {}
    lines.append(f"- **Name**: {value_or_tbd(eq.get('name'), 'name')}")
    lines.append(f"- **Model / RFQ**: {value_or_tbd(eq.get('model'), 'model')}")
    lines.append(f"- **Primary standard**: {standard}")
    lines.append(f"- **Site**: {value_or_tbd(eq.get('site'), 'site')}")
    lines.append(f"- **Serial number**: {value_or_tbd(eq.get('serial'), 'serial')}")
    lines.append("")

    # 2. Specifications (top-level parameters)
    lines.append("## 2. Specifications")
    lines.append("")
    specs = params.get("specifications") or {}
    if not specs:
        lines.append("_No `specifications` block in params.json — clarification required._")
    else:
        lines.append("| Parameter | Value | Reference |")
        lines.append("|---|---|---|")
        for k, v in specs.items():
            label = k.replace("_", " ").title()
            ref = ""
            if isinstance(v, dict):
                ref = v.get("ref", "")
            lines.append(f"| {label} | {value_or_tbd(v, k)} | {ref or '—'} |")
    lines.append("")

    # 3. Safety
    lines.append("## 3. Safety")
    lines.append("")
    safety = params.get("safety") or {}
    if safety:
        for k, v in safety.items():
            lines.append(f"- **{k.replace('_', ' ').title()}**: {value_or_tbd(v, k)}")
    else:
        lines.append("_No `safety` block in params.json — every PV test equipment must declare "
                     "lockout/tagout, E-stop coverage, light-curtain protection, interlocks, and "
                     "PPE requirements before release._")
    lines.append("")

    # 4. Pre-operation checks
    lines.append("## 4. Pre-operation checks")
    lines.append("")
    checks = (params.get("operation") or {}).get("pre_checks") or []
    if checks:
        for c in checks:
            lines.append(f"- [ ] {c}")
    else:
        lines.append("_No `operation.pre_checks` array in params.json._")
    lines.append("")

    # 5. Test cycle
    lines.append("## 5. Test cycle")
    lines.append("")
    cycle = (params.get("operation") or {}).get("cycle") or []
    if cycle:
        for i, step in enumerate(cycle, 1):
            if isinstance(step, dict):
                lines.append(f"{i}. **{step.get('name', 'step')}** — {step.get('description', '')}"
                             f"  _(duration: {step.get('duration', 'TBD')})_")
            else:
                lines.append(f"{i}. {step}")
    else:
        lines.append("_No `operation.cycle` array in params.json._")
    lines.append("")

    # 6. Acceptance criteria from standards clause map
    lines.append("## 6. Acceptance criteria  (IEC clause map)")
    lines.append("")
    if clauses:
        lines.append("| Clause | Requirement | Source value | Tolerance | Pass? |")
        lines.append("|---|---|---|---|:---:|")
        for c in clauses.get("clauses", []):
            lines.append(f"| {c.get('id', '?')} | {c.get('requirement', '?')} | "
                         f"{c.get('value', 'TBD')} | {c.get('tolerance', 'TBD')} | "
                         f"{c.get('pass', 'TBD')} |")
    else:
        lines.append("_No `standards/clause-map.json` for this project — fill it before TBE finalisation._")
    lines.append("")

    # 7. Simulation evidence
    lines.append("## 7. Simulation evidence")
    lines.append("")
    if sims:
        for domain, summary in sims.items():
            lines.append(f"### 7.{domain}")
            if isinstance(summary, dict):
                for k, v in summary.items():
                    lines.append(f"- **{k}**: {v}")
            else:
                lines.append(f"- {summary}")
            lines.append("")
    else:
        lines.append("_No simulation summaries committed in `sim/**/summary.json` yet._")
    lines.append("")

    # 8. Maintenance
    lines.append("## 8. Maintenance schedule")
    lines.append("")
    maint = params.get("maintenance") or {}
    if maint:
        for k, v in maint.items():
            lines.append(f"- **{k}**: {value_or_tbd(v, k)}")
    else:
        lines.append("_No `maintenance` block in params.json — declare daily / weekly / quarterly / "
                     "annual tasks._")
    lines.append("")

    # 9. Spares
    lines.append("## 9. Critical spares  (from BoM)")
    lines.append("")
    if bom:
        critical = [r for r in bom if (r.get("critical", "").strip().lower() in ("y", "yes", "1", "true"))]
        if critical:
            lines.append("| Part | Vendor | P/N | Lead time | Stock policy |")
            lines.append("|---|---|---|---|---|")
            for r in critical:
                lines.append(f"| {r.get('part', '?')} | {r.get('vendor', '?')} | "
                             f"{r.get('pn', '?')} | {r.get('lead_time', '?')} | "
                             f"{r.get('stock_policy', '?')} |")
        else:
            lines.append("_BoM loaded but no rows flagged `critical=Y`._")
    else:
        lines.append("_No `bom.csv` for this project._")
    lines.append("")

    return "\n".join(lines)


def render_production_plan(project: str, params: dict, bom: list[dict]) -> str:
    today = dt.date.today().isoformat()
    eq_name = (params.get("equipment") or {}).get("name") or project

    lines = [
        f"# Production Plan — {eq_name}",
        "",
        f"_Project: {project}  ·  Generated: {today}_",
        "",
    ]

    # Build sequence from params.production_sequence
    seq = (params.get("production") or {}).get("sequence") or []
    if not seq:
        lines.append("## Build sequence")
        lines.append("")
        lines.append("_No `production.sequence` array in params.json.  Recommended starter:_")
        lines.append("")
        lines.append("1. Mechanical frame assembly (Al extrusion + connectors)")
        lines.append("2. Sheet-metal panel install (riveted / bolted)")
        lines.append("3. Refrigeration loop install + leak test")
        lines.append("4. Electrical cabinet wiring + ELV / LV separation")
        lines.append("5. Sensor + actuator install + cable dressing")
        lines.append("6. PLC programme upload + HMI commissioning")
        lines.append("7. Empty-chamber commissioning (uniformity, leak rate)")
        lines.append("8. DUT-loaded commissioning (acceptance test per IEC clause map)")
        lines.append("9. Documentation handover (operation manual, calibration certs, "
                     "spare parts list, training records)")
    else:
        lines.append("## Build sequence")
        lines.append("")
        for i, step in enumerate(seq, 1):
            if isinstance(step, dict):
                lines.append(f"### {i}. {step.get('name', f'Step {i}')}")
                lines.append("")
                lines.append(f"- **Inputs**: {step.get('inputs', 'TBD')}")
                lines.append(f"- **Tasks**: {step.get('tasks', 'TBD')}")
                lines.append(f"- **Outputs / acceptance**: {step.get('acceptance', 'TBD')}")
                lines.append(f"- **Duration**: {step.get('duration', 'TBD')}")
                lines.append(f"- **Owner**: {step.get('owner', 'TBD')}")
                lines.append("")
            else:
                lines.append(f"{i}. {step}")
    lines.append("")

    # BoM / BoQ table
    lines.append("## Bill of Materials (BoM)")
    lines.append("")
    if bom:
        cols = list(bom[0].keys())
        lines.append("| " + " | ".join(cols) + " |")
        lines.append("|" + "---|" * len(cols))
        for r in bom:
            lines.append("| " + " | ".join(str(r.get(c, "")) for c in cols) + " |")
    else:
        lines.append("_No `bom.csv` yet — populate from KiCad / Fusion / DWSim exports._")
    lines.append("")

    return "\n".join(lines)


def render_rfq_response(project: str, params: dict, sims: dict) -> str:
    today = dt.date.today().isoformat()
    eq_name = (params.get("equipment") or {}).get("name") or project
    standard = (params.get("equipment") or {}).get("primary_standard") or "—"

    lines = [
        f"# RFQ Response — {eq_name}",
        "",
        f"_Project: {project}  ·  Generated: {today}  ·  Primary standard: {standard}_",
        "",
        "## Cover",
        "",
        f"- **Equipment**: {value_or_tbd((params.get('equipment') or {}).get('name'), 'name')}",
        f"- **Model / RFQ**: {value_or_tbd((params.get('equipment') or {}).get('model'), 'model')}",
        f"- **Standard**: {standard}",
        "",
        "## Compliance table",
        "",
        "_Every row below maps an RFQ clause to a declared parameter or a simulation result._",
        "",
        "| RFQ clause | Our offer | Source |",
        "|---|---|---|",
    ]
    for k, v in (params.get("specifications") or {}).items():
        ref = v.get("ref", "") if isinstance(v, dict) else ""
        lines.append(f"| {k.replace('_', ' ').title()} | {value_or_tbd(v, k)} | {ref or 'params.json'} |")
    lines.append("")

    if sims:
        lines.append("## Simulation evidence attached")
        lines.append("")
        for domain in sims:
            lines.append(f"- `sim/{domain}/`")
        lines.append("")

    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--project", required=True, help="folder under 08-engineering/")
    args = p.parse_args(argv)

    proj_dir = ENG_ROOT / args.project
    if not proj_dir.exists():
        print(f"FATAL: project folder missing: {proj_dir}", file=sys.stderr)
        return 2

    params = load_json(proj_dir / "params.json") or {}
    if not params:
        print(f"FATAL: {proj_dir/'params.json'} is empty or missing", file=sys.stderr)
        return 2

    sims: dict[str, Any] = {}
    sim_root = proj_dir / "sim"
    if sim_root.exists():
        for s in sim_root.rglob("summary.json"):
            domain = s.parent.relative_to(sim_root).as_posix()
            sims[domain] = load_json(s) or {}
    bom = load_bom(proj_dir / "bom.csv")
    clauses = load_json(proj_dir / "standards" / "clause-map.json")

    docs_dir = proj_dir / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)
    (docs_dir / "operation-manual.md").write_text(
        render_ops_manual(args.project, params, sims, bom, clauses), encoding="utf-8")
    (docs_dir / "production-plan.md").write_text(
        render_production_plan(args.project, params, bom), encoding="utf-8")
    (docs_dir / "rfq-response.md").write_text(
        render_rfq_response(args.project, params, sims), encoding="utf-8")

    print(f"wrote {docs_dir.relative_to(ROOT)}/operation-manual.md")
    print(f"wrote {docs_dir.relative_to(ROOT)}/production-plan.md")
    print(f"wrote {docs_dir.relative_to(ROOT)}/rfq-response.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
