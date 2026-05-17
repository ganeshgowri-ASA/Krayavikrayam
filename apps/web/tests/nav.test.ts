import { describe, expect, it } from "vitest";
import { NAV_ITEMS } from "@/lib/nav";
import { isActivePath } from "@/components/sidebar";

describe("NAV_ITEMS", () => {
  it("matches the ProcureNXT IA order from PRD-v3 §3", () => {
    expect(NAV_ITEMS.map((i) => i.label)).toEqual([
      "Home",
      "Purchase requests",
      "RFQs",
      "Material inspection",
      "Service certification",
      "Orders",
      "Supplier management",
      "Workforce management",
      "Access management",
      "Analytics",
      "Master data",
    ]);
  });

  it("has a unique href for every item", () => {
    const hrefs = NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("Home points at root", () => {
    expect(NAV_ITEMS[0]).toMatchObject({ label: "Home", href: "/" });
  });
});

describe("isActivePath", () => {
  it("matches root exactly for Home", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/purchase-requests", "/")).toBe(false);
  });

  it("matches exact href", () => {
    expect(isActivePath("/orders", "/orders")).toBe(true);
  });

  it("matches nested routes under the section", () => {
    expect(isActivePath("/orders/123", "/orders")).toBe(true);
    expect(isActivePath("/orders/123/grn", "/orders")).toBe(true);
  });

  it("does not match prefix collisions", () => {
    expect(isActivePath("/orders-archive", "/orders")).toBe(false);
  });
});
