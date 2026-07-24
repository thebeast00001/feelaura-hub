"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthState, CLERK_ENABLED } from "@/lib/auth-store";

/**
 * Publishes Clerk's sign-in state into a plain store so the Now Bar can gate
 * account-only activities. Renders nothing. When Clerk isn't configured the
 * store already defaults to "allowed", so this does nothing.
 */
export default function AuthState() {
  if (!CLERK_ENABLED) return null;
  return <ClerkWatcher />;
}

function ClerkWatcher() {
  const { isSignedIn, isLoaded } = useUser();
  const setSignedIn = useAuthState((s) => s.setSignedIn);

  useEffect(() => {
    if (isLoaded) setSignedIn(!!isSignedIn);
  }, [isSignedIn, isLoaded, setSignedIn]);

  return null;
}
