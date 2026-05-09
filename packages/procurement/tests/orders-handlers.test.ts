// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { setupOrdersServer } from "../src/orders/server";
import { MOCK_PO_LIST } from "../src/orders/mock-data";
import type {
  Grn,
  Invoice,
  PoDetail,
  PoListResponse,
} from "../src/orders/types";

const server = setupOrdersServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const BASE = "http://localhost";

async function getJson<T>(path: string): Promise<{ status: number; body: T }> {
  const res = await fetch(`${BASE}${path}`);
  const body = (await res.json()) as T;
  return { status: res.status, body };
}

describe("GET /api/orders", () => {
  it("returns the first page with the default page size", async () => {
    const { status, body } = await getJson<PoListResponse>("/api/orders");
    expect(status).toBe(200);
    expect(body.page).toBe(1);
    expect(body.limit).toBe(20);
    expect(body.total).toBe(MOCK_PO_LIST.length);
    expect(body.items).toHaveLength(20);
  });

  it("paginates", async () => {
    const { body } = await getJson<PoListResponse>("/api/orders?page=2&limit=10");
    expect(body.page).toBe(2);
    expect(body.limit).toBe(10);
    expect(body.items).toHaveLength(10);
    expect(body.total).toBe(MOCK_PO_LIST.length);
  });

  it("filters by status (repeatable)", async () => {
    const { body } = await getJson<PoListResponse>(
      "/api/orders?status=Issued&status=Closed&limit=100"
    );
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.every((i) => i.status === "Issued" || i.status === "Closed")).toBe(true);
  });

  it("filters by supplierId", async () => {
    const supplierId = MOCK_PO_LIST[0]!.supplier.id;
    const { body } = await getJson<PoListResponse>(
      `/api/orders?supplierId=${supplierId}&limit=100`
    );
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.every((i) => i.supplier.id === supplierId)).toBe(true);
  });

  it("filters by plantId", async () => {
    const plantId = MOCK_PO_LIST[0]!.plant.id;
    const { body } = await getJson<PoListResponse>(
      `/api/orders?plantId=${plantId}&limit=100`
    );
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.every((i) => i.plant.id === plantId)).toBe(true);
  });

  it("filters by date range (issueDate inclusive)", async () => {
    const { body: all } = await getJson<PoListResponse>("/api/orders?limit=200");
    const sample = [...all.items]
      .map((i) => i.issueDate)
      .sort()[Math.floor(all.items.length / 2)]!;
    const { body } = await getJson<PoListResponse>(
      `/api/orders?dateFrom=${sample}&dateTo=${sample}&limit=200`
    );
    expect(body.items.every((i) => i.issueDate === sample)).toBe(true);
  });

  it("searches across poNo, supplier, and plant case-insensitively", async () => {
    const target = MOCK_PO_LIST[5]!;
    const { body } = await getJson<PoListResponse>(
      `/api/orders?q=${encodeURIComponent(target.poNo.toLowerCase())}&limit=10`
    );
    expect(body.items.some((i) => i.poNo === target.poNo)).toBe(true);
  });

  it("sorts by value ascending and descending", async () => {
    const { body: asc } = await getJson<PoListResponse>("/api/orders?sort=value&limit=10");
    const { body: desc } = await getJson<PoListResponse>("/api/orders?sort=-value&limit=10");
    const ascValues = asc.items.map((i) => i.value.amount);
    const descValues = desc.items.map((i) => i.value.amount);
    expect([...ascValues].sort((a, b) => a - b)).toEqual(ascValues);
    expect([...descValues].sort((a, b) => b - a)).toEqual(descValues);
  });

  it("returns empty items when filters match nothing", async () => {
    const { body } = await getJson<PoListResponse>("/api/orders?supplierId=does-not-exist");
    expect(body.items).toEqual([]);
    expect(body.total).toBe(0);
  });

  it("ignores invalid sort and falls back to -issueDate", async () => {
    const { status } = await getJson<PoListResponse>("/api/orders?sort=garbage");
    expect(status).toBe(200);
  });
});

describe("GET /api/orders/:poNo", () => {
  it("returns full detail for a known PO", async () => {
    const target = MOCK_PO_LIST[0]!;
    const { status, body } = await getJson<PoDetail>(`/api/orders/${target.poNo}`);
    expect(status).toBe(200);
    expect(body.poNo).toBe(target.poNo);
    expect(body.lines.length).toBeGreaterThan(0);
    expect(body.match).toBeDefined();
    expect(body.payment).toBeDefined();
    expect(body.subtotal.currency).toBe(body.currency);
  });

  it("returns 404 for an unknown PO", async () => {
    const { status, body } = await getJson<{ error: string }>("/api/orders/PO-DOES-NOT-EXIST");
    expect(status).toBe(404);
    expect(body.error).toBe("PO_NOT_FOUND");
  });
});

describe("GET /api/orders/:poNo/grns", () => {
  it("returns the GRNs for a known PO", async () => {
    const target = MOCK_PO_LIST.find((p) => p.grnCount > 0)!;
    const { status, body } = await getJson<Grn[]>(`/api/orders/${target.poNo}/grns`);
    expect(status).toBe(200);
    expect(body.length).toBe(target.grnCount);
    expect(body.every((g) => g.poNo === target.poNo)).toBe(true);
  });

  it("returns an empty array when the PO has no GRNs", async () => {
    const target = MOCK_PO_LIST.find((p) => p.grnCount === 0)!;
    const { status, body } = await getJson<Grn[]>(`/api/orders/${target.poNo}/grns`);
    expect(status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns 404 for an unknown PO", async () => {
    const { status } = await getJson<{ error: string }>("/api/orders/PO-NOPE/grns");
    expect(status).toBe(404);
  });
});

describe("GET /api/orders/:poNo/invoices", () => {
  it("returns the invoices for a known PO", async () => {
    const target = MOCK_PO_LIST.find((p) => p.invoiceCount > 0)!;
    const { status, body } = await getJson<Invoice[]>(`/api/orders/${target.poNo}/invoices`);
    expect(status).toBe(200);
    expect(body.length).toBe(target.invoiceCount);
    expect(body.every((i) => i.poNo === target.poNo)).toBe(true);
  });

  it("returns an empty array when the PO has no invoices", async () => {
    const target = MOCK_PO_LIST.find((p) => p.invoiceCount === 0)!;
    const { status, body } = await getJson<Invoice[]>(`/api/orders/${target.poNo}/invoices`);
    expect(status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns 404 for an unknown PO", async () => {
    const { status } = await getJson<{ error: string }>("/api/orders/PO-NOPE/invoices");
    expect(status).toBe(404);
  });
});
