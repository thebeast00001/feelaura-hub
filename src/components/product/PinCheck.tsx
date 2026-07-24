"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { checkDelivery, isValidPincode, type DeliveryInfo } from "@/lib/delivery";

const STORAGE_KEY = "feelaura-pin";

/** PIN-code serviceability check with delivery estimate. */
export default function PinCheck() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<DeliveryInfo | null>(null);
  const [touched, setTouched] = useState(false);

  // Restore the last-checked pin
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isValidPincode(saved)) {
        setPin(saved);
        setResult(checkDelivery(saved));
      }
    } catch {
      /* private mode */
    }
  }, []);

  function handleCheck() {
    setTouched(true);
    if (!isValidPincode(pin)) {
      setResult(null);
      return;
    }
    const info = checkDelivery(pin);
    setResult(info);
    try {
      localStorage.setItem(STORAGE_KEY, pin);
    } catch {
      /* private mode */
    }
  }

  const invalid = touched && pin.length > 0 && !isValidPincode(pin);

  return (
    <div className="mt-8 rounded-[1.5rem] bg-cream-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        Check delivery
      </p>
      <div className="mt-3 flex items-center gap-2 rounded-full border border-line bg-surface p-1.5 pl-4 transition-colors focus-within:border-ink">
        <svg className="shrink-0 text-ink-faint" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <input
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setTouched(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          placeholder="Enter PIN code"
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink-faint"
        />
        <button
          onClick={handleCheck}
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-xs font-bold text-cream transition-colors hover:bg-accent"
        >
          Check
        </button>
      </div>

      <AnimatePresence mode="wait">
        {invalid && (
          <motion.p
            key="invalid"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs font-medium text-accent"
          >
            Please enter a valid 6-digit PIN code.
          </motion.p>
        )}
        {result && !invalid && (
          <motion.div
            key={`${result.region}-${result.etaDays}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2 text-xs font-medium"
          >
            {result.serviceable ? (
              <>
                <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-sage" />
                <span className="text-ink-soft">
                  {result.sameDay ? (
                    <>
                      <span className="font-bold text-sage">Same-day delivery</span> available in{" "}
                      {result.region}. Order by 4 PM.
                    </>
                  ) : (
                    <>
                      Delivered to <span className="font-bold">{result.region}</span> in{" "}
                      <span className="font-bold">
                        {result.etaDays} {result.etaDays === 1 ? "day" : "days"}
                      </span>
                      .
                    </>
                  )}
                </span>
              </>
            ) : (
              <>
                <span className="mt-px text-accent">✕</span>
                <span className="text-ink-soft">
                  We don&apos;t deliver to this PIN yet — we&apos;re expanding fast. Try another
                  address?
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
