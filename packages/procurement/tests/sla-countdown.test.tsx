import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlaCountdown } from "../src/components/sla-countdown";

describe("SlaCountdown", () => {
  it("shows breached state for past dates", () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    render(<SlaCountdown dueDate={past} />);
    const el = screen.getByTestId("sla-countdown");
    expect(el).toHaveAttribute("data-state", "breached");
    expect(el).toHaveTextContent("Overdue");
  });

  it("shows warning state under 24h", () => {
    const soon = new Date(Date.now() + 60 * 60_000).toISOString();
    render(<SlaCountdown dueDate={soon} />);
    expect(screen.getByTestId("sla-countdown")).toHaveAttribute(
      "data-state",
      "warning"
    );
  });

  it("shows ok state when far away", () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60_000).toISOString();
    render(<SlaCountdown dueDate={future} />);
    expect(screen.getByTestId("sla-countdown")).toHaveAttribute(
      "data-state",
      "ok"
    );
  });
});
