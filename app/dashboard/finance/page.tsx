"use client";

import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight,
  ArrowDownRight, Scale, BookMarked, Receipt, Landmark
} from "lucide-react";

const summaryCards = [
  {
    label: "Total Revenue",
    value: "₹48,25,000",
    change: "+12.4%",
    up: true,
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Total Expenses",
    value: "₹31,40,000",
    change: "+5.1%",
    up: false,
    icon: TrendingDown,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Net Profit",
    value: "₹16,85,000",
    change: "+22.7%",
    up: true,
    icon: DollarSign,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Cash Balance",
    value: "₹9,12,500",
    change: "+8.3%",
    up: true,
    icon: BarChart3,
    color: "bg-purple-50 text-purple-600",
  },
];

const quickLinks = [
  { href: "/dashboard/finance/profit-loss", label: "P&L Statement", icon: TrendingDown, desc: "View income & expense breakdown" },
  { href: "/dashboard/finance/balance-sheet", label: "Balance Sheet", icon: Scale, desc: "Assets, liabilities & equity" },
  { href: "/dashboard/finance/ledger", label: "General Ledger", icon: BookMarked, desc: "All transaction entries" },
  { href: "/dashboard/finance/tax-credits", label: "Tax & Credits", icon: Receipt, desc: "GST, TDS & credit notes" },
];

const recentTransactions = [
  { id: "TXN-001", date: "2026-03-10", desc: "Invoice #INV-2026-042 — Ramesh Enterprises", type: "Credit", amount: "₹1,25,000", account: "Revenue" },
  { id: "TXN-002", date: "2026-03-09", desc: "Office Rent — March 2026", type: "Debit", amount: "₹45,000", account: "Rent" },
  { id: "TXN-003", date: "2026-03-08", desc: "Invoice #INV-2026-041 — Priya Tech Solutions", type: "Credit", amount: "₹2,80,000", account: "Revenue" },
  { id: "TXN-004", date: "2026-03-07", desc: "Salary Disbursement — Feb 2026", type: "Debit", amount: "₹6,20,000", account: "Salaries" },
  { id: "TXN-005", date: "2026-03-06", desc: "AWS Cloud Services — Feb 2026", type: "Debit", amount: "₹18,500", account: "Software" },
  { id: "TXN-006", date: "2026-03-05", desc: "Invoice #INV-2026-040 — Arjun Logistics", type: "Credit", amount: "₹95,000", account: "Revenue" },
];

export default function FinancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Landmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance Overview</h1>
          <p className="text-sm text-gray-500">Financial summary for March 2026</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${card.up ? "text-green-600" : "text-red-500"}`}>
                  {card.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Finance Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 w-fit mb-3 group-hover:bg-blue-100 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{link.label}</p>
                <p className="text-xs text-gray-500">{link.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Description</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Account</th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{txn.date}</td>
                  <td className="px-5 py-3 text-gray-900">{txn.desc}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {txn.account}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${txn.type === "Credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className={`px-5 py-3 text-right font-semibold ${txn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                    {txn.type === "Credit" ? "+" : "-"}{txn.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
