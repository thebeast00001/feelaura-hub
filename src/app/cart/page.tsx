"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart, cartTotal, cartSavings } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";

export default function CartPage() {
  const mounted = useMounted();
  const { items, remove, setQuantity } = useCart();
  const total = cartTotal(items);
  const freeDelivery = total >= 999;

  if (!mounted) return <div className="min-h-[70vh]" />;

  const savings = cartSavings(items);
  const grandTotal = total + (freeDelivery ? 0 : 99);

  return (
    <div className="container-x pb-32 pt-28 md:pt-36 lg:pb-24">
      <h1 className="text-display text-5xl font-semibold md:text-6xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-display text-3xl">Nothing here yet</p>
          <p className="mt-3 text-ink-soft">Find something they&apos;ll never forget.</p>
          <Link href="/shop" className="mt-8 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-5 py-6">
                    <Link href={`/product/${item.slug}`} className="group shrink-0">
                      <ProductImage
                        name={item.name}
                        hue={item.hue}
                        image={item.image}
                        sizes="112px"
                        className="size-24 rounded-2xl md:size-28"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <Link href={`/product/${item.slug}`} className="font-medium leading-snug hover:text-accent">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-sm text-ink-faint transition-colors hover:text-accent"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-ink-faint">{formatPrice(item.price)} each</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="grid size-9 place-items-center text-ink-soft hover:text-ink"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="grid size-9 place-items-center text-ink-soft hover:text-ink"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <aside className="h-fit rounded-3xl bg-cream-soft p-7 lg:sticky lg:top-28">
            <h2 className="text-display text-2xl font-semibold">Summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium">{formatPrice(total)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-sage">You&apos;re saving</dt>
                  <dd className="font-semibold text-sage">{formatPrice(savings)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Delivery</dt>
                <dd className="font-medium">{freeDelivery ? "Free" : formatPrice(99)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="text-display text-xl font-semibold">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>
            {!freeDelivery && (
              <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-xs text-ink-soft">
                Add {formatPrice(999 - total)} more for free delivery.
              </p>
            )}
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-ink py-4 text-center text-sm font-semibold text-cream transition-colors hover:bg-accent"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}

      {/* Sticky checkout pill — thumb zone on mobile */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-[calc(0.9rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-sm lg:hidden"
        >
          <div className="flex items-center justify-between rounded-full bg-ink/90 p-2 pl-6 shadow-[0_16px_40px_-12px_rgb(27_23_18/0.5)] backdrop-blur-xl">
            <div className="mr-4">
              <p className="text-[0.65rem] uppercase tracking-wider text-cream/60">Total</p>
              <p className="text-display text-lg font-semibold leading-tight text-cream">
                {formatPrice(grandTotal)}
              </p>
            </div>
            <Link
              href="/checkout"
              className="rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-ink transition-colors active:bg-accent active:text-cream"
            >
              Checkout
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
