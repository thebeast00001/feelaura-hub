import Link from "next/link";
import Hero from "@/components/home/Hero";
import ReminderNudge from "@/components/home/ReminderNudge";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/ui/ProductCard";
import { CATEGORIES, OCCASIONS, getFeatured, getNewArrivals } from "@/lib/products";

export default function HomePage() {
  const featured = getFeatured(8);
  const arrivals = getNewArrivals(4);

  return (
    <>
      <Hero />

      <Marquee
        items={[
          "Same-day delivery",
          "Hand-wrapped with care",
          "Free message card",
          "5,000+ happy gifters",
        ]}
      />

      <ReminderNudge />

      {/* Shop by occasion — purpose-first entry point */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-display text-2xl font-semibold md:text-3xl">Shop by occasion</h2>
          <Link href="/gift-finder" className="link-underline text-sm font-medium text-accent">
            Not sure? Try the Gift Finder →
          </Link>
        </Reveal>
        <Reveal delay={0.08} className="no-scrollbar mt-6 flex gap-2 overflow-x-auto max-sm:-mx-5 max-sm:px-5">
          {OCCASIONS.map((o) => (
            <Link
              key={o.slug}
              href={`/shop?occasion=${o.slug}`}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
            >
              <span aria-hidden className="size-2 rounded-full" style={{ background: `hsl(${o.hue} 55% 65%)` }} />
              {o.name}
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Categories */}
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="chip mb-4">Categories</span>
              <h2 className="text-display max-w-md text-4xl font-semibold md:text-5xl">
                Whatever the occasion
              </h2>
            </div>
            <Link href="/shop" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
              View all →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.06} className={i % 4 === 1 || i % 4 === 2 ? "md:mt-10" : ""}>
              <Link
                href={`/shop/${cat.slug}`}
                className="card-lift press group block overflow-hidden rounded-[1.5rem]"
              >
                <div
                  className="relative flex aspect-[4/5] items-end p-5"
                  style={{
                    background: `
                      radial-gradient(120% 90% at 25% 15%, hsl(${cat.hue} 50% 88%) 0%, transparent 65%),
                      hsl(${cat.hue} 40% 80%)`,
                  }}
                >
                  <span
                    aria-hidden
                    className="text-display absolute right-3 top-2 text-7xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:rotate-6 md:text-8xl"
                    style={{ color: `hsl(${cat.hue} 45% 40% / 0.25)` }}
                  >
                    {cat.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-display text-xl font-semibold md:text-2xl" style={{ color: `hsl(${cat.hue} 50% 22%)` }}>
                      {cat.name}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: `hsl(${cat.hue} 35% 35%)` }}>
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-cream-soft py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <span className="chip mb-4">Bestsellers</span>
                <h2 className="text-display max-w-md text-4xl font-semibold md:text-5xl">
                  Loved by thousands
                </h2>
              </div>
              <Link href="/shop?tag=bestseller" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
                All bestsellers →
              </Link>
            </div>
          </Reveal>

          {/* Snap carousel on mobile, grid on desktop */}
          <div className="no-scrollbar max-md:-mx-5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:px-5 max-md:pb-2 md:grid md:grid-cols-4 md:gap-6">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 0.07} className="max-md:w-[70%] max-md:shrink-0 max-md:snap-start">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial banner */}
      <section className="container-x py-20 md:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-20 text-center md:rounded-[2.5rem] md:py-28">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                background: `
                  radial-gradient(60% 80% at 20% 100%, hsl(18 60% 30%) 0%, transparent 70%),
                  radial-gradient(50% 70% at 85% 0%, hsl(340 40% 28%) 0%, transparent 70%)`,
              }}
            />
            <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Personalized gifting
            </p>
            <h2 className="text-display relative mx-auto mt-4 max-w-2xl text-4xl font-semibold text-cream md:text-6xl">
              Their name on it. <span className="italic text-gold">Your heart</span> in it.
            </h2>
            <Link
              href="/shop/personalized"
              className="relative mt-8 inline-block rounded-full bg-cream px-8 py-4 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-gold"
            >
              Make it personal →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* New arrivals */}
      <section className="container-x pb-24 md:pb-32">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <span className="chip mb-4">Fresh</span>
              <h2 className="text-display max-w-md text-4xl font-semibold md:text-5xl">
                Just arrived
              </h2>
            </div>
            <Link href="/shop?sort=newest" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
              See what&apos;s new →
            </Link>
          </div>
        </Reveal>

        <div className="no-scrollbar max-md:-mx-5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:px-5 max-md:pb-2 md:grid md:grid-cols-4 md:gap-6">
          {arrivals.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.07} className="max-md:w-[70%] max-md:shrink-0 max-md:snap-start">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </>
  );
}
