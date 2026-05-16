import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PurchaseRequestList } from "./pr-list";
import { MOCK_PURCHASE_REQUESTS } from "@/mocks/data/purchase-requests";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe("<PurchaseRequestList /> + MSW", () => {
  it("renders the first page of PRs from the mock API", async () => {
    renderWithClient(<PurchaseRequestList />);

    const total = MOCK_PURCHASE_REQUESTS.length;
    const expected = Math.min(10, total);

    await waitFor(() => {
      const rows = within(screen.getByRole("table"))
        .getAllByRole("row")
        .slice(1);
      expect(rows).toHaveLength(expected);
    });
  });

  it("filters by tab=pending end-to-end", async () => {
    renderWithClient(<PurchaseRequestList />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("tab", { name: /pending for approval/i }));

    await waitFor(() => {
      const rows = within(screen.getByRole("table"))
        .getAllByRole("row")
        .slice(1);
      expect(rows.length).toBeGreaterThan(0);
      for (const row of rows) {
        expect(row.textContent).toContain("PENDING APPROVAL");
      }
    });
  });

  it("searches across number/title/requester/plant", async () => {
    renderWithClient(<PurchaseRequestList />);
    const user = userEvent.setup();
    const target = MOCK_PURCHASE_REQUESTS[7];

    await user.type(
      screen.getByLabelText(/search purchase requests/i),
      target.number
    );

    await waitFor(() => {
      expect(screen.getByText(target.number)).toBeInTheDocument();
    });
  });

  it("shows an empty state when nothing matches", async () => {
    renderWithClient(<PurchaseRequestList />);
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText(/search purchase requests/i),
      "__no_such_request_anywhere__"
    );

    await waitFor(() => {
      expect(
        screen.getByText(/no purchase requests match these filters/i)
      ).toBeInTheDocument();
    });
  });
});
