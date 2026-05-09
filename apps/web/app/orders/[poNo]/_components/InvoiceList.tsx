import type { Invoice } from "../../../../lib/types";
import { formatDate, formatMoney } from "../../../../lib/format";
import { Section } from "./Section";
import { InvoiceMatchBadge, InvoiceStatusBadge } from "./StatusBadge";

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  return (
    <Section
      title="Invoices"
      description={`${invoices.length} invoice(s) booked`}
    >
      {invoices.length === 0 ? (
        <p className="text-sm text-slate-500">No invoices booked yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Invoice</th>
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Due</th>
                <th className="py-2 pr-3 text-right font-medium">Amount</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium">Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.invoiceNo} className="text-slate-800">
                  <td className="py-2 pr-3 font-medium text-slate-900">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-2 pr-3">{formatDate(inv.invoiceDate)}</td>
                  <td className="py-2 pr-3">{formatDate(inv.dueDate)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatMoney(inv.amount, inv.currency)}
                  </td>
                  <td className="py-2 pr-3">
                    <InvoiceStatusBadge status={inv.status} />
                  </td>
                  <td className="py-2">
                    <InvoiceMatchBadge status={inv.matchStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
