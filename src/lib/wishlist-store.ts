"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSnapshot } from "./types";

interface WishlistState {
  items: ProductSnapshot[];
  toggle: (item: ProductSnapshot) => void;
  remove: (id: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      toggle: (item) =>
        set((state) =>
          state.items.some((i) => i.id === item.id)
            ? { items: state.items.filter((i) => i.id !== item.id) }
            : { items: [...state.items, item] }
        ),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    }),
    { name: "feelaura-wishlist" }
  )
);
