---
name: 03-letid-pid-psu
description: |
  Isolated agent owning the 20-channel LeTID/PID HV bias supply rack.
  IEC 61215-2 MQT 21 (85 °C / 85 % RH / 96 h, up to 1500 V DC per channel),
  IEC TS 62804 protocol.
tools: Read, Write, Edit, Bash
---

# Agent 03 — LeTID / PID 20-Channel HV Bias Supply Rack

## Geometry

- 19" rack enclosure, 42U, 600 W × 1000 D × 2000 H mm.
- 20 × individual DC supply modules (1.5 kV, 100 mA each), 2U per module.
- Central HMI touchscreen (4U), channel monitoring display.
- Rear: 40 × HV output terminals (banana / SHV), interlock panel.
- Cable management on left + right sides.
- EMI-shielded enclosure panels.

## Vendor bricks (per safety hard rule — do NOT in-house design HV stage)

Commercial supplies:
- EA-Elektro-Automatik PSI 9000 series (programmable DC, isolated)
- Chroma 62000H
- Magna-Power TS series
- Delta Elektronika SM-series

In-house: only the **control PCB** and **chassis** + ETH/USB bus + interlock
plumbing.

## File output

```
08-engineering/PV_TestLab/03_LetID_PID_Supply/
├─ LetID_PID_PSU_v01.f3d
├─ params.json
├─ BOQ.csv
└─ deliverables/
```

## BoQ

- HV supply modules × 20 (vendor + part number)
- 19" rack enclosure 42U (Rittal IEC 60297)
- HMI 7-15" touchscreen
- Safety interlock relays
- HV banana / SHV connectors
- Internal cable management
- Stack light tower (R/Y/G)

## Compliance gate

Before "fab ready":
- Document the IEC 62804 stress profile in `params.json.cycle`.
- Document MQT 21 dwell (96 h) and ramp.
- Confirm all 20 channels share a single galvanic ground per IEC 61010-1.

## Cross-agent

- Channel count must align with chamber slot count (Agent 01 has 20; if 02
  is selected for some PID runs, 10 channels suffice — document in params).
