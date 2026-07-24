"use client";

import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly";
import { formatPrice } from "@/lib/utils";

/** One UI-style floating buy pill, fixed in the thumb zone on mobile. */
export default function MobileBuyBar({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    add(product);
    const rect = e.currentTarget.getBoundingClientRect();
    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  return (
    <motion.div
      initial={{ y: 110, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-4 bottom-[calc(0.9rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-sm lg:hidden"
    >
      <div className="flex items-center justify-between rounded-full bg-ink/90 p-2 pl-6 shadow-[0_16px_40px_-12px_rgb(27_23_18/0.5)] backdrop-blur-xl">
        <div className="mr-4">
          <p className="text-[0.65rem] uppercase tracking-wider text-cream/60">Price</p>
          <p className="text-display text-lg font-semibold leading-tight text-cream">
            {formatPrice(product.price)}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAdd}
          className="rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-ink transition-colors active:bg-accent active:text-cream"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
