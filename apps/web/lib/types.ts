export type POStatus =
  | "Draft"
  | "Issued"
  | "Partially Received"
  | "Closed"
  | "Cancelled";

export type GRNStatus = "Posted" | "Reversed";

export type InvoiceStatus = "Pending" | "Approved" | "Rejected" | "Paid";

export type InvoiceMatchStatus =
  | "Matched"
  | "Price Variance"
  | "Qty Variance"
  | "Unmatched";

export type MatchResult = "OK" | "Qty Mismatch" | "Price Mismatch" | "Both";

export type PaymentState = "Unpaid" | "Partially Paid" | "Paid" | "Overdue";

export interface POSupplier {
  name: string;
  code: string;
}

export interface POHeader {
  poNo: string;
  status: POStatus;
  supplier: POSupplier;
  plant: string;
  buyer: string;
  currency: string;
  value: number;
  issuedAt: string | null;
  expectedDelivery: string | null;
  paymentTerms: string;
  incoterm: string;
}

export interface POLine {
  lineNo: number;
  itemCode: string;
  description: string;
  uom: string;
  qtyOrdered: number;
  qtyReceived: number;
  qtyInvoiced: number;
  unitPrice: number;
  lineTotal: number;
  deliveryDate: string;
}

export interface GRNLine {
  lineNo: number;
  qty: number;
}

export interface GRN {
  grnNo: string;
  receivedAt: string;
  receivedBy: string;
  status: GRNStatus;
  lines: GRNLine[];
}

export interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  matchStatus: InvoiceMatchStatus;
}

export interface ThreeWayMatchRow {
  lineNo: number;
  qtyOrdered: number;
  qtyReceived: number;
  qtyInvoiced: number;
  priceOrdered: number;
  priceInvoiced: number;
  qtyVariance: number;
  priceVariance: number;
  result: MatchResult;
}

export interface PaymentSummary {
  totalInvoiced: number;
  totalPaid: number;
  outstanding: number;
  nextDueDate: string | null;
  state: PaymentState;
}

export interface PurchaseOrderDetail {
  header: POHeader;
  lines: POLine[];
  grns: GRN[];
  invoices: Invoice[];
  match: ThreeWayMatchRow[];
  payment: PaymentSummary;
}
