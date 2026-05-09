import type { POLine } from "../../../../lib/types";
import { formatDate, formatMoney, formatNumber } from "../../../../lib/format";
import { Section } from "./Section";

interface POLinesProps {
  lines: POLine[];
  currency: string;
}

export function POLines({ lines, currency }: POLinesProps) {
  return (
    <Section title="Lines" description={`${lines.length} line item(s)`}>
      {lines.length === 0 ? (
        <p className="text-sm text-slate-500">No lines on this PO.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">#</th>
                <th className="py-2 pr-3 font-medium">Item</th>
                <th className="py-2 pr-3 font-medium">UOM</th>
                <th className="py-2 pr-3 text-right font-medium">Ordered</th>
                <th className="py-2 pr-3 text-right font-medium">Received</th>
                <th className="py-2 pr-3 text-right font-medium">Invoiced</th>
                <th className="py-2 pr-3 text-right font-medium">Unit price</th>
                <th className="py-2 pr-3 text-right font-medium">Line total</th>
                <th className="py-2 font-medium">Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((l) => (
                <tr key={l.lineNo} className="text-slate-800">
                  <td className="py-2 pr-3 tabular-nums">{l.lineNo}</td>
                  <td className="py-2 pr-3">
                    <div className="font-medium text-slate-900">
                      {l.itemCode}
                    </div>
                    <div className="text-xs text-slate-500">
                      {l.description}
                    </div>
                  </td>
                  <td className="py-2 pr-3">{l.uom}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(l.qtyOrdered)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(l.qtyReceived)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(l.qtyInvoiced)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatMoney(l.unitPrice, currency)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatMoney(l.lineTotal, currency)}
                  </td>
                  <td className="py-2">{formatDate(l.deliveryDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
