"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useReminders } from "@/lib/reminders-store";
import { getUpcoming, formatOccurrence } from "@/lib/reminder-utils";
import { useMounted } from "@/lib/use-mounted";

/**
 * Home-page nudge: when a saved occasion is within 14 days, surface it
 * with a one-tap route to fitting gifts. Dismiss snoozes until the day
 * after the occasion.
 */
export default function ReminderNudge() {
  const mounted = useMounted();
  const { reminders, snooze } = useReminders();

  if (!mounted) return null;

  const next = getUpcoming(reminders).find((u) => u.days <= 14);
  if (!next) return null;

  const { reminder, date, days } = next;
  const when = days === 0 ? "is today" : days === 1 ? "is tomorrow" : `is in ${days} days`;

  function dismiss() {
    const until = new Date(date);
    until.setDate(until.getDate() + 1);
    snooze(reminder.id, until.toISOString().slice(0, 10));
  }

  return (
    <div className="container-x pt-10 md:pt-14">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-ink p-6 sm:flex-row sm:items-center sm:justify-between md:p-8"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(50% 90% at 8% 100%, hsl(35 60% 32%) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Coming up
            </p>
            <p className="text-display mt-2 text-2xl font-semibold text-cream md:text-3xl">
              {reminder.person}&apos;s {reminder.occasionLabel.toLowerCase()} {when}
            </p>
            <p className="mt-1 text-sm text-cream/60">{formatOccurrence(date)} — don&apos;t show up empty-handed.</p>
          </div>

          <div className="relative flex items-center gap-2">
            <Link
              href={`/shop?occasion=${reminder.occasion}`}
              className="rounded-full bg-cream px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold"
            >
              Find a gift →
            </Link>
            <button
              aria-label="Dismiss reminder"
              onClick={dismiss}
              className="grid size-11 place-items-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
