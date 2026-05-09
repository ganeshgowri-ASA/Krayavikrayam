# RFQ Wizard — Discovery Spec

Status: discovery (read-only stubs in KV-D1.5; submit wiring lands later).
Owner: Track D1. Source of truth for `app/rfqs/new`.

## Steps

The wizard has six sequential steps. Each is a separate panel within a single
route (`/rfqs/new`); the active step is held in the `step` URL search param so
links and refreshes are stable.

| # | Step      | Goal                                                                 |
|---|-----------|----------------------------------------------------------------------|
| 1 | Scope     | What is being procured and which plant/buyer owns it.                |
| 2 | Items     | Line items (material code, qty, UoM, target price, delivery date).   |
| 3 | Suppliers | Invited vendor list and selection rationale.                         |
| 4 | Timeline  | Issue date, response window, Q&A cutoff, award target.               |
| 5 | T&C       | Incoterms, payment terms, warranty, attachments, compliance flags.   |
| 6 | Publish   | Read-only summary + publish action (wired later).                    |

## Field-level spec

### 1. Scope
- `title` (text, required) — short RFQ title.
- `category` (select) — material category from master.
- `plantId` (select) — plant/site requesting.
- `buyerId` (select) — RFQ owner.
- `priority` (enum: low/medium/high/urgent).
- `description` (textarea) — scope narrative.

### 2. Items
- Repeating row of `{ materialCode, description, quantity, uom, targetPrice, deliveryDate }`.
- At least one row required; bulk paste deferred.

### 3. Suppliers
- Multi-select from supplier master, filtered by category.
- Per-supplier rationale (text) optional.
- Minimum 3 suppliers recommended (soft warning).

### 4. Timeline
- `issueDate` (date) — when RFQ opens to suppliers.
- `responseDueDate` (datetime) — submission cutoff.
- `qnaCutoffDate` (datetime) — last day for clarifications.
- `awardTargetDate` (date) — internal target.

### 5. Terms & Conditions
- `incoterm` (enum: EXW/FOB/CIF/DDP/...).
- `paymentTerms` (text/template).
- `warrantyMonths` (number).
- `attachments` (file list — drawings, specs, NDAs).
- `complianceFlags` (multi: GST, MSME, ISO9001, ...).

### 6. Publish
- Read-only summary of all prior steps.
- Validation summary (blocking + warnings).
- "Publish" CTA — wired in a later session; emits draft until then.

## State

KV-D1.5 holds state in URL search params for navigation (`step`) and uses a
local in-memory store for field values within the session. Persistence to a
draft RFQ goes through the mock API (KV-D1.6) and the real backend later.

## Navigation

- Stepper at top shows all six steps; active step highlighted, completed steps
  marked.
- Back disabled on step 1; Next disabled on step 6 (Publish has its own CTA).
- Step links jump directly when permitted.
