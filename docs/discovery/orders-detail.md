# Purchase Orders — List + Detail (KV-E1.4)

Field-level spec for the buyer-facing PO list (`/orders`) and PO detail (`/orders/:poNo`) screens. The detail page surfaces the purchase order header, line items, GRNs (Goods Receipt Notes), invoices, the 3-way match summary, and the payment status. Read-only in E1; mutations land in later sessions.

Status: discovery + mock API. Real API lands in a later track. KV-E1.6 implements the MSW-backed mock for these endpoints.

## Conventions

- All money fields carry an explicit `currency` (ISO-4217); rendering uses the PO `currency` unless the field overrides it.
- All timestamps are stored in UTC and rendered in the plant's IANA timezone.
- `poNo` is the public, human-readable identifier (e.g., `PO-2026-00042`) and is the route parameter.
- Pagination on list endpoints is offset-based (`page`, `limit`) with `total` returned for UI page counters.

---

## Endpoints (mock)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/orders` | Paginated PO list with filters. |
| GET | `/api/orders/:poNo` | Full PO detail (header, lines, match summary, payment summary). |
| GET | `/api/orders/:poNo/grns` | All GRNs against the PO (chronological). |
| GET | `/api/orders/:poNo/invoices` | All supplier invoices against the PO (chronological). |

### `GET /api/orders`

Query params:

| Param | Type | Default | Notes |
|---|---|---|---|
| `page` | integer | `1` | 1-indexed. |
| `limit` | integer | `20` | 1–100. |
| `status` | enum (repeat) | — | One or more of `Draft`, `Issued`, `PartiallyReceived`, `Closed`, `Cancelled`. |
| `supplierId` | string (repeat) | — | Filter by one or more supplier ids. |
| `plantId` | string (repeat) | — | Filter by one or more plant ids. |
| `dateFrom` | ISO date | — | Inclusive lower bound on `issueDate`. |
| `dateTo` | ISO date | — | Inclusive upper bound on `issueDate`. |
| `q` | string | — | Free-text search across `poNo`, `supplier.name`, `plant.name`. Case-insensitive substring. |
| `sort` | enum | `-issueDate` | `issueDate` / `-issueDate` / `value` / `-value` / `deliveryDate` / `-deliveryDate`. |

Response shape:

```json
{
  "items": [PoListItem, ...],
  "page": 1,
  "limit": 20,
  "total": 137
}
```

`PoListItem` is the header view used by the list table:

| Field | Type | Notes |
|---|---|---|
| `poNo` | string | Human-readable PO number (also the route param). |
| `supplier` | `{ id, name, country }` | Denormalized for list rendering. |
| `plant` | `{ id, name }` | Denormalized. |
| `value` | `{ amount, currency }` | Total PO value (gross of taxes). |
| `status` | enum | See PO status taxonomy. |
| `issueDate` | ISO date | Set when PO transitions to `Issued`. |
| `deliveryDate` | ISO date | Earliest line `deliveryDate`. |
| `grnCount` | integer | Number of GRNs recorded against this PO. |
| `invoiceCount` | integer | Number of invoices recorded against this PO. |
| `matchStatus` | enum | `Matched`, `PartiallyMatched`, `Unmatched`, `NotApplicable`. |

### `GET /api/orders/:poNo`

Returns `null`/404 if not found. Otherwise returns the full `PoDetail`:

| Section | Shape |
|---|---|
| Header | `poNo`, `status`, `issueDate`, `deliveryDate`, `currency`, `incoTerms`, `paymentTerms`, `notes`, `createdBy`, `createdAt`, `updatedAt` |
| Supplier | `{ id, name, country, contact }` |
| Plant | `{ id, name, country, city }` |
| Buyer | `{ id, name, email }` |
| Lines | `PoLine[]` (see below) |
| Totals | `subtotal`, `taxTotal`, `total` (each `{ amount, currency }`) |
| Match | `MatchSummary` (see below) |
| Payment | `PaymentSummary` (see below) |
| Linked refs | `rfqId?`, `prIds?: string[]` |

### `PoLine`

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable line id. |
| `lineNo` | integer | 1-indexed. |
| `material` | `{ code, description, uom }` | Master Data ref. |
| `quantityOrdered` | decimal | Always > 0. |
| `quantityReceived` | decimal | Sum across GRNs; `≤ quantityOrdered + tolerance`. |
| `quantityInvoiced` | decimal | Sum across approved invoices. |
| `unitPrice` | `{ amount, currency }` | Currency = PO currency. |
| `taxRate` | decimal | Percentage, 0–100. |
| `lineValue` | `{ amount, currency }` | `unitPrice * quantityOrdered`, gross of tax. |
| `deliveryDate` | ISO date | Per-line need-by. |
| `notes` | string | Optional. |

### `MatchSummary` (3-way match)

| Field | Type | Notes |
|---|---|---|
| `status` | enum | `Matched`, `PartiallyMatched`, `Unmatched`, `NotApplicable`. |
| `tolerancePct` | decimal | BU policy threshold for quantity/price tolerance (typically 2.0). |
| `mismatches` | array of `{ lineId, dimension, poValue, grnValue, invoiceValue, deltaPct }` | One entry per dimension that exceeds tolerance. `dimension` is `quantity` / `unitPrice` / `currency`. |
| `lastEvaluatedAt` | ISO datetime | Engine timestamp. |

### `PaymentSummary`

| Field | Type | Notes |
|---|---|---|
| `status` | enum | `NotDue`, `Due`, `PartiallyPaid`, `Paid`, `OnHold`. |
| `dueDate` | ISO date | Computed from `paymentTerms` and earliest invoice. |
| `paidAmount` | `{ amount, currency }` | Sum of cleared payments. |
| `outstandingAmount` | `{ amount, currency }` | `total - paidAmount`. |
| `lastPaymentAt` | ISO datetime / null | — |

### `GET /api/orders/:poNo/grns`

Returns `Grn[]` ordered by `receivedAt` ascending. Each `Grn`:

| Field | Type | Notes |
|---|---|---|
| `id` | string | GRN id. |
| `grnNo` | string | Human-readable (e.g., `GRN-2026-00012`). |
| `poNo` | string | Back-reference. |
| `receivedAt` | ISO datetime | When goods arrived at the plant. |
| `receivedBy` | `{ id, name }` | Plant inwards user. |
| `lines` | array of `{ poLineId, quantity, condition, remarks }` | `condition` ∈ `OK` / `Damaged` / `ShortShipped`. |
| `attachments` | array of `{ name, url }` | Photos / docs. |

### `GET /api/orders/:poNo/invoices`

Returns `Invoice[]` ordered by `invoiceDate` ascending. Each `Invoice`:

| Field | Type | Notes |
|---|---|---|
| `id` | string | Invoice id. |
| `invoiceNo` | string | Supplier-issued. |
| `poNo` | string | Back-reference. |
| `invoiceDate` | ISO date | Supplier-issued date. |
| `dueDate` | ISO date | From PO `paymentTerms`. |
| `lines` | array of `{ poLineId, quantity, unitPrice, taxRate, lineTotal }` | — |
| `subtotal` | `{ amount, currency }` | — |
| `taxTotal` | `{ amount, currency }` | — |
| `total` | `{ amount, currency }` | — |
| `status` | enum | `Received`, `UnderReview`, `Approved`, `Rejected`, `Paid`. |
| `attachments` | array of `{ name, url }` | Invoice PDF + supporting docs. |

---

## Status taxonomy

**PO `status`**

| Value | Meaning |
|---|---|
| `Draft` | Created, not yet issued to supplier. |
| `Issued` | Sent to supplier; supplier has acknowledged or is expected to. |
| `PartiallyReceived` | At least one GRN exists but `quantityReceived < quantityOrdered` on ≥ 1 line. |
| `Closed` | All lines fully received and reconciled (or short-close confirmed). |
| `Cancelled` | Voided pre-receipt; non-recoverable. |

**Match `status`**

- `Matched` — every line within tolerance for quantity & price across PO/GRN/Invoice.
- `PartiallyMatched` — ≥ 1 dimension within tolerance, ≥ 1 outside.
- `Unmatched` — outside tolerance on a critical dimension; payment blocked.
- `NotApplicable` — no invoice or no GRN yet (read as "in flight").

**Payment `status`**

- `NotDue` — terms not elapsed; payment scheduled.
- `Due` — terms elapsed; not yet paid.
- `PartiallyPaid` — ≥ 1 payment but `outstandingAmount > 0`.
- `Paid` — `outstandingAmount == 0`.
- `OnHold` — match status `Unmatched` or supplier dispute open.

---

## Filters → list query mapping

The list page applies all filters via the `GET /api/orders` query string and reflects them in the URL (deep-link friendly). Combinations are AND-joined; repeated values within a single field are OR-joined.

## Empty / error states

- 404 on `GET /api/orders/:poNo` when `poNo` doesn't exist; the detail page renders a "PO not found" card with a link back to the list.
- Empty `grns` / `invoices` arrays are valid; the detail page renders an "—" placeholder for those tabs.

## Out of scope (tracked for later)

- PO creation, amendment, and approval workflows.
- GRN creation and quality dispositioning.
- Invoice approval workflow + payment scheduling.
- 3-way match engine implementation (the mock returns precomputed match results).

## Cross-references

- Sessions: `docs/SESSION-INDEX.md` — KV-E1.1..E1.6.
- PRD: `docs/PRD-v3.md` §7 Orders & Receipts.
