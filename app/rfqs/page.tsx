import Link from "next/link";
import { MOCK_RFQS } from "@procurement/api/mock";
import { RfqStatusBadge } from "@procurement/components/status-badge";
import type { Rfq } from "@procurement/types";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "RFQs · Krayavikrayam",
  description: "List of Requests for Quote with status, suppliers and deadline.",
};

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function rfqCategory(rfq: Rfq): string {
  return rfq.lineItems[0]?.material.category ?? "—";
}

function relativeDeadline(due: string, now: Date = new Date()): {
  label: string;
  tone: "past" | "soon" | "future";
} {
  const diffMs = new Date(due).getTime() - now.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.round(diffMs / dayMs);
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  const tone: "past" | "soon" | "future" =
    diffMs < 0 ? "past" : diffMs < dayMs * 2 ? "soon" : "future";

  if (diffMs < 0) {
    const absDays = Math.abs(days);
    if (absDays === 0) return { label: `${Math.abs(hours)}h ago`, tone };
    if (absDays === 1) return { label: "yesterday", tone };
    return { label: `${absDays} days ago`, tone };
  }
  if (days === 0) return { label: `in ${Math.max(hours, 1)}h`, tone };
  if (days === 1) return { label: "tomorrow", tone };
  return { label: `in ${days} days`, tone };
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || v === null) continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default function RfqsPage({
  searchParams,
}: {
  searchParams?: { page?: string; pageSize?: string };
}) {
  const pageSize = Math.min(
    parsePositiveInt(searchParams?.pageSize, DEFAULT_PAGE_SIZE),
    100
  );
  const totalRows = MOCK_RFQS.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const page = Math.min(parsePositiveInt(searchParams?.page, 1), totalPages);

  const start = (page - 1) * pageSize;
  const rows = MOCK_RFQS.slice(start, start + pageSize);
  const lastShown = Math.min(start + pageSize, totalRows);

  const prevHref = `/rfqs${buildQuery({ page: page - 1, pageSize })}`;
  const nextHref = `/rfqs${buildQuery({ page: page + 1, pageSize })}`;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">RFQs</h1>
          <p className="text-sm text-muted-foreground">
            {totalRows} total · showing {start + 1}–{lastShown}
          </p>
        </div>
        <form className="flex items-center gap-2 text-sm" action="/rfqs">
          <label htmlFor="pageSize" className="text-muted-foreground">
            Per page
          </label>
          <select
            id="pageSize"
            name="pageSize"
            defaultValue={pageSize}
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <input type="hidden" name="page" value={1} />
          <button
            type="submit"
            className="h-8 rounded-md border bg-background px-3 text-sm hover:bg-accent"
          >
            Apply
          </button>
        </form>
      </header>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">RFQ #</th>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium text-right">Suppliers</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                  No RFQs to show.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const dl = relativeDeadline(r.dueDate);
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

      <nav
        className="flex items-center justify-between gap-2 text-sm"
        aria-label="Pagination"
      >
        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Link
              href={prevHref}
              className="h-8 rounded-md border bg-background px-3 leading-8 hover:bg-accent"
              rel="prev"
            >
              Previous
            </Link>
          ) : (
            <span className="h-8 rounded-md border bg-background px-3 leading-8 text-muted-foreground opacity-50">
              Previous
            </span>
          )}
          {page < totalPages ? (
            <Link
              href={nextHref}
              className="h-8 rounded-md border bg-background px-3 leading-8 hover:bg-accent"
              rel="next"
            >
              Next
            </Link>
          ) : (
            <span className="h-8 rounded-md border bg-background px-3 leading-8 text-muted-foreground opacity-50">
              Next
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
