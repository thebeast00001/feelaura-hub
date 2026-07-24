import type { Product, ProductQuery, ProductSnapshot, SortKey } from "./types";
import { getAllProducts } from "./catalog";

export { CATEGORIES, OCCASIONS, getCategory, getOccasion } from "./catalog";

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => Number(b.tags.includes("bestseller")) - Number(a.tags.includes("bestseller")) || b.reviews - a.reviews,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")) || a.id.localeCompare(b.id),
};

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export function queryProducts(q: ProductQuery = {}): ProductPage {
  const { category, occasion, search, sort = "featured", minPrice, maxPrice, tag, page = 1, perPage = 12 } = q;

  let items = getAllProducts();

  if (category) items = items.filter((p) => p.category === category);
  if (occasion) items = items.filter((p) => p.occasions.includes(occasion));
  if (tag) items = items.filter((p) => p.tags.includes(tag));
  if (minPrice !== undefined) items = items.filter((p) => p.price >= minPrice);
  if (maxPrice !== undefined) items = items.filter((p) => p.price <= maxPrice);
  if (search) {
    const s = search.toLowerCase().trim();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(s) || p.category.replace("-", " ").includes(s)
    );
  }

  items = [...items].sort(SORTERS[sort] ?? SORTERS.featured);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    total,
    page: safePage,
    totalPages,
  };
}

export function getProduct(slug: string): Product | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function getRelated(product: Product, count = 4): Product[] {
  return getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count);
}

export function getFeatured(count = 8): Product[] {
  return queryProducts({ tag: "bestseller", perPage: count }).items;
}

export function getNewArrivals(count = 4): Product[] {
  return queryProducts({ tag: "new", sort: "newest", perPage: count }).items;
}

function toSnapshot(p: Product): ProductSnapshot {
  return { id: p.id, slug: p.slug, name: p.name, price: p.price, hue: p.hue, image: p.image };
}

/**
 * "Complete the gift" engine: given cart product IDs, suggest affordable,
 * highly-rated add-ons from complementary categories not already in the cart.
 */
export function getSuggestions(cartIds: string[], count = 4): ProductSnapshot[] {
  const all = getAllProducts();
  const inCart = new Set(cartIds);
  const cartCategories = new Set(
    cartIds.map((id) => all.find((p) => p.id === id)?.category).filter(Boolean)
  );

  const PRIORITY = ["greeting-cards", "chocolates", "flowers", "soft-toys", "home-decor"];
  const picks: Product[] = [];

  for (const cat of PRIORITY) {
    if (picks.length >= count) break;
    if (cartCategories.has(cat)) continue;
    const best = all
      .filter((p) => p.category === cat && !inCart.has(p.id) && p.price <= 1200)
      .sort((a, b) => b.rating - a.rating)[0];
    if (best) picks.push(best);
  }

  // Fill any remaining slots with top-rated affordable items
  if (picks.length < count) {
    const pickedIds = new Set(picks.map((p) => p.id));
    for (const p of [...all].sort((a, b) => b.rating - a.rating)) {
      if (picks.length >= count) break;
      if (!inCart.has(p.id) && !pickedIds.has(p.id) && p.price <= 1500) picks.push(p);
    }
  }

  return picks.slice(0, count).map(toSnapshot);
}
