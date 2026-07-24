"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { BRAND } from "@/lib/brand";
import { useCart, cartCount } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";
import AuthControls from "./AuthControls";
import ThemeToggle from "./ThemeToggle";
import FlyToCart from "./FlyToCart";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/occasions", label: "Occasions" },
  { href: "/gift-finder", label: "Gift Finder" },
  { href: "/reminders", label: "Reminders" },
  { href: "/shop/hampers", label: "Hampers" },
];

const TRENDING = [
  { label: "Birthday", href: "/shop?occasion=birthday" },
  { label: "Hampers", href: "/shop/hampers" },
  { label: "Chocolates", href: "/shop/chocolates" },
  { label: "Flowers", href: "/shop/flowers" },
  { label: "Anniversary", href: "/shop?occasion=anniversary" },
];

const SEARCH_KEY = "feelaura-searches";

function getRecentSearches(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(SEARCH_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 5) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  try {
    localStorage.setItem(
      SEARCH_KEY,
      JSON.stringify([q, ...getRecentSearches().filter((x) => x !== q)].slice(0, 5))
    );
  } catch {
    /* private mode */
  }
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const count = cartCount(items);
  const wishCount = useWishlist((s) => s.items.length);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQ("");
  }, [pathname]);

  // Load recent searches whenever the search field opens
  useEffect(() => {
    if (searchOpen) setRecent(getRecentSearches());
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes search and menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-3 z-50 md:top-5"
      >
        <div className="container-x">
          {/* Floating pill nav bar */}
          <div
            className={cn(
              "flex h-14 items-center justify-between gap-3 rounded-full border pl-5 pr-2 transition-all duration-500 md:h-16 md:pl-6 md:pr-2.5",
              scrolled || menuOpen || searchOpen
                ? "border-line bg-cream/85 shadow-[0_16px_40px_-20px_rgb(27_23_18/0.35)] backdrop-blur-xl"
                : "border-line/60 bg-cream/60 backdrop-blur-md"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {searchOpen ? (
                /* Navbar morphs into the search field */
                <motion.form
                  key="search"
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -14 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = searchQ.trim();
                    if (q) {
                      saveRecentSearch(q);
                      router.push(`/shop?search=${encodeURIComponent(q)}`);
                      setSearchOpen(false);
                      setSearchQ("");
                    }
                  }}
                >
                  <svg className="shrink-0 text-ink-faint" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    name="q"
                    autoFocus
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search gifts, flowers, cakes…"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint md:text-base"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-ink px-5 py-2 text-xs font-bold text-cream transition-colors hover:bg-accent md:px-6 md:py-2.5"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                    className="grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-ink/5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="bar"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex w-full items-center justify-between gap-3"
                >
            {/* Wordmark */}
            <Link href="/" className="text-display shrink-0 text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
              {BRAND.name}
              <span className="text-accent">.</span>
            </Link>

            {/* Desktop nav — pill links with sliding active pill */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[0.82rem] font-medium transition-colors duration-300",
                      active ? "text-cream" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions — theme toggle moves into the menu sheet on small screens */}
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <div className="max-sm:hidden">
                <ThemeToggle />
              </div>
              <AuthControls />
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-ink/5"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>

              <Link
                href="/wishlist"
                aria-label={`Wishlist, ${wishCount} items`}
                className="relative hidden size-10 place-items-center rounded-full transition-colors hover:bg-ink/5 sm:grid"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.5S3.5 15.5 3.5 9.6C3.5 6.6 5.9 4.5 8.5 4.5c1.5 0 2.8.7 3.5 1.9.7-1.2 2-1.9 3.5-1.9 2.6 0 5 2.1 5 5.1 0 5.9-8.5 10.9-8.5 10.9Z" />
                </svg>
                {mounted && wishCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-accent text-[0.65rem] font-bold text-cream">
                    {wishCount}
                  </span>
                )}
              </Link>

              <button
                id="cart-btn"
                aria-label={`Cart, ${count} items`}
                onClick={openCart}
                className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-ink/5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 7h12l1 13H5L6 7Z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
                {mounted && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-accent text-[0.65rem] font-bold text-cream"
                  >
                    {count}
                  </motion.span>
                )}
              </button>

              <button
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="grid size-10 place-items-center rounded-full transition-[background-color,transform] duration-300 select-none hover:bg-ink/5 active:scale-90 lg:hidden"
              >
                <div className="flex w-[16px] flex-col gap-[4.5px]">
                  <span className={cn("h-[1.7px] w-full rounded-full bg-ink transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]", menuOpen && "translate-y-[6.2px] rotate-45")} />
                  <span className={cn("h-[1.7px] w-full rounded-full bg-ink transition-opacity duration-300", menuOpen && "opacity-0")} />
                  <span className={cn("h-[1.7px] w-full rounded-full bg-ink transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]", menuOpen && "-translate-y-[6.2px] -rotate-45")} />
                </div>
              </button>
            </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Recent + trending chips — shown while the search field is empty */}
          <AnimatePresence>
            {searchOpen && searchQ.trim() === "" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 rounded-[1.6rem] border border-line bg-cream/90 p-4 shadow-[0_16px_40px_-20px_rgb(27_23_18/0.35)] backdrop-blur-xl"
              >
                {recent.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink-faint">
                        Recent
                      </p>
                      <button
                        onClick={() => {
                          try {
                            localStorage.removeItem(SEARCH_KEY);
                          } catch {
                            /* private mode */
                          }
                          setRecent([]);
                        }}
                        className="text-xs font-medium text-ink-faint transition-colors hover:text-accent"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {recent.map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            saveRecentSearch(q);
                            setSearchOpen(false);
                            setSearchQ("");
                            router.push(`/shop?search=${encodeURIComponent(q)}`);
                          }}
                          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink-faint">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 3" />
                          </svg>
                          {q}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <p className={cn("text-[0.68rem] font-bold uppercase tracking-[0.18em] text-ink-faint", recent.length > 0 && "mt-4")}>
                  Trending
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {TRENDING.map((t) => (
                    <Link
                      key={t.label}
                      href={t.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQ("");
                      }}
                      className="rounded-full bg-ink/5 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink hover:text-cream"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <FlyToCart />

      {/* Mobile menu — floating rounded sheet */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 cursor-default bg-ink/25 lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed inset-x-3 top-[4.6rem] z-40 overflow-hidden rounded-[2rem] border border-line bg-cream p-3 shadow-[0_32px_64px_-24px_rgb(27_23_18/0.4)] will-change-transform lg:hidden"
            >
              <nav aria-label="Mobile">
                {[{ href: "/", label: "Home" }, ...NAV, { href: "/wishlist", label: "Wishlist" }].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "text-display flex items-center justify-between rounded-full px-5 py-3.5 text-2xl transition-colors",
                        pathname === item.href ? "bg-ink text-cream" : "active:bg-ink/5"
                      )}
                    >
                      {item.label}
                      <span className="text-base text-accent">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Theme control (small screens only — lives in the pill on larger) */}
              <div className="mt-1 flex items-center justify-between border-t border-line px-5 py-2.5 sm:hidden">
                <span className="text-sm font-medium text-ink-soft">Appearance</span>
                <ThemeToggle />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
