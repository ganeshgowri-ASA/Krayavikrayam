import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RfqCard } from "../src/components/rfq-card";
import type { Rfq } from "../src/types";

const rfq: Rfq = {
  id: "rfq-test",
  number: "RFQ-2026-00001",
  title: "Steel sourcing for Pune Plant",
  status: "in_review",
  priority: "high",
  buyer: { id: "u1", name: "Aanya Sharma", email: "a@x.com" },
  plant: { id: "p1", name: "Pune Plant", country: "IN" },
  materialCodes: ["MAT-1001"],
  estimatedValue: { amount: 124500, currency: "USD" },
  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60_000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  collaborators: [
    { id: "u1", name: "Aanya Sharma", email: "a@x.com" },
    { id: "u2", name: "Rohan Patel", email: "r@x.com" },
  ],
  lineItems: [],
  invitedVendorIds: ["v1"],
  openQueriesCount: 2,
};

describe("RfqCard", () => {
  it("renders core RFQ fields", () => {
    render(<RfqCard rfq={rfq} />);
    expect(screen.getByText(rfq.number)).toBeInTheDocument();
    expect(screen.getByText(rfq.title)).toBeInTheDocument();
    expect(screen.getByTestId("rfq-status-badge")).toHaveAttribute(
      "data-status",
      "in_review"
    );
    expect(screen.getByTestId("value-chip")).toBeInTheDocument();
    expect(screen.getByTestId("collaborator-count")).toHaveTextContent("2");
    expect(screen.getByTestId("sla-countdown")).toBeInTheDocument();
  });

  it("invokes onClick", () => {
    const onClick = vi.fn();
    render(<RfqCard rfq={rfq} onClick={onClick} />);
    fireEvent.click(screen.getByTestId("rfq-card"));
    expect(onClick).toHaveBeenCalledWith(rfq);
  });

  it("invokes onOpenQueries without bubbling card click", () => {
    const onClick = vi.fn();
    const onOpenQueries = vi.fn();
    render(<RfqCard rfq={rfq} onClick={onClick} onOpenQueries={onOpenQueries} />);
    fireEvent.click(screen.getByText(/open/));
    expect(onOpenQueries).toHaveBeenCalledWith(rfq);
    expect(onClick).not.toHaveBeenCalled();
  });
});
