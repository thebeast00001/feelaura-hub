"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "./types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  /** Re-insert previously removed items (toast Undo) */
  restore: (items: CartItem[]) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          const items = existing
            ? state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            : [
                ...state.items,
                {
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  compareAtPrice: product.compareAtPrice,
                  hue: product.hue,
                  image: product.image,
                  quantity,
                },
              ];
          // Note: no longer auto-opens the drawer — a toast + flying dot
          // confirm the add instead (less interruptive).
          return { items };
        }),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      restore: (restored) =>
        set((s) => ({
          items: [
            ...s.items,
            ...restored.filter((r) => !s.items.some((i) => i.id === r.id)),
          ],
        })),
    }),
    { name: "feelaura-cart", partialize: (s) => ({ items: s.items }) }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.price * i.quantity, 0);
}

/** Total saved vs. compare-at prices across the cart. */
export function cartSavings(items: CartItem[]): number {
  return items.reduce(
    (n, i) => n + Math.max(0, (i.compareAtPrice ?? i.price) - i.price) * i.quantity,
    0
  );
}
