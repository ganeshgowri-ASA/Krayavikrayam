// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildPurchaseRequestUrl } from "./purchase-requests";

describe("buildPurchaseRequestUrl", () => {
  it("omits empty params", () => {
    expect(buildPurchaseRequestUrl({})).toBe("/api/purchase-requests");
  });

  it("encodes tab/status/search/page/pageSize", () => {
    const url = buildPurchaseRequestUrl({
      tab: "pending",
      status: ["PENDING_APPROVAL", "UNDER_REWORK"],
      search: "lab gear",
      page: 3,
      pageSize: 25,
    });
    expect(url).toContain("tab=pending");
    expect(url).toContain("status=PENDING_APPROVAL%2CUNDER_REWORK");
    expect(url).toContain("search=lab+gear");
    expect(url).toContain("page=3");
    expect(url).toContain("pageSize=25");
  });
});

describe("fetchPurchaseRequests via MSW", () => {
  it("returns paginated mock data over the network boundary", async () => {
    const res = await fetch(
      "http://test.local/api/purchase-requests?page=1&pageSize=5"
    ).then((r) => r.json());
    expect(res.page).toBe(1);
    expect(res.pageSize).toBe(5);
    expect(res.items).toHaveLength(5);
    expect(res.total).toBeGreaterThan(0);
  });

  it("respects the tab filter end-to-end", async () => {
    const res = await fetch(
      "http://test.local/api/purchase-requests?tab=pending&pageSize=50"
    ).then((r) => r.json());
    for (const pr of res.items as Array<{ status: string }>) {
      expect(pr.status).toBe("PENDING_APPROVAL");
    }
  });
});
