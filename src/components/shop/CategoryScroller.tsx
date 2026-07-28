"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Wraps the shop category chip bar and keeps its horizontal scroll position
 * across navigations. Without this, tapping a chip navigates to a new route,
 * the bar re-mounts, and the scroll jumps back to "All". We persist scrollLeft
 * in sessionStorage and restore it before paint; on a fresh visit we centre
 * the active chip instead.
 */
const KEY = "shop-category-scroll";

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function CategoryScroller({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const saved = sessionStorage.getItem(KEY);
    if (saved !== null) {
      el.scrollLeft = Number(saved) || 0;
    } else {
      const active = el.querySelector<HTMLElement>('[data-active="true"]');
      if (active) {
        el.scrollLeft = Math.max(
          0,
          active.offsetLeft - el.clientWidth / 2 + active.clientWidth / 2
        );
      }
    }

    const onScroll = () => sessionStorage.setItem(KEY, String(el.scrollLeft));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
