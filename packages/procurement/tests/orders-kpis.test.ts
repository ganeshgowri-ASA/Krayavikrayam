import { describe, expect, it } from "vitest";
import {
  MOCK_GRNS,
  MOCK_INVOICES,
  MOCK_PURCHASE_ORDERS,
  getOrdersKpis,
} from "../src/api/mock";

describe("getOrdersKpis", () => {
  it("counts open + partially_received POs as open", () => {
    const kpis = getOrdersKpis(
      [
        { ...MOCK_PURCHASE_ORDERS[0]!, status: "open" },
        { ...MOCK_PURCHASE_ORDERS[1]!, status: "partially_received" },
        { ...MOCK_PURCHASE_ORDERS[2]!, status: "closed" },
        { ...MOCK_PURCHASE_ORDERS[3]!, status: "cancelled" },
        { ...MOCK_PURCHASE_ORDERS[4]!, status: "draft" },
      ],
      [],
      []
    );
    expect(kpis.openPoCount).toBe(2);
  });

  it("counts pending GRNs only", () => {
    const kpis = getOrdersKpis(
      [],
      [
        { ...MOCK_GRNS[0]!, status: "pending" },
        { ...MOCK_GRNS[1]!, status: "pending" },
        { ...MOCK_GRNS[2]!, status: "posted" },
        { ...MOCK_GRNS[3]!, status: "cancelled" },
      ],
      []
    );
    expect(kpis.grnPendingCount).toBe(2);
  });

  it("counts pending invoices only", () => {
    const kpis = getOrdersKpis(
      [],
      [],
      [
        { ...MOCK_INVOICES[0]!, status: "pending" },
        { ...MOCK_INVOICES[1]!, status: "matched" },
        { ...MOCK_INVOICES[2]!, status: "paid" },
        { ...MOCK_INVOICES[3]!, status: "pending" },
        { ...MOCK_INVOICES[4]!, status: "disputed" },
      ]
    );
    expect(kpis.invoicesPendingCount).toBe(2);
  });

  it("returns zeros for empty inputs", () => {
    expect(getOrdersKpis([], [], [])).toEqual({
      openPoCount: 0,
      grnPendingCount: 0,
      invoicesPendingCount: 0,
    });
  });

  it("operates on default mock fixtures", () => {
    const kpis = getOrdersKpis();
    expect(kpis.openPoCount).toBeGreaterThanOrEqual(0);
    expect(kpis.grnPendingCount).toBeGreaterThanOrEqual(0);
    expect(kpis.invoicesPendingCount).toBeGreaterThanOrEqual(0);
  });
});
