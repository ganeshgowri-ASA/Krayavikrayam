---
name: 08-hail-mbt-fpt-combo
description: |
  Isolated agent owning the combined Hail + Module Breakage + Frame Pull
  Tester. IEC 61215-2 MQT 17 (hail), MQT 16 (mechanical static load),
  IEC 62790 (frame anchorage 5 N).
tools: Read, Write, Edit, Bash
---

# Agent 08 — Combined Hail + MBT + Frame-Pull Tester

## (A) Hail launcher — IEC 61215-2 MQT 17

- Pneumatic barrel: Ø 80 mm bore, 1500 mm length, adjustable angle arm 0° – 90°.
- Pressure vessel: 50 L air reservoir, 0–10 bar regulator.
- Solenoid valve: fast-acting (≤ 5 ms).
- Velocity sensor: 2 × photoelectric gate pair (IFM-type), 1 m from module surface.
- Module mount: rigid steel frame, 4-point adjustable clamping, normal to ice-ball path.
- Freezer bay: small chest freezer −10 °C for ice-ball storage.
- Safety enclosure: polycarbonate blast shield, 3-side surround.

Ice-ball table per IEC 61215-2 Table 2:

| Ø (mm) | Velocity (m/s) |
|---:|---:|
| 25 | 23.0 |
| 35 | 27.2 |
| 45 | 30.7 |
| 55 | 34.0 |
| 65 | 36.7 |
| 75 | 39.5 |

## (B) Module Breakage Test fixture

- Parallel to hail station (shared floor frame).
- 4-point bend: 2 × lower support rails, 2 × upper load applicators.
- Pneumatic actuator for load application.
- Load cell: 0 – 5000 N inline.
- Deflection sensor: LVDT or laser displacement.

## (C) Frame Pull Tester — IEC 62790

- Vertical test stand: 500 mm tall, module fixture plate.
- 5 N calibrated hanging weight + cord guide.
- Adjustable frame-grip clamps.

## Combined floor frame

- Modular aluminium extrusion (Item compatible).
- Three stations share one 4000 × 2000 mm platform.

## File output

```
08-engineering/PV_TestLab/07_Combined_Hail_MBT_FPT/
├─ Hail_MBT_FPT_COMBO_v01.f3d
├─ params.json
└─ BOQ.csv
```

## Cross-agent

- Module mount dimensions must match chambers (Agent 01, 06).
- Velocity-sensor model = same IFM family as the chamber light curtains
  (single supplier, reduce calibration drift).
