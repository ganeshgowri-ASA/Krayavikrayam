# Bite-size Task 1 — KiCad footprint assignment

Paste this AFTER the umbrella prompt is acknowledged.

---

```
Task 1 — Run the footprint assignment script as Subagent 1 against
<project>.kicad_sch.

Open the schematic via kiutils. Assign footprints from the standard KiCad
library per the mapping table I provided earlier (STM32G474, W5500,
AMC1311, ISO7741, MAX31865, etc.). Save back to the same .kicad_sch.

Deliverable:
- updated <project>.kicad_sch
- deliverables/reports/footprint_assignment_report.md
  Summarising: total components, count assigned, count needing custom
  footprints, list of unmapped MPNs.

Save report to deliverables/reports/. Reply with a 100-word summary +
blockers list.
```

## Acceptance

- All standard parts mapped from KiCad 9/10 library.
- Unmapped MPNs flagged with vendor + part-number for next task (custom symbol lib).
- DRC-clean after run.

## Cross-tool

- KiCad MCP must be alive (`Test-NetConnection 127.0.0.1 -Port 9876`).
- Python venv has kiutils ≥ 1.4.8 (`<venv>/Scripts/python -c "import kiutils; print(kiutils.__version__)"`).
