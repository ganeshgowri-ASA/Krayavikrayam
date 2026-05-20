# Bite-size Task 7 — BOM extraction + India sourcing

---

```
Task 7 — Extract the BOM from <project>.kicad_sch (post-Task-1 footprints),
then build an India-sourcing table.

For each unique MPN, web-search:
- Robu.in URL + price (INR)
- Mouser India URL + price (USD + INR at 85)
- Element14 India URL + price (INR)
- Digi-Key India URL + price (USD + INR)
- Lead time (best case)
- MOQ
- RoHS status

Flag any part with lead time > 6 weeks. Recommend alternates from the same
suppliers.

Deliverables (to deliverables/bom/):
- bom_<project>.csv             (Ref, Qty, MPN, MFG, Footprint, Description)
- bom_sourcing_india.csv        (above + 8 sourcing columns)
- bom_sourcing_report.md        (total cost INR, total cost USD, # items > 6 wk,
                                  alternates suggested)
```

## Acceptance

- All MPNs found on at least one Indian supplier.
- Lead-time flag column populated.
- RoHS column populated (Y/N/Unknown).

## Why India-first

- Reliance preference for Indian-stocked spares (CLAUDE.md service-network rule).
- Sub-2-week lead time on commodity passives via Robu.in / Element14 IN.
- Customs cycle eliminated for routine maintenance restocks.
