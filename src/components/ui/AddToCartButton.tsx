"use client";

import { motion } from "motion/react";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: "full" | "icon";
  className?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  variant = "full",
  className,
}: AddToCartButtonProps) {
  const add = useCart((s) => s.add);

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    add(product, quantity);
    const rect = e.currentTarget.getBoundingClientRect();
    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  if (variant === "icon") {
    return (
      <motion.button
        whileTap={{ scale: 0.88 }}
        aria-label={`Add ${product.name} to cart`}
        onClick={handleAdd}
        className={cn(
          "grid size-10 place-items-center rounded-full bg-ink text-cream shadow-lg transition-colors hover:bg-accent",
          className
        )}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleAdd}
      className={cn(
        "w-full rounded-full bg-ink py-4 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-accent",
        className
      )}
    >
      Add to Cart
    </motion.button>
  );
}
