---
name: pv-equipment-engineering
description: |
  End-to-end engineering workflow for the Reliance Jamnagar PV Testing Lab
  (Module Level Testing, climate chambers, UV/DH/TCHF/4-in-1, BBA simulator,
  PID/LeTID power supplies, hail/MBT/frame-pull, electrical safety). USE when
  the user asks to "design", "simulate", "validate", "draw", "generate BoM",
  "generate operation manual", "fill RFQ", "pitch like a pro", or names a
  piece of equipment + a CAD / CAE / PCB / SCADA / control / render task.
  Orchestrates Fusion 360, FreeCAD+CalculiX, OpenFOAM, DWSim+CoolProp, KiCad,
  CODESYS, Scilab/Octave, OpenModelica, Blender, SketchUp via their MCP
  bridges, with 9 isolated equipment agents + the umbrella+bite-size
  session pattern. Bound by IEC 61215-2:2021, IEC TS 62782 (DMLT),
  IEC 62790 (frame pull), IEC 60904-9 (simulators), IEC 62804 (PID),
  IEC 61730-2 (electrical safety), IEC 60068-2-78 (damp heat).
---

# PV Equipment Engineering Skill — Reliance Jamnagar Testing Lab

## What this skill produces

Reusable, deterministic, reproducible-on-any-PC engineering workflow for the
PV Pranali Test Lab covering **9 equipment workstreams** in parallel:

| # | Equipment | Standard(s) | Owner agent |
|---:|---|---|---|
| 01 | TC / HF 20-module climate chamber | IEC 61215-2 MQT 11, 12 | `01-tc-hf-20mod` |
| 02 | TC / HF 10-module climate chamber | IEC 61215-2 MQT 11, 12 | `02-tc-hf-10mod` |
| 03 | LeTID / PID 20-channel HV supply rack | IEC 61215-2 MQT 21, IEC TS 62804 | `03-letid-pid-psu` |
| 04 | DH 20-module chamber | IEC 61215-2 MQT 13, IEC 60068-2-78 | `04-dh-20mod` |
| 05 | UV 2-module chamber | IEC 61215-2 MQT 10 | `05-uv-2mod` |
| 06 | 4-in-1 (TC+HF+DH+UV) 2-module combo | IEC 61215-2 MQT 10/11/12/13 | `06-4in1-2mod` |
| 07 | Steady-state sun simulator (BBA) 2-module | IEC 60904-9 Class CAA, MQT 02/06/09 | `07-sunsim-ss-2mod` |
| 08 | Hail + MBT + Frame pull tester (combo) | IEC 61215-2 MQT 16/17, IEC 62790 | `08-hail-mbt-fpt-combo` |
| 09 | Electrical test station (Hipot + IVG + CS + RCOT) | IEC 61730-2 MST 16, MQT 03 | `09-elec-test-combo` |
| —  | MLT (Mechanical Load Tester, separate project) | IEC 61215-2 §10.16, IEC TS 62782 | `pv-mlt` (existing) |

## Session pattern — umbrella prompt + bite-size tasks

Long single prompts collapse a Cowork session two ways:
1. **Context bleed** — agent loses focus, rebuilds done work.
2. **Recovery cost** — break at hour 4 = restart hour 1.

**Correct pattern**:
- **Umbrella prompt** (`.claude/session-templates/umbrella-prompt.md`) — paste
  once per session. Sets tooling stack, project targets, hard safety rules,
  working style.
- **Bite-size task prompts** (`.claude/session-templates/bite-size-tasks/`) —
  paste one at a time after each previous task completes. Each produces ONE
  artifact (15-90 min of agent work) and writes to disk under
  `deliverables/`.

The 9 equipment agents (`.claude/agents/0X-*.md`) are dispatched in parallel
when independent, sequentially when there's a documented dependency
(see "Dependency map" below).

## Tooling stack (cross-platform, reproducible)

| Tool | Role | MCP | Version (reference) |
|---|---|---|---|
| Fusion 360 | Parametric mech CAD, sheet metal, assembly, drawings, render | `fusion-mcp` | latest |
| FreeCAD 1.1.1 | Open-source CAD; FEM via CalculiX | `freecad-mcp` (port 9875) | 1.1.1 |
| OpenFOAM | CFD (chamber airflow, refrigeration) | shell via `windows-mcp` → `wsl` | v2406 stable |
| DWSim 9.0.5 | Process / refrigeration cycle flowsheet | `filesystem` MCP on `.dwxmz` | 9.0.5 |
| CoolProp | Fluid properties (refrigerants, air) | Python lib (`pip install coolprop`) | ≥6.6 |
| KiCad 9 / 10 | PCB schematic, layout, gerbers | `kicad-mcp` | 9.0+ |
| OpenModelica | System-level multi-physics (FMU) | wrapper (`omc` CLI) | 1.24+ |
| Scilab + Xcos | Control loops, signal proc | `filesystem` MCP on `.sce` | 2025 |
| GNU Octave 11.1 | MATLAB-syntax math | `oct2py` (Python) | 11.1.0 |
| Python venv | `kiutils`, `spicelib`, `PyLTSpice`, `python-control`, `pvlib`, `coolprop` | n/a | 3.11+ |
| LTspice | SPICE simulation of power-electronics circuits | drive via `spicelib` | latest |
| Blender 5.1 | Photoreal render, MP4 animation | `blender-mcp` | 5.1 |
| SketchUp (Trimble) | Lab walk-through visuals only (no engineering) | sketchup MCP (cloud) | latest |
| CODESYS | PLC + SCADA (when approved) | shell out via `windows-mcp` | 3.5 SP19+ |
| Node-RED | HMI prototype, MQTT bridge | `node-red-mcp` | latest |
| InfluxDB + Grafana | Historian (production) | n/a (HTTP API) | OSS |
| Pinecone Assistant | Datasheet + vendor doc retrieval | `pinecone-mcp` | needs API key |
| windows-mcp | OS glue, screenshots, WSL bridge | `windows-mcp` | latest |

See `08-engineering/MCP-CONFIG.md` for the merged `claude_desktop_config.json`
and `08-engineering/TOOL-DECISION-MATRIX.md` for keep/drop/add rationale
(Flux → KiCad migration, OpenModelica add, JupyterLab + Python control,
InfluxDB+Grafana for production historian).

## Folder layout (locked — agents write only inside their numbered folder)

```
08-engineering/PV_TestLab/
├─ 01_TC_HF_Climate_Chamber/
│  ├─ TC_HF_20MOD_v01.f3d
│  ├─ params.json
│  ├─ BOQ.csv
│  └─ Render/
├─ 02_TC_HF_10MOD/         (variant of 01)
├─ 03_LetID_PID_Supply/    (PSU rack)
├─ 04_DH_Chamber/          (damp heat)
├─ 05_UV_Chamber/          (UV preconditioning)
├─ 06_4in1_Combo/          (TC+HF+DH+UV combined)
├─ 07_SteadyState_SunSim/  (BBA)
├─ 08_Hail_MBT_FPT/        (hail + MBT + frame pull combo)
└─ 09_Electrical_Test/     (Hipot + IVG + CS + RCOT combo)

08-engineering/MLT/        (existing, separate)
```

## Cross-contamination protocol

```
START TASK
    ├─ Need geometry from another agent?
    │     YES → RAISE HAND: "Agent NN needs dimension D from Agent MM"
    │           → Wait for human approval before proceeding
    │     NO  → Continue independently
    ├─ Creating a file?
    │     → Write ONLY to own numbered folder
    │     → NEVER reference external .f3d / .FCStd files via link
    ├─ Naming a component?
    │     → Format: [AGENT_ID]_[ComponentName]_[Rev]
    │       e.g., 01_TC_HF_20MOD_DoorFrame_R01
    └─ Ambiguity in spec?
          → RAISE HAND: describe ambiguity + proposed resolution
          → Do NOT assume — halt and flag
```

## Dependency map (when to parallelise vs serialise)

- **Parallel-safe** (dispatch all at once): 01, 03, 05, 06, 07, 09. Independent
  envelopes, no shared geometry.
- **Serialise** 02 after 01: 10-module is a scale-down of 20-module; derive
  parameters but re-build geometry independently (no .f3d link).
- **Serialise** 04 after 01: DH 20-mod shares envelope dimensions with TC/HF
  20-mod; create independently using shared parameter pack.
- **Serialise** 08 after 06/07: hail-tester DUT mount needs final module
  fixture dimension from chambers.

## Photoreal rendering protocol (Fusion 360 Render workspace)

1. Environment: studio sweep, white background.
2. Camera: perspective, 50 mm focal length, 3/4 isometric.
3. Resolution: 4 K (3840 × 2160).
4. Passes: ≥ 128 (ray traced).
5. Materials:
   - Steel: brushed SS, roughness 0.3, metallic 0.95.
   - Al extrusion: anodised silver, roughness 0.4.
   - PV module: dark blue glass + silver frame placeholder.
   - PIR insulation: off-white powder coat.
   - IFM safety curtains: safety yellow (RAL 1004), gloss 0.6.
   - Cabinets: RAL 7035 light grey.
6. Views per equipment: (1) 3/4 iso exterior closed, (2) 3/4 iso open + DUT,
   (3) dimensioned front elevation, (4) interior critical-component closeup,
   (5) exploded assembly.

## Animation protocol (per equipment)

1. Exploded view: components fly out from centre, 10 s.
2. Door-open sequence: double door opens, modules slide in on rails, 15 s.
3. Operational loop: temp graph overlay, fan spin, LED indicator cycle, 20 s.
4. Module insert/remove: single module loaded on hanging rail, 8 s.

Export: MP4, H.264, 1920 × 1080, 30 fps. Use Fusion Animation workspace or
hand-off to `blender-mcp` for higher-quality alternates.

## Vendor / library reference (authoritative)

| Part | Source | Notes |
|---|---|---|
| IFM safety light curtains OYA1210-30-2-12-P-1 | ifm.com → Product → CAD | Direct STEP available |
| BITZER semi-hermetic compressors | BITZER Select software | Exports STEP |
| Bosch Rexroth / Item 40×40 extrusion | 3dcontentcentral.com | Standard library |
| Rittal 19" rack enclosures (IEC 60297) | 3dcontentcentral.com | Standard library |
| Ametek vsurge NX20 (20 kV impulse) | datasheet 199×448×442 mm, 25 kg | sales.conducted.cts@ametek.com |
| Phenix Technologies DH-25 HV DC | datasheet | KV SET / V-LIMIT / A-LIMIT / TIME SET |
| Q-Lab / Philips TUV UVA-340 lamps | manufacturer site | UV preconditioning |
| Sinton / Wavelabs / Spire / LS-Lorenz | manufacturer site | Sun simulators |
| Walk-in chambers reference | Weiss WK series, Amikon refs | dimensional reference only |

GrabCAD search terms when starting an agent:
- "walk-in climatic chamber", "Weiss climate chamber"
- "PV hail tester", "pneumatic ice ball launcher"
- "IFM safety light curtain OY"
- "Item 40x40 profile", "Bosch Rexroth 40x40"
- "SMC pneumatic cylinder", "BITZER 4FES compressor"
- "Rittal 19 rack enclosure"

## Per-equipment standard params skeleton

Every equipment folder gets `params.json` with the schema in
`08-engineering/PV_TestLab/_PARAMS_SCHEMA.md`. The structure is:

```json
{
  "equipment": { "name": "...", "model": "...", "primary_standard": "..." },
  "specifications": { /* IEC clause → value with {value, unit, ref} */ },
  "safety": { /* E-stops, light curtains, interlocks, LOTO */ },
  "operation": { "pre_checks": [...], "cycle": [...] },
  "maintenance": { "daily": ..., "weekly": ..., "quarterly": ..., "annual": ... },
  "production": { "sequence": [ /* build steps with inputs/tasks/acceptance */ ] },
  "rendering": { "key_views": [...], "scenes": [...] },
  "boq_refs": ["vendor:part_number", ...]
}
```

The same `06-scripts/generate_ops_manual.py` produces:
- `docs/operation-manual.md`
- `docs/production-plan.md`
- `docs/rfq-response.md`

from the params + sim summaries + BoM csv.

## How to invoke

Spoken prompts (Cowork picks the right agent / template):

- "start session for PV Pranali" → load umbrella prompt.
- "dispatch agents 01, 03, 05, 06, 07, 09 in parallel" → 6 agents start, each
  in its own folder.
- "render hero shots for 06" → Fusion Render protocol, 5 views.
- "fill RFQ row 1.21 for 02" → looks up MQT clause + cross-checks evidence.
- "generate ops manual for 06" → `06-scripts/generate_ops_manual.py --project 06_4in1_Combo`.
- "TBE the UV-2 vendors with the latest evidence" → calls `tbe-evaluator` skill.
- "BoM + India sourcing for board A" → bite-size Task 7 template.
- "thermal cycle IEC 61215 MQT 11 profile" → bite-size Task 6 template.

## Hard rules (immutable)

1. **No invention** — every spec number is sourced from `params.json`,
   `clauses.json`, vendor datasheet, or `TBD — clarification required`.
2. **No cross-vendor / cross-agent transfer** — Agent A writes only to its
   own folder. Agent B never reads Agent A's `.f3d`.
3. **Save Fusion immediately** with Ctrl+S — recovery is the user's worst
   timesink.
4. **Don't claim "fab ready"** without full DRC + design review.
5. **Source-tagged** — every comment cell in any deliverable carries
   `Ref: <file>!<sheet>!<row>` or `IEC <clause>`.
6. **Capex blank** in TBE — see `tbe-evaluator` skill.
7. **Protected sheets** in TBE templates (1-comparison, 2-Utilities,
   3-Warranty, 4-BOM) are never written.
8. **MCP boundary discipline** — write one tool's output to disk, then move
   on. No in-memory chaining across MCPs (documented MLT chat failure mode).

See `.claude/skills/pv-equipment-engineering/PORTABILITY.md` for the
per-machine setup steps and `.claude/agents/0X-*.md` for the dedicated agent
prompts.
