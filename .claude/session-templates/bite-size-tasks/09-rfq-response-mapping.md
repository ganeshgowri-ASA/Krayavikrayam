# Bite-size Task 9 — RIL RFQ response mapping

---

```
Task 9 — Map the work-in-progress deliverables to the RIL RFQ Excel template:
Sheet 0 Quotation, Sheet 1 Technical, Sheet 2 Utilities, Sheet 3 Other,
Sheet 4 BoM, Sheet 5 General Info.

For each RIL row, fill in our supplier-input column from the artefacts
produced in Tasks 1-8. Where data is unknown, mark "TBD pending Phase 2"
(never invent).

Deliverables (to deliverables/ril_submission/):
- ril_rfq_response_TC.csv      (10-channel TC supply, 6 sheets stitched)
- ril_rfq_response_PID.csv     (20-channel PID supply, 6 sheets stitched)
- ril_response_cover_letter.md (1-page exec summary)
- gap_analysis.md              (rows still TBD + plan to close)
```

## Acceptance

- Every RIL row has either a sourced answer or a `TBD` flag — no blank cells.
- `gap_analysis.md` lists each TBD with the owning task / agent that will close it.
- Cover letter cites IEC clauses where compliance is the differentiator.

## Cross-reference

- TBE skill (`tbe-evaluator`) consumes `ril_rfq_response_*.csv` once vendor
  evidence is committed under `05-evidence/`.
- Engineering skill consumes the parametric specs to validate that our offer
  passes our own simulations.
