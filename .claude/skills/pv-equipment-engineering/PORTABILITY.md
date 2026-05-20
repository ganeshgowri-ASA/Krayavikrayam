# Skill portability — reproduce the workflow on any PC

This skill is **fully portable**.  Everything lives in the repo: the rules,
the IEC clause database, the per-equipment agents, the umbrella session
prompt, the bite-size task templates, the Python scripts, and the example
projects.  No PC-specific state.

## What travels with the repo (already committed)

```
.claude/
├─ skills/
│  ├─ tbe-evaluator/SKILL.md
│  └─ pv-equipment-engineering/
│     ├─ SKILL.md                          umbrella skill (this skill)
│     └─ PORTABILITY.md                    this file
├─ agents/
│  ├─ 01-tc-hf-20mod.md                    TC/HF 20-module chamber agent
│  ├─ 02-tc-hf-10mod.md                    TC/HF 10-module chamber agent
│  ├─ 03-letid-pid-psu.md                  LeTID/PID 20-channel PSU rack agent
│  ├─ 04-dh-20mod.md                       DH 20-module chamber agent
│  ├─ 05-uv-2mod.md                        UV 2-module chamber agent
│  ├─ 06-4in1-2mod.md                      4-in-1 combo (TC+HF+DH+UV) agent
│  ├─ 07-sunsim-ss-2mod.md                 Steady-state sun simulator agent
│  ├─ 08-hail-mbt-fpt-combo.md             Hail + MBT + frame-pull agent
│  └─ 09-elec-test-combo.md                Electrical safety station agent
└─ session-templates/
   ├─ umbrella-prompt.md                   paste-once-per-session umbrella
   └─ bite-size-tasks/
      ├─ 01-footprint-assign.md
      ├─ 06-iec61215-thermal-cycle.md
      ├─ 07-bom-india-sourcing.md
      └─ 09-rfq-response-mapping.md

00-rules/CLAUDE.md                          locked TBE scoring rules
05-evidence/UV-2_evidence.md                vendor evidence (UV-2 has data; others skeletons)
05-evidence/_SCHEMA.md                      v2 evidence schema (advanced + multi-physics)
06-scripts/
├─ pyproject.toml                            reproducible Python env (uv)
├─ fill_tbe.py                               TBE engine
├─ build_pitch.py                            management pitch + conv-vs-adv generator
├─ build_template.py                         placeholder TBE workbook generator
├─ generate_ops_manual.py                    ops manual + production plan + RFQ response generator
└─ pinecone_client.py                        vendor-doc fetch stub (needs API key)

08-engineering/
├─ MCP-CONFIG.md                             ready-to-merge claude_desktop_config.json
├─ TOOL-DECISION-MATRIX.md                   keep/drop/add stack recommendations
├─ iec-61215-2-2021/clauses.json             MQT clause database (machine-readable)
├─ PV_TestLab/
│  ├─ _PARAMS_SCHEMA.md                      shared params.json schema
│  └─ 05_4in1_UV_TC_HF_DH/params.json        first complete example
└─ MLT/                                      existing parametric Fusion project
   ├─ params.json
   └─ docs/{operation-manual,production-plan,rfq-response}.md
```

## What needs per-PC setup (one-time)

### 1. Repository
```bash
git clone https://github.com/ganeshgowri-ASA/Krayavikrayam.git
cd Krayavikrayam
```

### 2. Python env (uv)
```bash
# Once per machine
curl -LsSf https://astral.sh/uv/install.sh | sh        # Linux/macOS
# Windows: irm https://astral.sh/uv/install.ps1 | iex

cd 06-scripts
uv venv
uv pip install openpyxl pvlib python-control scipy matplotlib coolprop kiutils spicelib PyLTSpice oct2py
```

### 3. Claude Desktop / Cowork MCP servers
Open `%APPDATA%\Claude\claude_desktop_config.json` in **VS Code**
(NOT PowerShell — the merge attempts documented in the attached chat logs
produced JSON syntax errors).

Merge in the entries from `08-engineering/MCP-CONFIG.md`:
- fusion · freecad · blender · kicad · pinecone · windows-mcp · filesystem
- openmodelica (after you build the wrapper)
- openfoam (shell out via windows-mcp → wsl)

Fully quit Claude Desktop (system tray → Quit), reopen, verify `/mcp`
shows green for each server.

### 4. CAD/CAE tool installations (your status table)

| Tool | Install |
|---|---|
| Fusion 360 | autodesk.com (free for personal/educational) |
| FreeCAD 1.1.1 | freecad.org/downloads |
| Blender 5.1 | blender.org/download |
| DWSim 9.0.5 | sourceforge.net/projects/dwsim |
| Scilab 2025 | scilab.org/download |
| GNU Octave 11.1 | `winget install GNU.Octave` |
| KiCad 9/10 | kicad.org/download |
| LTspice | analog.com → LTspice |
| OpenFOAM | WSL2 + Ubuntu 24.04; `sudo apt install openfoam-default` |
| OpenModelica | openmodelica.org/download |
| CoolProp | `pip install coolprop` |
| Node-RED | `npm install -g node-red` |
| InfluxDB + Grafana | Docker compose stack |

### 5. Pinecone Assistant
```bash
# Windows:
setx PINECONE_API_KEY "<your-key>"
setx PINECONE_ASSISTANT_NAME "pv-test-equipment-comparison-tbe-queies"
# Linux/macOS:
export PINECONE_API_KEY=<your-key>
export PINECONE_ASSISTANT_NAME=pv-test-equipment-comparison-tbe-queies
```

## How to verify portability

1. On a fresh PC, complete steps 1-5 above.
2. Run the smoke tests:
   ```bash
   cd 06-scripts
   uv run python fill_tbe.py --package UV-2
   uv run python build_pitch.py --package UV-2
   uv run python generate_ops_manual.py --project MLT
   ```
3. Confirm three files in `07-output/` and three in `08-engineering/MLT/docs/`.
4. Open Claude Desktop, paste `.claude/session-templates/umbrella-prompt.md`,
   confirm the tool inventory in the reply.
5. Dispatch any agent: `Use the 01-tc-hf-20mod agent to plan the chamber frame`.

Same input → same output across PCs (modulo timestamps). That's the test.

## Session workflow (beast-mode)

1. **Paste umbrella prompt once.** Cowork acknowledges, lists tools, recommends task.
2. **Dispatch 6 agents in parallel** (01, 03, 05, 06, 07, 09 — independent envelopes).
3. **Bite-size tasks** for cross-cutting work (footprints, BoM sourcing, IEC profiles, RFQ map).
4. **Save Fusion immediately** on every change. Recovery is the worst time-sink.
5. **Raise hand** the moment any agent needs cross-folder data.

## Recovery if things break

- **MCP server red?** → Check `claude_desktop_config.json` paths, fully quit
  Claude (tray → Quit), reopen.
- **FreeCAD RPC dead?** → Start RPC server from inside FreeCAD's own Python
  console: `import freecad_mcp; freecad_mcp.start_rpc(port=9875)`.
- **Fusion MCP timeout on bulk write?** → Chunk to **10 slider writes per
  call** (documented in MLT chat as the safe size).
- **Cowork session "context bleed"?** → Re-paste umbrella prompt. Cowork
  rebuilds context in seconds.
- **Lost data?** → Sessions live in `%LOCALAPPDATA%\AnthropicClaude\` and
  `%APPDATA%\Claude\`. Back up nightly to git or a separate drive.

## Multi-physics design loop

```
                Fusion / FreeCAD  ──(STEP)──>  OpenFOAM / CalculiX / Flux
                       │                              │
                       │                          reports + plots
                       ▼                              ▼
                SketchUp (layout)              sim_validation block
                Blender  (render)              ────────────────────
                                                       │
                                                       ▼
                                          06-scripts/fill_tbe.py
                                          06-scripts/build_pitch.py
                                          06-scripts/generate_ops_manual.py
                                                       │
                                                       ▼
                                            07-output / docs / xlsx
```

The skill **does not run simulations** itself.  It **ingests** vendor- or
in-house-supplied simulation reports into the `simulation_validation` block
of the v2 evidence schema.  Co-occurrence of ≥ 2 physics domains scores +2
on Design Concept and +1 on Tech Maturity per `00-rules/CLAUDE.md`.

## CAD / CAE MCP cheat-sheet

```jsonc
// .mcp.json sketch (drop into claude_desktop_config.json under mcpServers)
{
  "fusion":   { "command": "uvx", "args": ["fusion-mcp"] },
  "freecad":  { "command": "uvx", "args": ["freecad-mcp"], "env": { "FREECAD_RPC_PORT": "9875" } },
  "blender":  { "command": "uvx", "args": ["blender-mcp"] },
  "kicad":    { "command": "uvx", "args": ["kicad-mcp"] },
  "filesystem": { "command": "uvx", "args": ["mcp-server-filesystem", "<repo-root>"] },
  "windows-mcp": { "command": "uvx", "args": ["windows-mcp"] },
  "pinecone": { "command": "npx", "args": ["@pinecone-database/pinecone-mcp"],
                "env": { "PINECONE_API_KEY": "<key>",
                         "PINECONE_ASSISTANT_NAME": "pv-test-equipment-comparison-tbe-queies" } }
}
```

OpenFOAM, OpenModelica, Scilab, Octave, DWSim, CODESYS — drive via
`windows-mcp` shelling into native CLI / WSL. No dedicated MCP needed
because their workflow is file-based.
