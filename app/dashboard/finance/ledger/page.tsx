"use client";

import { useState } from "react";
import { Download, Search, Filter } from "lucide-react";

type AccountType = "All" | "Revenue" | "Expenses" | "Assets" | "Liabilities" | "Equity";

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  accountType: AccountType;
  debit: number;
  credit: number;
  balance: number;
}

const allEntries: LedgerEntry[] = [
  { id: "L001", date: "2026-03-01", description: "Opening Balance", account: "Cash & Bank", accountType: "Assets", debit: 0, credit: 0, balance: 750000 },
  { id: "L002", date: "2026-03-01", description: "Office Rent — March 2026", account: "Rent", accountType: "Expenses", debit: 45000, credit: 0, balance: 705000 },
  { id: "L003", date: "2026-03-02", description: "Invoice #INV-2026-038 — Suresh Nagar Tech", account: "Revenue", accountType: "Revenue", debit: 0, credit: 185000, balance: 890000 },
  { id: "L004", date: "2026-03-03", description: "AWS Cloud Services — Feb 2026", account: "Software", accountType: "Expenses", debit: 18500, credit: 0, balance: 871500 },
  { id: "L005", date: "2026-03-04", description: "Google Workspace Annual Plan", account: "Software", accountType: "Expenses", debit: 12000, credit: 0, balance: 859500 },
  { id: "L006", date: "2026-03-05", description: "Invoice #INV-2026-039 — Priya Tech Solutions", account: "Revenue", accountType: "Revenue", debit: 0, credit: 280000, balance: 1139500 },
  { id: "L007", date: "2026-03-06", description: "Marketing Campaign — Facebook Ads", account: "Marketing", accountType: "Expenses", debit: 35000, credit: 0, balance: 1104500 },
  { id: "L008", date: "2026-03-07", description: "Salary Disbursement — Feb 2026", account: "Salaries", accountType: "Expenses", debit: 620000, credit: 0, balance: 484500 },
  { id: "L009", date: "2026-03-08", description: "TDS Deposit — Feb 2026 (Challan)", account: "TDS Payable", accountType: "Liabilities", debit: 42000, credit: 0, balance: 442500 },
  { id: "L010", date: "2026-03-08", description: "Invoice #INV-2026-040 — Arjun Logistics", account: "Revenue", accountType: "Revenue", debit: 0, credit: 95000, balance: 537500 },
  { id: "L011", date: "2026-03-09", description: "Vendor Payment — Tata Steels", account: "Accounts Payable", accountType: "Liabilities", debit: 124000, credit: 0, balance: 413500 },
  { id: "L012", date: "2026-03-09", description: "Electricity Bill — Feb 2026", account: "Utilities", accountType: "Expenses", debit: 8500, credit: 0, balance: 405000 },
  { id: "L013", date: "2026-03-10", description: "Invoice #INV-2026-041 — Ramesh Enterprises", account: "Revenue", accountType: "Revenue", debit: 0, credit: 125000, balance: 530000 },
  { id: "L014", date: "2026-03-10", description: "Travel Expense — Client Visit Delhi", account: "Travel", accountType: "Expenses", debit: 14500, credit: 0, balance: 515500 },
  { id: "L015", date: "2026-03-11", description: "Loan Repayment — SBI Term Loan (EMI)", account: "Long-term Loans", accountType: "Liabilities", debit: 85000, credit: 0, balance: 430500 },
];

const accountTypes: AccountType[] = ["All", "Revenue", "Expenses", "Assets", "Liabilities", "Equity"];

export default function LedgerPage() {
  const [search, setSearch] = useState("");
  const [accountFilter, setAccountFilter] = useState<AccountType>("All");
  const [fromDate, setFromDate] = useState("2026-03-01");
  const [toDate, setToDate] = useState("2026-03-31");

  const filtered = allEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(search.toLowerCase()) ||
      entry.account.toLowerCase().includes(search.toLowerCase());
    const matchesAccount = accountFilter === "All" || entry.accountType === accountFilter;
    const matchesDate = entry.date >= fromDate && entry.date <= toDate;
    return matchesSearch && matchesAccount && matchesDate;
  });

  const totalDebit = filtered.reduce((s, e) => s + e.debit, 0);
  const totalCredit = filtered.reduce((s, e) => s + e.credit, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Ledger</h1>
          <p className="text-sm text-gray-500 mt-0.5">All transaction entries with running balance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search description or account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Account Type</label>
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value as AccountType)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {accountTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">Total Debit</p>
          <p className="text-xl font-bold text-red-700">₹{totalDebit.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wider mb-1">Total Credit</p>
          <p className="text-xl font-bold text-green-700">₹{totalCredit.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Net Balance</p>
          <p className={`text-xl font-bold ${totalCredit - totalDebit >= 0 ? "text-blue-700" : "text-red-700"}`}>
            ₹{Math.abs(totalCredit - totalDebit).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-left px-4 py-3 font-medium">Account</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-right px-4 py-3 font-medium">Debit (₹)</th>
                <th className="text-right px-4 py-3 font-medium">Credit (₹)</th>
                <th className="text-right px-4 py-3 font-medium">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap font-mono text-xs">{entry.date}</td>
                  <td className="px-4 py-3 text-gray-900 max-w-xs">{entry.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {entry.account}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      entry.accountType === "Revenue" ? "bg-green-100 text-green-700" :
                      entry.accountType === "Expenses" ? "bg-red-100 text-red-700" :
                      entry.accountType === "Assets" ? "bg-blue-100 text-blue-700" :
                      entry.accountType === "Liabilities" ? "bg-orange-100 text-orange-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {entry.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 font-medium">
                    {entry.debit > 0 ? entry.debit.toLocaleString("en-IN") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">
                    {entry.credit > 0 ? entry.credit.toLocaleString("en-IN") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {entry.balance.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
          Showing {filtered.length} of {allEntries.length} entries
        </div>
      </div>
    </div>
  );
}
