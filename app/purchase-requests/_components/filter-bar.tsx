"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "./use-debounce";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  type NamedOption,
  type PrFilters,
  type PrStatus,
} from "./types";
import { filtersFromQuery, filtersToQuery, isEmptyFilters } from "./url-state";
import { StatusMultiSelect } from "./status-multiselect";
import { RequesterTypeahead } from "./requester-typeahead";

const SEARCH_DEBOUNCE_MS = 300;

export interface PrFilterBarProps {
  requesters: NamedOption[];
  plants: NamedOption[];
  onChange?: (filters: PrFilters) => void;
}

export function PrFilterBar({ requesters, plants, onChange }: PrFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initial = useMemo(
    () => filtersFromQuery(new URLSearchParams(searchParams?.toString() ?? "")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [searchInput, setSearchInput] = useState(initial.q);
  const [filters, setFilters] = useState<PrFilters>(initial);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setFilters((f) => (f.q === debouncedSearch ? f : { ...f, q: debouncedSearch }));
  }, [debouncedSearch]);

  const lastUrlRef = useRef<string>(searchParams?.toString() ?? "");

  useEffect(() => {
    const next = filtersToQuery(
      filters,
      new URLSearchParams(searchParams?.toString() ?? "")
    ).toString();
    if (next === lastUrlRef.current) return;
    lastUrlRef.current = next;
    const url = next ? `${pathname}?${next}` : pathname;
    router.replace(url, { scroll: false });
    onChange?.(filters);
  }, [filters, pathname, router, searchParams, onChange]);

  const update = useCallback(
    <K extends keyof PrFilters>(key: K, value: PrFilters[K]) =>
      setFilters((f) => ({ ...f, [key]: value })),
    []
  );

  const reset = () => {
    setSearchInput("");
    setFilters(EMPTY_FILTERS);
  };

  const activeCount = countActiveFilters(filters);

  return (
    <div
      role="search"
      aria-label="Purchase request filters"
      data-testid="pr-filter-bar"
      className="flex flex-wrap items-end gap-2 rounded-lg border bg-card p-3"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="pr-search" className="text-xs text-muted-foreground">
          Search by
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="pr-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="PR id, title, supplier…"
            className="h-9 w-64 pl-7 text-sm"
            aria-label="Search by"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Status</span>
        <StatusMultiSelect
          value={filters.status}
          onChange={(v) => update("status", v as PrStatus[])}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pr-requester" className="text-xs text-muted-foreground">
          Requester
        </label>
        <RequesterTypeahead
          value={filters.requester}
          options={requesters}
          onChange={(v) => update("requester", v)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pr-plant" className="text-xs text-muted-foreground">
          Plant
        </label>
        <select
          id="pr-plant"
          value={filters.plant}
          onChange={(e) => update("plant", e.target.value)}
          aria-label="Plant"
          className={cn(
            "h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-sm",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          )}
        >
          <option value="">All plants</option>
          {plants.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Date range</span>
        <div className="flex items-center gap-1">
          <Input
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => update("from", e.target.value)}
            aria-label="From date"
            className="h-9 w-40 text-sm"
          />
          <span aria-hidden="true" className="text-xs text-muted-foreground">
            –
          </span>
          <Input
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => update("to", e.target.value)}
            aria-label="To date"
            className="h-9 w-40 text-sm"
          />
        </div>
      </div>

      <div className="ml-auto flex items-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 gap-1"
          onClick={reset}
          disabled={isEmptyFilters(filters) && !searchInput}
          aria-label="Reset filters"
        >
          <X className="h-3.5 w-3.5" />
          Reset{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>
      </div>
    </div>
  );
}
