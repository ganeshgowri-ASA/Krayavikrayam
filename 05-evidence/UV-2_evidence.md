# UV-2 Package — Vendor-by-Vendor Extraction

Source: project knowledge files ingested 2026-05 (Pinecone assistant export).
Format: one fenced JSON block per vendor. Every fact MUST carry a `ref` tuple
`{file, sheet, row, quote}` or be `null` with `note="Not declared — vendor clarification required"`.

The script `06-scripts/fill_tbe.py` parses these JSON blocks. Do NOT remove the
language tag `json` after the triple backticks or the parser will skip the block.

---

## Vendor: Zealwe (China OEM; Indian entity = Aster)

```json
{
  "vendor": "Zealwe",
  "oem_country": "China",
  "indian_entity": "Aster",
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Not declared — vendor clarification required" },
  "lamp": {
    "type": { "value": "UV preconditioning chamber lamp", "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "强紫外老化箱 UV preconditioning Chamber" } },
    "life_hours": null,
    "sensor_make": null,
    "max_irradiance_w_per_m2": { "value": 226.8, "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "Max E 226.8" } },
    "spectral_nm": { "value": "UVB 280-320 nm, UVA 320-400 nm", "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "UVB测试波长为(280~320)nm, UVA测试波长为(320~400)nm" } },
    "uvb_percent": { "value": 5.06, "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "相对光谱中UVB占比 5.06%" } },
    "chamber_temp_control": { "value": "Temperature uniformity 0.99 °C", "ref": { "file": "TECHNI~2.PDF", "sheet": "Temperature", "row": "p.15-20", "quote": "温度均匀度 0.99 ℃" } }
  },
  "reliability": { "mtbf_hours": null, "mttr_hours": null, "warranty_years": null, "operator_headcount": null, "hmi_languages": null },
  "spares": {
    "bom_count": null,
    "critical_origin_country": { "value": "China", "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "上海盾卫环保科技有限公司 Zealwe Technology Co., Ltd" } },
    "india_stock": null,
    "spare_commitment_years": null
  },
  "service": { "india_centres": null, "india_engineers": null, "sla_hours": null, "jamnagar_proximity": null },
  "digital": { "opc_ua": null, "modbus_tcp": null, "rest_api": null, "lims": null },
  "oem_profile": {
    "country": { "value": "China", "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "1268# Zhongchun Road, Minhang, Shanghai, China" } },
    "years_in_pv_test": null,
    "installed_base": null,
    "indian_reference_customers": { "value": "ERDA Vadodara, Gujarat", "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "Electrical Research and Development Association ERDA Road, GIDC, Makarpura, Vadodara-390010 Gujarat, India" } }
  },
  "ctq": {
    "metal_halide_vs_uva340": null,
    "lamp_life_under_8000h": null,
    "sensor_nist_ptb_traceable": { "value": "Uncertainty U_rel=17% (k=2) declared; traceability NOT stated", "ref": { "file": "TECHNI~2.PDF", "sheet": "UV control part", "row": "p.15-20", "quote": "不确定度 U_rel=17% (k=2)" } },
    "black_panel_temp_regulation": null
  }
}
```

---

## Vendor: UFE (Universal Far East — Singapore)

```json
{
  "vendor": "UFE",
  "oem_country": "Singapore",
  "indian_entity": null,
  "fc_pc_nc": { "fc": 30, "pc": null, "nc": null, "note": "Approximate FC count from Performance & Safety Specifications S.No 1-46; PC/NC not explicitly counted", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 1-46", "quote": "Multiple rows marked 'Fully comply'" } },
  "lamp": {
    "type": { "value": "10 UV light units", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 24", "quote": "10 UV light" } },
    "life_hours": null,
    "sensor_make": null,
    "max_irradiance_w_per_m2": { "value": 200, "unit_note": "Quoted as W/cm² — almost certainly W/m² typo", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 16", "quote": "Max. 200 W/cm²" } },
    "spectral_nm": { "value": "UVB 280-320 nm 3-10%, UVA 320-400 nm 37-90%", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 17", "quote": "280nm to 320nm (UVB) about 3% to 10% max. 320nm to 400nm (UVX) about 37% to 90% min." } },
    "uvb_percent": null,
    "chamber_temp_control": { "value": "Closed-loop 60 °C ± 5 °C at module backside", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 29", "quote": "Closed-loop temperature control for maintaining 60 °C ± 5 °C at module backside during UV exposure. Air circulation" } }
  },
  "reliability": { "mtbf_hours": null, "mttr_hours": null, "warranty_years": null, "operator_headcount": null, "hmi_languages": null },
  "spares": {
    "bom_count": null,
    "critical_origin_country": { "value": "Germany (Bock compressor)", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 32", "quote": "BOCK compressors use materials such as aluminum/steel alloys, cast iron, aluminum pistons" } },
    "india_stock": null,
    "spare_commitment_years": null
  },
  "service": { "india_centres": null, "india_engineers": null, "sla_hours": null, "jamnagar_proximity": null },
  "digital": { "opc_ua": null, "modbus_tcp": null, "rest_api": null, "lims": null },
  "oem_profile": { "country": { "value": "Singapore", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "(cover)", "row": "header", "quote": "UFE — Universal Far East" } }, "years_in_pv_test": null, "installed_base": null, "indian_reference_customers": null },
  "ctq": {
    "metal_halide_vs_uva340": null,
    "lamp_life_under_8000h": null,
    "sensor_nist_ptb_traceable": null,
    "black_panel_temp_regulation": { "value": "Module backside controlled, NOT black-panel", "ref": { "file": "UV2_UFE_18.04.26.pdf", "sheet": "Performance & Safety Specifications", "row": "S.No 29", "quote": "60 °C ± 5 °C at module backside during UV exposure" } }
  }
}
```

---

## Vendor: CME (CM Envirosystems — India, Bangalore)

```json
{
  "vendor": "CME",
  "oem_country": "India",
  "indian_entity": "CME",
  "fc_pc_nc": { "fc": null, "pc": 4, "nc": null, "note": "FC implicit on majority of rows; 4 explicit PC rows captured (S.No 11, 12, 15, 16); NC not declared.", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Performance specifications", "row": "S.No 11-16", "quote": "Partially comply with deviation Module Temperature will be maintained to 60°C ±5°C" } },
  "lamp": {
    "type": { "value": "Not specified by vendor", "ref": { "file": "UV2_CME_28.04.26.pdf", "sheet": "Performance specifications", "row": "S.No 22", "quote": "UV design system Supplier to provide data/rejects details" } },
    "life_hours": null,
    "sensor_make": { "value": "UVR1/8 and UVR (unclear, needs clarification)", "ref": { "file": "UV2_CME_28.04.26.pdf", "sheet": "Performance specifications", "row": "S.No 19", "quote": "UVR1/8) and UVR" } },
    "max_irradiance_w_per_m2": { "value": 350, "unit_note": "Quoted W/cm² — almost certainly W/m² typo", "ref": { "file": "UV2_CME_28.04.26.pdf", "sheet": "Performance specifications", "row": "S.No 16", "quote": "Max. 350 W/cm²" } },
    "spectral_nm": { "value": "UVR2 100-500 nm 0-10%, UVR2 120-400 nm 97-90%", "ref": { "file": "UV2_CME_28.04.26.pdf", "sheet": "Performance specifications", "row": "S.No 17", "quote": "100nm to 500nm UVR2 about 0% to 10% max." } },
    "uvb_percent": null,
    "chamber_temp_control": { "value": "Closed-loop 60 °C ± 5 °C at random intervals", "ref": { "file": "UV2_CME_28.04.26.pdf", "sheet": "Performance specifications", "row": "S.No 27", "quote": "Closed-loop temperature control for maintaining 60 °C ± 5 °C at random intervals during UV exposure" } }
  },
  "reliability": { "mtbf_hours": null, "mttr_hours": null, "warranty_years": null, "operator_headcount": null, "hmi_languages": null },
  "spares": {
    "bom_count": null,
    "critical_origin_country": { "value": "India (Bangalore HQ + factory)", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Supplier Details", "row": "S.No 1+3", "quote": "Country of origin of OEM India; CEM HQ and Factory location Bangalore" } },
    "india_stock": null,
    "spare_commitment_years": null
  },
  "service": {
    "india_centres": { "value": "Bangalore, Pune, Chennai, Delhi, Hyderabad (5 cities)", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Supplier Details", "row": "S.No 4", "quote": "India office location Bangalore,Pune,Chennai,Delhi,Hyderabad" } },
    "india_engineers": { "value": 33, "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Supplier Details", "row": "S.No 10", "quote": "Number of Service Engg. in India 33" } },
    "sla_hours": null,
    "jamnagar_proximity": { "value": "No explicit Jamnagar/Gujarat presence; nearest = Pune", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Supplier Details", "row": "S.No 4", "quote": "Bangalore,Pune,Chennai,Delhi,Hyderabad" } }
  },
  "digital": { "opc_ua": null, "modbus_tcp": null, "rest_api": null, "lims": null },
  "oem_profile": {
    "country": { "value": "India", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Supplier Details", "row": "S.No 1", "quote": "Country of origin of OEM India" } },
    "years_in_pv_test": null,
    "installed_base": { "value": 53, "unit": "walk-in environmental chambers supplied to India", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Supplier Details", "row": "S.No 8", "quote": "Number of walk-in environmental chambers supplied to India 53" } },
    "indian_reference_customers": null
  },
  "ctq": {
    "metal_halide_vs_uva340": null,
    "lamp_life_under_8000h": null,
    "sensor_nist_ptb_traceable": null,
    "black_panel_temp_regulation": { "value": "Module temperature controlled, NOT black-panel", "ref": { "file": "Rev1_UV2_CME_15.05.26.pdf", "sheet": "Performance specifications", "row": "S.No 11", "quote": "Module Temperature will be maintained to 60°C ±5°C" } }
  }
}
```

---

## Vendor: Aster (India entity — separate UV-2 submission)

```json
{
  "vendor": "Aster",
  "oem_country": "India",
  "indian_entity": "Aster",
  "fc_pc_nc": { "fc": 2, "pc": 1, "nc": null, "note": "Warranty rows S.No 1-2 FC; S.No 3 PC with lamp-position deviation. Other sheets not summarised in current evidence — vendor clarification required for full FC/PC/NC tally.", "ref": { "file": "UV2_Aster_18.04.26.pdf", "sheet": "Warranty", "row": "S.No 1-3", "quote": "Fully comply 2 years from the date of installation; Partially comply with deviation Lamp should be maintained at top of chamber" } },
  "lamp": { "type": null, "life_hours": null, "sensor_make": null, "max_irradiance_w_per_m2": null, "spectral_nm": null, "uvb_percent": null, "chamber_temp_control": null },
  "reliability": {
    "mtbf_hours": null,
    "mttr_hours": null,
    "warranty_years": { "value": 2, "ref": { "file": "UV2_Aster_18.04.26.pdf", "sheet": "Warranty", "row": "S.No 1", "quote": "Min 2 years from the date of installation. It shall cover product / workmanship and performance of all components except consumables" } },
    "operator_headcount": null,
    "hmi_languages": null
  },
  "spares": { "bom_count": null, "critical_origin_country": { "value": "India (Aster) — OEM Zealwe (China) per mapping", "ref": { "file": "UV2_Aster_18.04.26.pdf", "sheet": "(cover)", "row": "header", "quote": "Aster — India" } }, "india_stock": null, "spare_commitment_years": null },
  "service": { "india_centres": null, "india_engineers": null, "sla_hours": null, "jamnagar_proximity": null },
  "digital": { "opc_ua": null, "modbus_tcp": null, "rest_api": null, "lims": null },
  "oem_profile": { "country": { "value": "India (sales) / China (OEM Zealwe)", "ref": { "file": "UV2_Aster_18.04.26.pdf", "sheet": "(cover)", "row": "header", "quote": "Aster — India" } }, "years_in_pv_test": null, "installed_base": null, "indian_reference_customers": null },
  "ctq": { "metal_halide_vs_uva340": null, "lamp_life_under_8000h": null, "sensor_nist_ptb_traceable": null, "black_panel_temp_regulation": null }
}
```

---

## Vendor: ATT

```json
{ "vendor": "ATT", "oem_country": null, "indian_entity": null, "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Not declared — vendor clarification required" }, "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {}, "oem_profile": {}, "ctq": {} }
```

---

## Vendor: Labtech

```json
{ "vendor": "Labtech", "oem_country": null, "indian_entity": null, "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Not declared — vendor clarification required" }, "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {}, "oem_profile": {}, "ctq": {} }
```

---

## Vendor: Zuvay (India entity — OEM Millennial Solar, China)

```json
{ "vendor": "Zuvay", "oem_country": "China", "indian_entity": "Zuvay", "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Not declared — vendor clarification required" }, "lamp": {}, "reliability": {}, "spares": { "critical_origin_country": { "value": "China (OEM Millennial Solar) per mapping", "ref": { "file": "(OEM mapping)", "sheet": "00-rules/CLAUDE.md", "row": "OEM↔Indian entity table", "quote": "Millennial Solar (China) ↔ Zuvay (India)" } } }, "service": {}, "digital": {}, "oem_profile": {}, "ctq": {} }
```

---

## Vendor: Stech (India entity — OEM Sanwood, China)

```json
{ "vendor": "Stech", "oem_country": "China", "indian_entity": "Stech", "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Not declared — vendor clarification required" }, "lamp": {}, "reliability": {}, "spares": { "critical_origin_country": { "value": "China (OEM Sanwood) per mapping", "ref": { "file": "(OEM mapping)", "sheet": "00-rules/CLAUDE.md", "row": "OEM↔Indian entity table", "quote": "Sanwood (China) ↔ Stech (India)" } } }, "service": {}, "digital": {}, "oem_profile": {}, "ctq": {} }
```

---

## Vendor: Zenitek

```json
{ "vendor": "Zenitek", "oem_country": null, "indian_entity": null, "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Not declared — vendor clarification required" }, "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {}, "oem_profile": {}, "ctq": {} }
```
