# RFQ Wizard — Discovery (KV-D1.4)

Field-level spec for the buyer-facing RFQ creation wizard. Six linear steps with a persistent draft (autosave on field blur). The wizard produces an RFQ in `Draft` status until **Publish**, after which it becomes `Open` and is visible to invited suppliers.

Status: discovery only. No runtime code in this PR. Implementation lands in KV-D1.5 (skeleton) and KV-D1.6 (mock API).

## Conventions

- **Required**: must be set before the user can advance to the next step.
- **Validation**: client-side rules. Server re-validates on Publish.
- **Default**: value pre-populated when the step is first rendered for a new draft.
- **Edge cases**: explicit behaviors that must be handled (not implicit).
- All money fields use the RFQ's currency (default `INR`); all timestamps are stored in UTC and rendered in the user's plant timezone.
- Step navigation: forward navigation requires the current step to be valid; backward navigation is always allowed and does not discard data.
- Autosave: every field change persists to the draft after a 500 ms debounce. The draft has a server-assigned `rfqId` from step 1 onward.

---

## Step 1 — Scope

Captures the high-level "what and why" of the RFQ. Creating this step provisions the draft `rfqId`.

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| `title` | string | Yes | — | 5–120 chars; trimmed; must be unique per (businessUnit, plant) among non-cancelled RFQs in the last 365 days (warn, not block). |
| `category` | enum (Master Data: `Category`) | Yes | — | Must be an active category the user is permitted to source for. |
| `businessUnit` | enum (Master Data: `BU`) | Yes | User's primary BU if exactly one | Must be active; user must have RFQ-create permission on this BU. |
| `plant` | enum (Master Data: `Plant`) | Yes | User's default plant if set | Plant must belong to the selected `businessUnit`. |
| `justification` | text | Yes | — | 20–2000 chars. Required for audit trail. |
| `currency` | enum ISO-4217 | Yes | `INR` | Must be in the BU's allowed currency list. |
| `linkedPRs` | array<PR id> | No | — | Each PR must be in `Approved` status, same BU+plant, and not already linked to a non-cancelled RFQ. |

**Edge cases**

- User has no permitted BU → block step with "Contact your admin to be assigned a Business Unit".
- User changes `businessUnit` after `plant` is set → clear `plant`, `linkedPRs`, and (if currency is no longer permitted) reset `currency` to BU default. Warn before clearing.
- Title duplicate detected → soft warning with link to the prior RFQ; user may proceed.
- `linkedPRs` includes a PR whose category differs from `category` → warn, do not block (PR may have multi-category lines).

---

## Step 2 — Items

Line items the suppliers will quote against. Items are pulled from Master Data (`Material` / `Service`); ad-hoc free-text items are not allowed in this wizard (they require a PR first).

**Per line item**

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| `materialCode` | ref Master Data | Yes | — | Must be active; category must match step 1's `category` (or be a child category). |
| `description` | string | Yes | Master Data description | 1–500 chars; editable to add RFQ-specific spec. |
| `quantity` | decimal(14,4) | Yes | — | `> 0`; ≤ 1e9. |
| `uom` | enum (Master Data: `UOM`) | Yes | Material's base UOM | Must be in the material's allowed UOM list (with conversion factor). |
| `targetPrice` | decimal(14,4) | No | Last awarded price for (material, plant) if available | `≥ 0`; in RFQ `currency`. Hidden from suppliers unless `disclosureFlag = true`. |
| `targetPriceDisclosed` | boolean | No | `false` | — |
| `needByDate` | date | Yes | Earliest `needByDate` from `linkedPRs` if any | `≥ today + 1` and `≤ today + 365`. Must be `>` Step 4 `responseDeadline` + 1 day (lead time check). |
| `deliveryLocation` | enum (Master Data: `Location`) | Yes | Selected `plant`'s default receiving location | Must belong to selected `plant`. |
| `notes` | text | No | — | ≤ 1000 chars. |
| `attachments` | array<file ref> | No | — | Per-line specs/drawings (≤ 10 files, ≤ 25 MB each). |

**Step-level rules**

- At least **1** line item required; max **200**.
- Duplicate `materialCode` is allowed only if `deliveryLocation` or `needByDate` differs (warn otherwise).
- If any `linkedPRs` are set in Step 1, the user is offered a "Pull lines from PRs" action that pre-populates items; PR lines marked already-fulfilled are skipped.

**Edge cases**

- Material is deactivated mid-draft → mark line invalid with "Material no longer active. Replace or remove."
- UOM has no conversion factor for the chosen base → block save with explicit error.
- `needByDate` violates lead time after Step 4 is filled → flag in Review step rather than rolling back; do not silently change dates.
- User pastes 1000 SKUs → enforce 200 cap with "Split this RFQ" guidance.

---

## Step 3 — Suppliers

Multi-select from the buyer's approved supplier list, scoped to step 1's `category` and `businessUnit`.

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| `suppliers` | array<supplier id> | Yes | — | ≥ 2 and ≤ 25. Each must be `Active`, not `Blacklisted`, KYC-valid, and approved for the `category`. |
| `inviteMessage` | text | No | Stock template per BU | ≤ 2000 chars. |
| `allowSupplierSelfNomination` | boolean | No | `false` | If `true`, additional approved suppliers in the category may opt in until `responseDeadline`. |

**Selection assist**

- Default sort: prior performance score (desc), then last awarded date (desc).
- Filters: region, certifications (e.g., ISO 9001), MSME status, prior performance band.
- Show per-supplier badges: KYC-expiring-in-30-days (warn), tax-cert-missing (warn), blacklisted (block + hide).

**Edge cases**

- Only one approved supplier exists for the category → block with "Single-source justification required" link to the single-source flow (out of scope here; show CTA).
- A selected supplier's KYC expires before `publishDate` → block at Publish with actionable error.
- Supplier removed from approved list mid-draft → automatically removed with a non-dismissable banner listing affected suppliers.
- Self-nomination enabled but `category` has fewer than 5 approved suppliers → warn (low pool).

---

## Step 4 — Timeline

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| `publishDate` | datetime | Yes | `now` | `≥ now` and `≤ now + 30 days`. |
| `responseDeadline` | datetime | Yes | `publishDate + 7 days` at 17:00 plant-local | `> publishDate + 24h`; `≤ publishDate + 90 days`. Must be a working day (warn if weekend/holiday per plant calendar). |
| `tbeDeadline` | datetime | Yes | `responseDeadline + 5 working days` at 17:00 plant-local | `> responseDeadline + 24h`; `≤ responseDeadline + 30 days`. |
| `qaWindow` | object `{ start, end }` | No | `{ publishDate, responseDeadline - 48h }` | If set: `start ≥ publishDate`, `end ≤ responseDeadline - 24h`. |
| `timezone` | enum IANA | Yes | Plant's timezone | Read-only display unless plant has multiple. |

**Edge cases**

- `needByDate` from any line item ≤ `responseDeadline` → block with "Adjust line need-by dates or shorten response window".
- `tbeDeadline` falls on a public holiday → warn; suggest next working day at 17:00.
- User edits `publishDate` to the past after autosave → snap forward to `now + 5 minutes` and show toast.
- Daylight-saving transition between `publishDate` and `tbeDeadline` → store UTC; display computes offset per render.

---

## Step 5 — Terms & Conditions

| Field | Type | Required | Default | Validation |
|---|---|---|---|---|
| `paymentTerms` | enum (`Net 30`, `Net 45`, `Net 60`, `Advance %`, `Milestone`, `Custom`) | Yes | BU default | If `Advance %`: `advancePercent` (1–50) required. If `Milestone`: ≥ 1 milestone with `description`, `percent`; sum of `percent` = 100. If `Custom`: `customTermsText` (50–4000 chars) required. |
| `deliveryTerms` | enum (`FOB-Plant`, `FOR-Site`, `Ex-Works`, `Door-Delivery`) | Yes | BU default | — |
| `incoTerms` | enum Incoterms 2020 (`EXW`, `FCA`, `CPT`, `CIP`, `DAP`, `DPU`, `DDP`, `FAS`, `FOB`, `CFR`, `CIF`) | Yes for cross-border; optional domestic | `DAP` for cross-border, blank for domestic | Required when any selected supplier is in a different country than the plant. |
| `incoLocation` | string | Conditional | Plant's city | Required if `incoTerms` is set. ≤ 200 chars. |
| `warrantyMonths` | integer | No | 12 | `0–120`. |
| `penaltyClause` | text | No | BU default boilerplate | ≤ 4000 chars. |
| `attachments` | array<file ref> | No | — | T&C addenda, drawings, NDA. ≤ 20 files; ≤ 25 MB each; allowed types: PDF, DOCX, XLSX, PNG, JPG, DWG, STEP. |
| `requiresNDA` | boolean | No | `false` | If `true`, suppliers must accept the attached NDA before viewing items. NDA file required. |
| `complianceFlags` | multi-select | No | — | Options: `MSME-preferred`, `GeM-mirror`, `BIS-required`, `RoHS`, `REACH`, `FSSAI`. Free-text custom flags not allowed. |

**Edge cases**

- Cross-border supplier added in Step 3 after `incoTerms` was left blank → revisit-flag on Step 5 in Review.
- Milestone percentages don't sum to 100 → block; show running total.
- NDA toggled on after suppliers already viewed the RFQ (post-publish edit, out of wizard scope) → not handled here; document only.
- Attachment virus scan pending → allow draft save; block Publish until clean.

---

## Step 6 — Review & Publish

Read-only summary of all prior steps with inline "Edit" links and a consolidated validation panel. **No new fields**, but the Publish action requires:

| Check | Severity | Behavior |
|---|---|---|
| All required fields present | Error | Blocks Publish; click jumps to first invalid field. |
| Line item lead time vs. `responseDeadline` | Error | Blocks. |
| Supplier KYC valid through `publishDate` | Error | Blocks; offers "Replace supplier". |
| Title duplicate within 365 days | Warn | Confirm dialog. |
| `responseDeadline` on weekend/holiday | Warn | Confirm dialog. |
| Self-nomination on with small approved pool | Warn | Confirm dialog. |
| Pending attachment scans | Error | Blocks; auto-recheck every 10 s. |
| Cross-border without `incoTerms` | Error | Blocks. |
| Single-bidder situation | Error | Blocks unless single-source flow completed. |

**Publish action**

- Atomically: validates server-side, sets `status = Open`, freezes the draft, triggers supplier-invite emails (queued), writes audit log entry `RFQ.PUBLISHED` with the user, timestamp, and a content hash of the published payload.
- On failure: surface the failed check, keep `status = Draft`, no emails sent.
- After success: redirect to RFQ detail page; "Edit" is replaced by "Amend" (amend flow is out of scope for D1).

**Defaults**

- "Send me a copy of supplier invites" toggle: default `true`.
- "Add to my watchlist" toggle: default `true`.

**Edge cases**

- User loses RFQ-create permission between draft and Publish → block with "Permissions changed; contact admin"; draft preserved.
- Concurrent edit (same draft, two tabs) → last-writer-wins per field with a "stale field" toast on conflict; Publish requires a re-read.
- Network failure mid-publish → idempotency key on the Publish call; retry safe.
- Buyer attempts Publish after `publishDate` already in the past (long-idle session) → snap `publishDate` forward to `now + 5 min` and re-confirm.

---

## Out of scope (tracked for later)

- Amend / republish flow after Publish.
- Supplier-side response wizard (separate discovery).
- TBE evaluation hooks (covered by `docs/TBE-SCHEMA.md` and the TBE sessions).
- Single-source justification flow (gated CTA only here).
- Reverse-auction extension to RFQ.

## Cross-references

- PRD: `docs/PRD-v3.md` §6 RFQs + TBE.
- TBE schema: `docs/TBE-SCHEMA.md`.
- Sessions: `docs/SESSION-INDEX.md` (KV-D1.5 wizard skeleton, KV-D1.6 mock API).
