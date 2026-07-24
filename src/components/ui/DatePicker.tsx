"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** One UI calendar dropdown replacing the native date input. */
export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const selected = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : null;
  const [view, setView] = useState(() => selected ?? today);

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

  const y = view.getFullYear();
  const m = view.getMonth();
  const firstWeekday = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  function shift(months: number, years = 0) {
    setView(new Date(y + years, m + months, 1));
  }

  const navBtn =
    "grid size-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream-soft hover:text-ink";

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (selected) setView(selected);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 rounded-full border bg-surface px-5 py-3.5 text-left text-sm transition-colors",
          open ? "border-ink" : "border-line hover:border-ink-faint"
        )}
      >
        <svg className="shrink-0 text-ink-faint" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
        <span className={selected ? "font-medium" : "text-ink-faint"}>
          {selected
            ? selected.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : placeholder}
        </span>
      </button>

      {/* Calendar panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Choose date"
            initial={{ opacity: 0, y: -8, scale: 0.97, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -8, scale: 0.97, x: "-50%" }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-full z-40 mt-2 w-full min-w-[16.5rem] max-w-[20rem] origin-top rounded-[1.6rem] border border-line bg-cream p-4 shadow-[0_24px_48px_-16px_rgb(27_23_18/0.3)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button type="button" aria-label="Previous year" onClick={() => shift(0, -1)} className={navBtn}>
                  «
                </button>
                <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className={navBtn}>
                  ‹
                </button>
              </div>
              <p className="text-sm font-bold">
                {MONTHS[m]} <span className="text-ink-faint">{y}</span>
              </p>
              <div className="flex items-center">
                <button type="button" aria-label="Next month" onClick={() => shift(1)} className={navBtn}>
                  ›
                </button>
                <button type="button" aria-label="Next year" onClick={() => shift(0, 1)} className={navBtn}>
                  »
                </button>
              </div>
            </div>

            {/* Weekday header */}
            <div className="mt-3 grid grid-cols-7 text-center">
              {WEEKDAYS.map((w, i) => (
                <span key={i} className="py-1 text-[0.65rem] font-bold uppercase text-ink-faint">
                  {w}
                </span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <span key={`b${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                const iso = toIso(y, m, d);
                const isSelected = value === iso;
                const isToday =
                  d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      onChange(iso);
                      setOpen(false);
                    }}
                    aria-pressed={isSelected}
                    className={cn(
                      "mx-auto grid size-9 place-items-center rounded-full text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-ink text-cream"
                        : isToday
                          ? "border border-accent text-accent hover:bg-accent hover:text-cream"
                          : "text-ink-soft hover:bg-cream-soft hover:text-ink"
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
