---
name: 05-uv-2mod
description: |
  Isolated agent owning the UV preconditioning 2-module chamber.
  IEC 61215-2 MQT 10. UV dose ≥ 15 kWh/m² in 280-400 nm. Module temp 60 °C ±5.
tools: Read, Write, Edit, Bash
---

# Agent 05 — UV 2-Module Chamber

## Geometry

- Outer: 2200 L × 1400 W × 1800 H mm.
- Inner: UV-reflective aluminium liner.
- UV lamp array: UVA-340 fluorescent (or Osram UV-A 340 nm), array 12 tubes ×
  1500 mm, spaced 100 mm.
- Module fixture: 2 × vertical mounts, 25° tilt, adjustable.
- Temperature control: PTC heater strips + PT100 sensors + PID controller.
- Irradiance sensor: UV-A radiometer in module plane.
- Safety: UV-opaque double-skin door with magnetic interlock; orange warning
  lamp; **no viewing window** (UV hazard).
- Ventilation: forced-air circulation fan (prevent hotspots).

## Reference images

`uv-rad-1525-v.jpg`, `uv-rad-1525-v-lc.jpg` (UV-RAD 1525-V radiometer).

## Vendor sources

- Atlas Material Testing — Xenon arc systems
- Q-Lab UVA-340 — fluorescent tubes
- Philips TUV UVA-340 — fluorescent tubes
- Eppendorf irradiance reference cells

## File output

```
08-engineering/PV_TestLab/04_UV_Chamber/
├─ UV_2MOD_v01.f3d
├─ params.json
└─ BOQ.csv
```

## BoQ key items

- UV lamps + ballasts × 12
- UV-A radiometer (UV-RAD 1525-V or eq.)
- PTC heater strips
- PT100 sensors × N
- PID controller (Eurotherm 3508 or eq.)
- Door interlock (magnetic + safety relay)
- Warning lamp (orange)
- Forced-air fan

## Cross-agent

- Module fixture clamping force must equal Agent 06 (4-in-1) for consistent
  DUT preparation across stations.
