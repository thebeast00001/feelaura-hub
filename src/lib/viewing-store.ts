"use client";

import { create } from "zustand";
import type { Product } from "./types";

/**
 * The product currently being viewed, published by the product page so the
 * Now Bar can offer an "Add to cart" action for it. Not persisted — it's
 * cleared when leaving the product page.
 */
interface ViewingState {
  product: Product | null;
  setProduct: (p: Product) => void;
  clearProduct: () => void;
}

export const useViewing = create<ViewingState>((set) => ({
  product: null,
  setProduct: (p) => set({ product: p }),
  clearProduct: () => set({ product: null }),
}));
