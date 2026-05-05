"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Rfq, RfqFilters, RfqStatus } from "../../types";
import { useRfqs } from "../../api/client";
import { useSavedViews } from "../../store/saved-views";
import { uniq } from "../../lib/utils";
import { FacetedFilter, type FacetOption } from "./faceted-filter";
import { SavedViewsBar } from "./saved-views";
import { RfqTable } from "./rfq-table";
import { Vendor360Drawer } from "../vendor-360-drawer";
import { OfferVersionDiffModal } from "../offer-version-diff-modal";
import { QueryThreadDrawer } from "../query-thread-drawer";

const STATUS_OPTIONS: FacetOption[] = (
  ["draft", "published", "in_review", "awarded", "cancelled", "closed"] as RfqStatus[]
).map((s) => ({ value: s, label: s.replace("_", " ") }));

export function RfqListPage() {
  const { activeViewId, views } = useSavedViews();
  const initial = views.find((v) => v.id === activeViewId)?.filters ?? {};
  const [filters, setFilters] = useState<RfqFilters>(initial);
  const [search, setSearch] = useState("");

  const merged: RfqFilters = useMemo(
    () => ({ ...filters, search: search || undefined }),
    [filters, search]
  );

  const { data: rows = [], isLoading } = useRfqs(merged);

  const buyerOptions: FacetOption[] = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach((r) => seen.set(r.buyer.id, r.buyer.name));
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [rows]);

  const countryOptions: FacetOption[] = useMemo(
    () =>
      uniq(rows.map((r) => r.plant.country))
        .sort()
        .map((c) => ({ value: c, label: c })),
    [rows]
  );
  const plantOptions: FacetOption[] = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach((r) => seen.set(r.plant.id, r.plant.name));
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [rows]);
  const materialOptions: FacetOption[] = useMemo(
    () =>
      uniq(rows.flatMap((r) => r.materialCodes))
        .sort()
        .map((c) => ({ value: c, label: c })),
    [rows]
  );

  const set = <K extends keyof RfqFilters>(key: K, value: RfqFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const reset = () => {
    setFilters({});
    setSearch("");
  };

  const [vendorId, setVendorId] = useState<string | null>(null);
  const [offerCtx, setOfferCtx] = useState<{ rfqId: string; vendorId: string } | null>(null);
  const [threadRfqId, setThreadRfqId] = useState<string | null>(null);

  const onRowClick = (r: Rfq) => {
    setVendorId(r.invitedVendorIds[0] ?? null);
  };

  const activeFilterCount =
    (filters.status?.length ?? 0) +
    (filters.buyerId?.length ?? 0) +
    (filters.country?.length ?? 0) +
    (filters.plantId?.length ?? 0) +
    (filters.materialCode?.length ?? 0) +
    (filters.dueDateFrom ? 1 : 0) +
    (filters.dueDateTo ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Request for Quotes</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${rows.length} matching RFQs`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setThreadRfqId("rfq-1")}>
            Open queries
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOfferCtx({ rfqId: "rfq-1", vendorId: "v1" })}
          >
            Compare offers
          </Button>
        </div>
      </header>

      <SavedViewsBar currentFilters={merged} onApply={(f) => setFilters(f)} />

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search RFQ…"
            className="h-8 w-64 pl-7 text-sm"
          />
        </div>
        <FacetedFilter
          title="Status"
          options={STATUS_OPTIONS}
          selected={filters.status ?? []}
          onChange={(v) => set("status", v as RfqStatus[])}
        />
        <FacetedFilter
          title="Buyer"
          options={buyerOptions}
          selected={filters.buyerId ?? []}
          onChange={(v) => set("buyerId", v)}
        />
        <FacetedFilter
          title="Country"
          options={countryOptions}
          selected={filters.country ?? []}
          onChange={(v) => set("country", v)}
        />
        <FacetedFilter
          title="Plant"
          options={plantOptions}
          selected={filters.plantId ?? []}
          onChange={(v) => set("plantId", v)}
        />
        <FacetedFilter
          title="Material"
          options={materialOptions}
          selected={filters.materialCode ?? []}
          onChange={(v) => set("materialCode", v)}
        />

        <label className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          Due
          <Input
            type="date"
            value={filters.dueDateFrom?.slice(0, 10) ?? ""}
            onChange={(e) =>
              set(
                "dueDateFrom",
                e.target.value ? new Date(e.target.value).toISOString() : undefined
              )
            }
            className="h-8 w-36 text-xs"
          />
          –
          <Input
            type="date"
            value={filters.dueDateTo?.slice(0, 10) ?? ""}
            onChange={(e) =>
              set(
                "dueDateTo",
                e.target.value ? new Date(e.target.value).toISOString() : undefined
              )
            }
            className="h-8 w-36 text-xs"
          />
        </label>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className={cn("h-8 gap-1")} onClick={reset}>
            <X className="h-3.5 w-3.5" />
            Reset ({activeFilterCount})
          </Button>
        )}
      </div>

      <RfqTable rows={rows} onRowClick={onRowClick} />

      <Vendor360Drawer
        vendorId={vendorId}
        open={!!vendorId}
        onOpenChange={(o) => !o && setVendorId(null)}
      />
      <OfferVersionDiffModal
        rfqId={offerCtx?.rfqId ?? null}
        vendorId={offerCtx?.vendorId ?? null}
        open={!!offerCtx}
        onOpenChange={(o) => !o && setOfferCtx(null)}
      />
      <QueryThreadDrawer
        rfqId={threadRfqId}
        open={!!threadRfqId}
        onOpenChange={(o) => !o && setThreadRfqId(null)}
      />
    </div>
  );
}
