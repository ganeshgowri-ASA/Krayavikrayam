import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PATH = "/purchase-requests";

async function gotoPRs(page: Page) {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "Purchase Requests" })).toBeVisible();
}

test.describe("KV-C1.6 — Purchase Requests list", () => {
  test("renders header, tabs and data table", async ({ page }) => {
    await gotoPRs(page);

    const tablist = page.getByRole("tablist", { name: /purchase request status/i });
    await expect(tablist).toBeVisible();

    for (const label of ["Draft", "Pending for approval", "Under rework", "Need clarification", "All"]) {
      await expect(tablist.getByRole("tab", { name: label })).toBeVisible();
    }

    const table = page.getByTestId("pr-table");
    await expect(table).toBeVisible();
    for (const header of ["ID", "Title", "Requester", "Plant", "Amount", "Status", "Updated"]) {
      await expect(table.getByRole("columnheader", { name: header })).toBeVisible();
    }
    await expect(page.getByTestId("pr-row").first()).toBeVisible();
  });

  test("switching a tab updates ?tab= and the visible rows", async ({ page }) => {
    await gotoPRs(page);

    const draftRows = await page.getByTestId("pr-row").count();
    expect(draftRows).toBeGreaterThan(0);
    for (const status of await page.getByTestId("pr-row").locator("td:nth-child(6)").allInnerTexts()) {
      expect(status.trim()).toBe("Draft");
    }

    await page.getByRole("tab", { name: "Pending for approval" }).click();

    await expect(page).toHaveURL(/[?&]tab=pending(?:&|$)/);
    await expect(page.getByRole("tab", { name: "Pending for approval" })).toHaveAttribute("aria-selected", "true");

    const statuses = await page.getByTestId("pr-row").locator("td:nth-child(6)").allInnerTexts();
    expect(statuses.length).toBeGreaterThan(0);
    for (const status of statuses) {
      expect(status.trim()).toBe("Pending");
    }
  });

  test("typing in Search by debounces and updates ?q=", async ({ page }) => {
    await gotoPRs(page);

    await page.getByRole("tab", { name: "All" }).click();
    await expect(page).toHaveURL(/[?&]tab=all(?:&|$)/);

    const search = page.getByRole("searchbox", { name: /search by/i });
    await search.fill("HVAC");

    // The URL update is debounced — give it time to land but don't assert on
    // exact timing here (would be flaky); the debounced effect is what makes
    // this a meaningful smoke test rather than a synchronous one.
    await expect(page).toHaveURL(/[?&]q=HVAC(?:&|$)/, { timeout: 2_000 });

    const rows = page.getByTestId("pr-row");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("HVAC");

    await search.fill("");
    await expect(page).not.toHaveURL(/[?&]q=/, { timeout: 2_000 });
  });

  test("has no serious or critical axe-core a11y violations", async ({ page }) => {
    await gotoPRs(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      blocking,
      blocking.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} nodes`).join("\n"),
    ).toEqual([]);
  });
});
