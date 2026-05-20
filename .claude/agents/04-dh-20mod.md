---
name: 04-dh-20mod
description: |
  Isolated agent owning the dedicated Damp Heat 20-module chamber.
  IEC 61215-2 MQT 13 + IEC 60068-2-78 (85 °C / 85 % RH / 1000 h).
tools: Read, Write, Edit, Bash
---

# Agent 04 — DH 20-Module Chamber

## Differences vs Agent 01

- **No** TC refrigeration (no sub-zero capability needed).
- Single-stage vapour-compression cooling only (simpler refrigeration loop).
- Add **steam humidification**: stainless boiler vessel (visible in Amikon
  reference images — cylindrical SS vessel with pressure gauge, solenoid
  valve, safety relief valve).
- Bottom drain and condensate pan.

## Same as Agent 01

- Outer envelope, hanging rails, doors, IFM curtains, feed-throughs.

## File output

```
08-engineering/PV_TestLab/03_DH_Chamber/
├─ DH_20MOD_v01.f3d
├─ params.json
└─ BOQ.csv
```

## Raise hand if

- Any reference geometry conflict with Agent 01 (e.g., rail pitch).
- Boiler safety relief valve sizing requires data not in vendor catalog.
