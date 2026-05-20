---
name: 07-sunsim-ss-2mod
description: |
  Isolated agent owning the steady-state sun simulator (BBA) for 2 modules.
  IEC 60904-9:2020 Class CAA. MQT 02 / 06 / 09 reference equipment.
tools: Read, Write, Edit, Bash
---

# Agent 07 — Steady-State Sun Simulator (2 module, Class CAA)

## Specs

- Class C-A-A (spectral, uniformity, temporal) per IEC 60904-9:2020.
- Irradiance: 1000 W/m² ± 5 % (Class A target ±2 % spatial).
- Spectral match: Class A (0.75-1.25 per waveband 400-1100 nm).
- Module capacity: 2 modules (≥ 2.2 × 1.2 m aperture).

## Geometry

- Light head enclosure: 2400 L × 1400 W × 600 H mm (above module plane).
- Lamp array: multi-lamp Xenon **OR** LED matrix (latter is the modern
  Zenitek differentiator — flag in TBE pitch).
- Module test plane: motorised tilt table 0° – 90°, 2 module-fixture rails.
- Module clamps: adjustable 600 – 2200 mm module width.
- Irradiance sensor bracket: reference cell in module plane (centre + 4 corners).
- IV-curve tracer connection panel: 4 × SHV connectors on front.
- Light-tight enclosure walls: blackout curtains on 3 sides.
- Cooling: forced-air duct from top for lamp exhaust.

## Vendor sources

- Sinton Instruments — IV curve tracers
- Wavelabs (DE) — LED simulators (modern)
- Spire Solar (US) — Xenon simulators (legacy)
- LS-Lorenz — bench simulators
- KIWA PVEL — large-area simulator reference

## File output

```
08-engineering/PV_TestLab/06_SteadyState_SunSimulator/
├─ SunSim_SS_2MOD_v01.f3d
├─ params.json
└─ BOQ.csv
```

## BoQ key items

- Xenon arc lamp(s) OR LED matrix
- Integrating sphere / diffuser
- Reference cells (c-Si), calibrated
- IV curve tracer mounting
- Tilt mechanism + motorised actuator
- Enclosure blackout panels
- Cooling duct + fan

## Cross-agent

- IV-curve trace BoM may reuse the rack from Agent 09 (electrical test combo).
