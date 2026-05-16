import { describe, expect, it } from "vitest";
import {
  filterAndPaginate,
  type PurchaseRequestListResponse,
} from "./handlers";
import {
  MOCK_PURCHASE_REQUESTS,
  TAB_TO_STATUSES,
} from "./data/purchase-requests";

function call(qs: string): PurchaseRequestListResponse {
  return filterAndPaginate(
    MOCK_PURCHASE_REQUESTS,
    new URL(`http://test.local/api/purchase-requests?${qs}`)
  );
}

describe("purchase-requests handler", () => {
  it("defaults page=1, pageSize=20 when not provided", () => {
    const res = call("");
    expect(res.page).toBe(1);
    expect(res.pageSize).toBe(20);
    expect(res.items.length).toBeLessThanOrEqual(20);
    expect(res.total).toBe(MOCK_PURCHASE_REQUESTS.length);
    expect(res.totalPages).toBe(Math.ceil(res.total / 20));
  });

  it("paginates correctly", () => {
    const p1 = call("page=1&pageSize=5");
    const p2 = call("page=2&pageSize=5");
    expect(p1.items).toHaveLength(5);
    expect(p2.items).toHaveLength(5);
    expect(p1.items[0].id).not.toBe(p2.items[0].id);
  });

  it("clamps pageSize to a maximum of 100", () => {
    const res = call("pageSize=9999");
    expect(res.pageSize).toBe(100);
  });

  it("filters by tab=draft to DRAFT status only", () => {
    const res = call("tab=draft&pageSize=100");
    const allowed = new Set(TAB_TO_STATUSES.draft!);
    expect(res.items.length).toBeGreaterThan(0);
    for (const pr of res.items) expect(allowed.has(pr.status)).toBe(true);
  });

  it("filters by tab=pending to PENDING_APPROVAL status only", () => {
    const res = call("tab=pending&pageSize=100");
    for (const pr of res.items) expect(pr.status).toBe("PENDING_APPROVAL");
  });

  it("explicit status param overrides tab", () => {
    const res = call("tab=draft&status=APPROVED&pageSize=100");
    for (const pr of res.items) expect(pr.status).toBe("APPROVED");
  });

  it("supports multi-status comma list", () => {
    const res = call("status=APPROVED,REJECTED&pageSize=100");
    const allowed = new Set(["APPROVED", "REJECTED"]);
    expect(res.items.length).toBeGreaterThan(0);
    for (const pr of res.items) expect(allowed.has(pr.status)).toBe(true);
  });

  it("filters by search across number, title, requester, plant", () => {
    const target = MOCK_PURCHASE_REQUESTS[3];
    const res = call(`search=${encodeURIComponent(target.number)}`);
    expect(res.items.some((pr) => pr.id === target.id)).toBe(true);
  });

  it("returns empty items when no matches", () => {
    const res = call("search=__definitely_no_match__");
    expect(res.items).toEqual([]);
    expect(res.total).toBe(0);
    expect(res.totalPages).toBe(0);
  });

  it("falls back to safe values for malformed numeric params", () => {
    const res = call("page=abc&pageSize=-3");
    expect(res.page).toBe(1);
    expect(res.pageSize).toBe(20);
  });

  it("treats unknown tab as 'all'", () => {
    const all = call("pageSize=100");
    const unknown = call("tab=bogus&pageSize=100");
    expect(unknown.total).toBe(all.total);
  });
});
