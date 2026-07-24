"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSnapshot } from "./types";

interface RecentlyViewedState {
  items: ProductSnapshot[];
  addView: (item: ProductSnapshot) => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addView: (item) =>
        set((s) => ({
          items: [item, ...s.items.filter((i) => i.id !== item.id)].slice(0, 12),
        })),
    }),
    { name: "feelaura-recent" }
  )
);
