import type {
  InvoiceMatchStatus,
  InvoiceStatus,
  MatchResult,
  PaymentState,
  POStatus,
} from "../../../../lib/types";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
};

function Badge({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}

const PO_TONE: Record<POStatus, Tone> = {
  Draft: "neutral",
  Issued: "info",
  "Partially Received": "warning",
  Closed: "success",
  Cancelled: "danger",
};

export function POStatusBadge({ status }: { status: POStatus }) {
  return <Badge tone={PO_TONE[status]} label={status} />;
}

const INVOICE_TONE: Record<InvoiceStatus, Tone> = {
  Pending: "warning",
  Approved: "info",
  Rejected: "danger",
  Paid: "success",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge tone={INVOICE_TONE[status]} label={status} />;
}

const MATCH_TONE: Record<InvoiceMatchStatus, Tone> = {
  Matched: "success",
  "Price Variance": "warning",
  "Qty Variance": "warning",
  Unmatched: "danger",
};

export function InvoiceMatchBadge({ status }: { status: InvoiceMatchStatus }) {
  return <Badge tone={MATCH_TONE[status]} label={status} />;
}

const MATCH_RESULT_TONE: Record<MatchResult, Tone> = {
  OK: "success",
  "Qty Mismatch": "warning",
  "Price Mismatch": "warning",
  Both: "danger",
};

export function MatchResultBadge({ result }: { result: MatchResult }) {
  return <Badge tone={MATCH_RESULT_TONE[result]} label={result} />;
}

const PAYMENT_TONE: Record<PaymentState, Tone> = {
  Unpaid: "neutral",
  "Partially Paid": "warning",
  Paid: "success",
  Overdue: "danger",
};

export function PaymentStateBadge({ state }: { state: PaymentState }) {
  return <Badge tone={PAYMENT_TONE[state]} label={state} />;
}
