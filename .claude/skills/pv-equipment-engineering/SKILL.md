---
name: pv-equipment-engineering
description: |
  End-to-end engineering workflow for PV test-equipment design (MLT, climate
  chambers, UV chambers, BBA simulator, PID power supplies). USE when the
  user asks to "design", "simulate", "validate", "draw", "generate BoM",
  "generate operation manual", "generate production plan", or names a piece
  of equipment + a CAD/CAE/PCB/SCADA task. Orchestrates Fusion 360,
  FreeCAD+CalculiX, OpenFOAM, DWSim+CoolProp, KiCad, CODESYS, Scilab/Octave,
  Blender via their respective MCP bridges. Bound by IEC 61215 / 61730 / 62782
  and Reliance Jamnagar design basis where applicable.
---

# PV Equipment Engineering Skill

A single entry point that drives a multi-tool engineering pipeline from a
text spec to ready-to-build artefacts: drawings, simulation reports, gerbers,
operation manuals, production plans, RFQ responses, BoM/BoQ.

## When to invoke

User says any of:
- "design the [X] chamber" / "design the MLT pull frame"
- "simulate the [refrigeration cycle | UV irradiance | thermal stratification | structural deflection]"
- "validate the [X] against IEC 61215 §10.X"
- "generate the operation manual for [X]"
- "generate the production plan / BoM / BoQ for [X]"
- "fill the RFQ for [X]"
- "render hero shots for [X]"

## Tool matrix (call only what's installed & MCP-bridged)

| Stage | Primary tool | MCP server | Fallback |
|---|---|---|---|
| Parametric CAD (mechanical) | Fusion 360 | `fusion-mcp` | FreeCAD via `freecad-mcp` |
| Open-source CAD (sheet metal, weldments) | FreeCAD 1.1.1 | `freecad-mcp` (port 9875) | Fusion if installed |
| FEA (structural, modal, thermal) | FreeCAD FEM + CalculiX | `freecad-mcp` | Fusion Simulation (limited via MCP) |
| CFD (chamber airflow, refrigeration) | OpenFOAM (WSL) | shell via `windows-mcp` | FreeCAD CfdOF workbench |
| Refrigeration cycle / heat exchanger | DWSim + CoolProp | `filesystem` MCP for `.dwxmz` files + Python CoolProp | Manual calculation |
| Electrical control / signal processing | Scilab / GNU Octave | `filesystem` MCP for `.sce` / `.m` | Python+SciPy |
| System-level multi-physics | OpenModelica (planned) | (build a small wrapper) | Scilab + Xcos |
| PCB design (power electronics, sensor breakouts) | KiCad 9 | `kicad-mcp` (community) | Fusion Electronics |
| PLC + SCADA | CODESYS (pending) | (no MCP yet — shell out via windows-mcp) | Node-RED for prototyping |
| Photoreal render / animation | Blender 5.1 | `blender-mcp` | Fusion native renderer |
| Knowledge retrieval (datasheets, vendor docs) | Pinecone Assistant | `pinecone-mcp` (needs API key) | local file search |
| OS automation (paths, file moves, screenshots) | Windows | `windows-mcp` | manual |

## Workflow stages

### Stage 1 — Concept + parameter pack
Inputs: text spec + applicable IEC standard.
Output: `08-engineering/<project>/params.json` (single source of truth).
Driver: this skill + `06-scripts/spec_to_params.py` (Python; no MCP needed).

### Stage 2 — Parametric CAD
Tools: Fusion 360 (preferred) or FreeCAD.
Output: `.f3d` / `.FCStd`, STEP, IGES.
Notes: Slider-write chunk size for Fusion MCP is **10 params per call** (timeout-safe; see attached MLT chat log).

### Stage 3 — Sheet-metal fabrication
Tool: Fusion 360 sheet-metal env → flat patterns; or FreeCAD SheetMetal workbench.
Output: DXF for laser cut, STEP for press brake.

### Stage 4 — Multi-physics simulation
Decision: route by physics domain.
- **Structural / modal**: FreeCAD FEM + CalculiX. (Fusion MCP has API-boundary issues with `createStudy`; documented in MLT chat.)
- **Thermal CFD**: OpenFOAM (via WSL) or FreeCAD CfdOF.
- **UV / radiation ray-trace**: Not yet MCP-wrapped. Use OptisWorks / TracePro file inputs and ingest the report into `simulation_validation` block of evidence schema.
- **Refrigeration thermodynamics**: DWSim flowsheet + CoolProp property calls.
- **Control loops**: Scilab Xcos / Octave control toolbox.
- **System-level coupled**: OpenModelica.
Output: `08-engineering/<project>/sim/<domain>/<case>.{vtu,frd,csv,png,pdf}`.

### Stage 5 — PCB + power electronics
Tool: KiCad 9 (recommend migrating from Flux — see DECISION-MATRIX.md).
Output: Schematic, layout, gerbers, BoM, 3D STEP for mechanical co-check.

### Stage 6 — PLC / SCADA
Tool: CODESYS (when approved) + visualization. Node-RED for HMI prototyping.
Output: `.project` source, IO list, alarm list, P&ID overlay.

### Stage 7 — Render + animation
Tool: Blender 5.1 via `blender-mcp` (import STEP → photoreal scene).
Output: PNG hero, MP4 motion study.

### Stage 8 — Documentation (auto-generated)
Driver: `06-scripts/generate_ops_manual.py` (Python).
Inputs: `params.json` + sim reports + BoM CSV.
Outputs:
- `08-engineering/<project>/docs/operation-manual.md` (then to PDF via Pandoc)
- `08-engineering/<project>/docs/production-plan.md`
- `08-engineering/<project>/docs/rfq-response.md`
- `08-engineering/<project>/docs/bom.csv` and `boq.csv`

## Hard rules
1. **No invention** — same rule as TBE skill. Every spec number, vendor offer,
   simulation value comes from a real file under `08-engineering/<project>/`
   or is flagged "TBD — clarification required".
2. **Reproducibility** — every script is deterministic. Re-running with the
   same `params.json` produces byte-stable outputs (modulo timestamps).
3. **Source-tagged** — every doc claim cites `Ref: <file>` or `IEC <ref>`.
4. **Standards compliance gate** — before declaring "complete", run
   `06-scripts/iec_compliance_check.py` (to be added) which maps every spec
   leaf to an IEC clause.
5. **No MCP hopping** — drive one tool at a time, write the output to disk,
   then move on. Avoid in-memory chaining across MCPs (the boundary is
   fragile, as documented in the MLT chat).

## Project folder layout

```
08-engineering/<project>/
├─ params.json                  # single source of truth
├─ rfq/                         # incoming RFQ docs
├─ standards/                   # IEC PDFs / clause map
├─ cad/                         # .f3d, .FCStd, STEP, IGES, DXF
├─ sim/
│  ├─ structural/               # CalculiX .frd, .vtu
│  ├─ thermal/                  # OpenFOAM case dirs
│  ├─ refrigeration/            # DWSim .dwxmz + CoolProp scripts
│  ├─ optics/                   # ray-trace reports (PDF)
│  └─ control/                  # Scilab .sce / Octave .m
├─ pcb/                         # KiCad project
├─ plc/                         # CODESYS project + Node-RED flows
├─ render/                      # Blender .blend + PNG + MP4
├─ docs/                        # generated manuals, plans, BoM
└─ ref/                         # vendor datasheets (read-only)
```

## Invocation patterns

- `/pv-engineer design MLT --standard IEC-61215-10.16`
- `/pv-engineer simulate climate-chamber-4in1 --domain cfd`
- `/pv-engineer validate UV-2 --against IEC-61215-10.10`
- `/pv-engineer ops-manual BBA-simulator`
- `/pv-engineer production-plan TCHFDH20`

Each invocation:
1. Loads the project folder under `08-engineering/<project>/`.
2. Reads `params.json`.
3. Routes to the right tool(s) per the stage table above.
4. Writes outputs back into the project folder.
5. Updates `08-engineering/<project>/STATUS.md` (Markdown checklist).

See `08-engineering/TOOL-DECISION-MATRIX.md` for tool-choice rationale and
alternatives, and `08-engineering/MCP-CONFIG.md` for the
`claude_desktop_config.json` template.
