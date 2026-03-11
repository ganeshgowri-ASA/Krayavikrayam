"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, getProbabilityColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Deal, DealStatus } from "@/lib/types";

interface DealsTableProps {
  deals: Deal[];
}

type SortField = "title" | "value" | "probability" | "expectedCloseDate" | "updatedAt" | "status";

export function DealsTable({ deals: initialDeals }: DealsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DealStatus | "ALL">("ALL");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = [...initialDeals];

    if (statusFilter !== "ALL") {
      result = result.filter((d) => d.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.contactName?.toLowerCase().includes(q) ||
          d.accountName?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal == null) aVal = "";
      if (bVal == null) bVal = "";
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return result;
  }, [initialDeals, search, statusFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-[var(--muted-foreground)]">&#x2195;</span>;
    return <span>{sortOrder === "asc" ? "\u2191" : "\u2193"}</span>;
  };

  const statusBadge = (status: DealStatus) => {
    const variant = status === "WON" ? "success" : status === "LOST" ? "danger" : "default";
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-9 rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm w-64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DealStatus | "ALL")}
          className="flex h-9 rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>
        <span className="text-sm text-[var(--muted-foreground)]">
          {filtered.length} deals
        </span>
      </div>
      <div className="rounded-lg border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)]">
            <tr>
              <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("title")}>
                Deal <SortIcon field="title" />
              </th>
              <th className="text-right p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("value")}>
                Value <SortIcon field="value" />
              </th>
              <th className="text-left p-3 font-medium">Contact</th>
              <th className="text-left p-3 font-medium">Stage</th>
              <th className="text-center p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("probability")}>
                Prob. <SortIcon field="probability" />
              </th>
              <th className="text-center p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("status")}>
                Status <SortIcon field="status" />
              </th>
              <th className="text-left p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("expectedCloseDate")}>
                Close Date <SortIcon field="expectedCloseDate" />
              </th>
              <th className="text-left p-3 font-medium">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((deal) => (
              <tr
                key={deal.id}
                className="hover:bg-[var(--muted)] transition-colors"
              >
                <td className="p-3">
                  <Link
                    href={`/dashboard/deals/${deal.id}`}
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    {deal.title}
                  </Link>
                  {deal.accountName && (
                    <p className="text-xs text-[var(--muted-foreground)]">{deal.accountName}</p>
                  )}
                </td>
                <td className="p-3 text-right font-medium">
                  {formatCurrency(deal.value, deal.currency)}
                </td>
                <td className="p-3 text-[var(--muted-foreground)]">
                  {deal.contactName || "-"}
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: deal.stage?.color }}
                    />
                    {deal.stage?.name || "-"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span
                    className="inline-block h-2 w-2 rounded-full mr-1"
                    style={{ backgroundColor: getProbabilityColor(deal.probability) }}
                  />
                  {deal.probability}%
                </td>
                <td className="p-3 text-center">{statusBadge(deal.status)}</td>
                <td className="p-3 text-[var(--muted-foreground)]">
                  {deal.expectedCloseDate
                    ? formatDate(deal.expectedCloseDate)
                    : "-"}
                </td>
                <td className="p-3 text-[var(--muted-foreground)]">
                  {deal.ownerName || "-"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[var(--muted-foreground)]">
                  No deals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
