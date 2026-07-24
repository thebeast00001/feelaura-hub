"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function NewsletterForm() {
  const [done, setDone] = useState(false);

  return (
    <div>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-[54px] items-center gap-2 text-cream"
          >
            <span className="grid size-8 place-items-center rounded-full bg-sage/30 text-sage">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 13 4 4L19 7" />
              </svg>
            </span>
            You&apos;re in — good things coming.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get("email");
              if (typeof email === "string") {
                // Fire-and-forget — stored in Supabase when configured
                fetch("/api/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                }).catch(() => {});
              }
              setDone(true);
            }}
            className="flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 p-1.5 pl-5 backdrop-blur transition-colors focus-within:border-cream/50"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="w-full bg-transparent py-2 text-sm text-cream outline-none placeholder:text-cream/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-cream px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold"
            >
              Join
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <p className="mt-3 text-xs text-cream/50">
        Occasion reminders &amp; early access. No spam, ever.
      </p>
    </div>
  );
}
