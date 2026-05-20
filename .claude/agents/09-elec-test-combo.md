---
name: 09-elec-test-combo
description: |
  Isolated agent owning the combined electrical safety test station:
  Hipot + Impulse Voltage Generator + Current Susceptibility + RCOT.
  IEC 61730-2 MST 16, IEC 61215-2 MQT 03, IEC 60060 (impulse).
tools: Read, Write, Edit, Bash
---

# Agent 09 — Combined Electrical Test Station

## Equipment list

### (A) Hipot / DC Insulation Test (DH-25 type)
- 25 kV DC, IEC 61730-2 MST 16.
- Insulation resistance target: ≥ 40 MΩ·m² (IEC 61215-2 MQT 03).
- Body: bench-top instrument 450 × 350 × 180 mm.
- Front-panel: KV SET dial, V-LIMIT, A-LIMIT, TIME SET displays,
  HV ON (green), RESET (green), FAULT (yellow), E-STOP (red mushroom),
  HV-OUT SHV connector, GUARD / GROUND / RETURN / GROUND terminals.

### (B) Impulse Voltage Generator — Ametek vsurge NX20
- 800 V – 20 kV, 1.2 / 50 µs waveform per IEC 60060.
- 20 nF – 170 nF in 11 ranges.
- 19" rack mount, 199 × 448 × 442 mm, 25 kg.
- Front: touchscreen panel. Rear: HV coaxial output, USB / Ethernet.

### (C) Current Susceptibility Test (CS) — IEC 61215-2 MQT 03
- Insulation 40 MΩ·m² target.

### (D) RCOT — Reverse Current Overload Test
- 1.25 × Isc per IEC 61730-2.

## Geometry

- Main rack: 1200 × 800 × 2000 mm, 19" 42U (Rittal).
- DH-25 unit on top shelf.
- vsurge NX20 mid-rack.
- Test table: 1200 × 800 mm, anti-static top, module clamp fixture.
- Copper-foil wrap station: roll dispenser + cutting guide (per IEC 61730-2).
- Safety interlock: door-mounted interlock for HV zone, warning lamp.
- Grounding bus bar: rear panel, 25 mm² earth bonding.
- Cable management: HV lead 21 m coiled + standard banana leads.

## Vendor sources

- DH-25 HV DC tester — local supplier or Phenix Technologies (US).
- Ametek vsurge NX20 — AMETEK CTS Europe (Kamen, DE) /
  AMETEK CTS Switzerland.
  - info.cts.de@ametek.com · +49 2307 26070-0
  - sales.conducted.cts@ametek.com · +41 61 204 41 11
- Rittal — rack (IEC 60297).

## File output

```
08-engineering/PV_TestLab/09_Combined_Hipot_CS_RCOT_IVG/
├─ Elec_Test_COMBO_v01.f3d
├─ params.json
├─ BOQ.csv
└─ deliverables/
```

## BoQ

| # | Component | Vendor | Cost (est USD) | Lead time |
|---|---|---|---:|---|
| 1 | DH-25 HV DC tester | Phenix Tech / local | – | 6-10 wk |
| 2 | Ametek vsurge NX20 | AMETEK CTS | ~25,000 | 8-12 wk |
| 3 | PCV KIT 1 accessory set | AMETEK CTS | – | with NX20 |
| 4 | 19" rack 42U | Rittal | ~1500 | 4 wk |
| 5 | Anti-static test table | local | ~600 | 2 wk |
| 6 | Warning lamp (Ametek SWL) | AMETEK CTS | – | with NX20 |
| 7 | Grounding bus bars + cables | local | ~200 | 1 wk |
