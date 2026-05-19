---
name: tbe-evaluator
description: |
  Deterministic Technical Bid Evaluation for PV-test equipment packages
  (4-in-1, UV-2, TCHFDH20, TCHFDH10, DH20, BBA simulator, PID power supplies,
  TCHF-LETID power supplies). USE when the user asks to "fill TBE", "score
  vendors", "compare conventional vs advanced", "generate management pitch",
  or names any of these packages. Bound by 00-rules/CLAUDE.md — no
  fabrication, no cross-vendor transfer, every Score/SxW/Comment carries a
  Ref: tag.
---

# TBE Evaluator Skill

## What this skill does
Runs the deterministic TBE pipeline end-to-end:

1. **Evidence intake.**  Reads `05-evidence/<PKG>_evidence.md` (one fenced
   `json` block per vendor).  If `PINECONE_API_KEY` is set, also calls
   `06-scripts/pinecone_client.py` to fetch new vendor docs and updates the
   markdown — never overwriting human-curated quotes.
2. **Score + fill.**  Calls `uv run python 06-scripts/fill_tbe.py
   --package <PKG>`.  Writes `07-output/TBE-<PKG>_filled_<DATE>.xlsx` plus a
   JSON sidecar.  Sheets 1-comparison / 2-Utilities / 3-Warranty / 4-BOM are
   never touched.
3. **Compare conventional vs advanced.**  Calls `06-scripts/compare_packages.py`
   to bucket vendors by the `advanced_features` block (AI integration, LED-UV,
   unified HMI for chamber + supply, OPC-UA + REST + LIMS, multi-physics
   simulation reports) and emit a delta matrix.
4. **Pitch generator.**  Calls `06-scripts/build_pitch.py` to produce
   `07-output/management-pitch_<PKG>_<DATE>.md` — a deck-ready markdown
   document that leads with the **vendor's own declared differentiators**,
   never invented ones.

## Hard rules (read every time)
- **Never invent.**  If `evidence.md` has `null`, the cell becomes
  `"Not declared — vendor clarification required"` plus the prescribed penalty.
- **No cross-vendor transfer.**  Vendor A's score is built from Vendor A's
  JSON only.  OEM ↔ Indian-entity mappings (Zealwe↔Aster etc.) are recorded
  in the comment, never imported as a fact.
- **Source-tagged.**  Every comment ends with `Ref: <file>!<sheet>!Row N — '<verbatim quote>'`.
- **Capex blank.**  Capex rows hold `"TBC — Procurement Team assessment, sealed commercial offer"`.
- **No personal experience.**  Field intuition shapes the *rules* in CLAUDE.md
  but never the deliverable text.
- **Protected sheets.**  Never write to 1-comparison / 2-Utilities / 3-Warranty / 4-BOM.

## Pitch protocol (Zenitek-style "pro" pitch)
The pitch generator emphasises *declared* advanced features per vendor.  It
does NOT manufacture differentiation:

- AI integration → only if `advanced_features.ai_integration` is non-null.
- LED-UV instead of metal-halide → only if `lamp.type` contains "LED" with a Ref.
- Unified chamber + power-supply HMI → only if `digital.unified_hmi` is non-null.
- Multi-physics validation reports → only if `simulation_validation.*` has refs.

When a vendor (e.g. Zenitek) has no declared advanced features yet, the
pitch surfaces this as a **clarification request**, not as a weakness — the
right read for a draft TBE.

## Invocation
- `/tbe UV-2` — full pipeline for UV-2.
- `/tbe 4-in-1` — full pipeline for 4-in-1 (anchor: Aster ≈ 54.3/1000 CFT-approved).
- `/tbe --all` — every package with an evidence file.
- `/tbe --pitch UV-2` — pitch markdown only (assumes xlsx already filled).
- `/tbe --pinecone UV-2` — re-fetch from Pinecone Assistant before filling.

## Package weight overrides
- UV-based chambers (4-in-1, UV-2): Design Concept = 30, Ease of Op = 5.
- Normal chambers (TCHFDH20, TCHFDH10, DH20) + power supplies (PID, TCHF-LETID,
  BBA simulator): Design Concept = 32, Ease of Op = 7.

These overrides live in the template W column, not in code, so the script
adapts when the right template is committed.

## Multi-physics evidence (new block in v2 schema)
`simulation_validation` per vendor:

```json
"simulation_validation": {
  "thermal_cfd":   { "value": "ANSYS Fluent report attached", "ref": {...} },
  "radiation_uv":  { "value": "OptisWorks ray-trace, ±2% on module plane", "ref": {...} },
  "structural_fea":{ "value": null },
  "electrical_emc":{ "value": "CISPR-11 Class A, NABL report 2025", "ref": {...} },
  "coupled_thermal_radiation": { "value": null, "note": "vendor clarification required" }
}
```

The scorer checks for **co-occurrence** of thermal + radiation + structural
on the same module — that's the "advanced" signature.  Single-physics
reports score baseline; coupled multi-physics scores +2 on Design Concept
and +1 on Technology Maturity.

## Outputs
- `07-output/TBE-<PKG>_filled_<DATE>.xlsx` — the workbook procurement reviews.
- `07-output/TBE-<PKG>_filled_<DATE>.json` — sidecar consumed by `/procurement/tbe`.
- `07-output/management-pitch_<PKG>_<DATE>.md` — slide-deck-ready prose.
- `07-output/conventional-vs-advanced_<PKG>_<DATE>.md` — delta matrix.

All four artefacts are deterministic — same inputs → same outputs, byte-stable
modulo timestamp.
