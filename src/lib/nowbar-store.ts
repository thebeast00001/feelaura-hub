"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Whether the Now Bar is minimised. When hidden, a small restore handle is
 * shown instead so the user can bring it back. Preference persists, but a new
 * order re-reveals it (see checkout).
 */
interface NowBarState {
  hidden: boolean;
  hide: () => void;
  show: () => void;
}

export const useNowBar = create<NowBarState>()(
  persist(
    (set) => ({
      hidden: false,
      hide: () => set({ hidden: true }),
      show: () => set({ hidden: false }),
    }),
    { name: "feelaura-nowbar" }
  )
);
