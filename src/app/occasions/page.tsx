import type { Metadata } from "next";
import Link from "next/link";
import { OCCASIONS } from "@/lib/products";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Shop by Occasion",
  description: "Find the perfect gift for every moment — birthdays, anniversaries, thank-yous and more.",
};

export default function OccasionsPage() {
  return (
    <div className="container-x pb-24 pt-28 md:pt-36">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Every moment covered
        </p>
        <h1 className="text-display mt-3 max-w-xl text-5xl font-semibold md:text-7xl">
          What are we celebrating?
        </h1>
        <p className="mt-4 max-w-md text-ink-soft">
          Start with the moment — we&apos;ll show you gifts that fit it perfectly.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {OCCASIONS.map((o, i) => (
          <Reveal key={o.slug} delay={(i % 4) * 0.06}>
            <Link
              href={`/shop?occasion=${o.slug}`}
              className="card-lift press group relative block overflow-hidden rounded-[1.5rem]"
            >
              <div
                className="relative flex aspect-square flex-col justify-end p-5"
                style={{
                  background: `
                    radial-gradient(130% 90% at 20% 12%, hsl(${o.hue} 52% 89%) 0%, transparent 65%),
                    hsl(${o.hue} 42% 81%)`,
                }}
              >
                <span
                  aria-hidden
                  className="text-display absolute right-3 top-1 text-7xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-6 md:text-8xl"
                  style={{ color: `hsl(${o.hue} 45% 38% / 0.22)` }}
                >
                  {o.name.charAt(0)}
                </span>
                <p className="text-display text-xl font-semibold md:text-2xl" style={{ color: `hsl(${o.hue} 50% 22%)` }}>
                  {o.name}
                </p>
                <p className="mt-1 text-xs" style={{ color: `hsl(${o.hue} 32% 34%)` }}>
                  {o.tagline}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Gift finder CTA */}
      <Reveal className="mt-14">
        <Link
          href="/gift-finder"
          className="group flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-ink p-8 transition-colors md:flex-row md:items-center md:p-10"
        >
          <div>
            <p className="text-display text-2xl font-semibold text-cream md:text-3xl">
              Not sure where to start?
            </p>
            <p className="mt-1 text-sm text-cream/60">
              Answer three quick questions — we&apos;ll find the perfect gift.
            </p>
          </div>
          <span className="rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-ink transition-colors group-hover:bg-gold">
            Try the Gift Finder →
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
