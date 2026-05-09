import { http, HttpResponse } from "msw";
import {
  MOCK_PO_GRNS,
  MOCK_PO_INVOICES,
  MOCK_PO_LIST,
  findPoDetail,
} from "./mock-data";
import type { PoListItem, PoListResponse, PoSortKey, PoStatus } from "./types";

const VALID_STATUSES: ReadonlySet<PoStatus> = new Set([
  "Draft",
  "Issued",
  "PartiallyReceived",
  "Closed",
  "Cancelled",
]);

const VALID_SORTS: ReadonlySet<PoSortKey> = new Set([
  "issueDate",
  "-issueDate",
  "value",
  "-value",
  "deliveryDate",
  "-deliveryDate",
]);

function parseInteger(value: string | null, fallback: number, min: number, max: number): number {
  if (value == null) return fallback;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function applyListFilters(items: PoListItem[], url: URL): PoListItem[] {
  const statuses = url.searchParams.getAll("status").filter((s): s is PoStatus =>
    VALID_STATUSES.has(s as PoStatus)
  );
  const supplierIds = url.searchParams.getAll("supplierId");
  const plantIds = url.searchParams.getAll("plantId");
  const dateFrom = url.searchParams.get("dateFrom");
  const dateTo = url.searchParams.get("dateTo");
  const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

  return items.filter((item) => {
    if (statuses.length && !statuses.includes(item.status)) return false;
    if (supplierIds.length && !supplierIds.includes(item.supplier.id)) return false;
    if (plantIds.length && !plantIds.includes(item.plant.id)) return false;
    if (dateFrom && item.issueDate < dateFrom) return false;
    if (dateTo && item.issueDate > dateTo) return false;
    if (q) {
      const blob = `${item.poNo} ${item.supplier.name} ${item.plant.name}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

function applySort(items: PoListItem[], sort: PoSortKey): PoListItem[] {
  const desc = sort.startsWith("-");
  const key = (desc ? sort.slice(1) : sort) as "issueDate" | "value" | "deliveryDate";
  const dir = desc ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = key === "value" ? a.value.amount : a[key];
    const bv = key === "value" ? b.value.amount : b[key];
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

export const ordersHandlers = [
  http.get("*/api/orders", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInteger(url.searchParams.get("page"), 1, 1, 10_000);
    const limit = parseInteger(url.searchParams.get("limit"), 20, 1, 100);
    const sortRaw = url.searchParams.get("sort");
    const sort: PoSortKey = sortRaw && VALID_SORTS.has(sortRaw as PoSortKey)
      ? (sortRaw as PoSortKey)
      : "-issueDate";

    const filtered = applyListFilters(MOCK_PO_LIST, url);
    const sorted = applySort(filtered, sort);
    const total = sorted.length;
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);

    const body: PoListResponse = { items, page, limit, total };
    return HttpResponse.json(body);
  }),

  http.get("*/api/orders/:poNo", ({ params }) => {
    const poNo = String(params.poNo);
    const detail = findPoDetail(poNo);
    if (!detail) {
      return HttpResponse.json(
        { error: "PO_NOT_FOUND", message: `Purchase order ${poNo} not found.` },
        { status: 404 }
      );
    }
    return HttpResponse.json(detail);
  }),

  http.get("*/api/orders/:poNo/grns", ({ params }) => {
    const poNo = String(params.poNo);
    if (!findPoDetail(poNo)) {
      return HttpResponse.json(
        { error: "PO_NOT_FOUND", message: `Purchase order ${poNo} not found.` },
        { status: 404 }
      );
    }
    const grns = MOCK_PO_GRNS[poNo] ?? [];
    return HttpResponse.json(grns);
  }),

  http.get("*/api/orders/:poNo/invoices", ({ params }) => {
    const poNo = String(params.poNo);
    if (!findPoDetail(poNo)) {
      return HttpResponse.json(
        { error: "PO_NOT_FOUND", message: `Purchase order ${poNo} not found.` },
        { status: 404 }
      );
    }
    const invoices = MOCK_PO_INVOICES[poNo] ?? [];
    return HttpResponse.json(invoices);
  }),
];
