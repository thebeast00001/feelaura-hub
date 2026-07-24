"use client";

import Link from "next/link";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import Reveal from "@/components/ui/Reveal";

/** Snap-scrolling "pick up where you left off" row. Renders nothing until
 *  the visitor has viewed at least two products. */
export default function RecentlyViewed() {
  const mounted = useMounted();
  const items = useRecentlyViewed((s) => s.items);

  if (!mounted || items.length < 2) return null;

  return (
    <section className="container-x pb-24 md:pb-32">
      <Reveal>
        <h2 className="text-display mb-8 text-3xl font-semibold md:text-4xl">
          Pick up where you left off
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="press group w-36 shrink-0 snap-start md:w-44"
            >
              <ProductImage
                name={item.name}
                hue={item.hue}
                image={item.image}
                sizes="176px"
                className="aspect-square w-full rounded-[1.4rem]"
              />
              <p className="mt-2.5 line-clamp-1 text-sm font-medium">{item.name}</p>
              <p className="text-sm font-semibold text-ink-soft">{formatPrice(item.price)}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
