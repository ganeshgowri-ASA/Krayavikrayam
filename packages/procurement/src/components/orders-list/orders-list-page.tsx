"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ensureOrdersWorker } from "../../orders/browser";
import { useOrders } from "../../orders/api";
import type { PoListQuery, PoStatus } from "../../orders/types";

const STATUS_OPTIONS: PoStatus[] = [
  "Draft",
  "Issued",
  "PartiallyReceived",
  "Closed",
  "Cancelled",
];

const PAGE_SIZE = 20;

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export function OrdersListPage() {
  const [workerReady, setWorkerReady] = useState(typeof window === "undefined");
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<PoStatus[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const promise = ensureOrdersWorker();
    if (!promise) {
      setWorkerReady(true);
      return;
    }
    let cancelled = false;
    promise
      .then(() => {
        if (!cancelled) setWorkerReady(true);
      })
      .catch(() => {
        if (!cancelled) setWorkerReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const query = useMemo<PoListQuery>(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: search.trim() || undefined,
      status: statuses.length ? statuses : undefined,
      sort: "-issueDate",
    }),
    [page, search, statuses]
  );

  const { data, isLoading, isError, error } = useOrders(workerReady ? query : undefined);

  const enabled = workerReady;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  function toggleStatus(s: PoStatus) {
    setPage(1);
    setStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mock data served by MSW (KV-E1.6). See{" "}
            <code>docs/discovery/orders-detail.md</code> for the schema.
          </p>
        </div>
      </header>

      <section className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search PO number, supplier, plant…"
          className="h-9 w-72 rounded-md border px-3 text-sm"
        />
        <div className="flex flex-wrap gap-1">
          {STATUS_OPTIONS.map((s) => {
            const active = statuses.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStatus(s)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  active ? "bg-foreground text-background" : "bg-background"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">PO No</th>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Plant</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Match</th>
              <th className="px-3 py-2">Issue date</th>
              <th className="px-3 py-2">Delivery</th>
              <th className="px-3 py-2 text-right">GRNs</th>
              <th className="px-3 py-2 text-right">Invoices</th>
            </tr>
          </thead>
          <tbody>
            {!enabled || isLoading ? (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-red-600">
                  {(error as Error)?.message ?? "Failed to load orders."}
                </td>
              </tr>
            ) : !data || data.items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-6 text-center text-muted-foreground">
                  No purchase orders match the current filters.
                </td>
              </tr>
            ) : (
              data.items.map((po) => (
                <tr key={po.poNo} className="border-t">
                  <td className="px-3 py-2 font-mono">
                    <Link className="underline" href={`/orders/${po.poNo}`}>
                      {po.poNo}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{po.supplier.name}</td>
                  <td className="px-3 py-2">{po.plant.name}</td>
                  <td className="px-3 py-2">
                    {formatMoney(po.value.amount, po.value.currency)}
                  </td>
                  <td className="px-3 py-2">{po.status}</td>
                  <td className="px-3 py-2">{po.matchStatus}</td>
                  <td className="px-3 py-2">{po.issueDate}</td>
                  <td className="px-3 py-2">{po.deliveryDate}</td>
                  <td className="px-3 py-2 text-right">{po.grnCount}</td>
                  <td className="px-3 py-2 text-right">{po.invoiceCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {data && data.total > 0 && (
        <footer className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {(data.page - 1) * data.limit + 1}–
            {Math.min(data.page * data.limit, data.total)} of {data.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>
              Page {data.page} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </footer>
      )}
    </main>
  );
}
