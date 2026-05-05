"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RfqFilters, SavedView } from "../types";

interface SavedViewsState {
  views: SavedView[];
  activeViewId: string | null;
  addView: (name: string, filters: RfqFilters) => SavedView;
  removeView: (id: string) => void;
  setActive: (id: string | null) => void;
  setDefault: (id: string) => void;
}

export const useSavedViews = create<SavedViewsState>()(
  persist(
    (set, get) => ({
      views: [
        {
          id: "default-mine",
          name: "My open RFQs",
          filters: { status: ["published", "in_review"] },
          isDefault: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "default-urgent",
          name: "Urgent (<24h)",
          filters: {},
          createdAt: new Date().toISOString(),
        },
      ],
      activeViewId: "default-mine",
      addView: (name, filters) => {
        const view: SavedView = {
          id: `sv-${Date.now()}`,
          name,
          filters,
          createdAt: new Date().toISOString(),
        };
        set({ views: [...get().views, view], activeViewId: view.id });
        return view;
      },
      removeView: (id) =>
        set({
          views: get().views.filter((v) => v.id !== id),
          activeViewId: get().activeViewId === id ? null : get().activeViewId,
        }),
      setActive: (id) => set({ activeViewId: id }),
      setDefault: (id) =>
        set({
          views: get().views.map((v) => ({ ...v, isDefault: v.id === id })),
        }),
    }),
    { name: "procurement.saved-views" }
  )
);
