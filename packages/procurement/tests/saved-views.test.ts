import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSavedViews } from "../src/store/saved-views";

describe("saved-views store", () => {
  beforeEach(() => {
    localStorage.clear();
    // reset to defaults
    useSavedViews.setState({
      views: [
        {
          id: "default-mine",
          name: "My open RFQs",
          filters: { status: ["published", "in_review"] },
          isDefault: true,
          createdAt: new Date().toISOString(),
        },
      ],
      activeViewId: "default-mine",
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("adds a view and sets it active", () => {
    const view = useSavedViews.getState().addView("Cancelled this month", {
      status: ["cancelled"],
    });
    expect(view.id).toMatch(/^sv-/);
    const state = useSavedViews.getState();
    expect(state.activeViewId).toBe(view.id);
    expect(state.views.find((v) => v.id === view.id)?.filters.status).toEqual([
      "cancelled",
    ]);
  });

  it("removes a view and clears active when removed", () => {
    const v = useSavedViews.getState().addView("X", {});
    useSavedViews.getState().removeView(v.id);
    expect(useSavedViews.getState().views.find((x) => x.id === v.id)).toBeUndefined();
    expect(useSavedViews.getState().activeViewId).not.toBe(v.id);
  });
});
