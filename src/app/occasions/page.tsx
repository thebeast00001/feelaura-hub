import type { Metadata } from "next";
import Link from "next/link";
import { OCCASIONS, getProduct } from "@/lib/products";
import Reveal from "@/components/ui/Reveal";
import ProductImage from "@/components/ui/ProductImage";

const OCCASION_HERO: Record<string, string> = {
  birthday: "birthday-surprise-hamper",
  anniversary: "evil-eye-gift-box",
  "love-romance": "rotating-photo-cube-lamp",
  congratulations: "personalised-photo-magazine",
  "thank-you": "floral-bird-canvas-tote",
  "new-baby": "photo-collage-frame",
  housewarming: "metallic-duo-mug-set",
  "just-because": "photo-keychain-set",
};

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
        {OCCASIONS.map((o, i) => {
          const lead = getProduct(OCCASION_HERO[o.slug] ?? "");
          return (
            <Reveal key={o.slug} delay={(i % 4) * 0.06}>
              <Link
                href={`/shop?occasion=${o.slug}`}
                className="card-lift press group relative block aspect-square overflow-hidden rounded-[1.5rem]"
              >
                <ProductImage
                  name={o.name}
                  hue={o.hue}
                  image={lead?.image ?? null}
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="absolute inset-0 size-full"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-display text-lg font-semibold text-white md:text-xl">{o.name}</p>
                  <p className="mt-0.5 text-[0.7rem] text-white/75">{o.tagline}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
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
