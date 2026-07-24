import fs from "fs";
import path from "path";
import type { Category, Occasion, Product, ProductTag } from "./types";
import { mulberry32 } from "./utils";

/**
 * Deterministic catalog generator — 128 products across 8 categories.
 * Replace with a real database/CMS in phase 2; every page reads through
 * lib/products.ts, so only that file needs to change.
 */

export const CATEGORIES: Category[] = [
  { slug: "flowers", name: "Flowers", tagline: "Fresh-cut and hand-tied", hue: 340 },
  { slug: "cakes", name: "Cakes", tagline: "Baked the same morning", hue: 25 },
  { slug: "chocolates", name: "Chocolates", tagline: "Small-batch indulgence", hue: 18 },
  { slug: "soft-toys", name: "Soft Toys", tagline: "Impossibly huggable", hue: 200 },
  { slug: "personalized", name: "Personalized", tagline: "Made only for them", hue: 265 },
  { slug: "home-decor", name: "Home & Decor", tagline: "Beautiful, useful things", hue: 160 },
  { slug: "hampers", name: "Hampers", tagline: "A little bit of everything", hue: 45 },
  { slug: "greeting-cards", name: "Greeting Cards", tagline: "Words that stay", hue: 300 },
];

export const OCCASIONS: Occasion[] = [
  { slug: "birthday", name: "Birthday", tagline: "Make their day unforgettable", hue: 35 },
  { slug: "anniversary", name: "Anniversary", tagline: "Celebrate the years together", hue: 350 },
  { slug: "love-romance", name: "Love & Romance", tagline: "Say it from the heart", hue: 335 },
  { slug: "congratulations", name: "Congratulations", tagline: "Cheer their big win", hue: 150 },
  { slug: "thank-you", name: "Thank You", tagline: "Gratitude, wrapped up", hue: 200 },
  { slug: "new-baby", name: "New Baby", tagline: "Welcome the little one", hue: 210 },
  { slug: "housewarming", name: "Housewarming", tagline: "Warm their new home", hue: 90 },
  { slug: "just-because", name: "Just Because", tagline: "No reason needed", hue: 270 },
];

/** Which occasions suit each category — the finder + occasion nav read this */
const OCCASION_MAP: Record<string, string[]> = {
  flowers: ["birthday", "anniversary", "love-romance", "thank-you", "just-because"],
  cakes: ["birthday", "anniversary", "congratulations"],
  chocolates: ["thank-you", "love-romance", "just-because", "birthday"],
  "soft-toys": ["new-baby", "birthday", "love-romance", "just-because"],
  personalized: ["anniversary", "birthday", "congratulations", "housewarming"],
  "home-decor": ["housewarming", "congratulations", "thank-you"],
  hampers: ["congratulations", "thank-you", "housewarming", "birthday", "anniversary"],
  "greeting-cards": ["birthday", "anniversary", "thank-you", "congratulations", "just-because", "love-romance"],
};

const NAME_BANK: Record<string, { adj: string[]; noun: string[]; price: [number, number] }> = {
  flowers: {
    adj: ["Blush", "Midnight", "Ivory", "Wild"],
    noun: ["Rose Bouquet", "Tulip Bunch", "Lily Arrangement", "Peony Posy"],
    price: [499, 2999],
  },
  cakes: {
    adj: ["Classic", "Signature", "Decadent", "Celebration"],
    noun: ["Chocolate Truffle Cake", "Red Velvet Cake", "Butterscotch Cake", "Fresh Fruit Gateau"],
    price: [599, 2499],
  },
  chocolates: {
    adj: ["Artisan", "Velvet", "Golden", "Assorted"],
    noun: ["Truffle Box", "Praline Collection", "Dark Chocolate Slab", "Hazelnut Selection"],
    price: [349, 1899],
  },
  "soft-toys": {
    adj: ["Cuddly", "Giant", "Baby", "Dreamy"],
    noun: ["Teddy Bear", "Bunny Plush", "Panda Companion", "Elephant Softie"],
    price: [399, 3499],
  },
  personalized: {
    adj: ["Engraved", "Custom", "Monogram", "Photo"],
    noun: ["Wooden Frame", "Star Map Print", "Leather Journal", "Memory Lamp"],
    price: [549, 2799],
  },
  "home-decor": {
    adj: ["Ceramic", "Handblown", "Rattan", "Marble"],
    noun: ["Bud Vase", "Scented Candle Set", "Table Planter", "Trinket Tray"],
    price: [449, 3299],
  },
  hampers: {
    adj: ["Gourmet", "Spa Day", "Sunrise", "Festive"],
    noun: ["Indulgence Hamper", "Wellness Basket", "Breakfast Crate", "Treats Trunk"],
    price: [999, 5999],
  },
  "greeting-cards": {
    adj: ["Letterpress", "Hand-painted", "Pop-up", "Foiled"],
    noun: ["Birthday Card", "Anniversary Card", "Thank You Card", "Just Because Card"],
    price: [149, 499],
  },
};

const DETAILS_BANK = [
  "Gift-wrapped by hand in signature packaging",
  "Same-day delivery available in select cities",
  "Includes a free handwritten message card",
  "Quality-checked before every dispatch",
];

function findImage(slug: string): string | null {
  for (const ext of ["jpg", "jpeg", "png", "webp", "avif"]) {
    const rel = `/images/products/${slug}.${ext}`;
    try {
      if (fs.existsSync(path.join(process.cwd(), "public", rel))) return rel;
    } catch {
      return null;
    }
  }
  return null;
}

function buildCatalog(): Product[] {
  const rand = mulberry32(20260723);
  const products: Product[] = [];

  for (const cat of CATEGORIES) {
    const bank = NAME_BANK[cat.slug];
    let i = 0;
    for (const adj of bank.adj) {
      for (const noun of bank.noun) {
        i += 1;
        const name = `${adj} ${noun}`;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const [min, max] = bank.price;
        const price = Math.round((min + rand() * (max - min)) / 50) * 50 - 1;
        const rating = Math.round((3.8 + rand() * 1.2) * 10) / 10;
        const reviews = Math.floor(12 + rand() * 880);

        const tags: ProductTag[] = [];
        if (i % 5 === 1) tags.push("bestseller");
        if (i % 7 === 3) tags.push("new");
        const onSale = i % 4 === 2;
        if (onSale) tags.push("sale");

        // Spread 2–3 occasions per product, rotating through the category's list
        const pool = OCCASION_MAP[cat.slug] ?? [];
        const occasions = [
          ...new Set([
            pool[i % pool.length],
            pool[(i + 2) % pool.length],
            pool[(i + 5) % pool.length],
          ]),
        ].filter(Boolean);

        products.push({
          id: `${cat.slug}-${i}`,
          slug,
          name,
          category: cat.slug,
          price,
          compareAtPrice: onSale ? Math.round((price * (1.2 + rand() * 0.3)) / 50) * 50 - 1 : undefined,
          rating,
          reviews,
          tags,
          occasions,
          description: `${name} — ${cat.tagline.toLowerCase()}. Thoughtfully curated for the ${cat.name.toLowerCase()} lover in your life, and finished with our signature wrap so it arrives ready to delight.`,
          details: DETAILS_BANK,
          hue: (cat.hue + i * 7) % 360,
          image: findImage(slug),
        });
      }
    }
  }
  return products;
}

let cache: Product[] | null = null;

export function getAllProducts(): Product[] {
  if (!cache) cache = buildCatalog();
  return cache;
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}
