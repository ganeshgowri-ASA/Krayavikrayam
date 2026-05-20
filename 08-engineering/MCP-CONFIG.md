# MCP Configuration — `claude_desktop_config.json` for PV Equipment Engineering

Drop-in template for your Windows Claude Desktop. Merges with your existing
config — does NOT replace it. Adjust paths to your install locations.

```jsonc
{
  "mcpServers": {
    /* ---------------- Already configured (per your status table) ---------------- */

    "fusion": {
      "command": "uvx",
      "args": ["fusion-mcp"],
      "env": { "FUSION_API_TOKEN": "<your-fusion-api-token>" }
    },

    "freecad": {
      // Wraps FreeCAD's RPC server (started from inside FreeCAD via
      // Tools → Macros → Run RPC Server). Default port 9875 after the
      // port-conflict fix documented in the MLT chat log.
      "command": "uvx",
      "args": ["freecad-mcp"],
      "env": { "FREECAD_RPC_HOST": "127.0.0.1", "FREECAD_RPC_PORT": "9875" }
    },

    "blender": {
      "command": "uvx",
      "args": ["blender-mcp"],
      "env": { "BLENDER_PATH": "C:\\Program Files\\Blender Foundation\\Blender 5.1\\blender.exe" }
    },

    "filesystem": {
      // Reads/writes inside the project root only — keeps DWSim .dwxmz,
      // Scilab .sce, Octave .m, OpenFOAM case dirs, etc. accessible.
      "command": "uvx",
      "args": ["mcp-server-filesystem", "C:\\Users\\<YOU>\\Krayavikrayam"]
    },

    "windows-mcp": {
      // OS-level glue: launching processes, file moves, screenshots,
      // shelling into WSL for OpenFOAM.
      "command": "uvx",
      "args": ["windows-mcp"]
    },

    "pinecone": {
      "command": "npx",
      "args": ["@pinecone-database/pinecone-mcp"],
      "env": {
        "PINECONE_API_KEY": "<your-key>",
        "PINECONE_ASSISTANT_NAME": "pv-test-equipment-comparison-tbe-queies"
      }
    },

    /* ---------------- Recommended additions (one-time install per machine) ---- */

    "kicad": {
      // Community MCP for KiCad 9. Replaces Flux for PCB design.
      "command": "uvx",
      "args": ["kicad-mcp"],
      "env": { "KICAD_PATH": "C:\\Program Files\\KiCad\\9.0\\bin\\kicad.exe" }
    },

    "openfoam": {
      // No native MCP; we shell into WSL via windows-mcp instead.
      // Add a thin wrapper script if you want a typed interface — see below.
      // Until then, drive OpenFOAM with:
      //   windows-mcp → shell: wsl bash -c "cd /mnt/c/.../sim/thermal/case1 && blockMesh && simpleFoam"
    },

    "openmodelica": {
      // Wrap omc (OpenModelica Compiler) CLI. ~50 lines of FastMCP.
      // Template: 06-scripts/openmodelica_mcp.py
      "command": "uv",
      "args": ["run", "python", "C:\\Users\\<YOU>\\Krayavikrayam\\06-scripts\\openmodelica_mcp.py"],
      "env": { "OPENMODELICA_HOME": "C:\\Program Files\\OpenModelica1.24.0-64bit" }
    },

    "node-red": {
      // Node-RED already exposes a REST admin API on :1880. A small MCP
      // can read/write flows via that API. Not critical until you start
      // building HMIs.
      "command": "uvx",
      "args": ["node-red-mcp"]
    }
  }
}
```

## Apply procedure (Windows, no PowerShell drama)

The MLT chat showed PowerShell merge attempts produced JSON syntax errors.
**Use the editor directly**:

1. Open `%APPDATA%\Claude\claude_desktop_config.json` in **VS Code** (it
   understands JSONC and warns on syntax errors before you save).
2. Find the `"mcpServers": { ... }` block.
3. Paste the entries above **inside** the existing braces, comma-separated.
4. Save. VS Code will flag any missing commas.
5. **Fully quit Claude Desktop** (System tray → right-click → Quit, not just
   close the window) and re-launch.
6. Open Claude Desktop → `/mcp` → confirm each server shows green.

If a server shows red, click it to see the stderr. 90% of failures are:
- Wrong absolute path in `command` or env var
- Server expects to be already running (FreeCAD RPC must be started from
  inside FreeCAD before its MCP wrapper can connect)
- Missing `uvx` — run `pip install uv` first

## Per-tool sanity check

```powershell
# FreeCAD RPC alive on 9875
Test-NetConnection 127.0.0.1 -Port 9875

# KiCad CLI works
kicad-cli --version

# OpenModelica
omc --version

# WSL + OpenFOAM
wsl bash -c "foamVersion"

# Blender headless
blender --version

# DWSim headless (CLI mode)
"C:\Program Files\DWSIM 9\DWSIM.exe" --help
```

If any of those fail, fix the install before adding the MCP entry — the MCP
wrappers all assume the underlying tool is on PATH and launchable.
