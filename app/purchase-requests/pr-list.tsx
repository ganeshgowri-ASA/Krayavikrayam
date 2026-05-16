"use client";

import { useMemo, useState } from "react";
import {
  usePurchaseRequests,
  type PrTab,
} from "@/lib/api/purchase-requests";

const TABS: { value: PrTab; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending for approval" },
  { value: "rework", label: "Under rework" },
  { value: "clarification", label: "Need clarification" },
  { value: "all", label: "All" },
];

const PAGE_SIZE = 10;
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function PurchaseRequestList() {
  const [tab, setTab] = useState<PrTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({ tab, search: search.trim() || undefined, page, pageSize: PAGE_SIZE }),
    [tab, search, page]
  );

  const { data, isLoading, isError, isFetching } = usePurchaseRequests(params);

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Purchase request status tabs"
        className="flex flex-wrap gap-2 border-b"
      >
        {TABS.map((t) => {
          const active = t.value === tab;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => {
                setTab(t.value);
                setPage(1);
              }}
              className={`px-3 py-2 text-sm transition-colors border-b-2 -mb-px ${
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="search"
          aria-label="Search purchase requests"
          placeholder="Search by number, title, requester or plant"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-sm rounded-md border bg-background px-3 py-2 text-sm"
        />
        {isFetching ? (
          <span className="text-xs text-muted-foreground">Loading…</span>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Number</th>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Requester</th>
              <th className="px-3 py-2 font-medium">Plant</th>
              <th className="px-3 py-2 font-medium text-right">Amount</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={7}>
                  Loading purchase requests…
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td className="px-3 py-6 text-center text-destructive" colSpan={7}>
                  Failed to load purchase requests.
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((pr) => (
                <tr key={pr.id} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{pr.number}</td>
                  <td className="px-3 py-2">{pr.title}</td>
                  <td className="px-3 py-2">{pr.requester.name}</td>
                  <td className="px-3 py-2">{pr.plant.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {INR.format(pr.amount)}
                  </td>
                  <td className="px-3 py-2">{pr.status.replace(/_/g, " ")}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {new Date(pr.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={7}>
                  No purchase requests match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {data.page} of {data.totalPages} · {data.total} total
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={data.page <= 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={data.page >= data.totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
