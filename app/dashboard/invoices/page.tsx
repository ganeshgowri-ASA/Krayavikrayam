"use client";

import { useState } from "react";
import {
  Plus, FileText, Download, Send, CheckCircle, Clock, AlertCircle,
  CreditCard, Trash2, X, ChevronDown, ChevronUp, ArrowRight,
  Banknote, Smartphone, Building2, ReceiptText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type InvoiceType = "PROFORMA" | "TAX" | "CREDIT_NOTE";
type InvoiceStatus = "DRAFT" | "SENT" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
type PaymentMethod = "BANK_TRANSFER" | "UPI" | "CASH" | "CHECK" | "CARD";

interface LineItem {
  id: string;
  product: string;
  qty: number;
  rate: number;
  taxPct: number;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference: string;
}

interface Invoice {
  id: string;
  number: string;
  type: InvoiceType;
  customer: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  payments: Payment[];
  notes?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    number: "PRO-2026-001",
    type: "PROFORMA",
    customer: "Acme Corp",
    status: "SENT",
    issueDate: "2026-03-01",
    dueDate: "2026-03-31",
    items: [
      { id: "li-1", product: "Enterprise Platform License", qty: 1, rate: 80000, taxPct: 18 },
      { id: "li-2", product: "Implementation Services",     qty: 5, rate: 8000,  taxPct: 18 },
    ],
    payments: [],
    notes: "Proforma for approval before tax invoice.",
  },
  {
    id: "inv-2",
    number: "TAX-2026-001",
    type: "TAX",
    customer: "Stark Industries",
    status: "PAID",
    issueDate: "2026-03-01",
    dueDate: "2026-03-15",
    items: [
      { id: "li-3", product: "Platform Integration Module", qty: 1, rate: 150000, taxPct: 18 },
      { id: "li-4", product: "Support Plan (Annual)",       qty: 1, rate: 30000,  taxPct: 18 },
    ],
    payments: [
      { id: "p-1", amount: 180000, date: "2026-03-10", method: "BANK_TRANSFER", reference: "REF-TXN-20260310" },
      { id: "p-2", amount: 32400,  date: "2026-03-12", method: "UPI",           reference: "UPI-78234563"       },
    ],
    notes: "Contract signed. Full payment received.",
  },
  {
    id: "inv-3",
    number: "TAX-2026-002",
    type: "TAX",
    customer: "Globex Inc",
    status: "PARTIALLY_PAID",
    issueDate: "2026-02-20",
    dueDate: "2026-03-20",
    items: [
      { id: "li-5", product: "Annual License", qty: 1, rate: 72000, taxPct: 18 },
    ],
    payments: [
      { id: "p-3", amount: 50000, date: "2026-03-01", method: "BANK_TRANSFER", reference: "NEFT-GLOB-001" },
    ],
  },
  {
    id: "inv-4",
    number: "TAX-2026-003",
    type: "TAX",
    customer: "Umbrella Corp",
    status: "OVERDUE",
    issueDate: "2026-01-15",
    dueDate: "2026-02-14",
    items: [
      { id: "li-6", product: "Platform License",     qty: 1, rate: 200000, taxPct: 18 },
      { id: "li-7", product: "Data Migration",        qty: 1, rate: 25000,  taxPct: 18 },
      { id: "li-8", product: "Training Sessions",     qty: 3, rate: 5000,   taxPct: 18 },
    ],
    payments: [],
  },
  {
    id: "inv-5",
    number: "CREDIT-2026-001",
    type: "CREDIT_NOTE",
    customer: "Oscorp",
    status: "PAID",
    issueDate: "2026-02-28",
    dueDate: "2026-02-28",
    items: [
      { id: "li-9", product: "Credit for cancelled order", qty: 1, rate: -45000, taxPct: 18 },
    ],
    payments: [],
    notes: "Credit note issued after deal cancellation.",
  },
  {
    id: "inv-6",
    number: "PRO-2026-002",
    type: "PROFORMA",
    customer: "Wayne Enterprises",
    status: "DRAFT",
    issueDate: "2026-03-10",
    dueDate: "2026-04-10",
    items: [
      { id: "li-10", product: "Premium Platform",  qty: 1, rate: 280000, taxPct: 18 },
      { id: "li-11", product: "Setup & Onboarding", qty: 1, rate: 60000,  taxPct: 18 },
    ],
    payments: [],
  },
];

const CUSTOMERS = [
  "Acme Corp", "Stark Industries", "Globex Inc", "Umbrella Corp",
  "Wayne Enterprises", "Oscorp", "LexCorp", "Initech",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcSubtotal(items: LineItem[]) {
  return items.reduce((sum, i) => sum + i.qty * i.rate, 0);
}

function calcTax(items: LineItem[]) {
  return items.reduce((sum, i) => sum + i.qty * i.rate * (i.taxPct / 100), 0);
}

function calcTotal(items: LineItem[]) {
  return calcSubtotal(items) + calcTax(items);
}

function calcPaid(payments: Payment[]) {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  DRAFT:          "bg-gray-100 text-gray-700",
  SENT:           "bg-blue-100 text-blue-700",
  PARTIALLY_PAID: "bg-amber-100 text-amber-700",
  PAID:           "bg-green-100 text-green-700",
  OVERDUE:        "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Draft", SENT: "Sent", PARTIALLY_PAID: "Partially Paid", PAID: "Paid", OVERDUE: "Overdue",
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: InvoiceType }) {
  const s: Record<InvoiceType, string> = {
    PROFORMA:    "bg-indigo-100 text-indigo-700",
    TAX:         "bg-purple-100 text-purple-700",
    CREDIT_NOTE: "bg-orange-100 text-orange-700",
  };
  const l: Record<InvoiceType, string> = { PROFORMA: "Proforma", TAX: "Tax Invoice", CREDIT_NOTE: "Credit Note" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s[type]}`}>{l[type]}</span>
  );
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Bank Transfer", UPI: "UPI", CASH: "Cash", CHECK: "Check", CARD: "Card",
};

const METHOD_ICON: Record<PaymentMethod, React.ReactNode> = {
  BANK_TRANSFER: <Building2 className="h-3.5 w-3.5" />,
  UPI:           <Smartphone className="h-3.5 w-3.5" />,
  CASH:          <Banknote className="h-3.5 w-3.5" />,
  CHECK:         <FileText className="h-3.5 w-3.5" />,
  CARD:          <CreditCard className="h-3.5 w-3.5" />,
};

// ─── New Invoice Form ──────────────────────────────────────────────────────────

const blankItem = (): LineItem => ({
  id: Math.random().toString(36).slice(2),
  product: "", qty: 1, rate: 0, taxPct: 18,
});

function NewInvoiceModal({ onClose, onSave }: { onClose: () => void; onSave: (inv: Invoice) => void }) {
  const [type, setType] = useState<InvoiceType>("PROFORMA");
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([blankItem()]);
  const [notes, setNotes] = useState("");
  const [isInterState, setIsInterState] = useState(false);

  const subtotal = calcSubtotal(items);
  const tax = calcTax(items);
  const total = subtotal + tax;
  const cgst = !isInterState ? tax / 2 : 0;
  const sgst = !isInterState ? tax / 2 : 0;
  const igst = isInterState ? tax : 0;

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: typeof value === "string" ? value : Number(value) } : i))
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleSave() {
    const today = new Date().toISOString().split("T")[0];
    const prefix = type === "PROFORMA" ? "PRO" : type === "TAX" ? "TAX" : "CREDIT";
    const inv: Invoice = {
      id: `inv-${Date.now()}`,
      number: `${prefix}-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      type,
      customer,
      status: "DRAFT",
      issueDate: today,
      dueDate: dueDate || today,
      items,
      payments: [],
      notes,
    };
    onSave(inv);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[var(--card)] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold">Create New Invoice</h2>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Type Toggle */}
          <div>
            <label className="text-sm font-medium mb-2 block">Invoice Type</label>
            <div className="flex gap-2 flex-wrap">
              {(["PROFORMA", "TAX", "CREDIT_NOTE"] as InvoiceType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    type === t
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                      : "border-[var(--border)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {t === "PROFORMA" ? "Proforma Invoice" : t === "TAX" ? "Tax Invoice" : "Credit Note"}
                </button>
              ))}
            </div>
            {type === "PROFORMA" && (
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                Proforma invoices are advance estimates. Convert to Tax Invoice after order confirmation.
              </p>
            )}
          </div>

          {/* Customer & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Customer</label>
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)]"
              >
                {CUSTOMERS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)]"
              />
            </div>
          </div>

          {/* GST Type */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">GST Type:</label>
            <button
              onClick={() => setIsInterState(false)}
              className={`px-3 py-1 rounded text-sm border ${!isInterState ? "bg-blue-600 text-white border-blue-600" : "border-[var(--border)]"}`}
            >
              Intra-State (CGST + SGST)
            </button>
            <button
              onClick={() => setIsInterState(true)}
              className={`px-3 py-1 rounded text-sm border ${isInterState ? "bg-blue-600 text-white border-blue-600" : "border-[var(--border)]"}`}
            >
              Inter-State (IGST)
            </button>
          </div>

          {/* Line Items */}
          <div>
            <label className="text-sm font-medium mb-2 block">Line Items</label>
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="text-left p-3 font-medium">Product / Service</th>
                    <th className="text-center p-3 font-medium w-20">Qty</th>
                    <th className="text-right p-3 font-medium w-28">Rate (₹)</th>
                    <th className="text-center p-3 font-medium w-20">Tax %</th>
                    <th className="text-right p-3 font-medium w-28">Amount</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.product}
                          onChange={(e) => updateItem(item.id, "product", e.target.value)}
                          placeholder="Product or service name"
                          className="w-full border-0 bg-transparent outline-none text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                          min={1}
                          className="w-full border-0 bg-transparent outline-none text-sm text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                          min={0}
                          className="w-full border-0 bg-transparent outline-none text-sm text-right"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={item.taxPct}
                          onChange={(e) => updateItem(item.id, "taxPct", e.target.value)}
                          className="w-full border-0 bg-transparent outline-none text-sm text-center"
                        >
                          {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </td>
                      <td className="p-2 text-right font-medium">
                        {fmt(item.qty * item.rate)}
                      </td>
                      <td className="p-2">
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setItems((prev) => [...prev, blankItem()])}
              className="mt-2 text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="bg-[var(--muted)] rounded-lg p-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span className="font-medium">{fmt(subtotal)}</span>
            </div>
            {isInterState ? (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">IGST ({items[0]?.taxPct ?? 18}%)</span>
                <span className="font-medium">{fmt(igst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">CGST ({(items[0]?.taxPct ?? 18) / 2}%)</span>
                  <span className="font-medium">{fmt(cgst)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">SGST ({(items[0]?.taxPct ?? 18) / 2}%)</span>
                  <span className="font-medium">{fmt(sgst)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-base font-bold pt-1.5 border-t border-[var(--border)]">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Additional terms, bank details, etc."
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--background)] resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90"
          >
            <FileText className="h-4 w-4" /> Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Record Payment Modal ──────────────────────────────────────────────────────

function RecordPaymentModal({
  invoice,
  onClose,
  onRecord,
}: {
  invoice: Invoice;
  onClose: () => void;
  onRecord: (payment: Payment) => void;
}) {
  const total = calcTotal(invoice.items);
  const paid = calcPaid(invoice.payments);
  const outstanding = total - paid;

  const [amount, setAmount] = useState(outstanding);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [method, setMethod] = useState<PaymentMethod>("BANK_TRANSFER");
  const [reference, setReference] = useState("");

  function handleRecord() {
    onRecord({
      id: `p-${Date.now()}`,
      amount,
      date,
      method,
      reference,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[var(--card)] rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="text-base font-bold">Record Payment</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-[var(--muted-foreground)]" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-[var(--muted)] rounded-lg p-3 text-sm flex justify-between">
            <div>
              <p className="text-[var(--muted-foreground)]">Invoice</p>
              <p className="font-semibold">{invoice.number}</p>
            </div>
            <div className="text-right">
              <p className="text-[var(--muted-foreground)]">Outstanding</p>
              <p className="font-bold text-red-600">{fmt(outstanding)}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Payment Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(["BANK_TRANSFER", "UPI", "CASH", "CHECK", "CARD"] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                    method === m
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                      : "border-[var(--border)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {METHOD_ICON[m]}
                  {METHOD_LABEL[m]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Reference #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="UTR / Transaction ID"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--border)]">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]">
            Cancel
          </button>
          <button
            onClick={handleRecord}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" /> Record Payment
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Invoice Row (expandable) ──────────────────────────────────────────────────

function InvoiceRow({
  invoice,
  onRecordPayment,
}: {
  invoice: Invoice;
  onRecordPayment: (inv: Invoice) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const total = calcTotal(invoice.items);
  const paid = calcPaid(invoice.payments);
  const outstanding = total - paid;
  const subtotal = calcSubtotal(invoice.items);
  const tax = calcTax(invoice.items);

  return (
    <>
      <tr
        className="hover:bg-[var(--muted)] transition-colors cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <td className="px-5 py-4">
          <p className="text-sm font-medium text-[var(--primary)]">{invoice.number}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{formatDate(invoice.issueDate)}</p>
        </td>
        <td className="px-5 py-4">
          <TypeBadge type={invoice.type} />
        </td>
        <td className="px-5 py-4 text-sm">{invoice.customer}</td>
        <td className="px-5 py-4 text-sm text-right font-medium">{fmt(subtotal)}</td>
        <td className="px-5 py-4 text-sm text-right">{fmt(tax)}</td>
        <td className="px-5 py-4 text-sm text-right font-bold">{fmt(total)}</td>
        <td className="px-5 py-4"><StatusBadge status={invoice.status} /></td>
        <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">{formatDate(invoice.dueDate)}</td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {invoice.status !== "PAID" && invoice.type !== "PROFORMA" && (
              <button
                onClick={() => onRecordPayment(invoice)}
                className="p-1.5 rounded-md text-green-600 hover:bg-green-50 transition-colors"
                title="Record Payment"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            <button className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors" title="Send">
              <Send className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors" title="Download PDF">
              <Download className="h-4 w-4" />
            </button>
            <button onClick={() => setExpanded((e) => !e)} className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={9} className="bg-[var(--muted)]/40 px-5 py-4 border-t border-[var(--border)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Line Items */}
              <div>
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-2">Line Items</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-1.5 text-xs font-medium text-[var(--muted-foreground)]">Product</th>
                      <th className="text-center py-1.5 text-xs font-medium text-[var(--muted-foreground)]">Qty</th>
                      <th className="text-right py-1.5 text-xs font-medium text-[var(--muted-foreground)]">Rate</th>
                      <th className="text-right py-1.5 text-xs font-medium text-[var(--muted-foreground)]">Tax</th>
                      <th className="text-right py-1.5 text-xs font-medium text-[var(--muted-foreground)]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-[var(--border)]/50">
                        <td className="py-1.5">{item.product}</td>
                        <td className="py-1.5 text-center">{item.qty}</td>
                        <td className="py-1.5 text-right">{fmt(item.rate)}</td>
                        <td className="py-1.5 text-center text-[var(--muted-foreground)]">{item.taxPct}%</td>
                        <td className="py-1.5 text-right font-medium">{fmt(item.qty * item.rate * (1 + item.taxPct / 100))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invoice.notes && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-3 italic">{invoice.notes}</p>
                )}
              </div>

              {/* Payment Tracking */}
              <div>
                <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-2">
                  Payment History &amp; Balance
                </p>
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Invoice Total</span>
                    <span className="font-semibold">{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Total Paid</span>
                    <span className="font-semibold text-green-600">{fmt(paid)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[var(--border)] pt-1">
                    <span className="font-semibold">Outstanding Balance</span>
                    <span className={`font-bold ${outstanding > 0 ? "text-red-600" : "text-green-600"}`}>
                      {fmt(outstanding)}
                    </span>
                  </div>
                </div>

                {/* Payment Progress Bar */}
                {total > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                      <span>Payment progress</span>
                      <span>{Math.round((paid / total) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500 transition-all"
                        style={{ width: `${Math.min(100, (paid / total) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {invoice.payments.length > 0 ? (
                  <div className="space-y-2">
                    {invoice.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-white dark:bg-[var(--card)] rounded-lg px-3 py-2 border border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <div className="text-[var(--muted-foreground)]">{METHOD_ICON[p.method]}</div>
                          <div>
                            <p className="text-xs font-medium">{fmt(p.amount)}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{METHOD_LABEL[p.method]}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-[var(--muted-foreground)]">{formatDate(p.date)}</p>
                          {p.reference && (
                            <p className="text-xs text-[var(--muted-foreground)] font-mono">{p.reference}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--muted-foreground)] italic">No payments recorded yet.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type TabFilter = "ALL" | InvoiceType;

const TAB_LABELS: { key: TabFilter; label: string }[] = [
  { key: "ALL",         label: "All"          },
  { key: "PROFORMA",    label: "Proforma"     },
  { key: "TAX",         label: "Tax Invoice"  },
  { key: "CREDIT_NOTE", label: "Credit Note"  },
];

const STATUS_FILTERS: { key: InvoiceStatus | "ALL"; label: string }[] = [
  { key: "ALL",            label: "All Status"      },
  { key: "DRAFT",          label: "Draft"           },
  { key: "SENT",           label: "Sent"            },
  { key: "PARTIALLY_PAID", label: "Partially Paid"  },
  { key: "PAID",           label: "Paid"            },
  { key: "OVERDUE",        label: "Overdue"         },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">("ALL");
  const [showNewModal, setShowNewModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) => {
    const typeMatch = activeTab === "ALL" || inv.type === activeTab;
    const statusMatch = statusFilter === "ALL" || inv.status === statusFilter;
    return typeMatch && statusMatch;
  });

  // Summary stats
  const totalRevenue = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + calcTotal(i.items), 0);
  const totalOutstanding = invoices.filter((i) => i.status !== "PAID").reduce((s, i) => s + (calcTotal(i.items) - calcPaid(i.payments)), 0);
  const overdueCount = invoices.filter((i) => i.status === "OVERDUE").length;
  const paidCount = invoices.filter((i) => i.status === "PAID").length;

  function handleSaveInvoice(inv: Invoice) {
    setInvoices((prev) => [inv, ...prev]);
  }

  function handleRecordPayment(invoice: Invoice, payment: Payment) {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoice.id) return inv;
        const newPayments = [...inv.payments, payment];
        const total = calcTotal(inv.items);
        const paid = calcPaid(newPayments);
        const status: InvoiceStatus = paid >= total ? "PAID" : "PARTIALLY_PAID";
        return { ...inv, payments: newPayments, status };
      })
    );
  }

  // Full cycle journey banner
  const cycleSteps = [
    { label: "Lead",             active: true },
    { label: "Quote",            active: true },
    { label: "Proforma Invoice", active: true },
    { label: "Order",            active: true },
    { label: "Tax Invoice",      active: true },
    { label: "Payment",          active: true },
    { label: "Receipt",          active: false },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            Manage proforma &amp; tax invoices, track payments
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> New Invoice
        </button>
      </div>

      {/* Full Cycle Journey */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase mb-3">Order-to-Cash Cycle</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {cycleSteps.map((step, idx) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  step.active
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                <ReceiptText className="h-3 w-3" />
                {step.label}
              </div>
              {idx < cycleSteps.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Collected",  value: fmt(totalRevenue),     icon: CheckCircle, color: "text-green-600 bg-green-50"  },
          { label: "Outstanding",      value: fmt(totalOutstanding),  icon: Clock,       color: "text-amber-600 bg-amber-50"  },
          { label: "Overdue",          value: `${overdueCount} invoices`, icon: AlertCircle, color: "text-red-600 bg-red-50"  },
          { label: "Paid Invoices",    value: `${paidCount} invoices`,    icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <div className={`inline-flex p-1.5 rounded-lg ${s.color} mb-2`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-[var(--muted)] p-1 rounded-lg">
          {TAB_LABELS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--card)] shadow text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | "ALL")}
          className="border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm bg-[var(--background)]"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Invoice Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Invoice #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Customer</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Subtotal</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">GST</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Due Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No invoices found for the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <InvoiceRow
                    key={inv.id}
                    invoice={inv}
                    onRecordPayment={(invoice) => setPaymentInvoice(invoice)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showNewModal && (
        <NewInvoiceModal onClose={() => setShowNewModal(false)} onSave={handleSaveInvoice} />
      )}
      {paymentInvoice && (
        <RecordPaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onRecord={(payment) => {
            handleRecordPayment(paymentInvoice, payment);
            setPaymentInvoice(null);
          }}
        />
      )}
    </div>
  );
}
