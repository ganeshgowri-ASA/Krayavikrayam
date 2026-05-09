"use client";

import { useMemo, useState } from "react";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";

type PoStatus = "draft" | "sent" | "acknowledged" | "in_transit" | "received" | "cancelled";

interface PurchaseOrder {
  poNo: string;
  supplier: string;
  value: number;
  status: PoStatus;
  deliveryDate: string;
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { poNo: "PO-2026-0001", supplier: "Tata Steel Ltd",            value: 2450000, status: "in_transit",   deliveryDate: "2026-05-12" },
  { poNo: "PO-2026-0002", supplier: "Mahindra Logistics",        value: 185000,  status: "acknowledged", deliveryDate: "2026-05-15" },
  { poNo: "PO-2026-0003", supplier: "Bharat Forge",              value: 1320000, status: "sent",         deliveryDate: "2026-05-22" },
  { poNo: "PO-2026-0004", supplier: "Reliance Industries",       value: 5600000, status: "received",     deliveryDate: "2026-05-01" },
  { poNo: "PO-2026-0005", supplier: "Larsen & Toubro",           value: 3450000, status: "in_transit",   deliveryDate: "2026-05-10" },
  { poNo: "PO-2026-0006", supplier: "Asian Paints",              value: 245000,  status: "draft",        deliveryDate: "2026-06-01" },
  { poNo: "PO-2026-0007", supplier: "Hindalco Industries",       value: 980000,  status: "acknowledged", deliveryDate: "2026-05-18" },
  { poNo: "PO-2026-0008", supplier: "JSW Steel",                 value: 1875000, status: "cancelled",    deliveryDate: "2026-04-28" },
  { poNo: "PO-2026-0009", supplier: "Cipla Ltd",                 value: 425000,  status: "received",     deliveryDate: "2026-04-25" },
  { poNo: "PO-2026-0010", supplier: "Godrej Consumer",           value: 156000,  status: "sent",         deliveryDate: "2026-05-30" },
  { poNo: "PO-2026-0011", supplier: "UltraTech Cement",          value: 2100000, status: "in_transit",   deliveryDate: "2026-05-09" },
  { poNo: "PO-2026-0012", supplier: "Maruti Suzuki",             value: 6800000, status: "acknowledged", deliveryDate: "2026-06-05" },
  { poNo: "PO-2026-0013", supplier: "Hero MotoCorp",             value: 540000,  status: "draft",        deliveryDate: "2026-06-12" },
  { poNo: "PO-2026-0014", supplier: "Wipro Enterprises",         value: 312000,  status: "received",     deliveryDate: "2026-04-20" },
  { poNo: "PO-2026-0015", supplier: "Bajaj Electricals",         value: 89000,   status: "sent",         deliveryDate: "2026-05-25" },
  { poNo: "PO-2026-0016", supplier: "Hindustan Unilever",        value: 1245000, status: "in_transit",   deliveryDate: "2026-05-11" },
  { poNo: "PO-2026-0017", supplier: "ITC Limited",               value: 720000,  status: "acknowledged", deliveryDate: "2026-05-19" },
  { poNo: "PO-2026-0018", supplier: "Dabur India",               value: 138000,  status: "received",     deliveryDate: "2026-04-15" },
  { poNo: "PO-2026-0019", supplier: "Sun Pharmaceuticals",       value: 2950000, status: "sent",         deliveryDate: "2026-05-28" },
  { poNo: "PO-2026-0020", supplier: "Kirloskar Brothers",        value: 465000,  status: "cancelled",    deliveryDate: "2026-04-30" },
  { poNo: "PO-2026-0021", supplier: "Voltas Limited",            value: 670000,  status: "draft",        deliveryDate: "2026-06-08" },
  { poNo: "PO-2026-0022", supplier: "Havells India",             value: 215000,  status: "in_transit",   deliveryDate: "2026-05-13" },
  { poNo: "PO-2026-0023", supplier: "Dr Reddy's Laboratories",   value: 1580000, status: "acknowledged", deliveryDate: "2026-05-21" },
];

const statusConfig: Record<PoStatus, { label: string; className: string }> = {
  draft:        { label: "Draft",        className: "bg-gray-100 text-gray-700" },
  sent:         { label: "Sent",         className: "bg-blue-100 text-blue-700" },
  acknowledged: { label: "Acknowledged", className: "bg-indigo-100 text-indigo-700" },
  in_transit:   { label: "In Transit",   className: "bg-cyan-100 text-cyan-700" },
  received:     { label: "Received",     className: "bg-green-100 text-green-700" },
  cancelled:    { label: "Cancelled",    className: "bg-red-100 text-red-700" },
};

const PAGE_SIZE = 10;
const TODAY = new Date("2026-05-09T00:00:00Z");

function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRelative(dateStr: string, now: Date = TODAY): string {
  const target = new Date(dateStr + "T00:00:00Z");
  const diffMs = target.getTime() - now.getTime();
  const days = Math.round(diffMs / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  if (days > 1 && days < 30) return `in ${days} days`;
  if (days < -1 && days > -30) return `${Math.abs(days)} days ago`;
  const months = Math.round(days / 30);
  if (months >= 1) return months === 1 ? "in 1 month" : `in ${months} months`;
  return Math.abs(months) === 1 ? "1 month ago" : `${Math.abs(months)} months ago`;
}

export default function PurchaseOrdersPage() {
  const [page, setPage] = useState(1);
  const orders = PURCHASE_ORDERS;
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders = useMemo(
    () => orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [orders, page],
  );

  const isEmpty = orders.length === 0;
  const startIdx = isEmpty ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, orders.length);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All issued POs across suppliers.
        </p>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-gray-900">No purchase orders yet</h2>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              When you issue a PO to a supplier, it will appear here with status and delivery tracking.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">PO #</th>
                    <th className="text-left px-5 py-3 font-medium">Supplier</th>
                    <th className="text-right px-5 py-3 font-medium">Value</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-left px-5 py-3 font-medium">Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageOrders.map((po) => {
                    const cfg = statusConfig[po.status];
                    return (
                      <tr key={po.poNo} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{po.poNo}</td>
                        <td className="px-5 py-3 font-medium text-gray-900">{po.supplier}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900 tabular-nums">
                          {formatInr(po.value)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          <span className="capitalize">{formatRelative(po.deliveryDate)}</span>
                          <span className="ml-2 text-xs text-gray-400">{po.deliveryDate}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
              <span>
                Showing <span className="font-medium text-gray-900">{startIdx}</span>–
                <span className="font-medium text-gray-900">{endIdx}</span> of{" "}
                <span className="font-medium text-gray-900">{orders.length}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <span className="text-gray-500">
                  Page <span className="font-medium text-gray-900">{page}</span> of{" "}
                  <span className="font-medium text-gray-900">{totalPages}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
