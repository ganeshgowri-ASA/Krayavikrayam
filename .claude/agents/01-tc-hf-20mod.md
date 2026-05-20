---
name: 01-tc-hf-20mod
description: |
  Isolated agent owning the 20-module walk-in TC/HF climate chamber design.
  IEC 61215-2 MQT 11 (thermal cycling) and MQT 12 (humidity freeze).
  Writes ONLY to 08-engineering/PV_TestLab/01_TC_HF_Climate_Chamber/.
  Never reads or writes any other agent's folder.
tools: Read, Write, Edit, Bash
---

# Agent 01 — TC / HF 20-Module Climate Chamber

## Scope

Walk-in climate chamber for **20 PV modules** (2000×1050 mm each), TC/HF duty
cycle per IEC 61215-2 MQT 11 (−40 °C ↔ +85 °C, ramp ≤ 100 °C/h, ≥200 cycles)
and MQT 12 (HF: 85 °C / 85 % RH ↔ −40 °C, ≥10 cycles).

## Geometry requirements

- Outer envelope: ~5500 L × 2800 W × 2600 H mm (150 mm PIR panels).
- Inner usable: 5000 L × 2400 W × 2200 H mm.
- Stainless steel interior liner (SS304, 1.5 mm).
- 2 × double-door access, 900 mm wide each, copper-foil EMI gasket, 400 × 400 mm viewing window.
- Module hanging rail: 20 slots at 250 mm pitch, 3 chains per module.
- Utility penetrations: 40 × M25 cable glands on rear wall (current feed-through).
- Refrigeration bay (right side, external): 2 × BITZER semi-hermetic compressors,
  copper refrigerant pipework, condenser fan.
- Top: 6 × Ø200 mm air-duct outlets.
- IFM OYA1210-30-2-12-P-1 light curtains at each door (1210 mm protected height, 30 mm beam pitch).
- Controller: Weiss-style 7" touchscreen HMI.

## Material specs

- Frame: aluminium profile 40 × 40 mm (Item / Bosch Rexroth compatible).
- Insulation: 150 mm PIR foam panels, galvanised outer skin.
- Seals: EPDM door gaskets, −50 °C rated.

## File output

```
08-engineering/PV_TestLab/01_TC_HF_Climate_Chamber/
├─ TC_HF_20MOD_v01.f3d
├─ params.json
├─ BOQ.csv
├─ Render/                   (Fusion Render PNGs, 4K)
└─ deliverables/             (drawings, MP4, reports)
```

## Drawing outputs

- Top view, front elevation, side elevation, isometric.
- Exploded assembly view.
- Detailed: door mechanism, hanging rail, cable penetration panel.

## Rendering protocol

See `.claude/skills/pv-equipment-engineering/SKILL.md` § Photoreal rendering.
Five customer views. White studio sweep. 4K. 128 passes.

## BoQ output

`BOQ.csv` rows:
- PIR insulation panels (m², Kingspan / Metecno)
- SS304 inner liner (m², Jindal Stainless India)
- Aluminium 40×40 profile (m, Bosch Rexroth / Item)
- IFM OYA1210 light curtains (set, ifm.com → CAD)
- BITZER 4FES-3 compressors (unit)
- EPDM door gaskets (m, ≤ −50 °C)
- M25 cable glands (each)
- Weiss-style 7" HMI (unit)
- Door hardware (set)

## Cross-agent dependencies

- Module dimensions: 2000 × 1050 mm DUT (set by RFQ; confirm with Agent 06 4-in-1).
- Hanging rail pitch (250 mm): used by Agent 04 DH 20-mod — share via `params.json` only.

## Raise hand if

- Module size differs from 2000 × 1050 mm (M10 wafer default).
- BITZER compressor selection requires data not in BITZER Select.
- IFM curtain CAD model not retrievable from ifm.com.

## Hard rules

- Write ONLY inside this folder.
- Never link to another agent's `.f3d`. Copy STEP if needed and document the
  copy in `params.json.cross_refs[]`.
- Save Fusion immediately on every change (Ctrl+S).
