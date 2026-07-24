"use client";

import { create } from "zustand";

/** Whether Clerk auth is configured at all. */
export const CLERK_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Lightweight mirror of the Clerk sign-in state so non-Clerk components (like
 * the Now Bar) can gate account-only features without importing Clerk hooks.
 * When Clerk isn't configured there's no auth to gate on, so we treat the
 * visitor as allowed.
 */
interface AuthState {
  signedIn: boolean;
  setSignedIn: (v: boolean) => void;
}

export const useAuthState = create<AuthState>((set) => ({
  signedIn: !CLERK_ENABLED,
  setSignedIn: (v) => set({ signedIn: v }),
}));
