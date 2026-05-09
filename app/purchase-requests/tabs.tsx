"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type PurchaseRequestTabId =
  | "draft"
  | "pending"
  | "rework"
  | "clarification"
  | "all";

export interface PurchaseRequestTab {
  id: PurchaseRequestTabId;
  label: string;
  count: number;
}

export const PURCHASE_REQUEST_TABS: readonly PurchaseRequestTab[] = [
  { id: "draft", label: "Draft", count: 0 },
  { id: "pending", label: "Pending for approval", count: 0 },
  { id: "rework", label: "Under rework", count: 0 },
  { id: "clarification", label: "Need clarification", count: 0 },
  { id: "all", label: "All", count: 0 },
] as const;

const DEFAULT_TAB: PurchaseRequestTabId = "all";

function isPurchaseRequestTabId(value: string | null): value is PurchaseRequestTabId {
  return !!value && PURCHASE_REQUEST_TABS.some((t) => t.id === value);
}

export function PurchaseRequestTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const activeTab: PurchaseRequestTabId = isPurchaseRequestTabId(tabFromUrl)
    ? tabFromUrl
    : DEFAULT_TAB;

  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const setTab = React.useCallback(
    (id: PurchaseRequestTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = PURCHASE_REQUEST_TABS.findIndex((t) => t.id === activeTab);
    if (idx < 0) return;
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % PURCHASE_REQUEST_TABS.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + PURCHASE_REQUEST_TABS.length) % PURCHASE_REQUEST_TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = PURCHASE_REQUEST_TABS.length - 1;
    if (nextIdx === null) return;
    e.preventDefault();
    const next = PURCHASE_REQUEST_TABS[nextIdx];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Purchase request status"
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-center gap-1 border-b border-border"
      >
        {PURCHASE_REQUEST_TABS.map((tab) => {
          const selected = tab.id === activeTab;
          const panelId = `pr-tabpanel-${tab.id}`;
          const tabId = `pr-tab-${tab.id}`;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-md",
                selected
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
              )}
            >
              <span>{tab.label}</span>
              <span
                aria-label={`${tab.count} ${tab.label}`}
                className={cn(
                  "inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {PURCHASE_REQUEST_TABS.map((tab) => {
        const selected = tab.id === activeTab;
        const panelId = `pr-tabpanel-${tab.id}`;
        const tabId = `pr-tab-${tab.id}`;
        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
            tabIndex={0}
            className="pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            {selected ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                <p className="text-sm font-medium text-foreground">
                  No {tab.label.toLowerCase()} purchase requests
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  List, filters, and pagination land in KV-C1.3 / KV-C1.4.
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
