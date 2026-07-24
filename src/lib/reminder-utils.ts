import type { Reminder } from "./reminders-store";

function midnight(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * The next time this reminder's date comes around.
 * Yearly reminders roll forward to this year or next; one-offs in the
 * past return null.
 */
export function nextOccurrence(reminder: Reminder, today = new Date()): Date | null {
  const [y, m, d] = reminder.dateIso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const t = midnight(today);

  if (!reminder.yearly) {
    const date = new Date(y, m - 1, d);
    return date >= t ? date : null;
  }

  let candidate = new Date(t.getFullYear(), m - 1, d);
  if (candidate < t) candidate = new Date(t.getFullYear() + 1, m - 1, d);
  return candidate;
}

export function daysUntil(date: Date, today = new Date()): number {
  return Math.round((midnight(date).getTime() - midnight(today).getTime()) / 86_400_000);
}

export function formatOccurrence(date: Date): string {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" });
}

export interface UpcomingReminder {
  reminder: Reminder;
  date: Date;
  days: number;
}

/** Active (non-snoozed) reminders with a future occurrence, soonest first. */
export function getUpcoming(reminders: Reminder[], today = new Date()): UpcomingReminder[] {
  const t = midnight(today);
  return reminders
    .map((reminder) => {
      const date = nextOccurrence(reminder, today);
      return date ? { reminder, date, days: daysUntil(date, today) } : null;
    })
    .filter((u): u is UpcomingReminder => {
      if (!u) return false;
      const snoozed = u.reminder.snoozedUntil ? new Date(u.reminder.snoozedUntil) >= t : false;
      return !snoozed;
    })
    .sort((a, b) => a.days - b.days);
}
