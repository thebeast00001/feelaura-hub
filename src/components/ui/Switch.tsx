"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** One UI toggle switch. */
export default function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-full bg-surface px-5 py-3.5 transition-colors",
        className
      )}
    >
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <span
        className={cn(
          "relative block h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
          checked ? "bg-accent" : "bg-line"
        )}
      >
        <motion.span
          animate={{ x: checked ? 21 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-[3px] block size-[22px] rounded-full bg-surface shadow-md"
        />
      </span>
    </button>
  );
}
