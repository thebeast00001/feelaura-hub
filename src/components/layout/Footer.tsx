import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { CATEGORIES } from "@/lib/products";
import NewsletterForm from "./NewsletterForm";
import Logo from "@/components/ui/Logo";

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3h-2.5A3.5 3.5 0 0 0 8 6.5V9H6v3h2v9h3v-9h2.5l.5-3h-3V6.8c0-.5.4-.8.8-.8H14V3Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M4 4l16 16M20 4 4 20" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-10">
      {/* Newsletter card — floating One UI panel */}
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 md:rounded-[2.5rem] md:px-14 md:py-16">
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              background: `
                radial-gradient(55% 90% at 12% 100%, hsl(18 60% 28%) 0%, transparent 70%),
                radial-gradient(45% 70% at 90% 0%, hsl(340 40% 26%) 0%, transparent 70%)`,
            }}
          />
          <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className="text-display text-3xl font-semibold text-cream md:text-5xl">
                Never miss a<span className="italic text-gold"> moment</span> worth gifting.
              </h2>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-12 py-14 md:grid-cols-[2fr_1fr_1fr_1.2fr] md:py-20">
        <div className="col-span-2 md:col-span-1">
          <Logo variant="full" className="h-20 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">{BRAND.description}</p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid size-11 place-items-center rounded-full border border-line text-ink-soft transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Shop">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Shop</p>
          <ul className="mt-5 space-y-3.5">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="link-underline text-sm text-ink-soft hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Help</p>
          <ul className="mt-5 space-y-3.5">
            {[
              ["Shop All", "/shop"],
              ["Gift Finder", "/gift-finder"],
              ["Occasion Reminders", "/reminders"],
              ["Wishlist", "/wishlist"],
              ["Cart", "/cart"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="link-underline text-sm text-ink-soft hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Get in touch</p>
          <ul className="mt-5 space-y-3.5 text-sm text-ink-soft">
            <li>
              <a href="mailto:hello@feelaura-hub.in" className="link-underline hover:text-ink">
                hello@feelaura-hub.in
              </a>
            </li>
            <li>
              <a href="tel:+911234567890" className="link-underline hover:text-ink">
                +91 12345 67890
              </a>
            </li>
            <li className="text-ink-faint">Mon–Sat, 9am–9pm IST</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Same-day delivery", "Secure payments", "Hand-wrapped"].map((t) => (
              <span key={t} className="rounded-full bg-cream-soft px-3.5 py-1.5 text-xs font-medium text-ink-soft">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized outlined wordmark */}
      <div className="overflow-hidden px-2 pb-6 md:pb-10" aria-hidden>
        <p className="text-display text-outline select-none whitespace-nowrap text-center text-[clamp(3rem,12vw,10.5rem)] font-bold leading-none">
          {BRAND.name}
          <span className="text-accent" style={{ WebkitTextStroke: "0" }}>
            .
          </span>
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Made with ♥ for people who give well.</p>
        </div>
      </div>
    </footer>
  );
}
