import type { ThreeWayMatchRow } from "../../../../lib/types";
import { formatMoney, formatNumber } from "../../../../lib/format";
import { Section } from "./Section";
import { MatchResultBadge } from "./StatusBadge";

interface ThreeWayMatchProps {
  rows: ThreeWayMatchRow[];
  currency: string;
}

export function ThreeWayMatch({ rows, currency }: ThreeWayMatchProps) {
  return (
    <Section
      title="3-way match summary"
      description="PO ↔ GRN ↔ Invoice reconciliation per line"
    >
      {rows.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing to match yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Line</th>
                <th className="py-2 pr-3 text-right font-medium">Ordered</th>
                <th className="py-2 pr-3 text-right font-medium">Received</th>
                <th className="py-2 pr-3 text-right font-medium">Invoiced</th>
                <th className="py-2 pr-3 text-right font-medium">Qty Δ</th>
                <th className="py-2 pr-3 text-right font-medium">Price PO</th>
                <th className="py-2 pr-3 text-right font-medium">Price Inv</th>
                <th className="py-2 pr-3 text-right font-medium">Price Δ</th>
                <th className="py-2 font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.lineNo} className="text-slate-800">
                  <td className="py-2 pr-3 tabular-nums">{r.lineNo}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(r.qtyOrdered)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(r.qtyReceived)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(r.qtyInvoiced)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatNumber(r.qtyVariance)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatMoney(r.priceOrdered, currency)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatMoney(r.priceInvoiced, currency)}
                  </td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    {formatMoney(r.priceVariance, currency)}
                  </td>
                  <td className="py-2">
                    <MatchResultBadge result={r.result} />
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
