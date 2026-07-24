"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly";
import WishlistButton from "@/components/ui/WishlistButton";

export default function PurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const add = useCart((s) => s.add);

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    add(product, quantity);
    const rect = e.currentTarget.getBoundingClientRect();
    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <div className="flex items-center justify-between rounded-full border border-line px-2 sm:w-36">
        <button
          aria-label="Decrease quantity"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="grid size-11 place-items-center text-lg text-ink-soft transition-colors hover:text-ink"
        >
          −
        </button>
        <span className="text-sm font-semibold">{quantity}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          className="grid size-11 place-items-center text-lg text-ink-soft transition-colors hover:text-ink"
        >
          +
        </button>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        className="flex-1 rounded-full bg-ink py-4 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-accent"
      >
        Add to Cart
      </motion.button>

      <WishlistButton
        product={product}
        className="size-[52px] shrink-0 self-center border border-line shadow-none max-sm:hidden"
      />
    </div>
  );
}
