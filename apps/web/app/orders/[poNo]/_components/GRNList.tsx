import type { GRN } from "../../../../lib/types";
import { formatDate, formatNumber } from "../../../../lib/format";
import { Section } from "./Section";

export function GRNList({ grns }: { grns: GRN[] }) {
  return (
    <Section title="GRN list" description={`${grns.length} receipt(s)`}>
      {grns.length === 0 ? (
        <p className="text-sm text-slate-500">No GRNs posted yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {grns.map((g) => {
            const totalQty = g.lines.reduce((sum, l) => sum + l.qty, 0);
            return (
              <li key={g.grnNo} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-medium text-slate-900">
                      {g.grnNo}
                    </span>
                    <span className="ml-2 text-xs uppercase tracking-wide text-slate-500">
                      {g.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    Received {formatDate(g.receivedAt)} by {g.receivedBy}
                  </div>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {g.lines.map((l) => (
                    <li key={`${g.grnNo}-${l.lineNo}`}>
                      Line {l.lineNo}:{" "}
                      <span className="tabular-nums">
                        {formatNumber(l.qty)}
                      </span>
                    </li>
                  ))}
                  <li className="text-xs text-slate-500">
                    Total received in this GRN:{" "}
                    <span className="tabular-nums">
                      {formatNumber(totalQty)}
                    </span>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
