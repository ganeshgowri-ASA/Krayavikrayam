# TBE Scoring Rules — Read this first, follow this always

## Hard rules
1. Never invent standard numbers, MTBF, specs, or vendor claims.
2. Never put a feature on Vendor A unless Vendor A's own document evidences it. No cross-vendor transfer of facts.
3. Never use personal field experience as deliverable text.
4. Every score has a source tag like "Ref: <file>!<sheet>!Row N".
5. Capex rows stay blank — "TBC — Procurement Team assessment, sealed commercial offer".
6. Open Excel templates with openpyxl(keep_vba=True, keep_links=True). Never regenerate from scratch.
7. Save filled files into 07-output/ as TBE-<package>_filled_YYYY-MM-DD.xlsx.
8. Missing facts → write "Not declared — vendor clarification required" AND apply the prescribed penalty below. Do not score generously to hide gaps.
9. Protected sheets (never written): 1-comparison, 2-Utilities, 3-Warranty, 4-BOM.

## Scoring bands (Design Concept / Technical Compliance, max 10)
- 99–100% FC → 10
- 90–98% FC → 9
- 80–89% FC → 8
- 70–79% FC → 7
- 60–69% FC → 6
- <60% FC OR any critical Non-Comply → ≤5

## Penalties (Option A — applied on top of base score, floor 0)
- China-origin critical spare + no India stock + no MTTR declared → −3 on Spare/Service/Availability.
- EU / US / Singapore origin + weak India presence → −2.
- Generic "service will be provided" without quantified SLA → cap Service Lead Time at 5, additional −3.
- 1–2 yr warranty + no MTBF + no installed base → Equipment Availability ≤5. −3 more if combined with origin risk above.
- 3–5 yr warranty + AMC offered + NABL / ISO-17025 calibration → high Equipment Availability AND high Technology Maturity.
- Metal-halide UV lamp ≤2000 h AND no HMI run-hours-vs-warranted-life view → −2 to −3 on Equipment Availability + Ease of Operation.
- HMI not exposing lamp run-hours vs warranted life (visibility penalty) → −1 Ease of Operation.

## Calibration anchor
Aster on 4-in-1 chamber = 54.3 / 1000 (CFT-approved). Hold band 52–56 unless a CTQ deviation forces otherwise.

## Per-package weight overrides
- UV-based chambers (4-in-1, UV-2):
  - Design Concept (Technical Compliance) = 30
  - Ease of Operation & Maintenance / Footprint = 5
- Normal chambers (TCHFDH20, TCHFDH10, DH20) and Power Supplies (PID, TCHF-LETID):
  - Design Concept (Technical Compliance) = 32
  - Ease of Operation & Maintenance / Footprint = 7

## OEM ↔ Indian entity mapping (use when cross-referencing evidence)
- Zealwe (China) ↔ Aster (India)
- Sanwood (China) ↔ Stech (India)
- Millennial Solar (China) ↔ Zuvay (India)
- UFE (Singapore) — direct
- CME (India) — direct
- Zenitek — direct
- ATT, Labtech — direct

A fact found only on the OEM doc may inform the Indian entity row ONLY when the OEM↔entity link is explicit in the evidence. Otherwise treat them as independent vendors.

## UV-2 vendor coverage (canonical list)
Aster, ATT, Labtech, Zuvay, Stech, UFE, Zenitek, CME, Zealwe.
Vendors absent from evidence get "Not declared" rows plus the prescribed penalties — never a fabricated baseline.

## Output format for every Comment cell
`<one-line judgement>. Evidence: <verbatim quote (≤120 chars)>. Ref: <file>!<sheet>!Row/SNo. Penalty: <none|description>.`
If no evidence: `Not declared — vendor clarification required. Penalty: <description>.`
