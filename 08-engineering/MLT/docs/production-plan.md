# Production Plan — PV Mechanical Load Tester (MLT)

_Project: MLT  ·  Generated: 2026-05-20_

## Build sequence

### 1. Frame assembly

- **Inputs**: 80x80 Al extrusion bars, T-slot connectors
- **Tasks**: Cut to length, square-up jig, torque connectors to 25 Nm
- **Outputs / acceptance**: Diagonals match within ±0.5 mm
- **Duration**: 1 day
- **Owner**: Mech

### 2. Gantry + cable tray

- **Inputs**: Crossbeams, cable tray, derived-pitch fasteners
- **Tasks**: Install crossbeams, route main cable tray
- **Outputs / acceptance**: Tray slope ≥ 1:200; no sag
- **Duration**: 0.5 day
- **Owner**: Mech

### 3. Piston grid install

- **Inputs**: 153 pistons + manifolds + pneumatic tubing
- **Tasks**: Install pistons in 17x9 grid; route pneumatic manifold; leak-test
- **Outputs / acceptance**: Leak rate < 0.1 bar/min at 6 bar
- **Duration**: 2 days
- **Owner**: Mech + Pneumatics

### 4. Suction cup re-attach (2D-bis)

- **Inputs**: Cup library, vacuum manifold
- **Tasks**: Mount cups per Path γ revised plan
- **Outputs / acceptance**: All cups hold 0.6 bar vacuum for 5 min on flat plate
- **Duration**: 0.5 day
- **Owner**: Mech

### 5. Sensor harness

- **Inputs**: PT100, load cells, deflection LVDT
- **Tasks**: Mount sensors, route harness, wire to junction box
- **Outputs / acceptance**: All sensors register in HMI within ±0.5 % of ref
- **Duration**: 1 day
- **Owner**: Instrumentation

### 6. Electrical cabinet

- **Inputs**: Drives, PLC, 24 V PSU, safety relays
- **Tasks**: Mount components, wire per drawing, ELV/LV segregation
- **Outputs / acceptance**: IR test > 50 MΩ; functional safety FAT pass
- **Duration**: 1.5 days
- **Owner**: Electrical

### 7. PLC + HMI commissioning

- **Inputs**: CODESYS project, HMI screens
- **Tasks**: Upload program, configure IO, tune control loops
- **Outputs / acceptance**: All sequences run within ±1 % of setpoint
- **Duration**: 1 day
- **Owner**: Controls

### 8. Empty-chamber FAT

- **Inputs**: —
- **Tasks**: Run full cycle without DUT; verify safety interlocks
- **Outputs / acceptance**: All safety functions test pass; no false trips
- **Duration**: 0.5 day
- **Owner**: QA

### 9. DUT-loaded SAT

- **Inputs**: Reference 1650x992 module
- **Tasks**: Run IEC 61215 §10.16 cycle on reference DUT
- **Outputs / acceptance**: EL scan matches baseline; deflection within ±2 mm of FEA prediction
- **Duration**: 1 day
- **Owner**: QA + Customer

### 10. Handover

- **Inputs**: Operation manual, BoM, spare parts, training records
- **Tasks**: Customer training, document handover
- **Outputs / acceptance**: Customer sign-off
- **Duration**: 0.5 day
- **Owner**: PM


## Bill of Materials (BoM)

_No `bom.csv` yet — populate from KiCad / Fusion / DWSim exports._
