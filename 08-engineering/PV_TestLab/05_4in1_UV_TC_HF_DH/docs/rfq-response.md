# RFQ Response — 4-in-1 Combo Chamber (TC + HF + DH + UV, 2 module)

_Project: PV_TestLab/05_4in1_UV_TC_HF_DH  ·  Generated: 2026-05-20  ·  Primary standard: IEC 61215-2 MQT 10, 11, 12, 13_

## Cover

- **Equipment**: 4-in-1 Combo Chamber (TC + HF + DH + UV, 2 module)
- **Model / RFQ**: COMBO_4in1_2MOD_v01.f3d
- **Standard**: IEC 61215-2 MQT 10, 11, 12, 13

## Compliance table

_Every row below maps an RFQ clause to a declared parameter or a simulation result._

| RFQ clause | Our offer | Source |
|---|---|---|
| Module Count | 2 modules | params.json |
| Module Length Mm | 2000 mm  _(ref: IEC 61215-2 default M10 DUT)_ | IEC 61215-2 default M10 DUT |
| Module Width Mm | 1050 mm  _(ref: IEC 61215-2 default M10 DUT)_ | IEC 61215-2 default M10 DUT |
| Envelope Outer Lxwxh Mm | 1800x1200x2000 mm | params.json |
| Envelope Inner Lxwxh Mm | 1400x800x1600 mm | params.json |
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
