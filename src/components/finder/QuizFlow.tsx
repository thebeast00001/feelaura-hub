"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  sub?: string;
  hue?: number;
  image?: string | null;
}

interface OccasionInput {
  slug: string;
  name: string;
  tagline: string;
  hue: number;
  image: string | null;
}

const BUDGETS: Option[] = [
  { value: "under-500", label: "Under ₹500", sub: "Small but mighty", hue: 40 },
  { value: "500-1500", label: "₹500 – ₹1,500", sub: "The sweet spot", hue: 150 },
  { value: "over-1500", label: "₹1,500+", sub: "Go all out", hue: 285 },
  { value: "", label: "Any budget", sub: "Show me everything", hue: 15 },
];

const VIBES: Option[] = [
  { value: "mugs", label: "Sip on a memory", sub: "Mugs", hue: 15 },
  { value: "photo-frames", label: "Keep it forever", sub: "Photo Frames", hue: 280 },
  { value: "led-lamps", label: "Warm & glowing", sub: "LED Lamps", hue: 260 },
  { value: "hampers", label: "Big & lavish", sub: "Hampers", hue: 45 },
  { value: "tote-bags", label: "Everyday carry", sub: "Tote Bags", hue: 140 },
  { value: "", label: "Surprise me", sub: "A bit of everything", hue: 200 },
];

export default function QuizFlow({ occasions }: { occasions: OccasionInput[] }) {
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
    image: o.image,
  }));

  const steps = [
    { question: "Who's it for, and why?", hint: "The occasion", options: occasionOptions },
    { question: "What's the budget?", hint: "Your spend", options: BUDGETS },
    { question: "What's their vibe?", hint: "The style", options: VIBES },
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

  const s = steps[step];

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-soft">
            <motion.div
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-accent"
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: leaving ? 0.5 : 1, x: 0 }}
          exit={{ opacity: 0, x: -36 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Step {step + 1} of 3 · {s.hint}
          </p>
          <h2 className="text-display mt-3 text-3xl font-semibold md:text-5xl">{s.question}</h2>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {s.options.map((opt, i) => (
              <motion.button
                key={`${step}-${opt.value}-${opt.label}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i + 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileTap={{ scale: 0.97 }}
                onClick={() => choose(opt.value)}
                className="group flex flex-col overflow-hidden rounded-[1.4rem] border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1 hover:border-ink"
              >
                {/* Cover: photo when available, else a colour swatch */}
                <div className="relative aspect-[5/3] w-full overflow-hidden">
                  {opt.image ? (
                    <Image
                      src={opt.image}
                      alt=""
                      fill
                      sizes="(max-width:768px) 45vw, 220px"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="size-full transition-transform duration-700 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, hsl(${opt.hue ?? 20} 55% 82%), hsl(${((opt.hue ?? 20) + 34) % 360} 50% 70%))`,
                      }}
                    />
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold leading-snug">{opt.label}</p>
                  {opt.sub && <p className="mt-0.5 text-xs text-ink-faint">{opt.sub}</p>}
                </div>
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
