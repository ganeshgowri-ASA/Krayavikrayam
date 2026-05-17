import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrdersPageShell } from "../src/components/orders/orders-page";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe("OrdersPageShell", () => {
  it("renders the page header and three KPI cards", async () => {
    renderWithClient(<OrdersPageShell />);
    expect(
      screen.getByRole("heading", { level: 1, name: /orders/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("kpi-open-pos")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-grn-pending")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-invoices-pending")).toBeInTheDocument();
  });

  it("shows loading skeletons before data resolves", () => {
    renderWithClient(<OrdersPageShell />);
    expect(screen.getByTestId("kpi-open-pos")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("renders numeric KPI values once loaded", async () => {
    renderWithClient(<OrdersPageShell />);
    await waitFor(
      () =>
        expect(screen.getByTestId("kpi-open-pos")).toHaveAttribute(
          "data-state",
          "ready"
        ),
      { timeout: 2_000 }
    );
    const value = screen
      .getByTestId("kpi-open-pos")
      .querySelector('[data-testid="kpi-card-value"]');
    expect(value?.textContent ?? "").toMatch(/^\d/);
  });
});
