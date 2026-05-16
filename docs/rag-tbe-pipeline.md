# RAG → TBE deliverables pipeline

End-to-end deterministic pipeline that retrieves vendor evidence from the
Pinecone Assistant `pv-test-equipment-comparison-tbe-queies`, fills the
locked Technical-Bid-Evaluation (TBE) Excel templates, generates a
vendor-clarification Word document, and composes (but never sends) the
HOD review email per package.

## Layout

```
scripts/
  packages.py        # package list + locked weights + locked constants
  queries.py         # 8 standard + 2 sun-simulator query templates
  rag_retrieve.py    # Pinecone retrieval, JSON-shape coercion, user facts merge
  scoring.py         # 5 locked scoring rules
  fill_tbe.py        # openpyxl writer (preserves VBA/links/formulas/merges/images)
  gen_query_doc.py   # python-docx vendor clarification matrix
  gen_email.py       # multipart MIME composer (writes .eml + .html)
  run_pipeline.py    # orchestrator + summary report
tests/               # pytest suite (offline, no live Pinecone)
evidence/            # generated -- per-package, per-vendor JSON (gitignored)
deliverables/        # generated -- TBE.xlsx, .docx, .eml, .html (gitignored)
templates/           # optional master TBE templates (xlsm/xlsx) (gitignored)
```

## Environment

| Var                  | Required | Notes                                                                 |
| -------------------- | -------- | --------------------------------------------------------------------- |
| `PINECONE_API_KEY`   | yes for live retrieval | When unset, the pipeline records every Pinecone-derived field as `"Not declared"` with `provenance: "no-pinecone"`. Tests deliberately run with it unset. |

Never commit a Pinecone key. The key value belongs in a CI secret or
local `.env` (already in `.gitignore`).

## Install

```bash
python -m pip install -r requirements.txt
```

## Locked packages

| Key             | Display name                          | Weight profile        |
| --------------- | ------------------------------------- | --------------------- |
| `UV2`           | UV-2 weather chamber                  | DC=30 / EO=5  (UV)    |
| `UV4in1`        | 4-in-1 (UV/Damp-Heat/Thermal)         | DC=30 / EO=5  (UV)    |
| `DH20`          | Damp-Heat 20-chamber                  | DC=32 / EO=7          |
| `TCHFDH10`      | TC-HF + DH 10-chamber                 | DC=32 / EO=7          |
| `TCHFDH20`      | TC-HF + DH 20-chamber                 | DC=32 / EO=7          |
| `TCPS10-PID10`  | TC-PS 10 / PID-10 combo               | DC=32 / EO=7          |
| `PID20`         | PID-20 chamber                        | DC=32 / EO=7          |
| `TCHF-LETID-PS` | TC-HF + LETID-PS                      | DC=32 / EO=7          |
| `MH-SSS`        | Metal-Halide Steady-State Sun Sim     | DC=32 / EO=7  (SSS)   |
| `LED-SSS`       | LED Steady-State Sun Simulator        | DC=32 / EO=7  (SSS)   |
| `BBA-SSS`       | BBA Steady-State Sun Simulator        | DC=32 / EO=7  (SSS)   |
| `AAA-Flasher`   | AAA Pulsed Flasher                    | DC=32 / EO=7  (SSS)   |
| `AAA-SSS`       | AAA Steady-State Sun Simulator        | DC=32 / EO=7  (SSS)   |

`DC` = Design Concept weight cap, `EO` = Ease of Operation weight cap.
`SSS` packages additionally trigger the two sun-simulator queries
(spectral match, lamp life).

## Locked scoring rules

These five rules are immutable without procurement-team sign-off:

1. **Option-A penalty.** Any vendor that lists a China-origin spare
   without (a) India stock AND (b) a contractual MTTR incurs a `-3`
   penalty in the Risk section. See `scripts/scoring.py:option_a_penalty`.
2. **MTBF / warranty / HMI run-hour visibility.** Each contributes to
   the Reliability section **only when explicitly declared**. Missing →
   the row reads `"Not declared"` and contributes 0 (neither credit nor
   penalty).
3. **Fluorescent-UV downgrade.** When the package is a UV package AND
   the evidence's `compressor` field reads "fluorescent" (anywhere in
   the value, case-insensitive), the Compliance-tally Design-Concept
   score is multiplied by `0.5`.
4. **Multilingual HMI credit.** `+2` to Ease of Operation, **only for
   Zenitek**, and **only when** the connectivity evidence's
   `verbatim_quote` contains the word "multilingual" / "multi-lingual" /
   "multi lingual".
5. **Capex rows blank.** All Capex rows are written with the literal
   placeholder `"TBC - Procurement Team assessment"` and contribute 0
   to the total. No Capex value is ever auto-scored.

Every score cell carries a `Ref: <file>!<sheet>!Row N` citation in the
Comments column. If evidence is missing the ref reads `Ref: Not declared`.

## CLI usage

### Retrieve evidence for one vendor

```bash
python -m scripts.rag_retrieve \
    --package UV2 \
    --vendor Atlas \
    --facts facts/atlas-uv2.json
```

Or pipe JSON facts on stdin:

```bash
echo '{"compliance_tally":{"fc":42,"pc":6,"dnc":2,"source_file":"x","sheet":"y","row":1,"verbatim_quote":"..."}}' \
    | python -m scripts.rag_retrieve --package UV2 --vendor Atlas
```

### Fill the TBE workbook for one package

```bash
python -m scripts.fill_tbe \
    --package UV2 \
    --vendors Atlas,Zenitek,Espec
```

This writes `deliverables/TBE-UV2-v<YYYYMMDD>.xlsx`. If
`templates/UV2.xlsm` (or `.xlsx`) exists it is loaded with
`keep_vba=True, keep_links=True` and *appended to* -- never regenerated.

### Generate the vendor clarification .docx

```bash
python -m scripts.gen_query_doc \
    --package UV2 \
    --vendors Atlas,Zenitek
```

### Compose the HOD email (writes .eml + .html, does NOT send)

```bash
python -m scripts.gen_email \
    --package UV2 \
    --vendors Atlas,Zenitek \
    --to hod@example.com \
    --attach deliverables/TBE-UV2-v20260516.xlsx \
    --attach deliverables/UV2-vendor-clarification.docx
```

### Full orchestrated run

```bash
python -m scripts.run_pipeline \
    --packages UV2,UV4in1,DH20,AAA-SSS \
    --vendors Atlas,Zenitek,Espec \
    --facts-dir facts/ \
    --to hod@example.com
```

`--facts-dir` is searched in this order for each (package, vendor):
`<dir>/<pkg>__<vendor>.json`, `<dir>/<vendor>.json`,
`<dir>/<pkg>/<vendor>.json`.

## What never happens

* The pipeline **never invents row numbers**, anecdotes, or vendor
  features. Missing evidence → `"Not declared"` + prescribed penalty.
* Evidence from one vendor **never appears in another vendor's
  workbook** (covered by `tests/test_rag_retrieve.py::test_no_cross_vendor_transfer`).
* Capex is **never auto-scored**.
* Pinecone API keys are **never logged or written to evidence files**.
* Emails are **never sent**. The pipeline only composes `.eml` + `.html`
  for procurement-team review.

## Tests

```bash
pytest                          # full suite
pytest tests/test_scoring_rules.py -v   # just the locked-rule unit tests
pytest -k "round_trip"          # template integrity tests
```

CI: `.github/workflows/rag-tbe.yml` runs on push/PR for `scripts/`,
`tests/`, `requirements.txt`, `pyproject.toml`, and the workflow file
itself.
