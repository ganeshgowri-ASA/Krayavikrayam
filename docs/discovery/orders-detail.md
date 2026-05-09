# Orders Detail — Discovery Spec (KV-E1.4)

> Read-only PO detail view at `/orders/[poNo]`. Field-level specification for the
> sections rendered by `apps/web/app/orders/[poNo]/page.tsx` (KV-E1.5) and mocked
> by MSW handlers (KV-E1.6).

The page is composed of six stacked sections. None mutate state in this milestone.

## 1. Header

| Field | Type | Notes |
|---|---|---|
| `poNo` | string | Display identifier (e.g. `PO-2025-00042`). |
| `status` | enum | `Draft` \| `Issued` \| `Partially Received` \| `Closed` \| `Cancelled`. |
| `supplier.name` | string | Supplier display name. |
| `supplier.code` | string | Internal supplier code. |
| `plant` | string | Receiving plant / location code. |
| `buyer` | string | Buyer / requester display name. |
| `currency` | ISO-4217 | Defaults to INR. |
| `value` | number | Total PO value in `currency`. |
| `issuedAt` | ISO date | When the PO was issued; null when `Draft`. |
| `expectedDelivery` | ISO date | Earliest expected delivery across lines. |
| `paymentTerms` | string | e.g. `Net 30`. |
| `incoterm` | string | e.g. `FOB Mumbai`. |

## 2. Lines

Table of PO line items.

| Field | Type | Notes |
|---|---|---|
| `lineNo` | int | 1-based line index. |
| `itemCode` | string | SKU / material code. |
| `description` | string | Line description. |
| `uom` | string | Unit of measure. |
| `qtyOrdered` | number | Ordered quantity. |
| `qtyReceived` | number | Cumulative GRN quantity. |
| `qtyInvoiced` | number | Cumulative invoiced quantity. |
| `unitPrice` | number | Price per UOM. |
| `lineTotal` | number | `qtyOrdered * unitPrice`. |
| `deliveryDate` | ISO date | Per-line expected date. |

## 3. GRN list

Goods Receipt Notes booked against this PO.

| Field | Type | Notes |
|---|---|---|
| `grnNo` | string | GRN identifier. |
| `receivedAt` | ISO date | Receipt date. |
| `receivedBy` | string | Receiver display name. |
| `lines[].lineNo` | int | Reference to PO line. |
| `lines[].qty` | number | Quantity received in this GRN. |
| `status` | enum | `Posted` \| `Reversed`. |

## 4. Invoices

Supplier invoices booked against this PO.

| Field | Type | Notes |
|---|---|---|
| `invoiceNo` | string | Supplier invoice identifier. |
| `invoiceDate` | ISO date | Invoice date. |
| `dueDate` | ISO date | Computed from `paymentTerms`. |
| `amount` | number | Invoice gross amount. |
| `currency` | ISO-4217 | Should match PO currency. |
| `status` | enum | `Pending` \| `Approved` \| `Rejected` \| `Paid`. |
| `matchStatus` | enum | `Matched` \| `Price Variance` \| `Qty Variance` \| `Unmatched`. |

## 5. Three-way match summary

Aggregated comparison of PO ↔ GRN ↔ Invoice for each line.

| Field | Type | Notes |
|---|---|---|
| `lineNo` | int | PO line reference. |
| `qtyOrdered` | number | From PO. |
| `qtyReceived` | number | Sum of GRNs. |
| `qtyInvoiced` | number | Sum of invoices. |
| `priceOrdered` | number | From PO. |
| `priceInvoiced` | number | Weighted invoice price. |
| `qtyVariance` | number | `qtyInvoiced - qtyReceived`. |
| `priceVariance` | number | `priceInvoiced - priceOrdered`. |
| `result` | enum | `OK` \| `Qty Mismatch` \| `Price Mismatch` \| `Both`. |

## 6. Payment status

Roll-up of invoice payments.

| Field | Type | Notes |
|---|---|---|
| `totalInvoiced` | number | Sum of `Approved`/`Paid` invoice amounts. |
| `totalPaid` | number | Sum of `Paid` invoices. |
| `outstanding` | number | `totalInvoiced - totalPaid`. |
| `nextDueDate` | ISO date \| null | Earliest unpaid invoice due date. |
| `state` | enum | `Unpaid` \| `Partially Paid` \| `Paid` \| `Overdue`. |

## Out of scope (this milestone)

- No mutations: cannot edit header, add lines, post GRN/invoice, or trigger payment.
- No attachments viewer.
- No conversation / query thread (handled in Track D).
- Real backend wiring deferred — use MSW handlers seeded from `apps/web/mocks`.
