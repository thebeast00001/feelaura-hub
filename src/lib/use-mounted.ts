"use client";

import { useEffect, useState } from "react";

/**
 * Returns false on the server render and first client render, true after mount.
 * Used to safely render cart state persisted in localStorage without
 * hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
