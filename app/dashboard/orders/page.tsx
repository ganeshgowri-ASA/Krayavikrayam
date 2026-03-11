"use client";

import { useState } from "react";
import {
  Search, Filter, Plus, Package, Truck, CheckCircle, Clock,
  RotateCcw, Ban, AlertTriangle, Pause, CloudLightning, X
} from "lucide-react";

type OrderStatus =
  | "Confirmed"
  | "In Progress"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Returned"
  | "Refunded"
  | "Cancelled"
  | "Disputed"
  | "Force Majeure"
  | "Halted";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  qty: number;
  amount: number;
  status: OrderStatus;
  date: string;
  invoiceId: string;
}

const orders: Order[] = [
  { id: "o1", orderNumber: "ORD-2026-101", customer: "Ramesh Enterprises", product: "CRM Pro License (5 seats)", qty: 5, amount: 125000, status: "Completed", date: "2026-03-01", invoiceId: "INV-2026-038" },
  { id: "o2", orderNumber: "ORD-2026-102", customer: "Priya Tech Solutions", product: "Enterprise SaaS Module", qty: 1, amount: 280000, status: "Delivered", date: "2026-03-03", invoiceId: "INV-2026-039" },
  { id: "o3", orderNumber: "ORD-2026-103", customer: "Arjun Logistics Pvt Ltd", product: "Fleet Management Software", qty: 2, amount: 95000, status: "In Progress", date: "2026-03-05", invoiceId: "INV-2026-040" },
  { id: "o4", orderNumber: "ORD-2026-104", customer: "Suresh Nagar Tech", product: "Data Analytics Dashboard", qty: 1, amount: 185000, status: "Shipped", date: "2026-03-06", invoiceId: "INV-2026-041" },
  { id: "o5", orderNumber: "ORD-2026-105", customer: "Kavitha Industries", product: "Inventory Management", qty: 3, amount: 67500, status: "Confirmed", date: "2026-03-08", invoiceId: "INV-2026-042" },
  { id: "o6", orderNumber: "ORD-2026-106", customer: "Deepak Retail Group", product: "POS Integration Kit", qty: 10, amount: 43000, status: "Returned", date: "2026-03-02", invoiceId: "INV-2026-035" },
  { id: "o7", orderNumber: "ORD-2026-107", customer: "Nandini Pharma", product: "Compliance Module", qty: 1, amount: 89000, status: "Disputed", date: "2026-02-28", invoiceId: "INV-2026-032" },
  { id: "o8", orderNumber: "ORD-2026-108", customer: "Amar Construction", product: "Project Tracking Software", qty: 2, amount: 56000, status: "Cancelled", date: "2026-02-25", invoiceId: "INV-2026-029" },
  { id: "o9", orderNumber: "ORD-2026-109", customer: "Geeta Textiles", product: "Supply Chain Module", qty: 1, amount: 145000, status: "Refunded", date: "2026-02-20", invoiceId: "INV-2026-025" },
  { id: "o10", orderNumber: "ORD-2026-110", customer: "Ravi Solar Energy", product: "Field Service App", qty: 4, amount: 38000, status: "Force Majeure", date: "2026-02-15", invoiceId: "INV-2026-021" },
  { id: "o11", orderNumber: "ORD-2026-111", customer: "Vinod Electronics", product: "Warranty Tracker", qty: 6, amount: 24000, status: "Halted", date: "2026-02-10", invoiceId: "INV-2026-018" },
];

const statusConfig: Record<OrderStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  Confirmed:     { label: "Confirmed",     className: "bg-blue-100 text-blue-700",      icon: Clock },
  "In Progress": { label: "In Progress",   className: "bg-indigo-100 text-indigo-700",  icon: Package },
  Shipped:       { label: "Shipped",       className: "bg-cyan-100 text-cyan-700",      icon: Truck },
  Delivered:     { label: "Delivered",     className: "bg-teal-100 text-teal-700",      icon: CheckCircle },
  Completed:     { label: "Completed",     className: "bg-green-100 text-green-700",    icon: CheckCircle },
  Returned:      { label: "Returned",      className: "bg-orange-100 text-orange-700",  icon: RotateCcw },
  Refunded:      { label: "Refunded",      className: "bg-purple-100 text-purple-700",  icon: RotateCcw },
  Cancelled:     { label: "Cancelled",     className: "bg-red-100 text-red-700",        icon: Ban },
  Disputed:      { label: "Disputed",      className: "bg-rose-100 text-rose-800",      icon: AlertTriangle },
  "Force Majeure": { label: "Force Majeure", className: "bg-gray-100 text-gray-700",   icon: CloudLightning },
  Halted:        { label: "Halted",        className: "bg-yellow-100 text-yellow-700",  icon: Pause },
};

const allStatuses: (OrderStatus | "All")[] = [
  "All", "Confirmed", "In Progress", "Shipped", "Delivered", "Completed",
  "Returned", "Refunded", "Cancelled", "Disputed", "Force Majeure", "Halted"
];

interface ReturnFormState {
  orderId: string;
  reason: string;
  product: string;
  qty: number;
  refundMethod: string;
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [returnModal, setReturnModal] = useState<Order | null>(null);
  const [disputeModal, setDisputeModal] = useState<Order | null>(null);
  const [returnForm, setReturnForm] = useState<Partial<ReturnFormState>>({});

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const disputes = orders.filter((o) => o.status === "Disputed");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all order lifecycle stages</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Order
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {(["Confirmed", "In Progress", "Shipped", "Delivered", "Disputed", "Cancelled"] as OrderStatus[]).map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const cfg = statusConfig[s];
          const Icon = cfg.icon;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
              className={`bg-white border rounded-xl p-3 text-left hover:shadow-sm transition-all ${statusFilter === s ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
                  <Icon className="h-3 w-3 mr-1" />{s}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as typeof statusFilter)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === s ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Order #</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-center px-5 py-3 font-medium">Qty</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Invoice</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => {
                const cfg = statusConfig[order.status];
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{order.orderNumber}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{order.customer}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{order.product}</td>
                    <td className="px-5 py-3 text-center text-gray-700">{order.qty}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">₹{order.amount.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-gray-500">{order.date}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
                        <Icon className="h-3 w-3" />{cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono text-gray-500 hover:text-blue-600 cursor-pointer">{order.invoiceId}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {(order.status === "Delivered" || order.status === "Completed") && (
                          <button
                            onClick={() => setReturnModal(order)}
                            className="px-2 py-1 text-xs font-medium rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                          >
                            Return
                          </button>
                        )}
                        {order.status === "Disputed" && (
                          <button
                            onClick={() => setDisputeModal(order)}
                            className="px-2 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      {/* Dispute Resolution Panel */}
      {disputes.length > 0 && (
        <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-red-100 bg-red-50 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="font-semibold text-red-800">Open Disputes ({disputes.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {disputes.map((d) => (
              <div key={d.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{d.orderNumber} — {d.customer}</p>
                  <p className="text-sm text-gray-500">{d.product} · ₹{d.amount.toLocaleString("en-IN")} · {d.date}</p>
                  <p className="text-xs text-red-600 mt-1">Invoice: {d.invoiceId}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">Under Review</span>
                  <button
                    onClick={() => setDisputeModal(d)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Resolve Dispute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return/Exchange Modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Return / Exchange Request</h3>
              <button onClick={() => setReturnModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-0.5">Order</p>
                <p className="font-medium text-gray-900">{returnModal.orderNumber} — {returnModal.customer}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <input
                  type="text"
                  defaultValue={returnModal.product}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Return</label>
                <input
                  type="number"
                  min={1}
                  max={returnModal.qty}
                  defaultValue={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Return</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Defective Product</option>
                  <option>Wrong Item Delivered</option>
                  <option>Not as Described</option>
                  <option>Customer Changed Mind</option>
                  <option>Duplicate Order</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Bank Transfer (NEFT/RTGS)</option>
                  <option>UPI Refund</option>
                  <option>Store Credit</option>
                  <option>Razorpay Refund</option>
                  <option>Cheque</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setReturnModal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setReturnModal(null)} className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
                Submit Return Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Resolution Modal */}
      {disputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Dispute Resolution</h3>
              <button onClick={() => setDisputeModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm font-medium text-red-800">{disputeModal.orderNumber} — {disputeModal.customer}</p>
                <p className="text-xs text-red-600 mt-1">{disputeModal.product} · ₹{disputeModal.amount.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dispute Category</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Non-delivery of Service</option>
                  <option>Quality Dispute</option>
                  <option>Billing Dispute</option>
                  <option>Scope Creep</option>
                  <option>Contractual Breach</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe the resolution steps taken..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Outcome</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Resolved in Customer Favor — Full Refund</option>
                  <option>Resolved in Customer Favor — Partial Refund</option>
                  <option>Resolved in Company Favor — No Refund</option>
                  <option>Mutually Settled</option>
                  <option>Escalated to Legal</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setDisputeModal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setDisputeModal(null)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Save Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
