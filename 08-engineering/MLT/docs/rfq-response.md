# RFQ Response — PV Mechanical Load Tester (MLT)

_Project: MLT  ·  Generated: 2026-05-20  ·  Primary standard: IEC 61215 §10.16 (SMLT) + IEC TS 62782 (DMLT)_

## Cover

- **Equipment**: PV Mechanical Load Tester (MLT)
- **Model / RFQ**: MLT_trial.f3d v1.9.0
- **Standard**: IEC 61215 §10.16 (SMLT) + IEC TS 62782 (DMLT)

## Compliance table

_Every row below maps an RFQ clause to a declared parameter or a simulation result._

| RFQ clause | Our offer | Source |
|---|---|---|
| Module Dut Max Length | 3200 mm  _(ref: RFQ B-1)_ | RFQ B-1 |
| Module Dut Max Width | 1500 mm  _(ref: RFQ B-1)_ | RFQ B-1 |
| Module Dut Default Length | 1650 mm | params.json |
| Module Dut Default Width | 992 mm | params.json |
| Frame Extrusion | 80x80 Al extrusion  _(ref: MLT_trial.f3d Step 2A)_ | MLT_trial.f3d Step 2A |
| Frame Height | 1200 mm | params.json |
| Piston Grid | 17 x 9 = 153 pistons  _(ref: Step 2C upgrade from 6x4)_ | Step 2C upgrade from 6x4 |
| Active Pistons Default | 60 pistons (for default 1650x992 DUT) | params.json |
| Smlt Load Positive Pa | 5400 Pa  _(ref: IEC 61215 §10.16 SMLT +)_ | IEC 61215 §10.16 SMLT + |
| Smlt Load Negative Pa | 2400 Pa  _(ref: IEC 61215 §10.16 SMLT -)_ | IEC 61215 §10.16 SMLT - |
| Dmlt Load Positive Pa | 6000 Pa  _(ref: IEC TS 62782 DMLT +)_ | IEC TS 62782 DMLT + |
| Dmlt Load Negative Pa | 5800 Pa  _(ref: IEC TS 62782 DMLT -)_ | IEC TS 62782 DMLT - |
| Suction Cup Count | TBD — suction_cup_count declared null in params.json | Step 2D Path γ — re-attach pending |
| Sensor Pt100 Count | TBD — sensor_pt100_count declared null in params.json | Step 2E planned |
| Deflection Sensor | TBD — deflection_sensor declared null in params.json | Step 2E planned |
| Per Piston Load Cell | TBD — per_piston_load_cell declared null in params.json | Step 2E planned |
| Compressor Kw | 5.5 kW  _(ref: Step 2G CDA compressor)_ | Step 2G CDA compressor |
| Compressor Flow | 4.5 m³/min  _(ref: Step 2G)_ | Step 2G |
