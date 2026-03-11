"use client";

import { useState } from "react";
import { CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";

type FilingPeriod = "Monthly" | "Quarterly";

const gstSummary = {
  inputTaxCredit: 342500,
  outputTax: 498750,
  netPayable: 156250,
};

const gstFilings = [
  { period: "Feb 2026", dueDate: "2026-03-20", status: "Filed", itc: 318000, output: 462000, netPayable: 144000 },
  { period: "Jan 2026", dueDate: "2026-02-20", status: "Filed", itc: 294000, output: 425000, netPayable: 131000 },
  { period: "Dec 2025", dueDate: "2026-01-20", status: "Filed", itc: 275000, output: 398000, netPayable: 123000 },
  { period: "Nov 2025", dueDate: "2025-12-20", status: "Filed", itc: 260000, output: 381000, netPayable: 121000 },
  { period: "Oct 2025", dueDate: "2025-11-20", status: "Filed", itc: 243000, output: 356000, netPayable: 113000 },
];

const tdsDeductions = [
  { id: "TDS001", date: "2026-03-07", party: "Ravi Sharma (Contractor)", section: "194C", tdsRate: "2%", grossAmt: 250000, tdsAmt: 5000, status: "Deposited" },
  { id: "TDS002", date: "2026-03-07", party: "Techplus Solutions", section: "194J", tdsRate: "10%", grossAmt: 180000, tdsAmt: 18000, status: "Deposited" },
  { id: "TDS003", date: "2026-03-05", party: "Anita Rent (Landlord)", section: "194I", tdsRate: "10%", grossAmt: 45000, tdsAmt: 4500, status: "Deposited" },
  { id: "TDS004", date: "2026-03-01", party: "Priya Digital Marketing", section: "194C", tdsRate: "2%", grossAmt: 35000, tdsAmt: 700, status: "Pending" },
  { id: "TDS005", date: "2026-02-28", party: "Infosys Ltd (Professional Svc)", section: "194J", tdsRate: "10%", grossAmt: 120000, tdsAmt: 12000, status: "Deposited" },
];

const creditNotes = [
  { id: "CN-001", date: "2026-03-08", issuedTo: "Ramesh Enterprises", reason: "Product Return", originalInvoice: "INV-2026-031", creditAmt: 32500, status: "Applied" },
  { id: "CN-002", date: "2026-03-05", issuedTo: "Priya Tech Solutions", reason: "Billing Error", originalInvoice: "INV-2026-028", creditAmt: 15000, status: "Pending" },
  { id: "CN-003", date: "2026-02-22", issuedTo: "Arjun Logistics", reason: "Discount Adjustment", originalInvoice: "INV-2026-020", creditAmt: 8750, status: "Applied" },
  { id: "CN-004", date: "2026-02-15", issuedTo: "Suresh Nagar Tech", reason: "Service Shortfall", originalInvoice: "INV-2026-015", creditAmt: 22000, status: "Applied" },
];

export default function TaxCreditsPage() {
  const [filingPeriod, setFilingPeriod] = useState<FilingPeriod>("Monthly");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax & Credits</h1>
        <p className="text-sm text-gray-500 mt-0.5">GST, TDS deductions, and credit notes</p>
      </div>

      {/* GST Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">GST Summary — March 2026</h2>
          <div className="flex items-center gap-2">
            {(["Monthly", "Quarterly"] as FilingPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setFilingPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filingPeriod === p ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wider mb-1">Input Tax Credit (ITC)</p>
            <p className="text-2xl font-bold text-green-700">₹{gstSummary.inputTaxCredit.toLocaleString("en-IN")}</p>
            <p className="text-xs text-green-600 mt-1">Available for offset</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-xs font-medium text-orange-600 uppercase tracking-wider mb-1">Output Tax</p>
            <p className="text-2xl font-bold text-orange-700">₹{gstSummary.outputTax.toLocaleString("en-IN")}</p>
            <p className="text-xs text-orange-600 mt-1">Collected from customers</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">Net GST Payable</p>
            <p className="text-2xl font-bold text-red-700">₹{gstSummary.netPayable.toLocaleString("en-IN")}</p>
            <p className="text-xs text-red-600 mt-1">Due by 20 April 2026</p>
          </div>
        </div>
      </div>

      {/* GST Filing History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">GST Filing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Period</th>
                <th className="text-left px-5 py-3 font-medium">Due Date</th>
                <th className="text-right px-5 py-3 font-medium">ITC (₹)</th>
                <th className="text-right px-5 py-3 font-medium">Output Tax (₹)</th>
                <th className="text-right px-5 py-3 font-medium">Net Payable (₹)</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gstFilings.map((row) => (
                <tr key={row.period} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{row.period}</td>
                  <td className="px-5 py-3 text-gray-500">{row.dueDate}</td>
                  <td className="px-5 py-3 text-right text-green-600">{row.itc.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-right text-orange-600">{row.output.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-right font-semibold text-red-600">{row.netPayable.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TDS Deductions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">TDS Deductions</h2>
          <span className="text-xs text-gray-500">March 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Party</th>
                <th className="text-left px-5 py-3 font-medium">Section</th>
                <th className="text-right px-5 py-3 font-medium">Gross Amt (₹)</th>
                <th className="text-right px-5 py-3 font-medium">TDS Rate</th>
                <th className="text-right px-5 py-3 font-medium">TDS Amt (₹)</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tdsDeductions.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500">{row.date}</td>
                  <td className="px-5 py-3 text-gray-900">{row.party}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {row.section}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-gray-700">{row.grossAmt.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3 text-right text-gray-500">{row.tdsRate}</td>
                  <td className="px-5 py-3 text-right font-semibold text-red-600">{row.tdsAmt.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    {row.status === "Deposited" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />{row.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                        <Clock className="h-3 w-3" />{row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Notes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Tax Credit Notes Issued</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            New Credit Note
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Credit Note #</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Issued To</th>
                <th className="text-left px-5 py-3 font-medium">Reason</th>
                <th className="text-left px-5 py-3 font-medium">Original Invoice</th>
                <th className="text-right px-5 py-3 font-medium">Credit Amount (₹)</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {creditNotes.map((cn) => (
                <tr key={cn.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-blue-600">{cn.id}</td>
                  <td className="px-5 py-3 text-gray-500">{cn.date}</td>
                  <td className="px-5 py-3 text-gray-900">{cn.issuedTo}</td>
                  <td className="px-5 py-3 text-gray-600">{cn.reason}</td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">{cn.originalInvoice}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-900">{cn.creditAmt.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      cn.status === "Applied" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {cn.status}
                    </span>
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
