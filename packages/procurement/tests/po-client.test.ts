import { describe, expect, it } from "vitest";
import { fetchPurchaseOrders } from "../src/api/po-client";
import { MOCK_PURCHASE_ORDERS } from "../src/api/po-mock";

describe("fetchPurchaseOrders", () => {
  it("returns the first page sized to pageSize with total count", async () => {
    const result = await fetchPurchaseOrders({ page: 1, pageSize: 10 });
    expect(result.rows).toHaveLength(10);
    expect(result.total).toBe(MOCK_PURCHASE_ORDERS.length);
    expect(result.page).toBe(1);
  });

  it("returns subsequent pages and a final partial page", async () => {
    const last = await fetchPurchaseOrders({ page: 3, pageSize: 10 });
    expect(last.rows).toHaveLength(MOCK_PURCHASE_ORDERS.length - 20);
    expect(last.page).toBe(3);
  });

  it("filters rows by status before paginating", async () => {
    const result = await fetchPurchaseOrders({
      filters: { status: ["draft"] },
      pageSize: 50,
    });
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows.every((po) => po.status === "draft")).toBe(true);
    expect(result.total).toBe(result.rows.length);
  });
});
