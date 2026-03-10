"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: { name: string; sku: string };
}

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  reference: string | null;
}

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  contactId: string | null;
  accountId: string | null;
  status: string;
  dueDate: string | null;
  totalAmount: number;
  orgId: string;
  createdAt: string;
  items: InvoiceItem[];
  payments: Payment[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    Promise.all([fetchInvoice(), fetchProducts()]);
  }, [params.id]);

  async function fetchInvoice() {
    const res = await fetch(`/api/invoices/${params.id}`);
    if (!res.ok) {
      router.push("/dashboard/invoices");
      return;
    }
    setInvoice(await res.json());
    setLoading(false);
  }

  async function fetchProducts() {
    const res = await fetch("/api/products?orgId=default");
    setProducts(await res.json());
  }

  async function addItem(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product || !invoice) return;

    const items = [
      ...invoice.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      { productId: product.id, quantity: 1, unitPrice: product.price },
    ];

    await fetch(`/api/invoices/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    fetchInvoice();
  }

  async function removeItem(index: number) {
    if (!invoice) return;
    const items = invoice.items
      .filter((_, i) => i !== index)
      .map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }));

    await fetch(`/api/invoices/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    fetchInvoice();
  }

  async function updateStatus(status: string) {
    await fetch(`/api/invoices/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchInvoice();
  }

  async function recordPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId: params.id,
        amount: parseFloat(form.get("amount") as string),
        method: form.get("method"),
        reference: form.get("reference"),
      }),
    });
    setShowPaymentModal(false);
    fetchInvoice();
  }

  function exportPdf() {
    if (!invoice) return;
    const content = `
INVOICE: ${invoice.invoiceNumber}
Status: ${invoice.status}
Date: ${format(new Date(invoice.createdAt), "MMM d, yyyy")}
Due: ${invoice.dueDate ? format(new Date(invoice.dueDate), "MMM d, yyyy") : "N/A"}

ITEMS:
${invoice.items.map((i) => `  ${i.product.name} (${i.product.sku}) x${i.quantity} @ ${formatCurrency(i.unitPrice)} = ${formatCurrency(i.total)}`).join("\n")}

TOTAL: ${formatCurrency(invoice.totalAmount)}

PAYMENTS:
${invoice.payments.map((p) => `  ${format(new Date(p.paymentDate), "MMM d, yyyy")} - ${formatCurrency(p.amount)} (${p.method})`).join("\n") || "  None"}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!invoice) return null;

  const totalPaid = invoice.payments.reduce((s, p) => s + p.amount, 0);
  const balance = invoice.totalAmount - totalPaid;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/dashboard/invoices"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Invoices
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{invoice.invoiceNumber}</h1>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPdf}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {invoice.status === "draft" && (
            <button
              onClick={() => updateStatus("sent")}
              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Mark Sent
            </button>
          )}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">
            {formatCurrency(invoice.totalAmount)}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-xl font-bold text-orange-600">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Line Items</h3>
          <select
            onChange={(e) => {
              if (e.target.value) addItem(e.target.value);
              e.target.value = "";
            }}
            className="text-sm border rounded-lg px-3 py-1.5"
          >
            <option value="">+ Add product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatCurrency(p.price)})
              </option>
            ))}
          </select>
        </div>
        {invoice.items.length === 0 ? (
          <p className="text-gray-400 text-sm">No line items yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Product</th>
                <th className="text-left py-2">SKU</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Total</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.product.name}</td>
                  <td className="py-2 text-gray-500">{item.product.sku}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {invoice.payments.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-medium mb-4">Payments</h3>
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Method</th>
                <th className="text-left py-2">Reference</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-2">
                    {format(new Date(p.paymentDate), "MMM d, yyyy")}
                  </td>
                  <td className="py-2 capitalize">{p.method}</td>
                  <td className="py-2 text-gray-500">{p.reference || "-"}</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-4">Record Payment</h2>
            <form onSubmit={recordPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={balance > 0 ? balance : undefined}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Method
                </label>
                <select
                  name="method"
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reference
                </label>
                <input
                  name="reference"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Transaction ID, check #, etc."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
