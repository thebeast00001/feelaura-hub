"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, cartTotal, cartCount } from "@/lib/cart-store";
import { useOrders } from "@/lib/orders-store";
import { useNowBar } from "@/lib/nowbar-store";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { useViewing } from "@/lib/viewing-store";
import { useReminders } from "@/lib/reminders-store";
import { getUpcoming } from "@/lib/reminder-utils";
import { deliveryStage, STAGE_LABELS } from "@/lib/delivery-stages";
import { useMounted } from "@/lib/use-mounted";
import { flyToCart } from "@/lib/fly";
import { formatPrice, cn } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";

const FREE_DELIVERY_AT = 999;

type Activity = "product" | "delivery" | "cart" | "reminder" | "continue";

export default function NowBar() {
  const mounted = useMounted();
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const drawerOpen = useCart((s) => s.isOpen);
  const openCart = useCart((s) => s.open);
  const restore = useCart((s) => s.restore);
  const add = useCart((s) => s.add);
  const viewing = useViewing((s) => s.product);
  const active = useOrders((s) => s.active);
  const clearOrder = useOrders((s) => s.clearOrder);
  const rate = useOrders((s) => s.rate);
  const barHidden = useNowBar((s) => s.hidden);
  const showBar = useNowBar((s) => s.show);
  const hideBar = useNowBar((s) => s.hide);
  const lastViewed = useRecentlyViewed((s) => s.items[0]);
  const reminders = useReminders((s) => s.reminders);
  const upcomingReminder = getUpcoming(reminders)[0];

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const onProduct = pathname.startsWith("/product/");
  const activities: Activity[] = [];
  if (onProduct && viewing) activities.push("product");
  if (active) activities.push("delivery");
  if (items.length > 0) activities.push("cart");
  if (upcomingReminder && upcomingReminder.days <= 30) activities.push("reminder");
  if (lastViewed && !onProduct) activities.push("continue");

  useEffect(() => {
    if (index >= activities.length) setIndex(0);
  }, [activities.length, index]);

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  if (!mounted) return null;

  const suppressed =
    drawerOpen ||
    activities.length === 0 ||
    pathname === "/cart" ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");
  if (suppressed) return null;

  // Minimised → show a small restore handle instead.
  if (barHidden) {
    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.85rem+env(safe-area-inset-bottom))] z-[55] flex justify-center px-4">
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={showBar}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink/90 px-4 py-2 text-xs font-semibold text-cream shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur"
        >
          {active ? (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold/70" />
              <span className="relative inline-flex size-2 rounded-full bg-gold" />
            </span>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l1 13H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
          )}
          Show updates
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      </div>
    );
  }

  const current = activities[Math.min(index, activities.length - 1)];
  const total = cartTotal(items);
  const count = cartCount(items);
  const stage = active ? deliveryStage(active, now) : null;

  function cycle(dir: number) {
    setIndex((i) => (i + dir + activities.length) % activities.length);
    setExpanded(false);
  }

  function reorder() {
    if (active?.items?.length) {
      restore(active.items);
      openCart();
    }
  }

  function addCurrent(e: React.MouseEvent<HTMLButtonElement>) {
    if (!viewing) return;
    add(viewing, 1);
    const rect = e.currentTarget.getBoundingClientRect();
    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.85rem+env(safe-area-inset-bottom))] z-[55] flex flex-col items-center px-4">
      {activities.length > 1 && (
        <div className="pointer-events-auto mb-2 flex gap-1.5">
          {activities.map((a, i) => (
            <button
              key={a}
              aria-label={`Show ${a}`}
              onClick={() => {
                setIndex(i);
                setExpanded(false);
              }}
              className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-5 bg-ink" : "w-1.5 bg-ink/30")}
            />
          ))}
        </div>
      )}

      <div className="pointer-events-auto relative w-full max-w-sm">
        {/* Dismiss */}
        <button
          aria-label="Hide the updates bar"
          onClick={hideBar}
          className="absolute -top-2.5 right-1 z-10 grid size-6 place-items-center rounded-full bg-ink text-cream shadow-md ring-2 ring-cream transition-transform active:scale-90"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <motion.div
          drag={!expanded && activities.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) cycle(1);
            else if (info.offset.x > 60) cycle(-1);
          }}
          className="w-full overflow-hidden rounded-[2rem] bg-ink text-cream shadow-[0_20px_50px_-18px_rgba(0,0,0,0.6)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {/* ---------- PRODUCT (add to cart) ---------- */}
            {current === "product" && viewing ? (
              <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <ProductImage name={viewing.name} hue={viewing.hue} image={viewing.image} sizes="44px" className="size-11 shrink-0 rounded-full" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{viewing.name}</span>
                    <span className="block text-xs text-cream/60">{formatPrice(viewing.price)}</span>
                  </span>
                  <button
                    onClick={addCurrent}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream py-2.5 pl-4 pr-2.5 text-sm font-bold text-ink transition-colors active:bg-gold"
                  >
                    Add
                    <span className="grid size-6 place-items-center rounded-full bg-ink text-cream">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : /* ---------- DELIVERY ---------- */
            current === "delivery" && stage ? (
              <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/12">
                    {stage.delivered ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
                        <circle cx="7" cy="18" r="1.6" />
                        <circle cx="17.5" cy="18" r="1.6" />
                      </svg>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{stage.delivered ? "Delivered" : stage.label}</span>
                    <span className="block truncate text-xs text-cream/60">{stage.delivered ? "Rate your order" : stage.sub}</span>
                  </span>
                  {!stage.delivered && (
                    <span className="flex items-center gap-1 pr-1" aria-hidden>
                      {[0, 1, 2, 3].map((s) => (
                        <span key={s} className={cn("size-1.5 rounded-full transition-colors", s <= stage.index ? "bg-gold" : "bg-cream/25")} />
                      ))}
                    </span>
                  )}
                  <motion.svg animate={{ rotate: expanded ? 180 : 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-cream/60">
                    <path d="m6 9 6 6 6-6" />
                  </motion.svg>
                </button>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <div className="border-t border-cream/10 px-5 py-4">
                        <div className="mb-3 flex items-center justify-between text-xs">
                          <span className="text-cream/50">Order {active?.ref}</span>
                          <span className="text-cream/50">{active?.itemCount} {active?.itemCount === 1 ? "gift" : "gifts"} · {formatPrice(active?.total ?? 0)}</span>
                        </div>

                        {stage.delivered ? (
                          /* Rate & reorder */
                          <div>
                            <p className="text-sm font-semibold">How was your order?</p>
                            <div className="mt-2 flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button key={n} aria-label={`Rate ${n} stars`} onClick={() => rate(n)} className="transition-transform active:scale-90">
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill={(active?.rating ?? 0) >= n ? "var(--color-gold)" : "none"} stroke="var(--color-gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                            {active?.rating ? <p className="mt-2 text-xs text-gold">Thanks for your feedback!</p> : null}
                            <div className="mt-4 flex gap-2">
                              <button onClick={reorder} className="flex-1 rounded-full bg-cream py-3 text-sm font-bold text-ink transition-colors hover:bg-gold">Reorder</button>
                              <button onClick={() => { clearOrder(); setExpanded(false); }} className="flex-1 rounded-full border border-cream/25 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cream/10">Done</button>
                            </div>
                          </div>
                        ) : (
                          /* Timeline */
                          <ol className="relative ml-1">
                            {STAGE_LABELS.map((label, i) => {
                              const done = i < stage.index;
                              const isCurrent = i === stage.index;
                              return (
                                <li key={label} className="flex gap-3 pb-4 last:pb-0">
                                  <div className="relative flex flex-col items-center">
                                    <span className={cn("z-10 grid size-4 place-items-center rounded-full transition-colors", done || isCurrent ? "bg-gold" : "bg-cream/20")}>
                                      {done && (
                                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="m5 13 4 4L19 7" />
                                        </svg>
                                      )}
                                    </span>
                                    {i < STAGE_LABELS.length - 1 && <span className={cn("absolute top-4 h-full w-0.5", i < stage.index ? "bg-gold" : "bg-cream/15")} />}
                                  </div>
                                  <div className={cn("-mt-0.5", isCurrent ? "text-cream" : done ? "text-cream/80" : "text-cream/40")}>
                                    <p className={cn("text-sm", isCurrent && "font-semibold")}>{label}</p>
                                    {isCurrent && <p className="text-xs text-cream/60">{stage.sub}</p>}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : current === "cart" ? (
              /* ---------- CART ---------- */
              <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center gap-3 px-3.5 py-2.5">
                  <button onClick={() => setExpanded((v) => !v)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/12">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 7h12l1 13H5L6 7Z" />
                        <path d="M9 7a3 3 0 0 1 6 0" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{count} {count === 1 ? "gift" : "gifts"} in cart</span>
                      <span className="block truncate text-xs text-cream/60">{total >= FREE_DELIVERY_AT ? "Free delivery unlocked" : `${formatPrice(FREE_DELIVERY_AT - total)} to free delivery`}</span>
                    </span>
                  </button>
                  <Link href="/checkout" className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream py-2.5 pl-4 pr-2.5 text-sm font-bold text-ink transition-colors active:bg-gold">
                    {formatPrice(total)}
                    <span className="grid size-6 place-items-center rounded-full bg-ink text-cream">→</span>
                  </Link>
                </div>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <div className="border-t border-cream/10 px-4 py-4">
                        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                          {items.slice(0, 6).map((item) => (
                            <ProductImage key={item.id} name={item.name} hue={item.hue} image={item.image} sizes="52px" className="size-12 shrink-0 rounded-xl" />
                          ))}
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream/15">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (total / FREE_DELIVERY_AT) * 100)}%`, background: total >= FREE_DELIVERY_AT ? "var(--color-sage)" : "var(--color-gold)" }} />
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => { openCart(); setExpanded(false); }} className="flex-1 rounded-full border border-cream/25 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cream/10">View cart</button>
                          <Link href="/checkout" className="flex-1 rounded-full bg-cream py-3 text-center text-sm font-bold text-ink transition-colors hover:bg-gold">Checkout</Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : current === "reminder" && upcomingReminder ? (
              /* ---------- REMINDER ---------- */
              <motion.div key="reminder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <Link href={`/shop?occasion=${upcomingReminder.reminder.occasion}`} className="flex items-center gap-3 px-3.5 py-2.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/12">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-cream/60">Coming up</span>
                    <span className="block truncate text-sm font-semibold">
                      {upcomingReminder.reminder.person}&apos;s {upcomingReminder.reminder.occasionLabel.toLowerCase()}{" "}
                      {upcomingReminder.days === 0 ? "is today" : upcomingReminder.days === 1 ? "is tomorrow" : `in ${upcomingReminder.days} days`}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-cream px-4 py-2 text-xs font-bold text-ink">Find a gift</span>
                </Link>
              </motion.div>
            ) : (
              /* ---------- CONTINUE ---------- */
              lastViewed && (
                <motion.div key="continue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Link href={`/product/${lastViewed.slug}`} className="flex items-center gap-3 px-3 py-2.5">
                    <ProductImage name={lastViewed.name} hue={lastViewed.hue} image={lastViewed.image} sizes="44px" className="size-11 shrink-0 rounded-full" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs text-cream/60">Pick up where you left off</span>
                      <span className="block truncate text-sm font-semibold">{lastViewed.name}</span>
                    </span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream/12 text-cream">→</span>
                  </Link>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
