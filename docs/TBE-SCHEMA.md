# Krayavikrayam — Canonical TBE Schema

Source spreadsheets:
- TCPS10_Comparison_File.xlsx
- PID-20-Ch-Comparison-File.xlsx
- Equipment-procurement-tracker.xlsx
- 4-in-1-Comparison-File.xlsx
- UV2_Comparison_File.xlsx

## 1. Common Pattern Observed
All comparison files follow a Technical-Bid-Evaluation (TBE) layout:
- Header block: RFQ ref, item code, scope, evaluator, date.
- Criteria rows: parameter name, specification (buyer requirement), unit, weight (optional).
- Supplier columns (N suppliers): quoted value, compliance (Y/N/Partial), remarks.
- Footer block: total score, recommendation, signatures.

## 2. Canonical Entities

### 2.1 TBE
- id, rfqId, title, category (TCPS / PID / Equipment / 4-in-1 / UV2 / Generic)
- evaluatorId, status (draft|in_review|approved|rejected), createdAt, approvedAt

### 2.2 TBECriterion
- id, tbeId, sectionId, sequence
- code, name, specification, unit
- dataType (text|number|enum|boolean|file)
- mandatory (bool), weight (number, optional)
- enumOptions[] (for enum)

### 2.3 TBESection
- id, tbeId, name, sequence (e.g., General, Mechanical, Electrical, Documentation, Commercial)

### 2.4 TBESupplier
- id, tbeId, supplierId, displayOrder, quotationRef

### 2.5 TBEResponse
- id, tbeId, criterionId, supplierId
- quotedValue, complianceFlag (Y|N|P), deviation, remarks, attachmentUrl
- score (computed)

### 2.6 TBEScore
- id, tbeId, supplierId, totalScore, normalizedScore, rank, recommended (bool)

## 3. Category-Specific Field Sets

### 3.1 TCPS10 (Transformer / Control Panel class)
Sections: General, Ratings, Insulation, Protection, Testing, Documentation, Commercial.

### 3.2 PID-20-Ch (Instrumentation, 20-channel)
Sections: General, Channel Spec, Signal Type, Accuracy, Environmental, Communication, Documentation, Commercial.

### 3.3 Equipment Procurement Tracker
Sections: Identification, Vendor, Delivery Schedule, Inspection, Dispatch, GRN, Payment.
Note: This is a tracker, not a TBE; modeled as POTracker entity reusing TBE section pattern.

### 3.4 4-in-1 Comparison
Sections: General, Functional Group A/B/C/D, Common Utilities, Documentation, Commercial.

### 3.5 UV2 Comparison
Sections: General, UV Source, Optics, Control, Safety, Documentation, Commercial.

## 4. Scoring Model
- Per-criterion score = compliance_factor * weight, where compliance_factor ∈ {1.0 Y, 0.5 P, 0.0 N}.
- Numeric criteria: score by closeness to spec or by min/max preference.
- Total = Σ criterion_score; Normalized = Total / Σ weights.
- Recommendation = supplier with highest normalized score AND no mandatory N.

## 5. Templates
Each category ships a seed template (sections + criteria) loaded via `prisma/seed/tbe-templates/*.json`.
A new TBE is instantiated by cloning a template and binding suppliers from the parent RFQ.

## 6. API Sketch
- POST /tbe (rfqId, templateKey)
- GET /tbe/:id
- PATCH /tbe/:id/responses (bulk upsert)
- POST /tbe/:id/score
- POST /tbe/:id/approve

## 7. UI Sketch
- TBE editor: spreadsheet-like grid; rows=criteria grouped by section, cols=suppliers.
- Sticky first column (criterion + spec); sticky header (supplier names).
- Inline compliance dropdown, deviation input, remarks, attachment.
- Right rail: score panel, recommendation, approval actions.

## 8. Open Items
- Confirm exact criteria lists per category by parsing the XLSX in CI (script: `scripts/ingest-tbe-xlsx.ts`).
- Decide whether weights are mandatory per category (TCPS10 typically yes; trackers no).
