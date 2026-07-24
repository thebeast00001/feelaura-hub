"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, cartTotal, cartSavings } from "@/lib/cart-store";
import { useOrders } from "@/lib/orders-store";
import { useNowBar } from "@/lib/nowbar-store";
import { useMounted } from "@/lib/use-mounted";
import { checkDelivery, getDeliveryDates, isValidPincode } from "@/lib/delivery";
import { formatPrice, cn } from "@/lib/utils";
import Suggestions from "@/components/cart/Suggestions";

const FIELDS = [
  { name: "name", label: "Full name", type: "text", autoComplete: "name", span: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "address", label: "Delivery address", type: "text", autoComplete: "street-address", span: true },
  { name: "city", label: "City", type: "text", autoComplete: "address-level2" },
];

function GiftCardPreview({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 16, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.5 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 rounded-[1.6rem] border border-line bg-surface p-6 shadow-[0_20px_44px_-20px_rgb(27_23_18/0.25)] md:p-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Your card will read
          </p>
          <p className="text-display mt-3 whitespace-pre-wrap text-lg italic leading-relaxed">
            {message.trim()}
          </p>
          <p className="text-display mt-4 text-right text-sm text-ink-faint">
            — handwritten with care
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function CheckoutPage() {
  const mounted = useMounted();
  const router = useRouter();
  const { items, clear } = useCart();
  const placeOrder = useOrders((s) => s.place);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pin, setPin] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const total = cartTotal(items);
  const savings = cartSavings(items);
  const delivery = total >= 999 ? 0 : 99;
  const grandTotal = total + delivery;
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  // Restore PIN checked earlier on a product page
  useEffect(() => {
    try {
      const saved = localStorage.getItem("feelaura-pin");
      if (saved && isValidPincode(saved)) setPin(saved);
    } catch {
      /* private mode */
    }
  }, []);

  const pinInfo = useMemo(() => (isValidPincode(pin) ? checkDelivery(pin) : null), [pin]);
  const dates = useMemo(
    () => (pinInfo?.serviceable ? getDeliveryDates(pinInfo.etaDays) : []),
    [pinInfo]
  );

  useEffect(() => {
    if (dates.length > 0 && !dates.some((d) => d.iso === selectedDate)) {
      setSelectedDate(dates[0].iso);
    }
  }, [dates, selectedDate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setErrorMsg("");

    if (!pinInfo?.serviceable) {
      setStatus("error");
      setErrorMsg("Please enter a serviceable 6-digit PIN code.");
      return;
    }
    if (!selectedDate) {
      setStatus("error");
      setErrorMsg("Please pick a delivery date.");
      return;
    }

    setStatus("loading");
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          pincode: pin,
          deliveryDate: selectedDate,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          city: form.get("city"),
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      const orderRef = data.orderRef ?? "FA-DEMO";
      try {
        sessionStorage.setItem(
          "feelaura-last-order",
          JSON.stringify({
            ref: orderRef,
            itemCount,
            total: grandTotal,
            deliveryDate: selectedDate,
            pincode: pin,
            region: pinInfo?.region ?? "",
            message,
          })
        );
      } catch {
        /* private mode */
      }

      // Start the live delivery tracker in the Now Bar (and re-reveal it if
      // the customer had previously minimised it).
      placeOrder({
        ref: orderRef,
        placedAt: Date.now(),
        deliveryDate: selectedDate,
        itemCount,
        total: grandTotal,
        region: pinInfo?.region ?? "",
        items: [...items],
      });
      useNowBar.getState().show();

      if (data.url) {
        window.location.href = data.url;
      } else {
        clear();
        router.push("/checkout/success");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (!mounted) return <div className="min-h-[70vh]" />;

  if (items.length === 0 && status !== "loading") {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-20 text-center">
        <h1 className="text-display text-4xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-ink-soft">Add something wonderful before checking out.</p>
        <Link href="/shop" className="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent">
          Browse gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x pb-24 pt-24 md:pt-36">
      <h1 className="text-display text-4xl font-semibold sm:text-5xl md:text-6xl">Checkout</h1>

      <div className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
        {/* Mobile order summary — collapsible, always visible up top */}
        <div className="overflow-hidden rounded-[1.6rem] border border-line bg-surface lg:hidden">
          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            aria-expanded={summaryOpen}
            className="flex w-full items-center justify-between gap-3 px-5 py-4"
          >
            <span className="text-sm font-semibold">
              Order summary
              <span className="ml-1.5 font-normal text-ink-faint">
                · {itemCount} {itemCount === 1 ? "gift" : "gifts"}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="text-display text-lg font-semibold">{formatPrice(grandTotal)}</span>
              <motion.svg
                animate={{ rotate: summaryOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ink-faint"
              >
                <path d="m6 9 6 6 6-6" />
              </motion.svg>
            </span>
          </button>

          <AnimatePresence>
            {summaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-line px-5 py-4">
                  <ul className="space-y-2.5">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-4 text-sm">
                        <span className="text-ink-soft">
                          {item.name} <span className="text-ink-faint">× {item.quantity}</span>
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                    {savings > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-sage">You&apos;re saving</dt>
                        <dd className="font-semibold text-sage">{formatPrice(savings)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-ink-soft">Delivery</dt>
                      <dd className="font-medium">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-display text-2xl font-semibold">Delivery details</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.name} className={f.span ? "sm:col-span-2" : ""}>
                <span className="mb-1.5 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {f.label}
                </span>
                <input
                  required
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  className="w-full rounded-full border border-line bg-transparent px-5 py-3.5 text-sm outline-none transition-colors focus:border-ink"
                />
              </label>
            ))}

            {/* PIN code with live serviceability */}
            <label>
              <span className="mb-1.5 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                PIN code
              </span>
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                autoComplete="postal-code"
                className={cn(
                  "w-full rounded-full border bg-transparent px-5 py-3.5 text-sm outline-none transition-colors focus:border-ink",
                  pinInfo && !pinInfo.serviceable ? "border-accent" : "border-line"
                )}
              />
            </label>

            <div className="flex items-center text-xs font-medium max-sm:-mt-2 max-sm:pl-4 sm:items-end sm:pb-2">
              <AnimatePresence mode="wait">
                {pinInfo && (
                  <motion.p
                    key={pinInfo.serviceable ? "ok" : "no"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={pinInfo.serviceable ? "text-sage" : "text-accent"}
                  >
                    {pinInfo.serviceable
                      ? pinInfo.sameDay
                        ? `Same-day available in ${pinInfo.region}`
                        : `Delivering to ${pinInfo.region} in ${pinInfo.etaDays} days`
                      : "✕ Not serviceable yet — try another PIN"}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Delivery date picker */}
            <AnimatePresence>
              {dates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden sm:col-span-2"
                >
                  <span className="mb-1.5 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    Delivery date
                  </span>
                  <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 max-sm:-mx-5 max-sm:px-5">
                    {dates.map((d) => {
                      const active = d.iso === selectedDate;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDate(d.iso)}
                          aria-pressed={active}
                          className={cn(
                            "shrink-0 rounded-full border px-5 py-2.5 text-center transition-all duration-300",
                            active
                              ? "border-ink bg-ink text-cream"
                              : "border-line bg-transparent text-ink-soft hover:border-ink-faint"
                          )}
                        >
                          <span className="block text-xs font-bold">{d.label}</span>
                          <span className={cn("block text-[0.65rem]", active ? "text-cream/70" : "text-ink-faint")}>
                            {d.sublabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <label className="sm:col-span-2">
              <span className="mb-1.5 block pl-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Gift message (optional)
              </span>
              <textarea
                name="message"
                rows={3}
                maxLength={300}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We'll handwrite this on the card…"
                className="w-full resize-none rounded-[1.5rem] border border-line bg-transparent px-5 py-3.5 text-sm outline-none transition-colors focus:border-ink"
              />
            </label>

            {/* Gift card preview — inline on mobile, right column on desktop */}
            <div className="sm:col-span-2 lg:hidden">
              <GiftCardPreview message={message} />
            </div>
          </div>

          {status === "error" && (
            <p className="mt-4 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent">
              {errorMsg || "Something went wrong. Please try again."}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={status === "loading"}
            className="mt-8 w-full rounded-full bg-ink py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent disabled:opacity-60 sm:w-auto sm:px-12"
          >
            {status === "loading" ? "Processing…" : `Pay ${formatPrice(grandTotal)}`}
          </motion.button>
          <p className="mt-3 text-xs text-ink-faint">
            Payments are processed securely by Stripe. We never see your card details.
          </p>
        </form>

        {/* Desktop order summary column */}
        <div className="max-lg:hidden">
          <aside className="h-fit rounded-3xl bg-cream-soft p-7 lg:sticky lg:top-28">
            <h2 className="text-display text-2xl font-semibold">Order</h2>
            <ul className="mt-5 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-ink-soft">
                    {item.name} <span className="text-ink-faint">× {item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
              {savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-sage">You&apos;re saving</dt>
                  <dd className="font-semibold text-sage">{formatPrice(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="font-medium">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
              </div>
              <div className="flex justify-between text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="text-display text-xl font-semibold">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>

            <div className="-mx-7 mt-4 [&>div]:border-t-0 [&>div]:px-7 [&>div]:py-0">
              <Suggestions title="Last-minute add-ons" />
            </div>
          </aside>

          <GiftCardPreview message={message} />
        </div>
      </div>
    </div>
  );
}
