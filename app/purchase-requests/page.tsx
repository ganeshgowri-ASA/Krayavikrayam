"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus } from "lucide-react";

type PRStatus = "Draft" | "Pending" | "Rework" | "Clarification";

interface PurchaseRequest {
  id: string;
  title: string;
  requester: string;
  plant: string;
  amount: number;
  status: PRStatus;
  updatedAt: string;
}

const PRS: PurchaseRequest[] = [
  { id: "PR-2026-001", title: "Office laptops Q2 refresh", requester: "Asha Rao", plant: "Bangalore", amount: 480000, status: "Draft", updatedAt: "2026-04-14" },
  { id: "PR-2026-002", title: "Welding consumables", requester: "Manoj Kumar", plant: "Chennai", amount: 92000, status: "Pending", updatedAt: "2026-04-22" },
  { id: "PR-2026-003", title: "HVAC spares for Bay 3", requester: "Priya Iyer", plant: "Pune", amount: 156000, status: "Pending", updatedAt: "2026-04-30" },
  { id: "PR-2026-004", title: "Marketing print collateral", requester: "Rohit Shah", plant: "Mumbai", amount: 45000, status: "Rework", updatedAt: "2026-05-01" },
  { id: "PR-2026-005", title: "Hydraulic press maintenance", requester: "Vinay Reddy", plant: "Hyderabad", amount: 215000, status: "Clarification", updatedAt: "2026-05-02" },
  { id: "PR-2026-006", title: "Pantry consumables monthly", requester: "Asha Rao", plant: "Bangalore", amount: 18000, status: "Draft", updatedAt: "2026-05-05" },
  { id: "PR-2026-007", title: "DG set diesel refill", requester: "Manoj Kumar", plant: "Chennai", amount: 60000, status: "Pending", updatedAt: "2026-05-06" },
  { id: "PR-2026-008", title: "Workstation chairs replacement", requester: "Sneha Patel", plant: "Ahmedabad", amount: 132000, status: "Rework", updatedAt: "2026-05-07" },
];

const TABS = [
  { value: "draft", label: "Draft", status: "Draft" as PRStatus },
  { value: "pending", label: "Pending for approval", status: "Pending" as PRStatus },
  { value: "rework", label: "Under rework", status: "Rework" as PRStatus },
  { value: "clarification", label: "Need clarification", status: "Clarification" as PRStatus },
  { value: "all", label: "All", status: null },
] as const;

const STATUS_CLASS: Record<PRStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Pending: "bg-blue-100 text-blue-700",
  Rework: "bg-orange-100 text-orange-700",
  Clarification: "bg-purple-100 text-purple-700",
};

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function PurchaseRequestsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") ?? "draft";
  const qParam = searchParams.get("q") ?? "";

  const activeTab = TABS.find((t) => t.value === tabParam)?.value ?? "draft";

  const [searchInput, setSearchInput] = useState(qParam);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  useEffect(() => {
    if (searchInput === qParam) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) {
        params.set("q", searchInput);
      } else {
        params.delete("q");
      }
      router.replace(`/purchase-requests?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, qParam, router, searchParams]);

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/purchase-requests?${params.toString()}`, { scroll: false });
  };

  const visibleRows = useMemo(() => {
    const tab = TABS.find((t) => t.value === activeTab);
    const byTab = tab && tab.status ? PRS.filter((r) => r.status === tab.status) : PRS;
    const q = qParam.trim().toLowerCase();
    if (!q) return byTab;
    return byTab.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.requester.toLowerCase().includes(q) ||
        r.plant.toLowerCase().includes(q),
    );
  }, [activeTab, qParam]);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Purchase Requests</h1>
            <p className="text-sm text-muted-foreground">Review and act on purchase requests across plants.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Create PR
          </button>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="pr-search" className="sr-only">
            Search by
          </label>
          <div className="relative w-full max-w-md">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="pr-search"
              type="search"
              placeholder="Search by title, id, requester or plant"
              aria-label="Search by"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div role="tablist" aria-label="Purchase request status" className="inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1">
          {TABS.map((tab) => {
            const selected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="pr-tabpanel"
                id={`tab-${tab.value}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(tab.value)}
                className={
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                  (selected ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <section
          role="tabpanel"
          id="pr-tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="rounded-lg border bg-card"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="pr-table">
              <caption className="sr-only">Purchase requests</caption>
              <thead className="border-b bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3">ID</th>
                  <th scope="col" className="px-4 py-3">Title</th>
                  <th scope="col" className="px-4 py-3">Requester</th>
                  <th scope="col" className="px-4 py-3">Plant</th>
                  <th scope="col" className="px-4 py-3 text-right">Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      No purchase requests match the current filters.
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row) => (
                    <tr key={row.id} className="border-b last:border-0" data-testid="pr-row">
                      <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                      <td className="px-4 py-3">{row.title}</td>
                      <td className="px-4 py-3">{row.requester}</td>
                      <td className="px-4 py-3">{row.plant}</td>
                      <td className="px-4 py-3 text-right">{formatINR(row.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " + STATUS_CLASS[row.status]}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.updatedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t px-4 py-2 text-xs text-muted-foreground" aria-live="polite">
            Showing {visibleRows.length} of {PRS.length} purchase requests
          </div>
        </section>
      </div>
    </main>
  );
}

export default function PurchaseRequestsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <PurchaseRequestsView />
    </Suspense>
  );
}
