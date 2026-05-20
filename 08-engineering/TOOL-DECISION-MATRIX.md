# Tool Decision Matrix — PV Equipment Engineering Stack

Honest assessment of the user's listed stack + my recommendations.
Updated 2026-05-19.

## What's already optimal in your list

| Tool | Use | Why keep |
|---|---|---|
| Fusion 360 | Mechanical parametric, sheet metal, assembly | Best-in-class for prosumer, has cloud sync, fusion-mcp exists |
| FreeCAD 1.1.1 + CalculiX | FEA (structural, modal, thermal) | Free, scriptable Python, CalculiX is industrial-grade |
| DWSim 9.0.5 + CoolProp | Refrigeration + HX + fluid properties | Free, NIST-grade refprops, handles ammonia / R-134a / R-404a |
| Scilab 2025 + GNU Octave 11.1 | Control systems, signal processing | Free, MATLAB-syntax compatible, runs `.sce` / `.m` headless |
| Blender 5.1 | Photoreal render, animation, MP4 | Best free renderer, mature blender-mcp |
| Pinecone | Vendor doc retrieval | Already configured for your TBE workflow |
| windows-mcp | OS automation glue | Required for shell-bridging tools without native MCP |

## My recommendations — switches & additions

### 1. Drop Flux, move PCB design to **KiCad 9**

**Why**: Flux's "airwiring" issue (auto-router weaknesses, single-side bias)
is a known limitation. KiCad 9:
- Open-source, $0 license cost.
- Freerouting plugin handles auto-routing on par with Altium.
- Has Python API → community `kicad-mcp` exists (https://github.com/lhc/kicad-mcp).
- STEP export for 3D check against Fusion / FreeCAD mechanical model.
- Same vendor library ecosystem (Mouser / Digikey BOM exports work natively).

**Migration path**:
1. Install KiCad 9 (https://www.kicad.org/download/).
2. Export Flux project to schematic + layout via KiCad's import wizard
   (Flux → Altium → KiCad chain works, or rebuild critical boards from
   scratch — usually faster).
3. Add `kicad-mcp` to `claude_desktop_config.json` (see MCP-CONFIG.md).
4. Use Fusion Electronics as a temporary fallback if a board is mid-design;
   it shares the same EAGLE roots as KiCad's import path.

**Tradeoff**: Flux has a slightly nicer UI for new users. KiCad's UI is
denser but vastly more powerful once you're past the first week.

### 2. Add **OpenModelica** for system-level multi-physics

**Why your current stack is missing this**:
DWSim is process simulation (steady-state mostly). Scilab/Octave are
math-first. Fusion Simulation is single-physics-at-a-time. Real climate-chamber
behavior is *coupled* — thermal mass × refrigeration COP × control-loop
response × UV-lamp heat dump.

**OpenModelica** handles this in one model:

```modelica
model Chamber4in1
  Modelica.Thermal.HeatTransfer.Components.HeatCapacitor wall(C=...);
  Modelica.Fluid.Vessels.ClosedVolume air(...);
  RefrigerationLoop r404a(...);
  UVLampHeat lamp(P=8e3);
  PID_TempControl ctrl(...);
equation
  // physics couplings
end Chamber4in1;
```

Then export to FMU (Functional Mock-up Unit) and *co-simulate* with Scilab,
DWSim, or even Simulink. FMU is the industry standard.

**Install path**: https://openmodelica.org/download (Windows installer).
No MCP server exists yet — wrap the OMC CLI (`omc <script.mos>`) in a small
FastMCP server (~50 lines of Python).

### 3. Skip Node-RED **for PLC**, but keep it **for prototyping HMIs and IoT**

CODESYS handles PLC + SCADA natively (when you get approval). Use Node-RED
for:
- Quick web dashboards in front of an OPC-UA endpoint
- MQTT bridging during equipment commissioning
- Data historian frontends (paired with InfluxDB + Grafana)

Don't use Node-RED as a hard-real-time PLC. It's not.

### 4. Add **JupyterLab + Python control stack**

Your Scilab/Octave covers MATLAB-style math. Add:
- `python-control` (Bode plots, root locus, MIMO state-space)
- `scipy.signal` (filter design, system ID)
- `coolprop` (you already have it via pip)
- `pymodbus` + `opcua` (talk to real PLCs from notebooks)

Why: faster iteration loops, easier handoff to ML engineers, runs in browser
(remote-friendly). Doesn't replace Scilab — it sits alongside.

### 5. Add **InfluxDB + Grafana** for production data historian

When the chambers go to production at Jamnagar, you'll need:
- Time-series logging (test cycle data: T, RH, irradiance, IV-curve)
- Dashboards (per-station throughput, alarm history, calibration drift)
- Alerting (out-of-spec excursions)

Both are free, container-friendly, and CODESYS / Node-RED / OPC-UA all
write to InfluxDB natively.

### 6. **OpenFOAM via WSL2** is the right call

You have it pending. Confirm:
- Install WSL2 + Ubuntu 24.04.
- `sudo apt install openfoam-default` (gets v2412 stable).
- Mount your Windows `08-engineering/` folder via `/mnt/c/...`.
- Drive from Claude through `windows-mcp` running `wsl bash -c "..."` shells.

No MCP server needed — shell-bridge is fine because OpenFOAM cases are file-
driven (no live-state to maintain).

### 7. **CODESYS** — wait for approval, but in parallel:

- Prototype HMI in Node-RED.
- Pre-write IEC 61131-3 structured text in plain `.st` files.
- Use OpenPLC (free) for development environment until CODESYS arrives.
  It can run the same `.st` files and validates the logic.

## Stack recommendation summary

| Layer | Recommended primary | Already installed? | Action |
|---|---|---:|---|
| Mech CAD | **Fusion 360** | ✅ | Keep |
| Mech CAD (open) | **FreeCAD 1.1.1** | ✅ | Keep |
| FEA | **FreeCAD FEM + CalculiX** | ✅ | Use this, not Fusion Sim (MCP-friendlier) |
| CFD | **OpenFOAM (WSL)** + **FreeCAD CfdOF** | ❌ + ✅ | Install OpenFOAM via WSL |
| Process / refrigeration | **DWSim + CoolProp** | ✅ + ✅ | Keep |
| Multi-physics (system) | **OpenModelica** | ❌ | **Install** (high-leverage) |
| Math / control | **Scilab + Octave + Python** | ✅ + ✅ + (add JupyterLab) | Add Jupyter |
| PCB | **KiCad 9** | ❌ | **Install, drop Flux** |
| PLC | **CODESYS** | ⏳ | Wait; use OpenPLC interim |
| SCADA / HMI | **CODESYS Visualization** + **Node-RED** (prototype) | ⏳ / ❌ | Install Node-RED |
| Render | **Blender 5.1** | ✅ | Keep |
| Knowledge | **Pinecone** | ✅ | Wire API key |
| OS glue | **windows-mcp** | ✅ | Keep |
| Historian | **InfluxDB + Grafana** | ❌ | Install Docker compose stack |

## Combination skills (why this stack beats single tools)

1. **MLT pull-frame design** → Fusion (parametric) → FreeCAD FEM (CalculiX
   structural at +5400/-2400/+6000/-5800 Pa per IEC 61215 §10.16) → Blender
   (deflection animation MP4) → operation manual auto-generated from params.

2. **4-in-1 climate chamber refrigeration design** → DWSim (cycle) +
   CoolProp (refprops) → OpenModelica (coupled thermal + control) →
   OpenFOAM (chamber airflow uniformity) → CODESYS (control logic on real
   PLC) → Blender (P&ID hero render).

3. **UV-2 chamber LED-UV driver PCB** → KiCad (schematic + layout +
   gerbers) → Fusion (enclosure) → FreeCAD FEM (thermal of heatsink) →
   Scilab (control-loop validation of irradiance setpoint).

4. **BBA Simulator power-supply** → KiCad → Octave (small-signal stability)
   → OpenModelica (transformer saturation + load step) → CODESYS (sequencer)
   → InfluxDB+Grafana (acceptance-test data capture).

## Anti-recommendations

- **Don't pay for ANSYS** until FreeCAD FEM hits a real ceiling. For
  PV-test-equipment loads (Pa-range pressures, mild thermal), CalculiX is
  fine.
- **Don't pay for Aspen Plus** for refrigeration design. DWSim + CoolProp is
  ≥95% of what you need.
- **Don't use SolidWorks** when Fusion + FreeCAD cover the same ground at
  one-tenth the cost and have MCP bridges.
- **Don't roll your own SCADA** — CODESYS Visualization is included with
  CODESYS, free for development, and far less fragile than custom Node-RED.

## When to ask vs. when to act

- "Should I install OpenModelica?" → Just install. High leverage, free, no risk.
- "Should I drop Flux?" → Yes, but stage the migration. Don't drop until at
  least one board is rebuilt in KiCad and validated end-to-end.
- "Should I add JupyterLab?" → Yes, it's `pip install jupyterlab` away.
- "Should I run OpenFOAM on Windows native?" → No, use WSL. Native build is
  painful.
