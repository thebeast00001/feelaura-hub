import Link from "next/link";
import BannerCarousel from "@/components/home/BannerCarousel";
import ReminderNudge from "@/components/home/ReminderNudge";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import RecipientGrid from "@/components/home/RecipientGrid";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/ui/ProductCard";
import ProductImage from "@/components/ui/ProductImage";
import {
  CATEGORIES,
  OCCASIONS,
  getProduct,
  getCategoryLead,
  getFeatured,
  getNewArrivals,
  queryProducts,
} from "@/lib/products";

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

const rowClass =
  "no-scrollbar max-md:-mx-5 max-md:-my-2 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:px-5 max-md:py-2 md:grid md:grid-cols-4 md:gap-6";
const cardClass = "max-md:w-[70%] max-md:shrink-0 max-md:snap-start";

export default function HomePage() {
  const featured = getFeatured(8);
  const arrivals = getNewArrivals(4);
  const hampers = queryProducts({ category: "hampers", perPage: 8 }).items;
  const occasionItems = OCCASIONS.slice(0, 6).map((o) => {
    const hero = getProduct(OCCASION_HERO[o.slug] ?? "");
    return { slug: o.slug, name: o.name, tagline: o.tagline, hue: o.hue, image: hero?.image ?? null };
  });

  return (
    <>
      {/* 1 — Festive banner hero */}
      <BannerCarousel />

      <ReminderNudge />

      {/* 2 — Shop by category */}
      <section className="container-x pt-12 md:pt-16">
        <Reveal className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-display text-3xl font-semibold md:text-4xl">Shop by category</h2>
          <Link href="/shop" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
            View all →
          </Link>
        </Reveal>
        <div className="no-scrollbar max-md:-mx-5 max-md:-my-2 max-md:flex max-md:snap-x max-md:gap-3 max-md:overflow-x-auto max-md:px-5 max-md:py-2 md:grid md:grid-cols-4 md:gap-4">
          {CATEGORIES.slice(0, 8).map((cat, i) => {
            const lead = getCategoryLead(cat.slug);
            return (
              <Reveal
                key={cat.slug}
                delay={(i % 4) * 0.05}
                className="max-md:w-[38%] max-md:shrink-0 max-md:snap-start"
              >
                <Link
                  href={`/shop/${cat.slug}`}
                  className="press group relative block aspect-[4/5] overflow-hidden rounded-[1.4rem]"
                >
                  <ProductImage
                    name={cat.name}
                    hue={cat.hue}
                    image={lead?.image ?? null}
                    sizes="(max-width:768px) 46vw, 30vw"
                    className="absolute inset-0 size-full"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-display text-lg font-semibold text-white md:text-xl">{cat.name}</p>
                    <p className="mt-0.5 text-[0.7rem] text-white/75">{cat.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 3 — Shop by occasion */}
      <section className="container-x pb-4 pt-14 md:pt-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-display text-3xl font-semibold md:text-4xl">Shop by occasion</h2>
          <Link href="/gift-finder" className="link-underline text-sm font-medium text-accent">
            Not sure? Try the Gift Finder →
          </Link>
        </Reveal>
        <div className="no-scrollbar mt-8 max-md:-mx-5 max-md:-my-2 max-md:flex max-md:snap-x max-md:gap-3 max-md:overflow-x-auto max-md:px-5 max-md:py-2 md:mt-10 md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {occasionItems.map((o, i) => (
            <Reveal key={o.slug} delay={(i % 4) * 0.05} className="max-md:w-[38%] max-md:shrink-0 max-md:snap-start">
              <Link
                href={`/shop?occasion=${o.slug}`}
                className="press group relative block aspect-[4/5] overflow-hidden rounded-[1.4rem]"
              >
                <ProductImage
                  name={o.name}
                  hue={o.hue}
                  image={o.image}
                  sizes="(max-width:768px) 46vw, 30vw"
                  className="absolute inset-0 size-full"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-display text-lg font-semibold text-white md:text-xl">{o.name}</p>
                  <p className="mt-0.5 text-[0.7rem] text-white/75">{o.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3.5 — Gifts for… (recipient) */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal className="mb-8">
          <h2 className="text-display text-3xl font-semibold md:text-4xl">
            Find the perfect gift for<span className="text-accent">…</span>
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Shop by who you&apos;re spoiling.</p>
        </Reveal>
        <Reveal delay={0.08}>
          <RecipientGrid />
        </Reveal>
      </section>

      {/* 4 — Bestsellers */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-display max-w-md text-3xl font-semibold md:text-4xl">Loved by thousands</h2>
          <Link href="/shop?tag=bestseller" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
            All bestsellers →
          </Link>
        </Reveal>
        <div className={rowClass}>
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.07} className={cardClass}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 — Gift hampers */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-display max-w-md text-3xl font-semibold md:text-4xl">Gift hampers</h2>
            <p className="mt-1 text-sm text-ink-soft">Beautifully packed boxes of joy.</p>
          </div>
          <Link href="/shop/hampers" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
            All hampers →
          </Link>
        </Reveal>
        <div className={rowClass}>
          {hampers.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.07} className={cardClass}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6 — Just arrived */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal className="mb-8 flex items-end justify-between gap-6">
          <h2 className="text-display max-w-md text-3xl font-semibold md:text-4xl">Just arrived</h2>
          <Link href="/shop?sort=newest" className="link-underline hidden shrink-0 text-sm font-medium text-ink-soft hover:text-ink sm:block">
            See what&apos;s new →
          </Link>
        </Reveal>
        <div className={rowClass}>
          {arrivals.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.07} className={cardClass}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 7 — Pick up where you left off */}
      <div className="pt-14 md:pt-20">
        <RecentlyViewed />
      </div>
    </>
  );
}
