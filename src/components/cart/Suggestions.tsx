"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "@/lib/cart-store";
import { flyToCart } from "@/lib/fly";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductSnapshot } from "@/lib/types";
import ProductImage from "@/components/ui/ProductImage";

/**
 * "Complete the gift" — horizontally scrolling add-on suggestions,
 * fetched from the server so pricing always comes from the catalog.
 */
export default function Suggestions({ title = "Complete the gift" }: { title?: string }) {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const [suggestions, setSuggestions] = useState<ProductSnapshot[]>([]);
  const [loading, setLoading] = useState(false);

  const cartKey = items.map((i) => i.id).sort().join(",");

  useEffect(() => {
    if (!cartKey) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/suggestions?ids=${encodeURIComponent(cartKey)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => {
        setSuggestions(Array.isArray(data.items) ? data.items : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => controller.abort();
  }, [cartKey]);

  function handleAdd(s: ProductSnapshot, e: React.MouseEvent<HTMLButtonElement>) {
    add(s as unknown as Product);
    const rect = e.currentTarget.getBoundingClientRect();
    flyToCart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  if (loading && suggestions.length === 0 && cartKey) {
    return (
      <div className="border-t border-line px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</p>
        <div className="no-scrollbar -mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-32 shrink-0">
              <div className="skeleton aspect-square w-full rounded-2xl" />
              <div className="skeleton mt-2 h-3 w-24 rounded-full" />
              <div className="skeleton mt-1.5 h-3 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visible = suggestions.filter((s) => !items.some((i) => i.id === s.id));
  if (visible.length === 0) return null;

  return (
    <div className="border-t border-line px-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">{title}</p>
      <div className="no-scrollbar -mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
        {visible.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-32 shrink-0"
          >
            <div className="group relative">
              <ProductImage
                name={s.name}
                hue={s.hue}
                image={s.image}
                sizes="128px"
                className="aspect-square w-full rounded-2xl"
              />
              <button
                aria-label={`Add ${s.name} to cart`}
                onClick={(e) => handleAdd(s, e)}
                className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-ink text-cream shadow-lg transition-colors hover:bg-accent active:scale-90"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
            <p className="mt-2 line-clamp-1 text-xs font-medium">{s.name}</p>
            <p className="text-xs font-semibold text-ink-soft">{formatPrice(s.price)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
