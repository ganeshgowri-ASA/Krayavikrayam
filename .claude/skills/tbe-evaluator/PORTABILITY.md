# Skill portability + CAD/CAE MCP wiring

This skill (and the whole TBE pipeline) is portable: it lives in the repo, so
any PC that clones `Krayavikrayam` and runs Claude Code can invoke it.  No
"export" step.  No PC-specific state.

## What travels with the repo

- `.claude/skills/tbe-evaluator/SKILL.md`  — the skill itself.
- `00-rules/CLAUDE.md`                     — locked scoring rules.
- `05-evidence/*.md`                       — per-package vendor evidence.
- `06-scripts/*.py`                        — engine + pitch generator.
- `06-scripts/pyproject.toml`              — `uv` reproducible env.

## What needs per-machine setup (one-time)

1. **`uv`** — `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. **Python deps** — `cd 06-scripts && uv venv && uv pip install openpyxl`
3. **(Optional) Pinecone Assistant** — set `PINECONE_API_KEY` and
   `PINECONE_ASSISTANT_NAME` in env, then `pinecone_client.py` will retrieve
   vendor docs.  Without these the script fails closed (no fabrication).

## CAD / CAE MCP wiring — concrete recipes

All MCP servers are declared in `.mcp.json` at the project root.  Claude Code
on any machine picks them up.  Drop the relevant block, restart the session.

### SketchUp  (already available in cloud sessions)

Server name varies — call it via `mcp__<id>__build_model` /
`mcp__<id>__save_model`.  Good for: 4-in-1 chamber bay layouts, BBA enclosure
plans, service-clearance drawings.

### Blender  (community MCP — well-maintained)

```jsonc
// .mcp.json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"],
      "env": { "BLENDER_PATH": "/Applications/Blender.app/Contents/MacOS/Blender" }
    }
  }
}
```

Good for: photoreal renders of the chamber + module layout (management deck
visuals), animation of the UV-exposure cycle, USD export for downstream tools.

### FreeCAD  (community MCP — variable quality)

```jsonc
{
  "mcpServers": {
    "freecad": {
      "command": "uvx",
      "args": ["freecad-mcp"],
      "env": { "FREECAD_PATH": "/usr/bin/freecad" }
    }
  }
}
```

Good for: parametric chamber-frame design, STEP / IGES for vendor sharing.

### Fusion 360  (no MCP yet — build one in ~1 day)

Fusion has a Python API ([fusion360api](https://help.autodesk.com/view/fusion360/ENU/?guid=GUID-A92A4B10-3781-4925-94C6-47DA85A4F65A)).  Wrap it in FastMCP:

```python
# fusion_mcp.py
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("fusion")

@mcp.tool()
def create_sketch(plane: str, points: list[list[float]]) -> str:
    """Drive Fusion via its Python add-in bridge."""
    # ... call out to Fusion's API ...
    return "sketch_id"

if __name__ == "__main__":
    mcp.run()
```

Then declare it in `.mcp.json` like any other server.  Best for: precise
parametric mechanical design of the chamber doors, gasket layouts, lamp racks.

### Scilab  (no MCP — shell-bridge it)

Scilab has a CLI (`scilab -nwni -e "<expr>"`).  Same FastMCP wrapper pattern:

```python
@mcp.tool()
def run_scilab(script: str) -> str:
    out = subprocess.check_output(["scilab", "-nwni", "-e", script], text=True)
    return out
```

Good for: control-loop validation of the chamber's temperature/UV-irradiance
PIDs, bode plots for the power-supply step response.

### Flux (Altair) — Windows-only COM API

Flux drives via COM on Windows.  Use `pywin32` from inside a Windows
machine + FastMCP.  Good for: EM-FEM validation of the BBA simulator
transformer + filter inductor saturation behavior under fault.

## Multi-physics design loop (recommended workflow)

```
Fusion / FreeCAD   --(STEP)-->   ANSYS / OpenFOAM / Flux
       |                                |
       |                          (reports + plots)
       v                                v
       SketchUp (layout)         05-evidence/<PKG>.md  ← `simulation_validation` block
       Blender (render)                 |
                                        v
                            06-scripts/fill_tbe.py
                            06-scripts/build_pitch.py
                                        |
                                        v
                               07-output/*.{xlsx,md,json}
```

The TBE skill **does not run simulations** itself.  It **ingests vendor-supplied
simulation reports** as `simulation_validation.{thermal_cfd, radiation_uv,
structural_fea, electrical_emc, coupled_thermal_radiation}` evidence.  Co-
occurrence of ≥2 physics domains → +2 on Design Concept and +1 on Tech
Maturity (per CLAUDE.md).

## "Will this run on my machine?"

If you can:
- `git clone ganeshgowri-ASA/Krayavikrayam`
- `uv venv` in `06-scripts/`
- Open Claude Code in the repo root

…then the TBE skill is available.  Type `/tbe UV-2` and it will run the
deterministic pipeline.  CAD/CAE MCPs are additive — the TBE engine works
without any of them; they just give richer drawings + simulation hooks
when the package needs visualisation work.
