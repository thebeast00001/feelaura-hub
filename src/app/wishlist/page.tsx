"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import ProductImage from "@/components/ui/ProductImage";

export default function WishlistPage() {
  const mounted = useMounted();
  const { items, remove } = useWishlist();
  const add = useCart((s) => s.add);

  if (!mounted) return <div className="min-h-[70vh]" />;

  return (
    <div className="container-x pb-24 pt-28 md:pt-36">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        {items.length} saved {items.length === 1 ? "gift" : "gifts"}
      </p>
      <h1 className="text-display mt-3 text-5xl font-semibold md:text-6xl">Wishlist</h1>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-display text-3xl">Nothing saved yet</p>
          <p className="mt-3 text-ink-soft">
            Tap the heart on any gift to keep it here for later.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent"
          >
            Browse gifts
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="card-lift block overflow-hidden rounded-[1.5rem] bg-surface"
                >
                  <ProductImage
                    name={item.name}
                    hue={item.hue}
                    image={item.image}
                    className="aspect-[4/5] w-full"
                  />
                  <div className="p-4">
                    <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                    <p className="mt-1.5 text-[0.95rem] font-semibold">{formatPrice(item.price)}</p>
                  </div>
                </Link>

                <button
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => remove(item.id)}
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-cream/85 text-accent shadow-md backdrop-blur transition-colors hover:bg-accent hover:text-cream"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 20.5S3.5 15.5 3.5 9.6C3.5 6.6 5.9 4.5 8.5 4.5c1.5 0 2.8.7 3.5 1.9.7-1.2 2-1.9 3.5-1.9 2.6 0 5 2.1 5 5.1 0 5.9-8.5 10.9-8.5 10.9Z" />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    add(item as unknown as Product);
                    const rect = e.currentTarget.getBoundingClientRect();
                    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
                  }}
                  className="mt-2 w-full rounded-full bg-ink py-3 text-xs font-semibold text-cream transition-colors hover:bg-accent"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
