"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReminders } from "@/lib/reminders-store";
import { getUpcoming, formatOccurrence } from "@/lib/reminder-utils";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";
import Switch from "@/components/ui/Switch";
import DatePicker from "@/components/ui/DatePicker";

const OCCASION_CHIPS = [
  { slug: "birthday", label: "Birthday", hue: 35 },
  { slug: "anniversary", label: "Anniversary", hue: 350 },
  { slug: "love-romance", label: "Valentine's", hue: 335 },
  { slug: "congratulations", label: "Big day", hue: 150 },
  { slug: "new-baby", label: "Baby due", hue: 210 },
  { slug: "just-because", label: "Other", hue: 270 },
];

export default function RemindersPage() {
  const mounted = useMounted();
  const { reminders, add, remove } = useReminders();
  const [person, setPerson] = useState("");
  const [occasion, setOccasion] = useState(OCCASION_CHIPS[0]);
  const [dateIso, setDateIso] = useState("");
  const [yearly, setYearly] = useState(true);
  const [added, setAdded] = useState(false);

  if (!mounted) return <div className="min-h-[70vh]" />;

  const upcoming = getUpcoming(reminders);
  const canSubmit = person.trim().length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(dateIso);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    add({
      person: person.trim().slice(0, 40),
      occasion: occasion.slug,
      occasionLabel: occasion.label,
      dateIso,
      yearly,
    });
    setPerson("");
    setDateIso("");
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="container-x pb-24 pt-28 md:pt-36">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        Never miss a moment
      </p>
      <h1 className="text-display mt-3 max-w-xl text-5xl font-semibold md:text-7xl">
        Occasion reminders
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Save the dates that matter. We&apos;ll nudge you here when one is coming up — with the
        perfect gifts ready to go.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        {/* Add form */}
        <form onSubmit={handleAdd} className="h-fit rounded-[2rem] bg-cream-soft p-6 md:p-8 lg:sticky lg:top-28">
          <h2 className="text-display text-2xl font-semibold">Add a date</h2>

          <label className="mt-6 block">
            <span className="mb-1.5 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Who is it for?
            </span>
            <input
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              maxLength={40}
              placeholder="Mum, Rahul, my better half…"
              className="w-full rounded-full border border-line bg-surface px-5 py-3.5 text-sm outline-none transition-colors focus:border-ink"
            />
          </label>

          <div className="mt-5">
            <span className="mb-2 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Occasion
            </span>
            <div className="flex flex-wrap gap-2">
              {OCCASION_CHIPS.map((o) => (
                <button
                  key={o.slug + o.label}
                  type="button"
                  onClick={() => setOccasion(o)}
                  aria-pressed={occasion.label === o.label}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                    occasion.label === o.label
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-surface text-ink-soft hover:border-ink-faint"
                  )}
                >
                  <span aria-hidden className="size-2 rounded-full" style={{ background: `hsl(${o.hue} 55% 65%)` }} />
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="mb-1.5 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Date
            </span>
            <DatePicker value={dateIso} onChange={setDateIso} placeholder="Pick their special day" />
          </div>

          <Switch
            checked={yearly}
            onChange={setYearly}
            label="Repeat every year"
            className="mt-5"
          />

          <button
            disabled={!canSubmit}
            className="mt-6 w-full rounded-full bg-ink py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent disabled:opacity-40"
          >
            {added ? "Saved ✓" : "Save reminder"}
          </button>
          <p className="mt-3 text-center text-xs text-ink-faint">
            Stored privately on your device.
          </p>
        </form>

        {/* List */}
        <div>
          {upcoming.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-line p-10 text-center">
              <p className="text-display text-2xl">No dates saved yet</p>
              <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">
                Add a birthday or anniversary and we&apos;ll count down to it for you.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {upcoming.map(({ reminder, date, days }) => (
                  <motion.li
                    key={reminder.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-4 rounded-[1.6rem] border border-line bg-surface p-4 md:p-5">
                      <div
                        aria-hidden
                        className="text-display grid size-12 shrink-0 place-items-center rounded-2xl text-xl font-semibold md:size-14"
                        style={{
                          background: `hsl(${OCCASION_CHIPS.find((o) => o.slug === reminder.occasion)?.hue ?? 270} 45% 88%)`,
                          color: `hsl(${OCCASION_CHIPS.find((o) => o.slug === reminder.occasion)?.hue ?? 270} 50% 35%)`,
                        }}
                      >
                        {reminder.person.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {reminder.person}
                          <span className="font-normal text-ink-soft"> · {reminder.occasionLabel}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-ink-faint">
                          {formatOccurrence(date)}
                          {reminder.yearly ? " · repeats yearly" : ""}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-[0.68rem] font-bold",
                              days === 0
                                ? "bg-accent text-cream"
                                : days <= 7
                                  ? "bg-accent/10 text-accent"
                                  : "bg-cream-soft text-ink-soft"
                            )}
                          >
                            {days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `In ${days} days`}
                          </span>
                          <Link
                            href={`/shop?occasion=${reminder.occasion}`}
                            className="rounded-full bg-ink px-3 py-1 text-[0.68rem] font-bold text-cream transition-colors hover:bg-accent"
                          >
                            Find a gift →
                          </Link>
                        </div>
                      </div>

                      <button
                        aria-label={`Delete reminder for ${reminder.person}`}
                        onClick={() => remove(reminder.id)}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-cream-soft hover:text-accent"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
