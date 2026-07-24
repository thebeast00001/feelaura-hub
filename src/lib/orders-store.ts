"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

export interface ActiveOrder {
  ref: string;
  placedAt: number; // epoch ms
  deliveryDate: string; // YYYY-MM-DD
  itemCount: number;
  total: number;
  region: string;
  /** Snapshot of the ordered items, so the customer can reorder in one tap */
  items: CartItem[];
  /** 1–5 star rating once delivered */
  rating?: number;
}

interface OrdersState {
  active: ActiveOrder | null;
  place: (o: ActiveOrder) => void;
  clearOrder: () => void;
  rate: (stars: number) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      active: null,
      place: (o) => set({ active: o }),
      clearOrder: () => set({ active: null }),
      rate: (stars) =>
        set((s) => (s.active ? { active: { ...s.active, rating: stars } } : {})),
    }),
    { name: "feelaura-active-order" }
  )
);
