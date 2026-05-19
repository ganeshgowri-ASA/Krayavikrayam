# 4-in-1 Walk-in Chamber — Vendor-by-Vendor Extraction (v2 schema)

> Skeleton.  Populate each vendor block from the 4-in-1 comparison file +
> Pinecone Assistant before running `uv run python 06-scripts/fill_tbe.py --package 4-in-1`.
> Anchor: Aster ≈ 54.3 / 1000 (CFT-approved).  Hold band 52–56 unless a
> CTQ deviation forces otherwise.  Schema reference: `05-evidence/_SCHEMA.md`.

---

## Vendor: Aster

```json
{ "vendor": "Aster", "oem_country": "India", "indian_entity": "Aster",
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {},
  "oem_profile": {}, "ctq": {} }
```

## Vendor: ATT

```json
{ "vendor": "ATT", "oem_country": null, "indian_entity": null,
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: Labtech

```json
{ "vendor": "Labtech", "oem_country": null, "indian_entity": null,
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: Zuvay

```json
{ "vendor": "Zuvay", "oem_country": "China", "indian_entity": "Zuvay",
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {},
  "spares": { "critical_origin_country": { "value": "China (OEM Millennial Solar)", "ref": { "file": "(OEM mapping)", "sheet": "00-rules/CLAUDE.md", "row": "OEM↔Indian entity table", "quote": "Millennial Solar (China) ↔ Zuvay (India)" } } },
  "service": {}, "digital": {}, "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: Stech

```json
{ "vendor": "Stech", "oem_country": "China", "indian_entity": "Stech",
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {},
  "spares": { "critical_origin_country": { "value": "China (OEM Sanwood)", "ref": { "file": "(OEM mapping)", "sheet": "00-rules/CLAUDE.md", "row": "OEM↔Indian entity table", "quote": "Sanwood (China) ↔ Stech (India)" } } },
  "service": {}, "digital": {}, "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: UFE

```json
{ "vendor": "UFE", "oem_country": "Singapore", "indian_entity": null,
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: Zenitek

```json
{ "vendor": "Zenitek", "oem_country": null, "indian_entity": null,
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction. Management driver: highlight any declared AI integration, LED-UV, unified chamber+supply HMI." },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: CME

```json
{ "vendor": "CME", "oem_country": "India", "indian_entity": "CME",
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```

## Vendor: Zealwe

```json
{ "vendor": "Zealwe", "oem_country": "China", "indian_entity": "Aster",
  "fc_pc_nc": { "fc": null, "pc": null, "nc": null, "note": "Pending Pinecone extraction" },
  "lamp": {}, "reliability": {}, "spares": {}, "service": {}, "digital": {},
  "advanced_features": {}, "simulation_validation": {}, "oem_profile": {}, "ctq": {} }
```
