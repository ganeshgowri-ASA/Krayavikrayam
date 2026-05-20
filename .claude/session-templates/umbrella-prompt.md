# Umbrella Session Prompt — Reliance Jamnagar PV Test Lab

Paste this ONCE at the start of every long Cowork / Claude Code session. Do
not repeat. Customise the bracketed `<...>` fields to your machine.

---

```
You are working on the Anahatasri / Krayavikrayam PV Test Bench project for
Reliance Industries Limited, Jamnagar. Full context follows.

### TOOLING STACK (all installed and verified)
- kicad-mcp                Python venv at <C:\Users\<YOU>\Documents\kicad-mcp\.venv> — drives KiCad 10
- Autodesk Fusion MCP      drives Fusion 3D Design (chassis, chambers, racks)
- Trimble SketchUp MCP     lab walk-through visuals only
- Blender MCP              photoreal renders, MP4 animation
- FreeCAD MCP              FreeCAD 1.1.1 + FEM via CalculiX (port 9875)
- OpenFOAM (WSL Ubuntu)    CFD; v2406 stable; shell via windows-mcp → wsl
- DWSim 9.0.5              refrigeration / process flowsheet
- CoolProp                 fluid properties (Python pip)
- OpenModelica             omc CLI; system-level multi-physics (FMU export)
- Octave 11.1.0            at <C:\Program Files\GNU Octave\Octave-11.1.0\mingw64\bin\octave.exe>
                           env var OCTAVE_EXECUTABLE set
- Scilab 2025              Xcos visual block diagrams
- LTspice                  driven via spicelib
- windows-mcp              OS glue, file moves, screenshots, WSL bridge
- Pinecone Assistant       pv-test-equipment-comparison-tbe-queies (API key set)

### PYTHON WRAPPERS IN kicad-mcp VENV
kiutils 1.4.8 · spicelib 1.5.1 · PyLTSpice 5.5.1 · oct2py 5.8.0 ·
python-control 0.10.2 · scipy · matplotlib · sympy · pvlib · coolprop ·
openpyxl

### PROJECT TARGETS (9 equipment workstreams)
01_TC_HF_20MOD         walk-in TC/HF chamber, 20 modules,  IEC 61215-2 MQT 11/12
02_TC_HF_10MOD         walk-in TC/HF chamber, 10 modules,  IEC 61215-2 MQT 11/12
03_LetID_PID_PSU       20-channel HV bias rack, IEC 61215-2 MQT 21, IEC TS 62804
04_DH_20MOD            damp heat chamber, 20 modules, IEC 61215-2 MQT 13, IEC 60068-2-78
05_UV_2MOD             UV preconditioning, 2 modules, IEC 61215-2 MQT 10
06_4IN1_COMBO_2MOD     TC+HF+DH+UV combined, 2 modules
07_SUNSIM_SS_2MOD      steady-state solar simulator, IEC 60904-9 Class CAA
08_HAIL_MBT_FPT        hail + module-breakage + frame-pull combo
09_ELEC_TEST_COMBO     Hipot + IVG + CS + RCOT (IEC 61730-2)
MLT                    mechanical load tester (existing, parametric Fusion model)

End customer: Reliance Industries Limited, Jamnagar (PV Pranali Test Lab).

### PROJECT FOLDER (locked)
08-engineering/PV_TestLab/0X_<equipment>/   per-equipment workspace
08-engineering/MLT/                          mechanical load tester (separate)
deliverables/                                writeable scratch (under each project folder)

### SAFETY HARD RULES (immutable)
- DO NOT in-house build the 100V/35A power stage or 2500V HV deck — use vendor
  bricks (TDK-Lambda / Spellman) + in-house LV control PCB.
- DO NOT claim Gerbers as "fab-ready" without full DRC pass + design review.
- ALWAYS save Fusion designs immediately with Ctrl+S (don't lose to crashes).
- ALWAYS write deliverables to 08-engineering/<project>/deliverables/.
- ALWAYS write only inside your assigned agent folder; raise hand on cross-agent
  geometry needs.

### WORKING STYLE
- I will give you ONE focused task per prompt.
- For each task: produce real artifact, save to disk, give 100-word summary,
  list any blockers.
- If you need a tool I haven't mentioned, ask before installing.
- Do NOT paste long file contents in chat — write to disk and reference the
  path.
- For multi-step work, queue subagents in parallel where independent.

Confirm understanding by replying with:
  (a) what tools you have access to right now,
  (b) what's in deliverables/ if it exists,
  (c) what you'd recommend as the highest-leverage next task.

After your reply, I'll send Task 1.
```

---

## How to use

1. Save your machine-specific paths in `<YOU>`-marked placeholders.
2. Paste the block above into your Claude Desktop / Cowork window once per
   session.
3. Then dispatch from `.claude/session-templates/bite-size-tasks/*.md`,
   one at a time.
4. Recovery prompts live in `.claude/session-templates/recovery/*.md`.
