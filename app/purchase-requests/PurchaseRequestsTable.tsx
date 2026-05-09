"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type {
  PurchaseRequest,
  PurchaseRequestListResponse,
} from "./types";
import { formatINR, formatRelative } from "./utils";
import { PurchaseRequestStatusBadge } from "./PurchaseRequestStatusBadge";

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 10;

const COLUMNS: {
  key: keyof PurchaseRequest | "actions";
  label: string;
  className?: string;
  align?: "left" | "right";
}[] = [
  { key: "id", label: "ID", className: "w-[110px]" },
  { key: "title", label: "Title" },
  { key: "requester", label: "Requester", className: "w-[180px]" },
  { key: "plant", label: "Plant", className: "w-[140px]" },
  { key: "amount", label: "Amount", className: "w-[160px]", align: "right" },
  { key: "status", label: "Status", className: "w-[130px]" },
  { key: "updatedAt", label: "Updated", className: "w-[140px]" },
];

function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function parsePageSize(value: string | null): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_PAGE_SIZE;
  return PAGE_SIZE_OPTIONS.includes(n) ? n : DEFAULT_PAGE_SIZE;
}

export function PurchaseRequestsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const page = parsePage(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));

  const [data, setData] = useState<PurchaseRequestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `/api/purchase-requests?page=${page}&pageSize=${pageSize}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return (await res.json()) as PurchaseRequestListResponse;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  const totalPages = useMemo(() => {
    if (!data || data.total === 0) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  function pushQuery(next: { page?: number; pageSize?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextPage = next.page ?? page;
    const nextPageSize = next.pageSize ?? pageSize;
    params.set("page", String(nextPage));
    params.set("pageSize", String(nextPageSize));
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {COLUMNS.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={cn(
                      "border-b border-border px-3 py-2.5 text-left font-medium",
                      c.align === "right" && "text-right",
                      c.className,
                    )}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonRows pageSize={pageSize} />}

              {!loading && error && (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-3 py-12 text-center text-sm text-rose-600 dark:text-rose-400"
                  >
                    Could not load purchase requests: {error}
                  </td>
                </tr>
              )}

              {!loading && !error && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    className="px-3 py-16 text-center"
                  >
                    <EmptyState />
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                rows.map((r) => (
                  <tr
                    key={r.id}
                    data-testid="pr-row"
                    className="border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                      {r.id}
                    </td>
                    <td className="px-3 py-2.5 font-medium">{r.title}</td>
                    <td className="px-3 py-2.5">{r.requester}</td>
                    <td className="px-3 py-2.5">{r.plant}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatINR(r.amount)}
                    </td>
                    <td className="px-3 py-2.5">
                      <PurchaseRequestStatusBadge status={r.status} />
                    </td>
                    <td
                      className="px-3 py-2.5 text-muted-foreground"
                      title={new Date(r.updatedAt).toLocaleString()}
                    >
                      {formatRelative(r.updatedAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 px-1 sm:flex-row sm:items-center">
        <div className="text-xs text-muted-foreground" data-testid="pr-page-info">
          {loading
            ? "Loading…"
            : total === 0
              ? "0 results"
              : `Showing ${start}–${end} of ${total}`}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Rows per page
            <select
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
              value={pageSize}
              onChange={(e) => pushQuery({ pageSize: Number(e.target.value), page: 1 })}
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => pushQuery({ page: Math.max(1, page - 1) })}
              disabled={loading || page <= 1}
              className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 text-xs text-muted-foreground tabular-nums">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => pushQuery({ page: Math.min(totalPages, page + 1) })}
              disabled={loading || page >= totalPages}
              className="rounded-md border border-border px-3 py-1 text-xs font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonRows({ pageSize }: { pageSize: number }) {
  const rowCount = Math.min(pageSize, 10);
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr
          key={i}
          data-testid="pr-skeleton-row"
          className="border-b border-border last:border-b-0"
        >
          {COLUMNS.map((c, j) => (
            <td key={j} className="px-3 py-3">
              <div
                className={cn(
                  "h-3 animate-pulse rounded bg-muted",
                  c.key === "title" && "w-3/4",
                  c.key === "id" && "w-16",
                  c.key === "amount" && "ml-auto w-20",
                  c.key === "status" && "w-20",
                  c.key === "updatedAt" && "w-14",
                  c.key === "requester" && "w-32",
                  c.key === "plant" && "w-20",
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-center">
      <div className="text-sm font-semibold">No purchase requests</div>
      <p className="text-xs text-muted-foreground">
        There are no purchase requests to show. New requests will appear here as
        they are created.
      </p>
    </div>
  );
}
