"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, cartTotal, cartSavings } from "@/lib/cart-store";
import { useMediaQuery } from "@/lib/use-media";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import Suggestions from "@/components/cart/Suggestions";

const FREE_DELIVERY_AT = 999;

export default function CartDrawer() {
  const { items, isOpen, close, remove, setQuantity, clear } = useCart();
  const total = cartTotal(items);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const progress = Math.min(1, total / FREE_DELIVERY_AT);

  // Lock page scroll while the cart is open; Escape closes it.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[60] cursor-default bg-ink/40 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={isDesktop ? { x: "100%" } : { y: "100%" }}
            animate={isDesktop ? { x: 0 } : { y: 0 }}
            exit={isDesktop ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            drag={isDesktop ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) close();
            }}
            className="fixed z-[70] flex flex-col bg-cream shadow-2xl max-sm:inset-x-0 max-sm:bottom-0 max-sm:max-h-[86svh] max-sm:rounded-t-[1.8rem] sm:inset-y-0 sm:right-0 sm:w-full sm:max-w-md sm:rounded-l-[2rem]"
          >
            {/* Grab handle (mobile bottom sheet) */}
            <div className="grid place-items-center pb-1 pt-3 sm:hidden" aria-hidden>
              <div className="h-1 w-10 rounded-full bg-line" />
            </div>

            <div className="flex items-center justify-between border-b border-line px-6 py-4 sm:py-5">
              <p className="text-display text-xl font-semibold">
                Your Cart
                {items.length > 0 && (
                  <span className="ml-2 align-middle text-sm font-normal text-ink-faint">
                    ({items.length})
                  </span>
                )}
              </p>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={clear}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-faint transition-colors hover:bg-cream-soft hover:text-accent"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={close}
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-full transition-colors hover:bg-cream-soft"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center sm:py-0">
                <div className="grid size-16 place-items-center rounded-full bg-cream-soft">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-faint)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 7h12l1 13H5L6 7Z" />
                    <path d="M9 7a3 3 0 0 1 6 0" />
                  </svg>
                </div>
                <p className="text-display text-2xl">Nothing here yet</p>
                <p className="text-sm text-ink-soft">Find something they&apos;ll never forget.</p>
                <button
                  onClick={close}
                  className="mt-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-accent"
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery progress */}
                <div className="border-b border-line px-6 py-4">
                  <p className="text-xs font-medium text-ink-soft">
                    {total >= FREE_DELIVERY_AT ? (
                      <span className="text-sage">Free delivery unlocked</span>
                    ) : (
                      <>
                        <span className="font-semibold text-ink">{formatPrice(FREE_DELIVERY_AT - total)}</span> away
                        from free delivery
                      </>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-soft">
                    <motion.div
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 22 }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          total >= FREE_DELIVERY_AT ? "var(--color-sage)" : "var(--color-accent)",
                      }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <Link href={`/product/${item.slug}`} onClick={close} className="group shrink-0">
                            <ProductImage
                              name={item.name}
                              hue={item.hue}
                              image={item.image}
                              sizes="80px"
                              className="size-20 rounded-2xl"
                            />
                          </Link>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-3">
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={close}
                                className="text-sm font-medium leading-snug hover:text-accent"
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => remove(item.id)}
                                aria-label={`Remove ${item.name}`}
                                className="grid size-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-cream-soft hover:text-accent"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center rounded-full bg-cream-soft">
                                <button
                                  aria-label="Decrease quantity"
                                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                                  className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-line hover:text-ink"
                                >
                                  −
                                </button>
                                <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                  aria-label="Increase quantity"
                                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                                  className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-line hover:text-ink"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                {/* Suggestions crowd the bottom sheet on phones — desktop drawer only */}
                <div className="max-sm:hidden">
                  <Suggestions />
                </div>

                <div className="border-t border-line px-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5">
                  {cartSavings(items) > 0 && (
                    <p className="mb-2 text-right text-xs font-semibold text-sage">
                      You&apos;re saving {formatPrice(cartSavings(items))}
                    </p>
                  )}
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-ink-soft">Subtotal</p>
                    <p className="text-display text-xl font-semibold">{formatPrice(total)}</p>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block rounded-full bg-ink py-4 text-center text-sm font-semibold text-cream transition-colors hover:bg-accent"
                  >
                    Checkout · {formatPrice(total)}
                  </Link>
                  <p className="mt-3 text-center text-xs text-ink-faint">Secure checkout · Ships in 24h</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
