"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

interface OrderSummary {
  ref: string;
  itemCount: number;
  total: number;
  deliveryDate: string;
  pincode: string;
  region: string;
  message?: string;
}

export default function SuccessPage() {
  const clear = useCart((s) => s.clear);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  // Clear the cart (also when arriving back from Stripe) and read the summary.
  useEffect(() => {
    clear();
    try {
      const raw = sessionStorage.getItem("feelaura-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* private mode */
    }
  }, [clear]);

  const deliveryLabel = order?.deliveryDate
    ? new Date(`${order.deliveryDate}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="container-x flex min-h-[85vh] flex-col items-center justify-center pb-24 pt-28 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="grid size-20 place-items-center rounded-full bg-sage/25"
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-sage)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <h1 className="text-display mt-8 text-4xl font-semibold md:text-5xl">
          Order placed with love
        </h1>

        {order ? (
          <div className="mt-8 rounded-[1.8rem] border border-line bg-surface p-6 text-left">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
                Order reference
              </p>
              <p className="text-sm font-bold">{order.ref}</p>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {deliveryLabel && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Arriving</dt>
                  <dd className="text-right font-semibold">{deliveryLabel}</dd>
                </div>
              )}
              {order.pincode && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">Delivering to</dt>
                  <dd className="text-right font-medium">
                    {order.region ? `${order.region} · ` : ""}
                    {order.pincode}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">
                  {order.itemCount} {order.itemCount === 1 ? "gift" : "gifts"}
                </dt>
                <dd className="text-display text-right text-lg font-semibold">
                  {formatPrice(order.total)}
                </dd>
              </div>
              {order.message?.trim() && (
                <div className="rounded-2xl bg-cream-soft px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Card message
                  </p>
                  <p className="text-display mt-1 line-clamp-2 text-sm italic">
                    {order.message.trim()}
                  </p>
                </div>
              )}
            </dl>
          </div>
        ) : (
          <p className="mx-auto mt-4 max-w-md text-ink-soft">
            Thank you! We&apos;re wrapping your gift right now — you&apos;ll receive a
            confirmation email with tracking details shortly.
          </p>
        )}

        <p className="mt-6 text-xs text-ink-faint">
          A confirmation email with tracking details is on its way.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent"
        >
          Continue shopping
        </Link>
      </motion.div>
    </div>
  );
}
