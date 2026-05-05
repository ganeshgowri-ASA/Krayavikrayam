import { describe, expect, it } from "vitest";
import { formatMoney, timeRemaining, uniq } from "../src/lib/utils";
import { applyFilters } from "../src/api/client";
import { MOCK_RFQS } from "../src/api/mock";

describe("formatMoney", () => {
  it("formats USD with currency", () => {
    const out = formatMoney({ amount: 1234, currency: "USD" });
    expect(out).toMatch(/\$|USD/);
    expect(out).toContain("1,234");
  });

  it("returns em-dash for null", () => {
    expect(formatMoney(null)).toBe("—");
  });
});

describe("timeRemaining", () => {
  it("returns breached when in the past", () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const r = timeRemaining(past);
    expect(r.state).toBe("breached");
    expect(r.label).toBe("Overdue");
  });

  it("returns warning when under 24h", () => {
    const soon = new Date(Date.now() + 60 * 60_000).toISOString();
    const r = timeRemaining(soon);
    expect(r.state).toBe("warning");
  });

  it("returns ok when far away", () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60_000).toISOString();
    const r = timeRemaining(future);
    expect(r.state).toBe("ok");
    expect(r.label).toMatch(/d/);
  });
});

describe("uniq", () => {
  it("dedupes preserving values", () => {
    expect(uniq([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });
});

describe("applyFilters", () => {
  it("filters by status", () => {
    const out = applyFilters(MOCK_RFQS, { status: ["awarded"] });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((r) => r.status === "awarded")).toBe(true);
  });

  it("filters by country", () => {
    const out = applyFilters(MOCK_RFQS, { country: ["DE"] });
    expect(out.every((r) => r.plant.country === "DE")).toBe(true);
  });

  it("filters by search across number/title/buyer/plant", () => {
    const target = MOCK_RFQS[0]!;
    const out = applyFilters(MOCK_RFQS, { search: target.number });
    expect(out.map((r) => r.id)).toContain(target.id);
  });

  it("returns input unchanged when filters undefined", () => {
    expect(applyFilters(MOCK_RFQS, undefined)).toBe(MOCK_RFQS);
  });
});
