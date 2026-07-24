import Link from "next/link";
import Hero from "@/components/home/Hero";
import BannerCarousel from "@/components/home/BannerCarousel";
import ReminderNudge from "@/components/home/ReminderNudge";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import OccasionShowcase from "@/components/home/OccasionShowcase";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/ui/ProductCard";
import { OCCASIONS, getProduct, getFeatured, getNewArrivals } from "@/lib/products";

/** A thematically-fitting product photo for each occasion panel. */
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

export default function HomePage() {
  const featured = getFeatured(8);
  const arrivals = getNewArrivals(4);
  const occasionItems = OCCASIONS.slice(0, 6).map((o) => {
    const hero = getProduct(OCCASION_HERO[o.slug] ?? "");
    return { slug: o.slug, name: o.name, tagline: o.tagline, hue: o.hue, image: hero?.image ?? null };
  });

  return (
    <>
      <Hero />

      <BannerCarousel />

      <Marquee
        items={[
          "Same-day delivery",
          "Hand-wrapped with care",
          "Free message card",
          "5,000+ happy gifters",
        ]}
      />

      <ReminderNudge />

      {/* Shop by occasion */}
      <section className="container-x pb-4 pt-14 md:pt-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-display text-3xl font-semibold md:text-4xl">Shop by occasion</h2>
          <Link href="/gift-finder" className="link-underline text-sm font-medium text-accent">
            Not sure? Try the Gift Finder →
          </Link>
        </Reveal>
        <Reveal delay={0.08}>
          <OccasionShowcase items={occasionItems} />
        </Reveal>
      </section>

      {/* Bestsellers */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
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
              Personalised gifting
            </p>
            <h2 className="text-display relative mx-auto mt-4 max-w-2xl text-4xl font-semibold text-cream md:text-6xl">
              Their photo on it. <span className="italic text-gold">Your heart</span> in it.
            </h2>
            <Link
              href="/shop/photo-frames"
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
