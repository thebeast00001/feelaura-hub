export interface Category {
  slug: string;
  name: string;
  tagline: string;
  /** Base hue (0-360) used for generated placeholder art */
  hue: number;
}

export interface Occasion {
  slug: string;
  name: string;
  tagline: string;
  hue: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviews: number;
  tags: ProductTag[];
  /** Occasion slugs this product suits */
  occasions: string[];
  description: string;
  details: string[];
  /** Hue used for placeholder art until a real photo is added */
  hue: number;
  /** Path under /public if a real image exists, otherwise null */
  image: string | null;
}

/** Lightweight product snapshot for wishlist + suggestion payloads */
export interface ProductSnapshot {
  id: string;
  slug: string;
  name: string;
  price: number;
  hue: number;
  image: string | null;
}

export type ProductTag = "bestseller" | "new" | "sale";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  hue: number;
  image: string | null;
  quantity: number;
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export interface ProductQuery {
  category?: string;
  occasion?: string;
  search?: string;
  sort?: SortKey;
  minPrice?: number;
  maxPrice?: number;
  tag?: ProductTag;
  page?: number;
  perPage?: number;
}
