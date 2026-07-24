"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import type { ProductSnapshot } from "@/lib/types";

/** Silently records a product visit for the "Recently viewed" row. */
export default function RecordView({ product }: { product: ProductSnapshot }) {
  const addView = useRecentlyViewed((s) => s.addView);

  useEffect(() => {
    addView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      hue: product.hue,
      image: product.image,
    });
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
