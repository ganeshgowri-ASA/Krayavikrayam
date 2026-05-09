// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { server } from "../src/mocks/server";
import { resetRfqStore } from "../src/mocks/handlers";
import type { RfqListResponse } from "../src/mocks/handlers";
import {
  buildRfqListSearchParams,
  fetchRfq,
  fetchRfqs,
  createRfq,
} from "../src/api/client";
import { MOCK_RFQS } from "../src/api/mock";

const BASE = "http://localhost";
let originalFetch: typeof fetch;

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
  originalFetch = globalThis.fetch;
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/")) {
      return originalFetch(`${BASE}${input}`, init);
    }
    return originalFetch(input as RequestInfo | URL, init);
  }) as typeof fetch;
});
afterEach(() => {
  server.resetHandlers();
  resetRfqStore();
});
afterAll(() => {
  server.close();
  globalThis.fetch = originalFetch;
});

describe("rfq msw handlers", () => {
  it("GET /api/rfqs paginates with default page size", async () => {
    const res = await fetchRfqs({ page: 1, pageSize: 25 });
    expect(res.total).toBe(MOCK_RFQS.length);
    expect(res.page).toBe(1);
    expect(res.pageSize).toBe(25);
    expect(res.items).toHaveLength(25);
    expect(res.items[0]!.id).toBe(MOCK_RFQS[0]!.id);
  });

  it("GET /api/rfqs paginates with explicit page", async () => {
    const res = await fetchRfqs({ page: 2, pageSize: 50 });
    expect(res.page).toBe(2);
    expect(res.items).toHaveLength(50);
    expect(res.items[0]!.id).toBe(MOCK_RFQS[50]!.id);
  });

  it("GET /api/rfqs filters by status (csv)", async () => {
    const res = await fetchRfqs({
      filters: { status: ["draft"] },
      page: 1,
      pageSize: 200,
    });
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items.every((r) => r.status === "draft")).toBe(true);
  });

  it("GET /api/rfqs filters by search term", async () => {
    const target = MOCK_RFQS[3]!;
    const res = await fetchRfqs({
      filters: { search: target.number },
      page: 1,
      pageSize: 25,
    });
    expect(res.items.some((r) => r.id === target.id)).toBe(true);
  });

  it("buildRfqListSearchParams serializes csv values", () => {
    const params = buildRfqListSearchParams({
      filters: { status: ["draft", "published"], country: ["IN"] },
      page: 3,
      pageSize: 10,
    });
    expect(params.get("status")).toBe("draft,published");
    expect(params.get("country")).toBe("IN");
    expect(params.get("page")).toBe("3");
    expect(params.get("pageSize")).toBe("10");
  });

  it("GET /api/rfqs/:id returns a single rfq", async () => {
    const target = MOCK_RFQS[0]!;
    const rfq = await fetchRfq(target.id);
    expect(rfq.id).toBe(target.id);
    expect(rfq.number).toBe(target.number);
  });

  it("GET /api/rfqs/:id returns 404 for unknown id", async () => {
    const res = await fetch("/api/rfqs/does-not-exist");
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: string };
    expect(body.error).toMatch(/not found/i);
  });

  it("POST /api/rfqs returns a created rfq with a mock id (no persistence beyond reset)", async () => {
    const before = await fetchRfqs({ page: 1, pageSize: 1 });
    const created = await createRfq({
      title: "Sample new RFQ",
      status: "draft",
    });
    expect(created.id).toMatch(/^rfq-mock-/);
    expect(created.rfq.title).toBe("Sample new RFQ");
    expect(created.rfq.status).toBe("draft");

    const after = await fetchRfqs({ page: 1, pageSize: 1 });
    expect(after.total).toBe(before.total);
  });

  it("POST /api/rfqs accepts and echoes status code 201", async () => {
    const res = await fetch("/api/rfqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Another" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as RfqListResponse | { id: string };
    expect("id" in body && body.id).toBeTruthy();
  });
});
