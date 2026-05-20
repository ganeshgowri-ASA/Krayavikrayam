# PV_TestLab params.json — shared schema (v1)

Every numbered equipment folder under `08-engineering/PV_TestLab/0X_*/`
has a `params.json` following this schema. The schema is the **single
source of truth** for `06-scripts/generate_ops_manual.py`,
`06-scripts/fill_tbe.py`, and the dedicated CAD agents.

```json
{
  "schema_version": "1.0",
  "equipment": {
    "id": "01_TC_HF_20MOD",
    "name": "TC/HF 20-Module Climate Chamber",
    "model": "TC_HF_20MOD_v01.f3d",
    "primary_standard": "IEC 61215-2 MQT 11, 12",
    "site": "Reliance Dhirubhai Ambani Green Energy Giga Complex, Jamnagar",
    "agent_owner": ".claude/agents/01-tc-hf-20mod.md"
  },

  "specifications": {
    "<param_name>": { "value": ..., "unit": "...", "ref": "..." }
  },

  "safety": {
    "estop_count": { "value": ..., "ref": "..." },
    "light_curtain": { "value": "IFM OYA1210-30-2-12-P-1", "ref": "..." },
    "interlocks": [...]
  },

  "operation": {
    "pre_checks": [...],
    "cycle": [ { "name": "...", "description": "...", "duration": "..." } ]
  },

  "maintenance": {
    "daily": {...}, "weekly": {...}, "quarterly": {...}, "annual": {...}
  },

  "production": {
    "sequence": [
      { "name": "...", "inputs": "...", "tasks": "...",
        "acceptance": "...", "duration": "...", "owner": "..." }
    ]
  },

  "rendering": {
    "key_views": ["3/4 iso exterior", "3/4 iso open + DUT",
                  "front elevation", "interior detail", "exploded"],
    "scenes": ["exploded", "door-open", "operation-loop", "module-insert"]
  },

  "boq_refs": [
    "vendor:part_number",
    "Kingspan:PIR-150",
    "Jindal:SS304-1.5",
    "IFM:OYA1210-30-2-12-P-1",
    "BITZER:4FES-3"
  ],

  "cross_refs": [
    { "from_agent": "01", "to_agent": "04", "param": "rail_pitch_mm", "value": 250 }
  ]
}
```

## Rules

1. Every leaf in `specifications` is `{value, unit, ref}` or `null`. `null`
   means "TBD — clarification required". Never paraphrase.
2. `ref` cites either an IEC clause (`IEC 61215-2 §10.16`), a vendor
   datasheet (`Ametek vsurge_nx20 datasheet p.2`), or `params.cross_refs[i]`.
3. `cross_refs` is the ONLY way one agent's design touches another's. Each
   entry must be reciprocated in the other agent's params.json.
4. `agent_owner` is the agent file. The agent never writes outside its
   numbered folder; if it must, it raises hand and updates `cross_refs`.

## Validation

`06-scripts/validate_params.py <project>` (to be added) will:
- Lint the JSON schema.
- Resolve every `IEC` ref against `08-engineering/iec-61215-2-2021/clauses.json`.
- Verify every `cross_refs` entry has a reciprocal entry in the peer agent.
- Report missing fields with the prescribed `TBD — <reason>` text.

## See also

- `.claude/skills/pv-equipment-engineering/SKILL.md` — umbrella skill.
- `.claude/agents/0X-*.md` — per-equipment agents.
- `06-scripts/generate_ops_manual.py` — consumes params.json + sim summaries
  + bom.csv to produce ops manual + production plan + RFQ response.
- `08-engineering/iec-61215-2-2021/clauses.json` — MQT clause database.
