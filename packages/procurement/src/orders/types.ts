import type { Money } from "../types";

export type PoStatus =
  | "Draft"
  | "Issued"
  | "PartiallyReceived"
  | "Closed"
  | "Cancelled";

export type MatchStatus =
  | "Matched"
  | "PartiallyMatched"
  | "Unmatched"
  | "NotApplicable";

export type PaymentStatus =
  | "NotDue"
  | "Due"
  | "PartiallyPaid"
  | "Paid"
  | "OnHold";

export type GrnLineCondition = "OK" | "Damaged" | "ShortShipped";

export type InvoiceStatus =
  | "Received"
  | "UnderReview"
  | "Approved"
  | "Rejected"
  | "Paid";

export interface SupplierRef {
  id: string;
  name: string;
  country: string;
  contact?: { id: string; name: string; email: string };
}

export interface PlantRef {
  id: string;
  name: string;
  country: string;
  city?: string;
}

export interface BuyerRef {
  id: string;
  name: string;
  email: string;
}

export interface MaterialRef {
  code: string;
  description: string;
  uom: string;
}

export interface PoLine {
  id: string;
  lineNo: number;
  material: MaterialRef;
  quantityOrdered: number;
  quantityReceived: number;
  quantityInvoiced: number;
  unitPrice: Money;
  taxRate: number;
  lineValue: Money;
  deliveryDate: string;
  notes?: string;
}

export interface MatchMismatch {
  lineId: string;
  dimension: "quantity" | "unitPrice" | "currency";
  poValue: number | string;
  grnValue: number | string;
  invoiceValue: number | string;
  deltaPct: number;
}

export interface MatchSummary {
  status: MatchStatus;
  tolerancePct: number;
  mismatches: MatchMismatch[];
  lastEvaluatedAt: string;
}

export interface PaymentSummary {
  status: PaymentStatus;
  dueDate: string;
  paidAmount: Money;
  outstandingAmount: Money;
  lastPaymentAt: string | null;
}

export interface PoListItem {
  poNo: string;
  supplier: { id: string; name: string; country: string };
  plant: { id: string; name: string };
  value: Money;
  status: PoStatus;
  issueDate: string;
  deliveryDate: string;
  grnCount: number;
  invoiceCount: number;
  matchStatus: MatchStatus;
}

export interface PoDetail {
  poNo: string;
  status: PoStatus;
  issueDate: string;
  deliveryDate: string;
  currency: string;
  incoTerms: string;
  paymentTerms: string;
  notes?: string;
  createdBy: BuyerRef;
  createdAt: string;
  updatedAt: string;
  supplier: SupplierRef;
  plant: PlantRef;
  buyer: BuyerRef;
  lines: PoLine[];
  subtotal: Money;
  taxTotal: Money;
  total: Money;
  match: MatchSummary;
  payment: PaymentSummary;
  rfqId?: string;
  prIds?: string[];
}

export interface GrnLine {
  poLineId: string;
  quantity: number;
  condition: GrnLineCondition;
  remarks?: string;
}

export interface Grn {
  id: string;
  grnNo: string;
  poNo: string;
  receivedAt: string;
  receivedBy: { id: string; name: string };
  lines: GrnLine[];
  attachments: { name: string; url: string }[];
}

export interface InvoiceLine {
  poLineId: string;
  quantity: number;
  unitPrice: Money;
  taxRate: number;
  lineTotal: Money;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  poNo: string;
  invoiceDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  subtotal: Money;
  taxTotal: Money;
  total: Money;
  status: InvoiceStatus;
  attachments: { name: string; url: string }[];
}

export interface PoListResponse {
  items: PoListItem[];
  page: number;
  limit: number;
  total: number;
}

export type PoSortKey =
  | "issueDate"
  | "-issueDate"
  | "value"
  | "-value"
  | "deliveryDate"
  | "-deliveryDate";

export interface PoListQuery {
  page?: number;
  limit?: number;
  status?: PoStatus[];
  supplierId?: string[];
  plantId?: string[];
  dateFrom?: string;
  dateTo?: string;
  q?: string;
  sort?: PoSortKey;
}
