import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileText } from "lucide-react";
import { KpiCard } from "../src/components/kpi-card";

describe("KpiCard", () => {
  it("renders label, value and hint when loaded", () => {
    render(
      <KpiCard
        label="Open POs"
        value={24}
        hint="Awaiting fulfilment"
        icon={FileText}
        testId="kpi-open-pos"
      />
    );
    expect(screen.getByTestId("kpi-open-pos")).toHaveAttribute(
      "data-state",
      "ready"
    );
    expect(screen.getByText("Open POs")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-card-value")).toHaveTextContent("24");
    expect(screen.getByText("Awaiting fulfilment")).toBeInTheDocument();
  });

  it("formats large values with locale grouping", () => {
    render(<KpiCard label="Open POs" value={12345} testId="kpi" />);
    expect(screen.getByTestId("kpi-card-value").textContent).toMatch(
      /12[.,]345/
    );
  });

  it("renders a skeleton while loading", () => {
    render(<KpiCard label="Open POs" value={undefined} isLoading testId="kpi" />);
    expect(screen.getByTestId("kpi")).toHaveAttribute("data-state", "loading");
    expect(screen.getByTestId("kpi-card-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("kpi-card-value")).toBeNull();
  });

  it("renders an empty placeholder when value is null", () => {
    render(<KpiCard label="Open POs" value={null} testId="kpi" />);
    expect(screen.getByTestId("kpi")).toHaveAttribute("data-state", "empty");
    expect(screen.getByTestId("kpi-card-empty")).toHaveTextContent("—");
  });

  it("renders zero as a real value, not as empty", () => {
    render(<KpiCard label="Open POs" value={0} testId="kpi" />);
    expect(screen.getByTestId("kpi")).toHaveAttribute("data-state", "ready");
    expect(screen.getByTestId("kpi-card-value")).toHaveTextContent("0");
  });
});
