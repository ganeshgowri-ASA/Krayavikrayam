import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PoTable } from "../src/components/po-list/po-table";
import type { PurchaseOrder } from "../src/types";

const NOW = new Date("2026-05-09T00:00:00Z");

const ROW: PurchaseOrder = {
  poNo: "PO-TEST-001",
  supplier: "Acme Corp",
  value: 1250000,
  status: "in_transit",
  deliveryDate: "2026-05-12",
};

describe("PoTable", () => {
  it("renders one row per purchase order", () => {
    render(<PoTable rows={[ROW, { ...ROW, poNo: "PO-TEST-002" }]} now={NOW} />);
    expect(screen.getAllByTestId("po-row")).toHaveLength(2);
  });

  it("renders the supplier, INR-formatted value and relative delivery date", () => {
    render(<PoTable rows={[ROW]} now={NOW} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText(/12,50,000/)).toBeInTheDocument();
    expect(screen.getByText("in 3 days")).toBeInTheDocument();
    expect(screen.getByText("2026-05-12")).toBeInTheDocument();
  });

  it("renders the status badge for the row status", () => {
    render(<PoTable rows={[ROW]} now={NOW} />);
    const badge = screen.getByTestId("po-status-badge");
    expect(badge).toHaveAttribute("data-status", "in_transit");
    expect(badge).toHaveTextContent("In Transit");
  });

  it("shows the empty state when no rows are provided", () => {
    render(<PoTable rows={[]} />);
    expect(screen.getByTestId("po-empty-state")).toBeInTheDocument();
    expect(screen.getByText(/No purchase orders/i)).toBeInTheDocument();
    expect(screen.queryByTestId("po-table")).not.toBeInTheDocument();
  });

  it("shows the loading skeleton while loading with no rows yet", () => {
    render(<PoTable rows={[]} loading />);
    expect(screen.getByText(/Loading purchase orders/i)).toBeInTheDocument();
    expect(screen.queryByTestId("po-empty-state")).not.toBeInTheDocument();
  });
});
