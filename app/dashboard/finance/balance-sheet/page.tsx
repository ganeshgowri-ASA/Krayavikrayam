"use client";

import { CheckCircle, AlertCircle } from "lucide-react";

interface BSItem {
  label: string;
  amount: number;
  indent?: boolean;
  bold?: boolean;
  subheader?: boolean;
}

const currentAssets: BSItem[] = [
  { label: "Current Assets", subheader: true, amount: 0 },
  { label: "Cash & Cash Equivalents", amount: 912500, indent: true },
  { label: "Accounts Receivable", amount: 2340000, indent: true },
  { label: "Inventory", amount: 685000, indent: true },
  { label: "Prepaid Expenses", amount: 124000, indent: true },
  { label: "Total Current Assets", amount: 4061500, bold: true },
];

const fixedAssets: BSItem[] = [
  { label: "Fixed Assets", subheader: true, amount: 0 },
  { label: "Office Equipment", amount: 820000, indent: true },
  { label: "Computers & Hardware", amount: 640000, indent: true },
  { label: "Furniture & Fixtures", amount: 285000, indent: true },
  { label: "Vehicle", amount: 950000, indent: true },
  { label: "Less: Accumulated Depreciation", amount: -390000, indent: true },
  { label: "Total Fixed Assets", amount: 2305000, bold: true },
];

const currentLiabilities: BSItem[] = [
  { label: "Current Liabilities", subheader: true, amount: 0 },
  { label: "Accounts Payable", amount: 845000, indent: true },
  { label: "Short-term Loan (HDFC)", amount: 500000, indent: true },
  { label: "Accrued Salaries", amount: 210000, indent: true },
  { label: "GST Payable", amount: 128500, indent: true },
  { label: "TDS Payable", amount: 42000, indent: true },
  { label: "Total Current Liabilities", amount: 1725500, bold: true },
];

const longTermLiabilities: BSItem[] = [
  { label: "Long-term Liabilities", subheader: true, amount: 0 },
  { label: "Term Loan (SBI)", amount: 1800000, indent: true },
  { label: "Vehicle Loan", amount: 620000, indent: true },
  { label: "Total Long-term Liabilities", amount: 2420000, bold: true },
];

const equityItems: BSItem[] = [
  { label: "Equity", subheader: true, amount: 0 },
  { label: "Owner's Equity / Share Capital", amount: 1500000, indent: true },
  { label: "Retained Earnings", amount: 721000, indent: true },
  { label: "Total Equity", amount: 2221000, bold: true },
];

const totalAssets = 4061500 + 2305000;
const totalLiabilities = 1725500 + 2420000;
const totalEquity = 2221000;
const balanced = totalAssets === totalLiabilities + totalEquity;

function fmt(n: number) {
  if (n === 0) return "";
  const abs = Math.abs(n);
  return (n < 0 ? "−" : "") + "₹" + abs.toLocaleString("en-IN");
}

function BSSection({ title, items, total, color }: { title: string; items: BSItem[]; total: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 ${color}`}>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-50">
          {items.map((item, i) => {
            if (item.subheader) {
              return (
                <tr key={i} className="bg-gray-50">
                  <td colSpan={2} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    {item.label}
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i} className={item.bold ? "bg-gray-50" : "hover:bg-gray-50"}>
                <td className={`px-5 py-2.5 ${item.indent ? "pl-10 text-gray-600" : ""} ${item.bold ? "font-bold text-gray-900" : "text-gray-700"}`}>
                  {item.label}
                </td>
                <td className={`px-5 py-2.5 text-right ${item.bold ? "font-bold text-gray-900" : item.amount < 0 ? "text-red-600" : "text-gray-900"}`}>
                  {fmt(item.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-300 bg-blue-50/50">
            <td className="px-5 py-3 font-bold text-gray-900">Total {title}</td>
            <td className="px-5 py-3 text-right font-bold text-blue-700">₹{total.toLocaleString("en-IN")}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default function BalanceSheetPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-sm text-gray-500 mt-0.5">As of 31 March 2026</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${balanced ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {balanced ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {balanced ? "Balanced" : "Out of Balance"}
        </div>
      </div>

      {/* Balance Check Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wider mb-1">Total Assets</p>
          <p className="text-2xl font-bold text-green-700">₹{totalAssets.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
          <p className="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">Total Liabilities</p>
          <p className="text-2xl font-bold text-red-700">₹{totalLiabilities.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Total Equity</p>
          <p className="text-2xl font-bold text-blue-700">₹{totalEquity.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets Column */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">ASSETS</h2>
          <BSSection title="Current Assets" items={currentAssets} total={4061500} color="bg-green-50" />
          <BSSection title="Fixed Assets" items={fixedAssets} total={2305000} color="bg-emerald-50" />
        </div>

        {/* Liabilities + Equity Column */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">LIABILITIES & EQUITY</h2>
          <BSSection title="Current Liabilities" items={currentLiabilities} total={1725500} color="bg-red-50" />
          <BSSection title="Long-term Liabilities" items={longTermLiabilities} total={2420000} color="bg-orange-50" />
          <BSSection title="Equity" items={equityItems} total={2221000} color="bg-blue-50" />
        </div>
      </div>

      {/* Accounting Equation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-sm text-gray-500 text-center">
          <span className="font-bold text-gray-900">Assets</span> (₹{totalAssets.toLocaleString("en-IN")})
          {" = "}
          <span className="font-bold text-gray-900">Liabilities</span> (₹{totalLiabilities.toLocaleString("en-IN")})
          {" + "}
          <span className="font-bold text-gray-900">Equity</span> (₹{totalEquity.toLocaleString("en-IN")})
          {"  "}
          {balanced ? (
            <span className="text-green-600 font-semibold">✓ Balanced</span>
          ) : (
            <span className="text-red-600 font-semibold">✗ Difference: ₹{Math.abs(totalAssets - totalLiabilities - totalEquity).toLocaleString("en-IN")}</span>
          )}
        </p>
      </div>
    </div>
  );
}
