import { http, HttpResponse } from "msw";
import type { Rfq, RfqFilters, RfqStatus } from "../types";
import { applyFilters } from "../api/filters";
import { MOCK_RFQS } from "../api/mock";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 200;

export interface RfqListResponse {
  items: Rfq[];
  total: number;
  page: number;
  pageSize: number;
}

function csv(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function parseFilters(url: URL): RfqFilters {
  const p = url.searchParams;
  return {
    status: csv(p.get("status")) as RfqStatus[] | undefined,
    buyerId: csv(p.get("buyerId")),
    country: csv(p.get("country")),
    plantId: csv(p.get("plantId")),
    materialCode: csv(p.get("materialCode")),
    dueDateFrom: p.get("dueDateFrom") ?? undefined,
    dueDateTo: p.get("dueDateTo") ?? undefined,
    search: p.get("search") ?? undefined,
  };
}

function clampPage(value: string | null, fallback: number, max?: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return max ? Math.min(Math.floor(n), max) : Math.floor(n);
}

let rfqs: Rfq[] = [...MOCK_RFQS];
let createdCounter = 0;

export function resetRfqStore() {
  rfqs = [...MOCK_RFQS];
  createdCounter = 0;
}

export const RFQ_API_BASE = "*/api/rfqs";

export const rfqHandlers = [
  http.get(RFQ_API_BASE, ({ request }) => {
    const url = new URL(request.url);
    const filters = parseFilters(url);
    const page = clampPage(url.searchParams.get("page"), 1);
    const pageSize = clampPage(
      url.searchParams.get("pageSize"),
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE
    );

    const filtered = applyFilters(rfqs, filters);
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    const body: RfqListResponse = { items, total, page, pageSize };
    return HttpResponse.json(body);
  }),

  http.get("*/api/rfqs/:id", ({ params }) => {
    const id = String(params.id);
    const found = rfqs.find((r) => r.id === id);
    if (!found) {
      return HttpResponse.json(
        { error: "RFQ not found", id },
        { status: 404 }
      );
    }
    return HttpResponse.json(found);
  }),

  http.post("*/api/rfqs", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Partial<Rfq>;
    createdCounter += 1;
    const id = `rfq-mock-${Date.now()}-${createdCounter}`;
    const now = new Date().toISOString();
    const created: Rfq = {
      id,
      number:
        body.number ??
        `RFQ-MOCK-${String(createdCounter).padStart(5, "0")}`,
      title: body.title ?? "Untitled RFQ",
      status: body.status ?? "draft",
      priority: body.priority ?? "medium",
      buyer:
        body.buyer ?? {
          id: "u-mock",
          name: "Mock Buyer",
          email: "mock@krayavikrayam.com",
        },
      plant:
        body.plant ?? {
          id: "p-mock",
          name: "Mock Plant",
          country: "IN",
        },
      materialCodes: body.materialCodes ?? [],
      estimatedValue:
        body.estimatedValue ?? { amount: 0, currency: "USD" },
      dueDate: body.dueDate ?? now,
      createdAt: now,
      updatedAt: now,
      collaborators: body.collaborators ?? [],
      lineItems: body.lineItems ?? [],
      invitedVendorIds: body.invitedVendorIds ?? [],
      openQueriesCount: body.openQueriesCount ?? 0,
    };
    return HttpResponse.json({ id, rfq: created }, { status: 201 });
  }),
];
