import { RfqStatusBadge } from "@procurement/components/status-badge";
import type { Rfq } from "@procurement/types";
import { relativeDeadline, rfqCategory } from "@procurement/lib/rfq-list";
import { cn } from "@/lib/utils";

export function RfqTable({ rows, now }: { rows: Rfq[]; now?: Date }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm" data-testid="rfq-list-table">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">RFQ #</th>
            <th scope="col" className="px-3 py-2 font-medium">Title</th>
            <th scope="col" className="px-3 py-2 font-medium">Category</th>
            <th scope="col" className="px-3 py-2 font-medium text-right">Suppliers</th>
            <th scope="col" className="px-3 py-2 font-medium">Status</th>
            <th scope="col" className="px-3 py-2 font-medium">Deadline</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                No RFQs match the current filters.
              </td>
            </tr>
          ) : (
            rows.map((r) => {
              const dl = relativeDeadline(r.dueDate, now);
              return (
                <tr key={r.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-xs">{r.number}</td>
                  <td className="px-3 py-2">{r.title}</td>
                  <td className="px-3 py-2">{rfqCategory(r)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {r.invitedVendorIds.length}
                  </td>
                  <td className="px-3 py-2">
                    <RfqStatusBadge status={r.status} />
                  </td>
                  <td
                    className={cn(
                      "px-3 py-2",
                      dl.tone === "past" && "text-rose-700 dark:text-rose-400",
                      dl.tone === "soon" && "text-amber-700 dark:text-amber-400"
                    )}
                    title={new Date(r.dueDate).toISOString()}
                  >
                    {dl.label}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
