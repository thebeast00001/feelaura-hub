"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/recently-viewed-store";
import { useViewing } from "@/lib/viewing-store";
import type { Product } from "@/lib/types";

/**
 * Records the visit for "Recently viewed" and publishes the current product
 * to the Now Bar (so it can offer a sticky Add to cart). Clears on unmount.
 */
export default function RecordView({ product }: { product: Product }) {
  const addView = useRecentlyViewed((s) => s.addView);
  const setProduct = useViewing((s) => s.setProduct);
  const clearProduct = useViewing((s) => s.clearProduct);

  useEffect(() => {
    addView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      hue: product.hue,
      image: product.image,
    });
    setProduct(product);
    return () => clearProduct();
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
