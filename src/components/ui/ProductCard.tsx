import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

const TAG_LABEL: Record<string, string> = {
  bestseller: "Bestseller",
  new: "New",
  sale: "Sale",
};

/**
 * Three distinct action zones so nothing crowds on small cards:
 * tag → top-left of image · heart → top-right of image · add → bottom-right
 * beside the price row.
 */
export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const tag = product.tags[0];

  return (
    <div className="group relative">
      <Link
        href={`/product/${product.slug}`}
        className="card-lift press block overflow-hidden rounded-[1.5rem] bg-surface"
      >
        <div className="relative">
          <ProductImage
            name={product.name}
            hue={product.hue}
            image={product.image}
            priority={priority}
            className="aspect-[4/5] w-full"
          />
          {tag && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:text-[0.68rem]">
              {TAG_LABEL[tag]}
            </span>
          )}
        </div>
        <div className="p-3.5 pr-14 sm:p-4 sm:pr-16">
          <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-[0.95rem] font-semibold">{formatPrice(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-ink-faint line-through">{formatPrice(product.compareAtPrice)}</p>
            )}
            <p className="flex items-center gap-1 text-xs text-ink-faint">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-gold)">
                <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" />
              </svg>
              {product.rating}
            </p>
          </div>
        </div>
      </Link>

      {/* Heart — top-right of the image */}
      <div className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3">
        <WishlistButton product={product} className="size-8 sm:size-9" />
      </div>

      {/* Add to cart — bottom-right, beside the price row */}
      <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5">
        <AddToCartButton product={product} variant="icon" className="size-9 sm:size-10" />
      </div>
    </div>
  );
}
