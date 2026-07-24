"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveOrder {
  ref: string;
  placedAt: number; // epoch ms
  deliveryDate: string; // YYYY-MM-DD
  itemCount: number;
  total: number;
  region: string;
}

interface OrdersState {
  active: ActiveOrder | null;
  place: (o: ActiveOrder) => void;
  clearOrder: () => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      active: null,
      place: (o) => set({ active: o }),
      clearOrder: () => set({ active: null }),
    }),
    { name: "feelaura-active-order" }
  )
);
