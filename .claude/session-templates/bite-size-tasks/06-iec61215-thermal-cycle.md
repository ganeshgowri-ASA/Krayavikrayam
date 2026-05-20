# Bite-size Task 6 — IEC 61215 thermal-cycle profile generator

---

```
Task 6 — Generate IEC 61215-2:2021 MQT 11 thermal-cycle profile data for the
test recipe.

Per IEC 61215: 200 cycles, -40°C → +85°C, ramp ≤ 100°C/hour, dwell ≥ 10 min
at extremes. Total ~ 200 hours of test.

Using pvlib + numpy:
- Generate time-temperature CSV at 1-min resolution.
- Plot first 5 cycles + summary plot of all 200 cycles.
- Generate test-recipe JSON in RIL format: profile name, setpoint_array,
  ramp_rates, dwell_times, total_duration_hours.

Deliverables (to deliverables/sim/test_profiles/):
- thermal_cycle_iec61215.csv
- thermal_cycle_plot.png
- thermal_cycle_recipe.json
- thermal_cycle_report.md
```

## Acceptance

- Ramp rate ≤ 100 °C/h verified analytically.
- Dwell ≥ 10 min at +85 °C and −40 °C.
- Total duration matches 200 × (ramp_up + dwell_high + ramp_down + dwell_low).

## Reuse hooks

Same shape works for MQT 12 (HF) by changing extremes + adding 85 % RH
control set-point per minute. Same shape for MQT 13 (DH) but flat profile
at 85 °C / 85 % RH for 1000 h.
