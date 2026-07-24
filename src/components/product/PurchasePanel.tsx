"use client";

import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly";
import WishlistButton from "@/components/ui/WishlistButton";

export default function PurchasePanel({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    add(product, 1);
    const rect = e.currentTarget.getBoundingClientRect();
    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  return (
    <div className="mt-8 flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        className="flex-1 rounded-full bg-ink py-4 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-accent"
      >
        Add to Cart
      </motion.button>

      <WishlistButton
        product={product}
        className="size-[52px] shrink-0 border border-line shadow-none"
      />
    </div>
  );
}
