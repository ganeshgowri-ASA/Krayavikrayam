"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { RfqStatus } from "@procurement/types";
import { buildRfqListQuery } from "@procurement/lib/rfq-list";

const STATUS_OPTIONS: { value: RfqStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "in_review", label: "In Review" },
  { value: "awarded", label: "Awarded" },
  { value: "cancelled", label: "Cancelled" },
  { value: "closed", label: "Closed" },
];

export function RfqFilters({
  categories,
  pageSize,
}: {
  categories: string[];
  pageSize: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = useMemo(
    () => ({
      status: params.get("status") ?? "",
      category: params.get("category") ?? "",
      q: params.get("q") ?? "",
    }),
    [params]
  );

  const push = useCallback(
    (overrides: Record<string, string | number | undefined | null>) => {
      const merged: Record<string, string | number | undefined | null> = {
        status: current.status || undefined,
        category: current.category || undefined,
        q: current.q || undefined,
        pageSize,
        page: 1,
        ...overrides,
      };
      const qs = buildRfqListQuery(merged);
      startTransition(() => router.push(`/rfqs${qs}`));
    },
    [current, pageSize, router]
  );

  const reset = () => {
    startTransition(() => router.push(`/rfqs${buildRfqListQuery({ pageSize })}`));
  };

  const hasFilters = !!(current.status || current.category || current.q);

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3"
      data-testid="rfq-list-filters"
      data-pending={pending ? "true" : "false"}
    >
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        Search
        <input
          type="search"
          defaultValue={current.q}
          placeholder="RFQ # or title…"
          className="h-8 w-56 rounded-md border bg-background px-2 text-sm text-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              push({ q: (e.target as HTMLInputElement).value || undefined });
            }
          }}
          onBlur={(e) => {
            if (e.target.value !== current.q) {
              push({ q: e.target.value || undefined });
            }
          }}
        />
      </label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        Status
        <select
          value={current.status}
          onChange={(e) => push({ status: e.target.value || undefined })}
          className="h-8 rounded-md border bg-background px-2 text-sm text-foreground"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        Category
        <select
          value={current.category}
          onChange={(e) => push({ category: e.target.value || undefined })}
          className="h-8 rounded-md border bg-background px-2 text-sm text-foreground"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      {hasFilters && (
        <button
          type="button"
          onClick={reset}
          className="h-8 rounded-md border bg-background px-3 text-sm hover:bg-accent"
        >
          Reset
        </button>
      )}
    </div>
  );
}
