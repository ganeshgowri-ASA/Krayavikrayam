import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/sidebar";
import { NAV_ITEMS } from "@/lib/nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/orders",
}));

describe("<Sidebar />", () => {
  it("renders all nav items in PRD order", () => {
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(
      NAV_ITEMS.map((i) => i.href)
    );
  });

  it("marks the active route with aria-current", () => {
    render(<Sidebar />);
    const active = screen.getByRole("link", { name: /Orders/i });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("toggles collapsed state via the chevron button", () => {
    render(<Sidebar />);
    const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(
      screen.getByRole("button", { name: "Expand sidebar" })
    ).toHaveAttribute("aria-expanded", "false");
  });
});
