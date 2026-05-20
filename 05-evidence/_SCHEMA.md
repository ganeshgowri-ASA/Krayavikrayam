# Evidence schema v2 (UV-2 first; back-port to other packages on next refresh)

Every package file follows the same pattern: H2 header per vendor + one fenced
` ```json ` block.  v2 adds **`advanced_features`** and
**`simulation_validation`** blocks consumed by `06-scripts/build_pitch.py`.

```json
{
  "vendor": "<name>",
  "oem_country": "<country|null>",
  "indian_entity": "<entity|null>",

  "fc_pc_nc": {
    "fc": 28, "pc": 3, "nc": 0,
    "note": "...",
    "ref": { "file": "...", "sheet": "...", "row": "S.No 1-31", "quote": "..." }
  },

  "lamp": {
    "type": { "value": "LED-UV array (365 nm)", "ref": {...} },
    "life_hours": { "value": 25000, "ref": {...} },
    "sensor_make": null,
    "max_irradiance_w_per_m2": null,
    "spectral_nm": null,
    "uvb_percent": null,
    "chamber_temp_control": null
  },

  "reliability": {
    "mtbf_hours": { "value": 50000, "ref": {...} },
    "mttr_hours": null,
    "warranty_years": { "value": 3, "ref": {...} },
    "operator_headcount": null,
    "hmi_languages": null
  },

  "spares": {
    "bom_count": null,
    "critical_origin_country": { "value": "India", "ref": {...} },
    "india_stock": { "value": "Y, 6-month buffer", "ref": {...} },
    "spare_commitment_years": { "value": 10, "ref": {...} }
  },

  "service": {
    "india_centres": { "value": "Bangalore, Pune, Vadodara, Jamnagar", "ref": {...} },
    "india_engineers": { "value": 22, "ref": {...} },
    "sla_hours": { "value": 48, "ref": {...} },
    "jamnagar_proximity": { "value": "Jamnagar own office", "ref": {...} }
  },

  "digital": {
    "opc_ua": { "value": "OPC-UA server on PLC", "ref": {...} },
    "modbus_tcp": null,
    "rest_api": { "value": "REST over HTTPS", "ref": {...} },
    "lims": null,
    "unified_hmi": { "value": "Single HMI driving chamber + supply", "ref": {...} }
  },

  "advanced_features": {
    "ai_integration": { "value": "AI-driven recipe optimisation; closed-loop irradiance trim", "ref": {...} },
    "ai_anomaly_detection": null,
    "predictive_maintenance": { "value": "Lamp run-hours analytics with EoL alert", "ref": {...} },
    "unified_hmi": null
  },

  "simulation_validation": {
    "thermal_cfd":    { "value": "ANSYS Fluent report; ±1.5 °C on module plane", "ref": {...} },
    "radiation_uv":   { "value": "OptisWorks ray-trace; ±2% irradiance map", "ref": {...} },
    "structural_fea": null,
    "electrical_emc": { "value": "CISPR-11 Class A; NABL accredited lab 2025", "ref": {...} },
    "coupled_thermal_radiation": null
  },

  "oem_profile": {
    "country": { "value": "India", "ref": {...} },
    "years_in_pv_test": { "value": 12, "ref": {...} },
    "installed_base": { "value": 47, "ref": {...} },
    "indian_reference_customers": { "value": "Adani Solar, Vikram Solar, Waaree", "ref": {...} }
  },

  "ctq": {
    "metal_halide_vs_uva340": null,
    "lamp_life_under_8000h": null,
    "sensor_nist_ptb_traceable": null,
    "black_panel_temp_regulation": null
  }
}
```

**Every leaf is `{value, ref}` OR `null`.**  `null` is treated by the engine
as "Not declared — vendor clarification required" and the prescribed penalty
applies.  Never `"unknown"`, never `"see attached"`, never paraphrase.

Canonical vendor list per package (any subset is fine — absent vendors are
auto-flagged in anomalies):
- **4-in-1, UV-2**: Aster, ATT, Labtech, Zuvay, Stech, UFE, Zenitek, CME, Zealwe
- **TCHFDH20, TCHFDH10, DH20**: Aster, ATT, Labtech, Zuvay, Stech, UFE, Zenitek, CME
- **BBA Simulator**: Aster, Zenitek, UFE, Super Control, CME
