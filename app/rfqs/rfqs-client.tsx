"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  RFQ_STATUSES,
  TBE_CATEGORIES,
  type RfqFilters,
  type RfqStatus,
  type TbeCategory,
} from "./types";
import { MOCK_RFQS, applyFilters } from "./data";
import {
  filtersToQueryString,
  isFilterActive,
  parseFiltersFromParams,
} from "./url-filters";

const EMPTY_FILTERS: RfqFilters = { status: [], category: [] };

function MultiSelect<T extends string>({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: readonly T[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (v: T) => {
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
  };
  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 gap-1"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{title}</span>
        {selected.length > 0 && (
          <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-[10px] font-semibold">
            {selected.length}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </Button>
      {open && (
        <div
          role="listbox"
          aria-label={title}
          className="absolute z-30 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((opt) => {
            const checked = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(opt)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                  checked && "bg-accent/60"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-input"
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                {opt}
              </button>
            );
          })}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-sm px-2 py-1.5 text-center text-xs text-muted-foreground hover:bg-accent"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function RfqsClient({ initialFilters }: { initialFilters: RfqFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<RfqFilters>(initialFilters);

  // Re-hydrate from URL on back/forward navigation.
  useEffect(() => {
    setFilters(parseFiltersFromParams(searchParams));
  }, [searchParams]);

  const syncUrl = useCallback(
    (next: RfqFilters) => {
      const qs = filtersToQueryString(next);
      router.replace(qs ? `/rfqs?${qs}` : "/rfqs", { scroll: false });
    },
    [router]
  );

  const update = useCallback(
    (patch: Partial<RfqFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        syncUrl(next);
        return next;
      });
    },
    [syncUrl]
  );

  const reset = () => {
    setFilters(EMPTY_FILTERS);
    syncUrl(EMPTY_FILTERS);
  };

  const rows = useMemo(() => applyFilters(MOCK_RFQS, filters), [filters]);
  const active = isFilterActive(filters);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Request for Quotes</h1>
          <p className="text-sm text-muted-foreground">{rows.length} matching RFQs</p>
        </div>
        <Button size="sm">Create RFQ</Button>
      </header>

      <div
        className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3"
        data-testid="rfq-filters"
      >
        <MultiSelect<RfqStatus>
          title="Status"
          options={RFQ_STATUSES}
          selected={filters.status}
          onChange={(v) => update({ status: v })}
        />
        <MultiSelect<TbeCategory>
          title="Category"
          options={TBE_CATEGORIES}
          selected={filters.category}
          onChange={(v) => update({ category: v })}
        />

        <label className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          Deadline
          <Input
            type="date"
            aria-label="Deadline from"
            value={filters.deadlineFrom ?? ""}
            onChange={(e) => update({ deadlineFrom: e.target.value || undefined })}
            className="h-9 w-40 text-xs"
          />
          <span aria-hidden>–</span>
          <Input
            type="date"
            aria-label="Deadline to"
            value={filters.deadlineTo ?? ""}
            onChange={(e) => update({ deadlineTo: e.target.value || undefined })}
            className="h-9 w-40 text-xs"
          />
        </label>

        {active && (
          <Button variant="ghost" size="sm" className="h-9 gap-1" onClick={reset}>
            <X className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">RFQ #</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-right">Suppliers</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                  No RFQs match the current filters.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{r.rfqNo}</td>
                <td className="px-3 py-2">{r.title}</td>
                <td className="px-3 py-2">{r.category}</td>
                <td className="px-3 py-2 text-right">{r.suppliersCount}</td>
                <td className="px-3 py-2">{r.status}</td>
                <td className="px-3 py-2">{r.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
