"use client";

import { motion } from "motion/react";
import { useWishlist } from "@/lib/wishlist-store";
import { useMounted } from "@/lib/use-mounted";
import type { ProductSnapshot } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: ProductSnapshot;
  className?: string;
}

export default function WishlistButton({ product, className }: WishlistButtonProps) {
  const mounted = useMounted();
  const toggle = useWishlist((s) => s.toggle);
  const saved = useWishlist((s) => s.items.some((i) => i.id === product.id));
  const active = mounted && saved;

  return (
    <motion.button
      whileTap={{ scale: 0.82 }}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={active}
      onClick={() =>
        toggle({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          hue: product.hue,
          image: product.image,
        })
      }
      className={cn(
        "grid size-10 place-items-center rounded-full bg-cream/85 shadow-md backdrop-blur transition-colors",
        active ? "text-accent" : "text-ink-soft hover:text-ink",
        className
      )}
    >
      <motion.svg
        key={active ? "on" : "off"}
        initial={{ scale: active ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20.5S3.5 15.5 3.5 9.6C3.5 6.6 5.9 4.5 8.5 4.5c1.5 0 2.8.7 3.5 1.9.7-1.2 2-1.9 3.5-1.9 2.6 0 5 2.1 5 5.1 0 5.9-8.5 10.9-8.5 10.9Z" />
      </motion.svg>
    </motion.button>
  );
}
