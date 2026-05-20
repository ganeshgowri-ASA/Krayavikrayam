# Operation Manual — PV Mechanical Load Tester (MLT)

_Project: MLT  ·  Generated: 2026-05-20  ·  Primary standard: IEC 61215 §10.16 (SMLT) + IEC TS 62782 (DMLT)_

> Auto-generated from `08-engineering/MLT/params.json` and the sim/BoM sidecars.  Every numeric value below is a verbatim leaf from those files or marked `TBD` with the reason.  Do **not** edit this file by hand — edit the source and re-run `uv run python 06-scripts/generate_ops_manual.py --project MLT`.

## 1. Equipment identification

- **Name**: PV Mechanical Load Tester (MLT)
- **Model / RFQ**: MLT_trial.f3d v1.9.0
- **Primary standard**: IEC 61215 §10.16 (SMLT) + IEC TS 62782 (DMLT)
- **Site**: Reliance Dhirubhai Ambani Green Energy Giga Complex, Jamnagar
- **Serial number**: TBD — serial not in params.json

## 2. Specifications

| Parameter | Value | Reference |
|---|---|---|
| Module Dut Max Length | 3200 mm  _(ref: RFQ B-1)_ | RFQ B-1 |
| Module Dut Max Width | 1500 mm  _(ref: RFQ B-1)_ | RFQ B-1 |
| Module Dut Default Length | 1650 mm | — |
| Module Dut Default Width | 992 mm | — |
| Frame Extrusion | 80x80 Al extrusion  _(ref: MLT_trial.f3d Step 2A)_ | MLT_trial.f3d Step 2A |
| Frame Height | 1200 mm | — |
| Piston Grid | 17 x 9 = 153 pistons  _(ref: Step 2C upgrade from 6x4)_ | Step 2C upgrade from 6x4 |
| Active Pistons Default | 60 pistons (for default 1650x992 DUT) | — |
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

## 3. Safety

- **Estop Count**: TBD — estop_count declared null in params.json
- **Light Curtain**: TBD — light_curtain not in params.json
- **Acrylic Safety Cage**: Step 2F planned  _(ref: yellow I-beam pull frame + acrylic panels)_
- **Stack Light**: R/Y/G tower  _(ref: Step 2F planned)_
- **Lockout Tagout**: TBD — lockout_tagout not in params.json

## 4. Pre-operation checks

- [ ] Verify CDA compressor pressure within 6-7 bar
- [ ] Verify all E-stops physically reset
- [ ] Verify safety cage door interlock closed
- [ ] Verify PT100 sensors reading within ±0.5 °C of ambient
- [ ] Verify per-piston load cells zeroed
- [ ] Run continuity loop test on DUT cable harness

## 5. Test cycle

1. **DUT load** — Place module on suction-cup grid; activate suction; verify hold  _(duration: 120 s)_
2. **SMLT +** — Pressurise pistons to +5400 Pa over 1 min; hold 60 min; record deflection  _(duration: 61 min)_
3. **SMLT -** — Pressurise pistons to -2400 Pa over 1 min; hold 60 min; record deflection  _(duration: 61 min)_
4. **DMLT cycles** — 1000 cycles of ±1000 Pa per IEC TS 62782  _(duration: 8 h)_
5. **Post-EL** — Electroluminescence scan after test; compare to baseline  _(duration: 5 min)_
6. **DUT release** — Vent suction; remove module; visual inspection  _(duration: 120 s)_

## 6. Acceptance criteria  (IEC clause map)

_No `standards/clause-map.json` for this project — fill it before TBE finalisation._

## 7. Simulation evidence

_No simulation summaries committed in `sim/**/summary.json` yet._

## 8. Maintenance schedule

- **daily**: CDA water trap drain; visual cable check
- **weekly**: PT100 calibration check vs reference; load cell zero verification
- **quarterly**: Pneumatic seal replacement on high-cycle pistons
- **annual**: Full IEC 61215 reference test; NABL recalibration of load cells + sensors

## 9. Critical spares  (from BoM)

_No `bom.csv` for this project._
