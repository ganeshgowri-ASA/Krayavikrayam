# KV-E1.4 — Orders Detail Discovery

Status: Discovery (no runtime code)
Owner: Procurement squad
Scope: Field-level specification for the Orders Detail view covering Purchase Order (PO) header & lines, Goods Receipt Note (GRN), Invoice, 3-way match, and Payment status.

This document is the source of truth for downstream schema, API, and UI tickets. It defines required fields, validations, and known edge cases for each entity. It does **not** prescribe storage, indexing, or UI layout.

---

## 1. Conventions

- **Required**: must be present at create time and cannot be cleared.
- **Conditionally required**: required only when the noted condition holds.
- **Optional**: may be null/absent.
- **Identifiers**: all human-facing identifiers (`poNo`, `grnNo`, `invoiceNo`) are unique per tenant. Internal surrogate IDs (UUIDs) are assumed and not enumerated below.
- **Money**: stored as a `{ amount: decimal(18,4), currency: ISO-4217 }` pair. UI rounds to currency minor units; storage keeps 4 decimals to avoid rounding drift on tax/line totals.
- **Quantities**: `decimal(18,3)` to support partial units (kg, m, l). UoM is captured per line.
- **Timestamps**: UTC ISO-8601; user-facing display in tenant locale/timezone.
- **Audit**: every entity carries `createdAt`, `createdBy`, `updatedAt`, `updatedBy`. Not repeated below.

---

## 2. PO Header

The PO header is the contractual envelope around a set of order lines.

| Field | Type | Required | Notes |
|---|---|---|---|
| `poNo` | string (≤ 32) | Required | Tenant-unique. Format `PO-{yyyy}-{seq}` recommended. Immutable after issue. |
| `status` | enum | Required | `draft` → `pending_approval` → `approved` → `issued` → `partially_received` → `received` → `closed` / `cancelled`. |
| `supplier.id` | uuid | Required | FK to Supplier master. Must be `active`. |
| `supplier.name` | string | Required (snapshot) | Captured at issue time so later supplier renames don't mutate historical POs. |
| `supplier.gstin` / tax id | string | Conditionally required | Required if supplier is taxable in jurisdiction. |
| `currency` | ISO-4217 | Required | Must equal supplier's contracted currency unless override flag set. |
| `incoTerms` | enum | Required | INCOTERMS 2020: `EXW, FCA, FAS, FOB, CFR, CIF, CPT, CIP, DAP, DPU, DDP`. |
| `incoLocation` | string | Required | Named place per INCOTERMS rule (e.g., `FOB Mumbai Port`). |
| `paymentTerms.code` | enum | Required | e.g., `NET30`, `NET60`, `2/10 NET30`, `COD`, `ADV`, `MILESTONE`. |
| `paymentTerms.dueOffsetDays` | int | Required | Derived from code; editable for custom terms. ≥ 0. |
| `paymentTerms.discountPct` | decimal(5,2) | Optional | Early-payment discount. 0–100. |
| `paymentTerms.discountWithinDays` | int | Conditionally required | Required when `discountPct > 0`. |
| `billingAddress` | Address block | Required | See §2.1. |
| `shippingAddress` | Address block | Required | May equal billing. |
| `supplierAddress` | Address block | Required | Snapshot. |
| `buyerContact` | Contact block | Required | Name, email, phone. |
| `supplierContact` | Contact block | Optional | Captured if known. |
| `orderDate` | date | Required | Cannot be future-dated > 1 day. |
| `expectedDeliveryDate` | date | Required | ≥ `orderDate`. |
| `subtotal` | money | Required (derived) | Σ line `lineSubtotal`. |
| `taxTotal` | money | Required (derived) | Σ line `taxAmount`. |
| `freight` | money | Optional | Header-level freight if not allocated to lines. |
| `otherCharges` | money | Optional | Header-level. |
| `grandTotal` | money | Required (derived) | `subtotal + taxTotal + freight + otherCharges`. |
| `notes` | text (≤ 2000) | Optional | Internal + supplier-visible split recommended. |
| `attachments[]` | File[] | Optional | RFQ, quote, contract, etc. |
| `revision` | int | Required | Increments on amendment after issue. Starts at 0. |

### 2.1 Address block

`{ line1, line2?, city, state, postalCode, country (ISO-3166-1 alpha-2), gstin?/taxId? }`

### 2.2 Validations

- `currency` must match all line `unitPrice.currency` values.
- `grandTotal` must equal computed sum within rounding tolerance (1 minor unit).
- Status transitions are one-way except `draft ↔ pending_approval` and amendment-driven `approved → pending_approval`.
- Cannot move to `issued` without ≥ 1 line and an approver distinct from creator (segregation of duties).
- `cancelled` only allowed if no GRN or Invoice is linked.

### 2.3 Edge cases

- **Multi-currency supplier**: supplier supports more than one currency — UI must force selection at PO creation; locking at first line entry.
- **Tax-exempt supplier**: GSTIN absent but supplier flagged tax-exempt — skip tax validation; persist exemption reason.
- **Drop-ship**: `shippingAddress` is the customer's, not the buyer's — flag `isDropShip=true` and require linked sales order.
- **Blanket POs**: `expectedDeliveryDate` may be a window; modeled as separate release schedules (out of scope here, noted for E1.5).
- **Supplier deactivated mid-flight**: existing approved PO is read-only but receivable; new POs blocked.
- **Currency revaluation**: PO is fixed in PO currency; FX impact is captured at invoice booking, not on PO.

---

## 3. PO Lines

Each line is a contract for a specific item, quantity, and price.

| Field | Type | Required | Notes |
|---|---|---|---|
| `lineNo` | int | Required | 1-based, unique within PO, gap-free after issue. |
| `item.id` | uuid | Required | FK to Item master. |
| `item.sku` | string | Required (snapshot) | |
| `item.description` | string | Required (snapshot) | |
| `item.hsn` / tax classification | string | Conditionally required | Required when tax > 0 in jurisdictions that need it (e.g., India HSN). |
| `uom` | enum | Required | EA, KG, L, M, BOX, etc. Must match item master allowed UoMs. |
| `qtyOrdered` | decimal(18,3) | Required | > 0. |
| `qtyReceived` | decimal(18,3) | Required (derived) | Σ accepted GRN qty across linked GRNs. Defaults 0. |
| `qtyInvoiced` | decimal(18,3) | Required (derived) | Σ invoice line qty across linked invoices. Defaults 0. |
| `qtyCancelled` | decimal(18,3) | Optional | For partial cancellation post-issue. |
| `unitPrice` | money | Required | ≥ 0. Currency = header currency. |
| `discountPct` | decimal(5,2) | Optional | 0–100. |
| `tax.code` | string | Conditionally required | e.g., `GST-18`, `VAT-20`. Required if jurisdiction taxes line. |
| `tax.ratePct` | decimal(5,2) | Required when `tax.code` set | Snapshot. |
| `tax.amount` | money | Required (derived) | `(unitPrice × qtyOrdered − discount) × ratePct`. |
| `lineSubtotal` | money | Required (derived) | `unitPrice × qtyOrdered − discount`. |
| `lineTotal` | money | Required (derived) | `lineSubtotal + tax.amount + lineFreight + lineOther`. |
| `requestedDeliveryDate` | date | Optional | Per-line override of header. |
| `costCenter` / `glAccount` | string | Conditionally required | Per finance config. |
| `notes` | text | Optional | |

### 3.1 Validations

- `qtyOrdered > 0`; whole-number UoMs (EA, BOX) reject fractional values.
- `qtyReceived ≤ qtyOrdered + over-receipt-tolerance` (see §6).
- `qtyInvoiced ≤ qtyReceived + invoice-over-tolerance` (see §6).
- `discountPct + sum(other discounts)` cannot exceed 100.
- `tax.amount` recomputed server-side on any qty/price change.
- Line cannot be deleted once any GRN or Invoice references it; instead, set `qtyCancelled` for the open balance.

### 3.2 Edge cases

- **Free-of-charge line**: `unitPrice = 0`, flag `isFOC=true`. Tax may still apply on assessable value — capture `assessableValue` override.
- **Catch-weight items** (e.g., meat, produce): ordered in EA, received/invoiced in KG. Requires dual-UoM mapping; out of scope for E1.4 but captured as known gap.
- **Negative tax / reverse charge**: supported by allowing `tax.ratePct = 0` plus a `reverseCharge=true` flag for downstream booking.
- **Price change after issue**: requires PO amendment (`revision++`) and re-approval; never silently mutated.
- **Same item across multiple lines**: allowed (different delivery dates, cost centers, prices). Match logic must aggregate by line, not by item.

---

## 4. GRN (Goods Receipt Note)

A GRN records physical receipt against one PO. Multiple GRNs per PO are allowed (split deliveries).

| Field | Type | Required | Notes |
|---|---|---|---|
| `grnNo` | string | Required | Tenant-unique. `GRN-{yyyy}-{seq}`. Immutable. |
| `poNo` / `poId` | ref | Required | PO must be `issued` or `partially_received`. |
| `status` | enum | Required | `draft`, `posted`, `reversed`. |
| `receivedAt` | datetime | Required | Cannot be future-dated. ≥ PO `orderDate`. |
| `receivedBy.userId` | uuid | Required | Must have `goods_receipt` permission. |
| `receivedBy.name` | string | Required (snapshot) | |
| `warehouseId` / `location` | ref | Required | Where goods landed. |
| `vehicleNo` | string | Optional | For audit / gate pass reconciliation. |
| `deliveryNoteNo` | string | Optional | Supplier's challan / DN reference. |
| `lines[]` | GRN line | Required | ≥ 1. See §4.1. |
| `photos[]` | File[] | Conditionally required | Required if any line has `rejectedQty > 0` or category flagged `photo_mandatory`. ≤ 10 by default. |
| `notes` | text | Optional | |
| `postedAt` | datetime | Required when `status=posted` | |
| `reversedAt` | datetime | Required when `status=reversed` | |
| `reversalReason` | enum + text | Required when `status=reversed` | `wrong_po`, `data_entry`, `quality_recheck`, `other`. |

### 4.1 GRN line

| Field | Type | Required | Notes |
|---|---|---|---|
| `poLineNo` | int | Required | FK to PO line. |
| `acceptedQty` | decimal(18,3) | Required | ≥ 0. |
| `rejectedQty` | decimal(18,3) | Required | ≥ 0. Defaults 0. |
| `rejectionReason` | enum | Conditionally required | Required when `rejectedQty > 0`: `damaged`, `short_supplied`, `wrong_item`, `expired`, `quality_fail`, `other`. |
| `batchNo` / `lotNo` | string | Conditionally required | Required for batch-tracked items. |
| `serialNos[]` | string[] | Conditionally required | Required for serialized items; length must equal `acceptedQty`. |
| `expiryDate` | date | Conditionally required | Required for items flagged `expiryTracked`. Must be > `receivedAt`. |
| `mfgDate` | date | Optional | If captured, must be ≤ `receivedAt` and ≤ `expiryDate`. |
| `linePhotos[]` | File[] | Optional | Per-line photos in addition to header-level. |
| `notes` | text | Optional | |

### 4.2 Validations

- `acceptedQty + rejectedQty > 0` (no zero-receipt lines).
- `Σ acceptedQty (across all GRNs for a PO line) ≤ qtyOrdered + overReceiptTolerance` (see §6). Hard reject if exceeded; allow override only with `force_overreceipt` permission and a reason.
- A GRN cannot be edited once `posted`. Corrections require reversal + new GRN.
- Reversed GRNs decrement `qtyReceived` on PO lines and unblock matched invoices (which then re-enter mismatch state).
- `photos[]` content-type whitelist: `image/jpeg`, `image/png`, `image/heic`. Max 10 MB each.

### 4.3 Edge cases

- **Over-receipt within tolerance**: post normally, log `overReceived=true` for analytics.
- **Short shipment**: PO line stays open until `qtyReceived + qtyCancelled = qtyOrdered`. After expected-delivery + grace period, surface as overdue.
- **Quarantine receipts**: goods physically received but pending QC — model as `acceptedQty=0, quarantinedQty=N` (extension, flagged for E1.5).
- **Receipt before PO issue**: not allowed; use Unplanned Receipt flow (out of scope).
- **Mobile capture offline**: GRN drafted offline must reconcile `grnNo` server-side at sync; client `clientGrnId` is the idempotency key.
- **Photo missing for rejection**: hard block on post; cannot be deferred.
- **Cross-PO consolidated delivery**: one truck, multiple POs — modeled as multiple GRNs sharing `vehicleNo` and `deliveryNoteNo`.

---

## 5. Invoice

Supplier invoice booked against one or more GRNs (and by extension, PO lines).

| Field | Type | Required | Notes |
|---|---|---|---|
| `invoiceNo` | string | Required | Supplier's invoice number. Unique per `(supplierId, fiscalYear)`. Cannot be reused. |
| `internalRef` | string | Required (system-generated) | Tenant-unique handle, e.g., `AP-{yyyy}-{seq}`. |
| `poNo` / `poId` | ref | Required | |
| `grnRefs[]` | ref[] | Conditionally required | Required for goods POs. Service POs may invoice without GRN if `serviceAccepted=true`. |
| `supplierId` | ref | Required | Must equal PO supplier. |
| `invoiceDate` | date | Required | Cannot be future-dated. Must be ≥ earliest linked GRN `receivedAt` (date). |
| `receivedAt` (by AP) | datetime | Required | When AP team logged the invoice. |
| `currency` | ISO-4217 | Required | Must equal PO currency. FX gain/loss handled at payment. |
| `lines[]` | Invoice line | Required | See §5.1. |
| `subtotal` | money | Required (derived) | |
| `taxTotal` | money | Required (derived) | |
| `freight` | money | Optional | |
| `otherCharges` | money | Optional | |
| `roundingAdjustment` | money | Optional | ±1 minor unit auto, larger needs reason. |
| `amount` (grand total) | money | Required | Must reconcile with derived total within tolerance. |
| `dueDate` | date | Required (derived) | `invoiceDate + paymentTerms.dueOffsetDays`. Editable with reason. |
| `attachments[]` | File[] | Required | ≥ 1. PDF of invoice mandatory. Optional: e-invoice XML, supplier email. |
| `eInvoice.irn` | string | Conditionally required | Required where statutory (e.g., India ≥ threshold). |
| `eInvoice.qrPayload` | string | Conditionally required | |
| `status` | enum | Required | `received` → `under_review` → `matched` / `disputed` → `approved` → `posted` → `paid` / `cancelled`. |
| `holdReason` | enum + text | Conditionally required | Required when status transitions to `disputed` or payment hold. |

### 5.1 Invoice line

| Field | Type | Required | Notes |
|---|---|---|---|
| `poLineNo` | int | Required | |
| `grnRef` | ref | Conditionally required | Required for goods. |
| `qty` | decimal(18,3) | Required | > 0. |
| `unitPrice` | money | Required | |
| `tax.code` / `tax.ratePct` / `tax.amount` | as in §3 | per jurisdiction | Snapshot from invoice, not PO. |
| `lineTotal` | money | Required (derived) | |

### 5.2 Validations

- `Σ qty (across invoices for a PO line) ≤ qtyReceived + invoiceOverTolerance`.
- Currency must equal PO currency.
- `attachments[]` must contain at least one PDF/image; size ≤ 25 MB each.
- Duplicate detection: same `(supplierId, invoiceNo)` blocks creation.
- `dueDate` ≥ `invoiceDate`.
- 3-way match (§6) is computed on save; status auto-routes.

### 5.3 Edge cases

- **Supplier reuses invoice number across years**: scoped per fiscal year — allowed only if supplier confirms; surface a warning.
- **Credit note**: modeled as invoice with negative `qty` and negative `amount`; must reference the original invoice.
- **Pro-forma invoice**: not posted to AP; stored as attachment on PO until commercial invoice arrives.
- **Multiple invoices per GRN**: allowed (e.g., goods + freight billed separately by same supplier).
- **Invoice predates GRN**: blocked unless `serviceAccepted=true` or `advancePayment=true`.
- **FX**: invoice currency = PO currency. Booking-rate captured at `posted`; payment-rate at `paid`; difference posted to FX gain/loss.
- **Tax mismatch with PO**: allowed; AP can override with reason. Match status reflects the mismatch (§6).
- **Self-billing / ERS**: invoice generated by buyer from GRN — `source=ERS`, attachment is the system-generated PDF.

---

## 6. 3-Way Match (PO ↔ GRN ↔ Invoice)

The 3-way match validates that we ordered, received, and were billed for the same thing within configured tolerances.

### 6.1 Match dimensions (per PO line)

| Dimension | Compare | Pass if |
|---|---|---|
| Quantity | `Σ invoice.qty` vs `Σ grn.acceptedQty` | within `qtyTolerancePctOrAbs` |
| Price | `invoice.unitPrice` vs `po.unitPrice` | within `priceTolerancePctOrAbs` |
| Tax | `invoice.tax.amount` vs computed PO tax | within `taxToleranceAbs` (typically 1 minor unit) |
| Amount | `invoice.lineTotal` vs `po.lineTotal` (prorated by qty) | within `amountTolerancePctOrAbs` |

### 6.2 Configurable tolerances (tenant-level, overridable per supplier/category)

| Tolerance | Type | Default | Notes |
|---|---|---|---|
| `overReceiptTolerance` | pct or abs | 0% | Receipts above this are blocked unless force-override. |
| `invoiceOverTolerance` | pct or abs | 0% | Invoiced > received blocked. |
| `priceTolerance` | pct + abs floor | 2% or 1 minor unit | Whichever is greater. |
| `qtyTolerance` | pct + abs floor | 0% / 0 | Stricter than receipt tolerance. |
| `taxTolerance` | abs | 1 minor unit | Rounding only. |
| `amountTolerance` | pct | 1% | Header-level fallback. |

### 6.3 Match outcomes

- `matched` — all dimensions within tolerance → auto-route to approval (or post if auto-post enabled).
- `price_variance` / `qty_variance` / `tax_variance` — specific dimension failed; route to AP for resolution.
- `unmatched` — no GRN linkable (goods PO without receipt) or no PO linkable.
- `partially_matched` — some lines pass, some fail; invoice held until all resolved or short-pay approved.

### 6.4 Validations

- Match recomputed on: invoice create/edit, GRN post/reverse, PO line amend.
- A `matched` invoice that becomes mismatched (due to GRN reversal) must reopen automatically and notify AP.
- Tolerance overrides require permission `match.override` and a recorded reason.
- Service POs follow a 2-way match (PO ↔ Invoice) using `serviceAccepted` flag in lieu of GRN.

### 6.5 Edge cases

- **Freight/charges not on PO**: allowed up to `unplannedChargesTolerance`; above that, requires PO amendment.
- **Partial deliveries, full invoice**: invoice qty > received qty → `qty_variance` until further GRN posted.
- **Price decrease**: favorable variance — still flagged but auto-approvable per policy.
- **Currency rounding cascade**: per-line tolerance may pass while header fails due to rounding; header-level check uses `roundingAdjustment` to absorb up to ±1 minor unit.
- **Retro price change**: PO amended after invoice posted — match recomputed; invoice may flip back to `disputed` and trigger debit/credit note workflow.
- **Consolidated invoice across POs**: not supported in E1.4; out of scope, noted as gap.
- **Multi-GRN single line**: aggregate `acceptedQty` across all linked GRNs before comparison.

---

## 7. Payment Status

Payments are tracked per invoice. A single invoice may be paid in tranches.

| Field | Type | Required | Notes |
|---|---|---|---|
| `paymentId` | uuid | Required | |
| `invoiceId` | ref | Required | |
| `status` | enum | Required | `scheduled`, `pending_approval`, `approved`, `released`, `paid`, `failed`, `hold`, `cancelled`. |
| `scheduledDate` | date | Required when `status=scheduled` | Defaults to `invoice.dueDate`. Must be ≥ today. |
| `amount` | money | Required | ≤ `invoice.amount − Σ prior successful payments`. |
| `paymentMethod` | enum | Required | `bank_transfer`, `neft`, `rtgs`, `imps`, `ach`, `wire`, `cheque`, `card`, `cash`, `offset`. |
| `bankAccountId` | ref | Conditionally required | Required for non-cash methods. Must be supplier's verified account. |
| `referenceNo` (UTR/cheque/etc.) | string | Required when `status ∈ {released, paid}` | |
| `paidAt` | datetime | Required when `status=paid` | |
| `failureReason` | enum + text | Required when `status=failed` | `insufficient_funds`, `bank_rejected`, `invalid_account`, `other`. |
| `holdReason` | enum + text | Required when `status=hold` | `dispute`, `quality_issue`, `awaiting_credit_note`, `compliance`, `cashflow`, `other`. |
| `cancelReason` | enum + text | Required when `status=cancelled` | |
| `fxRate` | decimal(18,8) | Conditionally required | Required when payment currency ≠ functional currency. |
| `bankCharges` | money | Optional | |

### 7.1 Sub-status: invoice-level rollup

The invoice exposes a derived `paymentStatus`:

- `unpaid` — no successful payment.
- `scheduled` — has `scheduled` or `approved` payment, none `paid`.
- `partially_paid` — `Σ paid < invoice.amount`.
- `paid` — `Σ paid ≥ invoice.amount` (within rounding tolerance).
- `hold` — at least one active hold; no in-flight schedule.
- `overdue` — unpaid/partially_paid and `today > dueDate`.

### 7.2 Validations

- Cannot schedule payment for an invoice not in `approved` or `posted` state.
- Cannot release payment if invoice has any line in `disputed` match state, unless `short_pay` is invoked with explicit approved amount.
- Hold blocks all downstream transitions; releasing hold returns status to prior state.
- Sum of all non-cancelled, non-failed payment amounts ≤ invoice amount + rounding tolerance.
- Maker-checker required for `release` on amounts ≥ tenant threshold.

### 7.3 Edge cases

- **Short pay**: pay less than invoice amount with reason; remaining balance stays open and may be cleared by credit note.
- **Overpay**: not allowed via standard flow; surfaces as supplier credit (out of scope, gap noted).
- **Duplicate payment**: idempotency key = `(invoiceId, scheduledDate, amount, bankAccountId)`; UI must warn on re-submit.
- **Payment failure after release**: status `failed`; invoice rollup reverts; bank charges (if any) booked separately.
- **Hold added after release**: rejected — once `released` the funds are with the bank; hold can only target unreleased payments.
- **Offset payment**: settled against a credit note from same supplier — `paymentMethod=offset`, `bankAccountId` not required, `referenceNo` = credit note id.
- **FX revaluation at payment**: gain/loss = `(payment_rate − booking_rate) × amount`; posted to dedicated GL.
- **Cancellation post-paid**: not allowed; use refund flow (out of scope).
- **Cheque bounce**: `failed` with `bank_rejected`; cheque tracking sub-state retained for audit.

---

## 8. Cross-cutting concerns

- **Idempotency**: every create endpoint (PO, GRN, Invoice, Payment) accepts a client-supplied idempotency key.
- **Audit trail**: every status transition writes an immutable event with actor, timestamp, before/after, and reason where applicable.
- **Soft delete**: only `draft` records may be hard-deleted. Posted records are reversed/cancelled, never deleted.
- **Permissions** (minimum set referenced above): `po.create`, `po.approve`, `po.amend`, `goods_receipt`, `grn.reverse`, `invoice.create`, `invoice.approve`, `match.override`, `payment.schedule`, `payment.release`, `payment.hold`, `force_overreceipt`, `short_pay`.
- **Localization**: all enums map to localized labels in UI; storage uses canonical English codes.
- **Privacy**: bank account numbers masked in UI except last 4; full value access gated by permission.

---

## 9. Out of scope for E1.4 (gaps to track)

- Blanket POs and release schedules.
- Catch-weight / dual-UoM items.
- Quarantine receipts and QC sub-states.
- Consolidated invoices spanning multiple POs.
- Supplier overpay credits.
- Refund flow for cancelled-post-paid invoices.

These are captured here so downstream tickets can reference a single discovery artifact.
