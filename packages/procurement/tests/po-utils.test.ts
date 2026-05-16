import { describe, expect, it } from "vitest";
import {
  applyPoFilters,
  formatInr,
  formatRelativeDate,
  paginate,
} from "../src/lib/po-utils";
import { MOCK_PURCHASE_ORDERS } from "../src/api/po-mock";

describe("formatInr", () => {
  it("formats with INR symbol and Indian grouping", () => {
    const out = formatInr(2450000);
    expect(out).toMatch(/24,50,000/);
    expect(out).toMatch(/₹|INR/);
  });

  it("omits fractional digits", () => {
    expect(formatInr(1234.56)).not.toMatch(/\./);
  });
});

describe("formatRelativeDate", () => {
  const NOW = new Date("2026-05-09T00:00:00Z");

  it("returns 'today' for the same day", () => {
    expect(formatRelativeDate("2026-05-09", NOW)).toBe("today");
  });

  it("returns 'tomorrow' for next day", () => {
    expect(formatRelativeDate("2026-05-10", NOW)).toBe("tomorrow");
  });

  it("returns 'yesterday' for previous day", () => {
    expect(formatRelativeDate("2026-05-08", NOW)).toBe("yesterday");
  });

  it("returns 'in N days' for a date within the next month", () => {
    expect(formatRelativeDate("2026-05-15", NOW)).toBe("in 6 days");
  });

  it("returns 'N days ago' for a recent past date", () => {
    expect(formatRelativeDate("2026-05-04", NOW)).toBe("5 days ago");
  });

  it("falls back to months for far future/past dates", () => {
    expect(formatRelativeDate("2026-08-09", NOW)).toMatch(/months/);
    expect(formatRelativeDate("2026-01-09", NOW)).toMatch(/months ago/);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 23 }, (_, i) => i + 1);

  it("returns the first page with correct slice and indices", () => {
    const result = paginate(items, 1, 10);
    expect(result.rows).toHaveLength(10);
    expect(result.rows[0]).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.startIndex).toBe(1);
    expect(result.endIndex).toBe(10);
  });

  it("returns the final partial page", () => {
    const result = paginate(items, 3, 10);
    expect(result.rows).toEqual([21, 22, 23]);
    expect(result.endIndex).toBe(23);
  });

  it("clamps oversized page numbers", () => {
    const result = paginate(items, 99, 10);
    expect(result.page).toBe(3);
  });

  it("returns an empty result when input is empty", () => {
    const result = paginate([], 1, 10);
    expect(result.rows).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.startIndex).toBe(0);
  });
});

describe("applyPoFilters", () => {
  it("returns input unchanged when filters are undefined", () => {
    expect(applyPoFilters(MOCK_PURCHASE_ORDERS, undefined)).toBe(MOCK_PURCHASE_ORDERS);
  });

  it("filters by status", () => {
    const out = applyPoFilters(MOCK_PURCHASE_ORDERS, { status: ["received"] });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((po) => po.status === "received")).toBe(true);
  });

  it("filters by search across PO number and supplier", () => {
    const bySupplier = applyPoFilters(MOCK_PURCHASE_ORDERS, { search: "tata" });
    expect(bySupplier.some((po) => po.supplier.toLowerCase().includes("tata"))).toBe(true);
    expect(bySupplier.every((po) => /tata/i.test(`${po.poNo} ${po.supplier}`))).toBe(true);

    const byNumber = applyPoFilters(MOCK_PURCHASE_ORDERS, { search: "PO-2026-0012" });
    expect(byNumber).toHaveLength(1);
    expect(byNumber[0]!.poNo).toBe("PO-2026-0012");
  });
});
