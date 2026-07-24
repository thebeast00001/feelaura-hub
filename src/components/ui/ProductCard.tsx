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
            <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider backdrop-blur">
              {TAG_LABEL[tag]}
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <p className="text-[0.95rem] font-semibold">{formatPrice(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-ink-faint line-through">{formatPrice(product.compareAtPrice)}</p>
            )}
            <p className="ml-auto flex items-center gap-1 text-xs text-ink-faint">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--color-gold)">
                <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" />
              </svg>
              {product.rating}
            </p>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 flex flex-col gap-2">
        <WishlistButton product={product} className="max-lg:size-9" />
        <div className="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          <AddToCartButton product={product} variant="icon" className="max-lg:size-9" />
        </div>
      </div>
    </div>
  );
}
