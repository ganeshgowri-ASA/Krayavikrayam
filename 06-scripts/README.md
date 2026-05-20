# TBE Scoring Pipeline

Deterministic Technical Bid Evaluation scoring for PV-test equipment packages
(UV-2, 4-in-1, TCHFDH20, TCHFDH10, DH20, PID power supplies, TCHF-LETID).

```
00-rules/CLAUDE.md       — locked scoring rules (read once, never invented)
01-templates/*.xlsx      — master TBE workbooks (preserve VBA, ext. links)
02-comparison-files/     — vendor comparison spreadsheets (read-only)
03-rfp-docs/             — RFP PDFs (read-only)
05-evidence/<PKG>.md     — per-vendor structured evidence (fenced JSON blocks)
06-scripts/              — this folder: pyproject.toml, fill_tbe.py, build_template.py
07-output/               — filled TBE workbooks + JSON sidecars
```

## One-shot

```bash
cd 06-scripts
uv venv
uv pip install openpyxl
uv run python build_template.py          # only when seeding a placeholder
uv run python fill_tbe.py --package UV-2
```

Outputs:
- `07-output/TBE-UV2_filled_<YYYY-MM-DD>.xlsx`  (master, sheets 1-4 untouched)
- `07-output/TBE-UV2_filled_<YYYY-MM-DD>.json`  (Vercel stub consumes this)

## Guarantees

1. **No invention.** Every Score / SxW / Comment is computed only from
   `05-evidence/*.md` JSON blocks. Missing facts produce `"Not declared —
   vendor clarification required"` plus the prescribed penalty.
2. **Source-tagged.** Every comment ends with one or more
   `Ref: <file>!<sheet>!Row N — '<verbatim quote>'` tags.
3. **No cross-vendor transfer.** Vendor A's score is built from Vendor A's
   evidence JSON alone. OEM ↔ Indian-entity mappings (Zealwe↔Aster, etc.)
   are recorded in comments, never imported as facts.
4. **Sheets 1-comparison / 2-Utilities / 3-Warranty / 4-BOM** are never
   written.
5. **Capex rows** stay blank with
   `"TBC — Procurement Team assessment, sealed commercial offer"`.

## Adding a new package

1. Drop the master template into `01-templates/TBE-<PKG>.xlsx` (or run
   `build_template.py` for a placeholder).
2. Add per-vendor JSON blocks to `05-evidence/<PKG>_evidence.md` following
   the schema in `UV-2_evidence.md`.
3. Run `uv run python fill_tbe.py --package <PKG>`.

The scorer keys off the Subcategory text in the header — keep
`Design Concept`, `Ease of Operation`, `Equipment Availability`, etc., as
visible prefixes and the routing will find them automatically.

## Vercel stub

`app/procurement/tbe/page.tsx` is a server component that reads every
`07-output/*.json` sidecar and renders the totals + anomalies table.  No
secrets, no fabrication — same data the procurement team sees from the
Python summary.
