"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  validUntil: string | null;
  totalAmount: number;
  createdAt: string;
}

export default function QuotesListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);
    const res = await fetch("/api/quotes");
    setQuotes(await res.json());
    setLoading(false);
  }

  async function createQuote() {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const quote = await res.json();
    window.location.href = `/dashboard/quotes/${quote.id}`;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <button
          onClick={createQuote}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Quote
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No quotes found. Create one to get started.
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Quote #
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Valid Until
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/quotes/${q.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {q.quoteNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {formatCurrency(q.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {q.validUntil
                      ? format(new Date(q.validUntil), "MMM d, yyyy")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(q.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
