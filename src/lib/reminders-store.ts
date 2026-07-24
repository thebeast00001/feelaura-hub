"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Reminder {
  id: string;
  /** Who the date belongs to, e.g. "Mum" */
  person: string;
  /** Occasion slug (matches OCCASIONS) for shop deep-links */
  occasion: string;
  occasionLabel: string;
  /** Original date, YYYY-MM-DD (year used for anniversaries/age) */
  dateIso: string;
  /** Repeat every year */
  yearly: boolean;
  /** Hide nudges until this ISO date (set when dismissed) */
  snoozedUntil?: string;
}

interface RemindersState {
  reminders: Reminder[];
  add: (r: Omit<Reminder, "id">) => void;
  remove: (id: string) => void;
  snooze: (id: string, untilIso: string) => void;
}

function makeId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export const useReminders = create<RemindersState>()(
  persist(
    (set) => ({
      reminders: [],

      add: (r) =>
        set((s) => ({
          reminders: [...s.reminders, { ...r, id: makeId() }].slice(0, 100),
        })),

      remove: (id) => set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) })),

      snooze: (id, untilIso) =>
        set((s) => ({
          reminders: s.reminders.map((r) => (r.id === id ? { ...r, snoozedUntil: untilIso } : r)),
        })),
    }),
    { name: "feelaura-reminders" }
  )
);
