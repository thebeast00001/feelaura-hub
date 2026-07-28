import Link from "next/link";
import Image from "next/image";
import BannerCarousel from "@/components/home/BannerCarousel";
import ReminderNudge from "@/components/home/ReminderNudge";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import RecipientGrid from "@/components/home/RecipientGrid";
import CategoryShelf from "@/components/home/CategoryShelf";
import HScroller from "@/components/ui/HScroller";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/ui/ProductCard";
import {
  getFeatured,
  getNewArrivals,
  queryProducts,
} from "@/lib/products";

/** Festive occasion cards — full-bleed artwork with baked-in titles & dates. */
const OCCASION_CARDS: Array<{ name: string; href: string; image: string }> = [
  { name: "Raksha Bandhan", href: "/shop/hampers", image: "/images/occasions/raksha-bandhan.jpg" },
  { name: "Girlfriend's Day", href: "/shop?occasion=love-romance", image: "/images/occasions/girlfriends-day.jpg" },
  { name: "Friendship Day", href: "/shop?occasion=just-because", image: "/images/occasions/friendship-day.jpg" },
  { name: "Anniversary", href: "/shop?occasion=anniversary", image: "/images/occasions/anniversary.jpg" },
  { name: "Congratulations", href: "/shop?occasion=congratulations", image: "/images/occasions/congratulations.jpg" },
  { name: "Thank You", href: "/shop?occasion=thank-you", image: "/images/occasions/thank-you.jpg" },
  { name: "Baby Shower", href: "/shop?occasion=new-baby", image: "/images/occasions/baby-shower.jpg" },
];

const rowClass =
  "no-scrollbar max-md:-mx-5 max-md:-my-2 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:overflow-x-auto max-md:px-5 max-md:py-2 md:grid md:grid-cols-4 md:gap-6";
const cardClass = "max-md:w-[70%] max-md:shrink-0 max-md:snap-start";

export default function HomePage() {
  const featured = getFeatured(8);
  const arrivals = getNewArrivals(4);
  const hampers = queryProducts({ category: "hampers", perPage: 8 }).items;

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
        <Reveal y={0} className="max-sm:-mx-5">
          <CategoryShelf />
        </Reveal>
      </section>

      {/* 3 — Shop by occasion */}
      <section className="container-x pb-4 pt-14 md:pt-20">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-display text-3xl font-semibold md:text-4xl">Shop by occasion</h2>
          <Link href="/gift-finder" className="link-underline text-sm font-medium text-accent">
            Not sure? Try the Gift Finder →
          </Link>
        </Reveal>
        <HScroller
          wrapperClassName="mt-8 md:mt-10"
          className="-mx-5 gap-4 px-5 pb-1 snap-x snap-mandatory sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
        >
          {OCCASION_CARDS.map((o, i) => (
            <Reveal
              key={o.name}
              delay={(i % 3) * 0.05}
              y={0}
              className="w-[66%] shrink-0 snap-start sm:w-[38%] lg:w-[27%]"
            >
              <Link
                href={o.href}
                aria-label={o.name}
                className="press group block overflow-hidden rounded-[1.4rem]"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={o.image}
                    alt={o.name}
                    fill
                    sizes="(max-width:768px) 78vw, 32vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </HScroller>
      </section>

      {/* 3.5 — Gifts for… (recipient) */}
      <section className="container-x pt-14 md:pt-20">
        <Reveal className="mb-8">
          <h2 className="text-display text-3xl font-semibold md:text-4xl">
            Find the perfect gift for<span className="text-accent">…</span>
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Shop by who you&apos;re spoiling.</p>
        </Reveal>
        <Reveal delay={0.08} y={0}>
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
            <Reveal key={product.id} delay={(i % 4) * 0.07} y={0} className={cardClass}>
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
            <Reveal key={product.id} delay={(i % 4) * 0.07} y={0} className={cardClass}>
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
            <Reveal key={product.id} delay={i * 0.07} y={0} className={cardClass}>
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
