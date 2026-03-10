"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

interface QuoteItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  product: { name: string; sku: string };
}

interface QuoteDetail {
  id: string;
  quoteNumber: string;
  dealId: string | null;
  contactId: string | null;
  status: string;
  validUntil: string | null;
  totalAmount: number;
  createdAt: string;
  items: QuoteItem[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchQuote(), fetchProducts()]);
  }, [params.id]);

  async function fetchQuote() {
    const res = await fetch(`/api/quotes/${params.id}`);
    if (!res.ok) {
      router.push("/dashboard/quotes");
      return;
    }
    setQuote(await res.json());
    setLoading(false);
  }

  async function fetchProducts() {
    const res = await fetch("/api/products?orgId=default");
    setProducts(await res.json());
  }

  async function addItem(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product || !quote) return;

    const items = [
      ...quote.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountPercent: i.discountPercent,
      })),
      {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
        discountPercent: 0,
      },
    ];

    await fetch(`/api/quotes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    fetchQuote();
  }

  async function removeItem(index: number) {
    if (!quote) return;
    const items = quote.items
      .filter((_, i) => i !== index)
      .map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountPercent: i.discountPercent,
      }));

    await fetch(`/api/quotes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    fetchQuote();
  }

  async function updateItemDiscount(index: number, discount: number) {
    if (!quote) return;
    const items = quote.items.map((i, idx) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountPercent: idx === index ? discount : i.discountPercent,
    }));

    await fetch(`/api/quotes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    fetchQuote();
  }

  async function updateItemQuantity(index: number, quantity: number) {
    if (!quote || quantity < 1) return;
    const items = quote.items.map((i, idx) => ({
      productId: i.productId,
      quantity: idx === index ? quantity : i.quantity,
      unitPrice: i.unitPrice,
      discountPercent: i.discountPercent,
    }));

    await fetch(`/api/quotes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    fetchQuote();
  }

  async function updateStatus(status: string) {
    await fetch(`/api/quotes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchQuote();
  }

  function exportPdf() {
    if (!quote) return;
    const content = `
QUOTE: ${quote.quoteNumber}
Status: ${quote.status}
Date: ${format(new Date(quote.createdAt), "MMM d, yyyy")}
Valid Until: ${quote.validUntil ? format(new Date(quote.validUntil), "MMM d, yyyy") : "N/A"}

ITEMS:
${quote.items
  .map((i) => {
    const lineTotal =
      i.quantity * i.unitPrice * (1 - i.discountPercent / 100);
    return `  ${i.product.name} (${i.product.sku}) x${i.quantity} @ ${formatCurrency(i.unitPrice)} ${i.discountPercent > 0 ? `(-${i.discountPercent}%)` : ""} = ${formatCurrency(lineTotal)}`;
  })
  .join("\n")}

TOTAL: ${formatCurrency(quote.totalAmount)}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quote.quoteNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!quote) return null;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/dashboard/quotes"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Quotes
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{quote.quoteNumber}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={quote.status} />
            {quote.validUntil && (
              <span className="text-sm text-gray-500">
                Valid until{" "}
                {format(new Date(quote.validUntil), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPdf}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {quote.status === "draft" && (
            <button
              onClick={() => updateStatus("sent")}
              className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Send
            </button>
          )}
          {quote.status === "sent" && (
            <>
              <button
                onClick={() => updateStatus("accepted")}
                className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus("rejected")}
                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500">Total Amount</p>
        <p className="text-3xl font-bold text-blue-600">
          {formatCurrency(quote.totalAmount)}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
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

        {quote.items.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No items yet. Add products to build your quote.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Product</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Discount %</th>
                <th className="text-right py-2">Line Total</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, idx) => {
                const lineTotal =
                  item.quantity *
                  item.unitPrice *
                  (1 - item.discountPercent / 100);
                return (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.product.sku}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 text-right">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemQuantity(idx, parseInt(e.target.value) || 1)
                        }
                        className="w-16 border rounded px-2 py-1 text-right"
                      />
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2 text-right">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent}
                        onChange={(e) =>
                          updateItemDiscount(
                            idx,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 border rounded px-2 py-1 text-right"
                      />
                    </td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(lineTotal)}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
