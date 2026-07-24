"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Occasion } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  sub?: string;
  hue?: number;
}

const BUDGETS: Option[] = [
  { value: "under-500", label: "Under ₹500", sub: "Small but mighty" },
  { value: "500-1500", label: "₹500 – ₹1,500", sub: "The sweet spot" },
  { value: "over-1500", label: "₹1,500+", sub: "Go all out" },
  { value: "", label: "Any budget", sub: "Show me everything" },
];

const VIBES: Option[] = [
  { value: "flowers", label: "Fresh & blooming", sub: "Flowers", hue: 340 },
  { value: "cakes", label: "Sweet tooth", sub: "Cakes", hue: 25 },
  { value: "personalized", label: "Keep it forever", sub: "Personalized", hue: 265 },
  { value: "soft-toys", label: "Cozy & cute", sub: "Soft toys", hue: 200 },
  { value: "hampers", label: "Big & lavish", sub: "Hampers", hue: 45 },
  { value: "", label: "Surprise me", sub: "A bit of everything", hue: 150 },
];

export default function QuizFlow({ occasions }: { occasions: Occasion[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  const occasionOptions: Option[] = occasions.map((o) => ({
    value: o.slug,
    label: o.name,
    sub: o.tagline,
    hue: o.hue,
  }));

  const steps = [
    { question: "What's the occasion?", options: occasionOptions },
    { question: "What's the budget?", options: BUDGETS },
    { question: "What's their vibe?", options: VIBES },
  ];

  function choose(value: string) {
    if (step === 0) {
      setOccasion(value);
      setStep(1);
    } else if (step === 1) {
      setBudget(value);
      setStep(2);
    } else {
      setLeaving(true);
      const qs = new URLSearchParams({ sort: "rating" });
      if (occasion) qs.set("occasion", occasion);
      if (budget) qs.set("price", budget);
      const base = value ? `/shop/${value}` : "/shop";
      router.push(`${base}?${qs.toString()}`);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-10 flex items-center gap-2">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-soft"
          >
            <motion.div
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-accent"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: leaving ? 0.5 : 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Step {step + 1} of 3
          </p>
          <h2 className="text-display mt-3 text-4xl font-semibold md:text-5xl">
            {steps[step].question}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {steps[step].options.map((opt, i) => (
              <motion.button
                key={`${step}-${opt.value}-${opt.label}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.96 }}
                onClick={() => choose(opt.value)}
                className={cn(
                  "group rounded-[1.4rem] border border-line bg-surface p-4 text-left transition-all duration-300",
                  "hover:-translate-y-1 hover:border-ink hover:shadow-[0_16px_32px_-16px_rgb(27_23_18/0.25)]"
                )}
              >
                {opt.hue !== undefined && (
                  <span
                    aria-hidden
                    className="mb-3 block h-2 w-8 rounded-full transition-all duration-300 group-hover:w-12"
                    style={{ background: `hsl(${opt.hue} 50% 74%)` }}
                  />
                )}
                <p className="text-sm font-semibold leading-snug">{opt.label}</p>
                {opt.sub && <p className="mt-1 text-xs text-ink-faint">{opt.sub}</p>}
              </motion.button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-8 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              ← Back
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
