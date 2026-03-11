"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";

const dateRanges = ["This Week", "This Month", "This Quarter", "This Year", "Custom Range"];

interface PLRow {
  label: string;
  current: number;
  previous: number;
  indent?: boolean;
  bold?: boolean;
  separator?: boolean;
}

const plData: PLRow[] = [
  { label: "INCOME", current: 0, previous: 0, bold: true },
  { label: "Product Sales", current: 2850000, previous: 2340000, indent: true },
  { label: "Service Revenue", current: 1450000, previous: 1280000, indent: true },
  { label: "Consulting Fees", current: 520000, previous: 410000, indent: true },
  { label: "Subscription Revenue", current: 135000, previous: 98000, indent: true },
  { label: "Other Income", current: 70000, previous: 52000, indent: true },
  { label: "Total Revenue", current: 5025000, previous: 4180000, bold: true },
  { label: "COST OF GOODS SOLD (COGS)", current: 0, previous: 0, bold: true },
  { label: "Raw Materials", current: 980000, previous: 820000, indent: true },
  { label: "Manufacturing Cost", current: 340000, previous: 290000, indent: true },
  { label: "Packaging & Shipping", current: 120000, previous: 105000, indent: true },
  { label: "Total COGS", current: 1440000, previous: 1215000, bold: true },
  { label: "GROSS PROFIT", current: 3585000, previous: 2965000, bold: true, separator: true },
  { label: "OPERATING EXPENSES", current: 0, previous: 0, bold: true },
  { label: "Salaries & Wages", current: 1240000, previous: 1120000, indent: true },
  { label: "Marketing & Advertising", current: 210000, previous: 185000, indent: true },
  { label: "Office Rent", current: 135000, previous: 135000, indent: true },
  { label: "Software & Subscriptions", current: 55500, previous: 42000, indent: true },
  { label: "Utilities", current: 28000, previous: 25000, indent: true },
  { label: "Travel & Conveyance", current: 42000, previous: 38000, indent: true },
  { label: "Depreciation", current: 65000, previous: 65000, indent: true },
  { label: "Miscellaneous", current: 24500, previous: 19000, indent: true },
  { label: "Total Operating Expenses", current: 1800000, previous: 1629000, bold: true },
  { label: "NET PROFIT", current: 1785000, previous: 1336000, bold: true, separator: true },
];

function fmt(n: number) {
  if (n === 0) return "";
  return "₹" + n.toLocaleString("en-IN");
}

function pctChange(curr: number, prev: number) {
  if (!prev) return null;
  const diff = ((curr - prev) / prev) * 100;
  return diff.toFixed(1);
}

function isIncome(label: string) {
  return ["Total Revenue", "GROSS PROFIT", "NET PROFIT"].includes(label);
}

export default function ProfitLossPage() {
  const [dateRange, setDateRange] = useState("This Quarter");
  const [customFrom, setCustomFrom] = useState("2026-01-01");
  const [customTo, setCustomTo] = useState("2026-03-31");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profit & Loss Statement</h1>
          <p className="text-sm text-gray-500 mt-0.5">Comparison with previous period</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {dateRanges.map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                dateRange === r
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {dateRange === "Custom Range" && (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Revenue Breakdown by Category</h2>
        <div className="space-y-3">
          {[
            { label: "Product Sales", value: 2850000, pct: 56.7 },
            { label: "Service Revenue", value: 1450000, pct: 28.9 },
            { label: "Consulting Fees", value: 520000, pct: 10.3 },
            { label: "Subscription Revenue", value: 135000, pct: 2.7 },
            { label: "Other Income", value: 70000, pct: 1.4 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-medium">₹{item.value.toLocaleString("en-IN")} <span className="text-gray-400 font-normal">({item.pct}%)</span></span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* P&L Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Statement of Profit & Loss</h2>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="font-semibold text-gray-700">Current Period</span>
            <span>vs Previous Period</span>
            <span>Change</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium w-1/2">Description</th>
                <th className="text-right px-5 py-3 font-medium">Current ({dateRange})</th>
                <th className="text-right px-5 py-3 font-medium">Previous Period</th>
                <th className="text-right px-5 py-3 font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plData.map((row, i) => {
                const change = pctChange(row.current, row.previous);
                const isUp = change !== null && parseFloat(change) >= 0;
                const isHeader = row.current === 0 && row.previous === 0 && row.bold;
                if (isHeader) {
                  return (
                    <tr key={i} className="bg-gray-50">
                      <td colSpan={4} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                        {row.label}
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr
                    key={i}
                    className={`${row.separator ? "border-t-2 border-gray-300 bg-blue-50/50" : "hover:bg-gray-50"}`}
                  >
                    <td className={`px-5 py-3 ${row.indent ? "pl-10 text-gray-600" : ""} ${row.bold ? "font-bold text-gray-900" : "text-gray-700"}`}>
                      {row.label}
                    </td>
                    <td className={`px-5 py-3 text-right ${row.bold ? "font-bold" : ""} ${isIncome(row.label) ? "text-green-700" : "text-gray-900"}`}>
                      {fmt(row.current)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">{fmt(row.previous)}</td>
                    <td className="px-5 py-3 text-right">
                      {change !== null && row.current !== 0 && (
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? "text-green-600" : "text-red-500"}`}>
                          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          {Math.abs(parseFloat(change))}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
