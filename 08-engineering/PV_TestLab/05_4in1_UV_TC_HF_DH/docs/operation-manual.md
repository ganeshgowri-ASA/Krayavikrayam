# Operation Manual — 4-in-1 Combo Chamber (TC + HF + DH + UV, 2 module)

_Project: PV_TestLab/05_4in1_UV_TC_HF_DH  ·  Generated: 2026-05-20  ·  Primary standard: IEC 61215-2 MQT 10, 11, 12, 13_

> Auto-generated from `08-engineering/PV_TestLab/05_4in1_UV_TC_HF_DH/params.json` and the sim/BoM sidecars.  Every numeric value below is a verbatim leaf from those files or marked `TBD` with the reason.  Do **not** edit this file by hand — edit the source and re-run `uv run python 06-scripts/generate_ops_manual.py --project PV_TestLab/05_4in1_UV_TC_HF_DH`.

## 1. Equipment identification

- **Name**: 4-in-1 Combo Chamber (TC + HF + DH + UV, 2 module)
- **Model / RFQ**: COMBO_4in1_2MOD_v01.f3d
- **Primary standard**: IEC 61215-2 MQT 10, 11, 12, 13
- **Site**: Reliance Dhirubhai Ambani Green Energy Giga Complex, Jamnagar
- **Serial number**: TBD — serial not in params.json

## 2. Specifications

| Parameter | Value | Reference |
|---|---|---|
| Module Count | 2 modules | — |
| Module Length Mm | 2000 mm  _(ref: IEC 61215-2 default M10 DUT)_ | IEC 61215-2 default M10 DUT |
| Module Width Mm | 1050 mm  _(ref: IEC 61215-2 default M10 DUT)_ | IEC 61215-2 default M10 DUT |
| Envelope Outer Lxwxh Mm | 1800x1200x2000 mm | — |
| Envelope Inner Lxwxh Mm | 1400x800x1600 mm | — |
| Mode A Tc Temp Min C | -40 °C  _(ref: IEC 61215-2 MQT 11)_ | IEC 61215-2 MQT 11 |
| Mode A Tc Temp Max C | 85 °C  _(ref: IEC 61215-2 MQT 11)_ | IEC 61215-2 MQT 11 |
| Mode A Tc Tol C | 2 °C  _(ref: IEC 61215-2 MQT 11)_ | IEC 61215-2 MQT 11 |
| Mode A Tc Ramp Max | 100 °C/h  _(ref: IEC 61215-2 MQT 11)_ | IEC 61215-2 MQT 11 |
| Mode B Hf Rh Percent | 85 %RH  _(ref: IEC 61215-2 MQT 12)_ | IEC 61215-2 MQT 12 |
| Mode B Hf Temp High | 85 °C  _(ref: IEC 61215-2 MQT 12)_ | IEC 61215-2 MQT 12 |
| Mode C Dh Temp C | 85 °C  _(ref: IEC 61215-2 MQT 13 + IEC 60068-2-78)_ | IEC 61215-2 MQT 13 + IEC 60068-2-78 |
| Mode C Dh Rh | 85 %RH  _(ref: IEC 61215-2 MQT 13 + IEC 60068-2-78)_ | IEC 61215-2 MQT 13 + IEC 60068-2-78 |
| Mode C Dh Duration | 1000 h  _(ref: IEC 61215-2 MQT 13)_ | IEC 61215-2 MQT 13 |
| Mode D Uv Band Nm | 280-400 nm  _(ref: IEC 61215-2 MQT 10)_ | IEC 61215-2 MQT 10 |
| Mode D Uv Dose Kwh | 15 kWh/m² (min)  _(ref: IEC 61215-2 MQT 10)_ | IEC 61215-2 MQT 10 |
| Mode D Uv Module Temp | 60 °C ±5  _(ref: IEC 61215-2 MQT 10)_ | IEC 61215-2 MQT 10 |
| Mode D Uv Uniformity | 15 % max  _(ref: IEC 61215-2 MQT 10)_ | IEC 61215-2 MQT 10 |
| Refrigeration Topology | cascade (2-stage)  _(ref: Agent 06 HVACR design)_ | Agent 06 HVACR design |
| Refrigerant High Stage | R507A None  _(ref: design choice)_ | design choice |
| Refrigerant Low Stage | R23 None  _(ref: design choice)_ | design choice |
| Evaporator Temp C | -45 °C  _(ref: cascade design target)_ | cascade design target |
| Condenser Temp C | 40 °C  _(ref: cascade design target)_ | cascade design target |

## 3. Safety

- **Estop Count**: TBD — estop_count not in params.json
- **Light Curtain**: IFM OYA1210-30-2-12-P-1 set  _(ref: ifm.com CAD)_
- **Interlocks**: [{'name': 'UV door interlock', 'spec': 'disables UV when door open', 'ref': 'IEC 61215-2 MQT 10 safety note'}, {'name': 'HV interlock', 'spec': 'n/a (no HV in this chamber)'}]
- **Lockout Tagout**: compressors + UV ballasts + steam boiler loto points

## 4. Pre-operation checks

- [ ] Verify compressor oil level + sight-glass
- [ ] Verify steam boiler water level
- [ ] Verify UV-A radiometer calibration date < 12 months
- [ ] Run leak rate test on chamber seals: < 5 % RH drop in 1 h at 85/85

## 5. Test cycle

1. **MODE A — TC** — −40 → +85 °C, 200 cycles, ramp ≤100 °C/h, dwell ≥10 min  _(duration: 200 h)_
2. **MODE B — HF** — TC + 85 % RH; 10 cycles  _(duration: 100 h)_
3. **MODE C — DH** — 85 °C / 85 % RH steady-state, 1000 h  _(duration: 1000 h)_
4. **MODE D — UV** — 60 °C ±5; UV dose ≥15 kWh/m² in 280-400 nm  _(duration: ≈ 150 h at 100 W/m²)_

## 6. Acceptance criteria  (IEC clause map)

_No `standards/clause-map.json` for this project — fill it before TBE finalisation._

## 7. Simulation evidence

_No simulation summaries committed in `sim/**/summary.json` yet._

## 8. Maintenance schedule

- **daily**: Drain water trap; visual; HMI alarm log
- **weekly**: PT100 cross-check vs reference; UV irradiance check
- **quarterly**: UV lamp replacement when accumulated dose > 80 % of rated
- **annual**: NABL recalibration of T/RH sensors + UV radiometer; refrigerant moisture check

## 9. Critical spares  (from BoM)

_No `bom.csv` for this project._
