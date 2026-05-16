import type { PoStatus, PurchaseOrder } from "../types";

export const PO_STATUS_LABEL: Record<PoStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  acknowledged: "Acknowledged",
  in_transit: "In Transit",
  received: "Received",
  cancelled: "Cancelled",
};

export const PO_STATUS_COLOR: Record<PoStatus, string> = {
  draft: "bg-gray-100 text-gray-700 ring-gray-200",
  sent: "bg-blue-100 text-blue-700 ring-blue-200",
  acknowledged: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  in_transit: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  received: "bg-green-100 text-green-700 ring-green-200",
  cancelled: "bg-red-100 text-red-700 ring-red-200",
};

export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const DAY_MS = 86_400_000;

function startOfUtcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function formatRelativeDate(dateStr: string, now: Date = new Date()): string {
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return dateStr;
  const days = Math.round((startOfUtcDay(target) - startOfUtcDay(now)) / DAY_MS);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  if (days > 1 && days < 30) return `in ${days} days`;
  if (days < -1 && days > -30) return `${Math.abs(days)} days ago`;
  const months = Math.round(days / 30);
  if (months >= 1) return months === 1 ? "in 1 month" : `in ${months} months`;
  return Math.abs(months) === 1 ? "1 month ago" : `${Math.abs(months)} months ago`;
}

export interface PaginateResult<T> {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export function paginate<T>(items: T[], page: number, pageSize: number): PaginateResult<T> {
  const size = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * size;
  const end = Math.min(start + size, total);
  return {
    rows: items.slice(start, end),
    page: safePage,
    pageSize: size,
    total,
    totalPages,
    startIndex: total === 0 ? 0 : start + 1,
    endIndex: end,
  };
}

export function applyPoFilters(
  rows: PurchaseOrder[],
  filters: { search?: string; status?: PoStatus[] } | undefined,
): PurchaseOrder[] {
  if (!filters) return rows;
  const { search, status } = filters;
  return rows.filter((po) => {
    if (status?.length && !status.includes(po.status)) return false;
    if (search) {
      const q = search.toLowerCase();
      const blob = `${po.poNo} ${po.supplier}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}
