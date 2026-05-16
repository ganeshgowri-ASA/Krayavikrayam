import type { Rfq, RfqStatus } from "../types";

export interface RfqListFilters {
  status?: RfqStatus[];
  category?: string[];
  search?: string;
}

export interface RfqListSearchParams {
  page?: string | string[];
  pageSize?: string | string[];
  status?: string | string[];
  category?: string | string[];
  q?: string | string[];
}

export interface PaginatedResult<T> {
  rows: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  start: number;
  end: number;
}

export const RFQ_LIST_DEFAULT_PAGE_SIZE = 20;
export const RFQ_LIST_MAX_PAGE_SIZE = 100;
export const RFQ_LIST_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function paramList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v) => v.split(",")).filter(Boolean);
  }
  if (typeof value === "string" && value.length > 0) {
    return value.split(",").filter(Boolean);
  }
  return [];
}

export function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number
): number {
  const raw = firstParam(value);
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const VALID_STATUSES: ReadonlySet<RfqStatus> = new Set<RfqStatus>([
  "draft",
  "published",
  "in_review",
  "awarded",
  "cancelled",
  "closed",
]);

export function parseRfqListFilters(params: RfqListSearchParams): RfqListFilters {
  const statuses = paramList(params.status).filter((s): s is RfqStatus =>
    VALID_STATUSES.has(s as RfqStatus)
  );
  const categories = paramList(params.category);
  const search = firstParam(params.q)?.trim();
  return {
    status: statuses.length ? statuses : undefined,
    category: categories.length ? categories : undefined,
    search: search ? search : undefined,
  };
}

export function rfqCategory(rfq: Rfq): string {
  return rfq.lineItems[0]?.material.category ?? "—";
}

export function applyRfqListFilters(rfqs: Rfq[], f: RfqListFilters): Rfq[] {
  if (!f.status && !f.category && !f.search) return rfqs;
  const q = f.search?.toLowerCase();
  return rfqs.filter((r) => {
    if (f.status && !f.status.includes(r.status)) return false;
    if (f.category && !f.category.includes(rfqCategory(r))) return false;
    if (q) {
      const blob = `${r.number} ${r.title}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

export function paginate<T>(rows: T[], page: number, pageSize: number): PaginatedResult<T> {
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * pageSize;
  const slice = rows.slice(start, start + pageSize);
  return {
    rows: slice,
    page: clampedPage,
    pageSize,
    total,
    totalPages,
    start,
    end: Math.min(start + pageSize, total),
  };
}

export interface RelativeDeadline {
  label: string;
  tone: "past" | "soon" | "future";
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export function relativeDeadline(due: string, now: Date = new Date()): RelativeDeadline {
  const diffMs = new Date(due).getTime() - now.getTime();
  const days = Math.round(diffMs / DAY_MS);
  const hours = Math.round(diffMs / HOUR_MS);
  const tone: RelativeDeadline["tone"] =
    diffMs < 0 ? "past" : diffMs < 2 * DAY_MS ? "soon" : "future";

  if (diffMs < 0) {
    const absDays = Math.abs(days);
    if (absDays === 0) {
      const absHours = Math.max(1, Math.abs(hours));
      return { label: `${absHours}h ago`, tone };
    }
    if (absDays === 1) return { label: "yesterday", tone };
    return { label: `${absDays} days ago`, tone };
  }
  if (days === 0) {
    const fwdHours = Math.max(1, hours);
    return { label: `in ${fwdHours}h`, tone };
  }
  if (days === 1) return { label: "tomorrow", tone };
  return { label: `in ${days} days`, tone };
}

export function buildRfqListQuery(
  params: Record<string, string | number | string[] | undefined | null>
): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      sp.set(k, v.join(","));
    } else {
      sp.set(k, String(v));
    }
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function uniqCategories(rfqs: Rfq[]): string[] {
  const set = new Set<string>();
  for (const r of rfqs) set.add(rfqCategory(r));
  return Array.from(set).filter((c) => c !== "—").sort();
}
