import { http, HttpResponse } from "msw";
import {
  MOCK_PURCHASE_REQUESTS,
  TAB_TO_STATUSES,
  type PrStatus,
  type PrTab,
  type PurchaseRequest,
} from "./data/purchase-requests";

const VALID_TABS: PrTab[] = [
  "all",
  "draft",
  "pending",
  "rework",
  "clarification",
];

const VALID_STATUSES: PrStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "UNDER_REWORK",
  "NEEDS_CLARIFICATION",
  "APPROVED",
  "REJECTED",
];

export interface PurchaseRequestListResponse {
  items: PurchaseRequest[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function parseInteger(raw: string | null, fallback: number, min = 1): number {
  if (raw === null) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < min) return fallback;
  return n;
}

function tabFromParam(raw: string | null): PrTab {
  if (raw && (VALID_TABS as string[]).includes(raw)) return raw as PrTab;
  return "all";
}

function statusesFromParam(raw: string | null): PrStatus[] | null {
  if (!raw) return null;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as PrStatus[];
  const filtered = list.filter((s) => (VALID_STATUSES as string[]).includes(s));
  return filtered.length ? filtered : null;
}

export function filterAndPaginate(
  data: PurchaseRequest[],
  url: URL
): PurchaseRequestListResponse {
  const tab = tabFromParam(url.searchParams.get("tab"));
  const explicitStatuses = statusesFromParam(url.searchParams.get("status"));
  const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();
  const page = parseInteger(url.searchParams.get("page"), 1, 1);
  const pageSize = Math.min(
    parseInteger(url.searchParams.get("pageSize"), 20, 1),
    100
  );

  const tabStatuses = TAB_TO_STATUSES[tab];
  const statusFilter = explicitStatuses ?? tabStatuses;

  let items = data;
  if (statusFilter && statusFilter.length) {
    const allowed = new Set(statusFilter);
    items = items.filter((pr) => allowed.has(pr.status));
  }
  if (search) {
    items = items.filter((pr) => {
      const haystack =
        `${pr.number} ${pr.title} ${pr.requester.name} ${pr.plant.name}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  items = [...items].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const total = items.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);

  return {
    items: slice,
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export const handlers = [
  http.get("*/api/purchase-requests", ({ request }) => {
    const url = new URL(request.url);
    const body = filterAndPaginate(MOCK_PURCHASE_REQUESTS, url);
    return HttpResponse.json(body);
  }),
];
