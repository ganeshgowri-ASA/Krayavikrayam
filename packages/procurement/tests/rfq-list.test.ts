import { describe, expect, it } from "vitest";
import { MOCK_RFQS } from "../src/api/mock";
import {
  applyRfqListFilters,
  buildRfqListQuery,
  paginate,
  parsePositiveInt,
  parseRfqListFilters,
  relativeDeadline,
  rfqCategory,
  uniqCategories,
} from "../src/lib/rfq-list";

describe("parsePositiveInt", () => {
  it("returns parsed value when valid", () => {
    expect(parsePositiveInt("7", 1)).toBe(7);
  });
  it("returns fallback for non-numeric / empty / negative", () => {
    expect(parsePositiveInt(undefined, 5)).toBe(5);
    expect(parsePositiveInt("", 5)).toBe(5);
    expect(parsePositiveInt("abc", 5)).toBe(5);
    expect(parsePositiveInt("-2", 5)).toBe(5);
    expect(parsePositiveInt("0", 5)).toBe(5);
  });
  it("uses first element when given an array", () => {
    expect(parsePositiveInt(["3", "9"], 1)).toBe(3);
  });
});

describe("parseRfqListFilters", () => {
  it("drops unknown statuses and empty values", () => {
    const out = parseRfqListFilters({
      status: "awarded,bogus,draft",
      category: "Steel,",
      q: "  hex  ",
    });
    expect(out.status).toEqual(["awarded", "draft"]);
    expect(out.category).toEqual(["Steel"]);
    expect(out.search).toBe("hex");
  });
  it("omits keys when not provided", () => {
    expect(parseRfqListFilters({})).toEqual({});
  });
});

describe("applyRfqListFilters", () => {
  it("returns input when no filters", () => {
    expect(applyRfqListFilters(MOCK_RFQS, {})).toBe(MOCK_RFQS);
  });
  it("filters by status", () => {
    const out = applyRfqListFilters(MOCK_RFQS, { status: ["awarded"] });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((r) => r.status === "awarded")).toBe(true);
  });
  it("filters by category derived from line items", () => {
    const out = applyRfqListFilters(MOCK_RFQS, { category: ["Steel"] });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((r) => rfqCategory(r) === "Steel")).toBe(true);
  });
  it("filters by search across number and title", () => {
    const target = MOCK_RFQS[0]!;
    const out = applyRfqListFilters(MOCK_RFQS, { search: target.number });
    expect(out.map((r) => r.id)).toContain(target.id);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 47 }, (_, i) => i);
  it("returns the requested page slice", () => {
    const r = paginate(items, 2, 10);
    expect(r.rows).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    expect(r.page).toBe(2);
    expect(r.totalPages).toBe(5);
    expect(r.start).toBe(10);
    expect(r.end).toBe(20);
  });
  it("clamps page above totalPages", () => {
    const r = paginate(items, 99, 10);
    expect(r.page).toBe(5);
    expect(r.rows).toEqual([40, 41, 42, 43, 44, 45, 46]);
    expect(r.end).toBe(47);
  });
  it("clamps page below 1", () => {
    const r = paginate(items, 0, 10);
    expect(r.page).toBe(1);
    expect(r.rows[0]).toBe(0);
  });
  it("handles empty input", () => {
    const r = paginate<number>([], 1, 10);
    expect(r.totalPages).toBe(1);
    expect(r.rows).toEqual([]);
  });
});

describe("relativeDeadline", () => {
  const now = new Date("2026-05-16T12:00:00Z");
  it("labels overdue dates with days ago", () => {
    const r = relativeDeadline("2026-05-10T12:00:00Z", now);
    expect(r.tone).toBe("past");
    expect(r.label).toBe("6 days ago");
  });
  it("labels yesterday", () => {
    const r = relativeDeadline("2026-05-15T12:00:00Z", now);
    expect(r.label).toBe("yesterday");
    expect(r.tone).toBe("past");
  });
  it("labels tomorrow", () => {
    const r = relativeDeadline("2026-05-17T12:00:00Z", now);
    expect(r.label).toBe("tomorrow");
    expect(r.tone).toBe("soon");
  });
  it("labels future days", () => {
    const r = relativeDeadline("2026-05-26T12:00:00Z", now);
    expect(r.label).toBe("in 10 days");
    expect(r.tone).toBe("future");
  });
  it("labels intraday with hours", () => {
    const r = relativeDeadline("2026-05-16T18:00:00Z", now);
    expect(r.label).toBe("in 6h");
    expect(r.tone).toBe("soon");
  });
});

describe("buildRfqListQuery", () => {
  it("skips empty / null / undefined values", () => {
    expect(
      buildRfqListQuery({ page: 1, pageSize: undefined, q: "", status: null })
    ).toBe("?page=1");
  });
  it("joins array values with commas", () => {
    expect(buildRfqListQuery({ status: ["draft", "awarded"] })).toBe(
      "?status=draft%2Cawarded"
    );
  });
  it("returns empty string when nothing remains", () => {
    expect(buildRfqListQuery({ q: "" })).toBe("");
  });
});

describe("uniqCategories", () => {
  it("returns sorted unique categories", () => {
    const cats = uniqCategories(MOCK_RFQS);
    expect(cats).toEqual([...cats].sort());
    expect(new Set(cats).size).toBe(cats.length);
    expect(cats).toContain("Steel");
  });
});
