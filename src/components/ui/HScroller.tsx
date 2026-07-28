"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll row with aesthetic prev/next controls on laptop+ screens.
 * Touch-drag scroll everywhere; arrow buttons appear on lg and fade out at the
 * ends. The scroll classes (margins, gaps, snap) are passed via `className` so
 * each section keeps its own edge-to-edge / padding behaviour.
 */
export default function HScroller({
  children,
  className,
  wrapperClassName,
  arrowTop = "top-1/2",
}: {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  /** Tailwind top-* for vertical arrow alignment (default centred). */
  arrowTop?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const nudge = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 640), behavior: "smooth" });
  };

  const arrowBase = cn(
    "absolute z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/95 text-ink shadow-[0_12px_34px_-14px_rgba(0,0,0,0.5)] backdrop-blur transition-all duration-300 hover:border-accent hover:bg-accent hover:text-cream lg:grid",
    arrowTop
  );

  return (
    <div className={cn("relative", wrapperClassName)}>
      <div ref={ref} onScroll={update} className={cn("no-scrollbar flex overflow-x-auto", className)}>
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => nudge(-1)}
        className={cn(arrowBase, "-left-5", atStart && "pointer-events-none opacity-0")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => nudge(1)}
        className={cn(arrowBase, "-right-5", atEnd && "pointer-events-none opacity-0")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
