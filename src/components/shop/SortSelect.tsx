"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const OPTIONS: Array<[string, string]> = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"],
  ["rating", "Top Rated"],
];

/** One UI pill dropdown replacing the native <select>. */
export default function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = OPTIONS.find(([v]) => v === current)?.[1] ?? "Featured";

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(value: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          open
            ? "border-ink bg-ink text-cream"
            : "border-line bg-transparent text-ink hover:border-ink-faint"
        )}
      >
        <span className="text-xs text-ink-faint" aria-hidden style={open ? { color: "var(--color-cream)", opacity: 0.6 } : undefined}>
          Sort
        </span>
        {currentLabel}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Sort products"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full z-40 mt-2 w-52 origin-top-right rounded-[1.4rem] border border-line bg-cream p-1.5 shadow-[0_24px_48px_-16px_rgb(27_23_18/0.3)]"
          >
            {OPTIONS.map(([value, label]) => {
              const active = value === current;
              return (
                <li key={value} role="option" aria-selected={active}>
                  <button
                    onClick={() => select(value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-full px-4 py-2.5 text-left text-sm font-medium transition-colors",
                      active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                    )}
                  >
                    {label}
                    {active && <span aria-hidden>✓</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
