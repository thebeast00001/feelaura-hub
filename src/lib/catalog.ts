import fs from "fs";
import path from "path";
import type { Category, Occasion, Product, ProductTag } from "./types";
import { mulberry32 } from "./utils";

/**
 * Deterministic catalog generator — 128 products across 8 categories.
 * Replace with a real database/CMS in phase 2; every page reads through
 * lib/products.ts, so only that file needs to change.
 */

/** The exact product lines Feelaura Hub deals in. */
export const CATEGORIES: Category[] = [
  { slug: "mugs", name: "Mugs", tagline: "Sip on a memory", hue: 15 },
  { slug: "photo-frames", name: "Photo Frames", tagline: "Framed to keep forever", hue: 280 },
  { slug: "photo-prints", name: "Photo Prints", tagline: "Polaroids & prints of your best moments", hue: 30 },
  { slug: "led-lamps", name: "LED Lamps", tagline: "Your photos, aglow", hue: 260 },
  { slug: "hampers", name: "Hampers", tagline: "Curated boxes of joy", hue: 45 },
  { slug: "tote-bags", name: "Tote Bags", tagline: "Carry it in style", hue: 140 },
  { slug: "fridge-magnets", name: "Fridge Magnets", tagline: "Little moments, on display", hue: 200 },
  { slug: "keychains", name: "Keychains", tagline: "The people you love, everywhere", hue: 250 },
  { slug: "magazines", name: "Magazines", tagline: "Their story, cover to cover", hue: 300 },
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
  mugs: ["birthday", "thank-you", "just-because", "love-romance"],
  "photo-frames": ["birthday", "anniversary", "new-baby", "love-romance"],
  "photo-prints": ["birthday", "just-because", "love-romance", "thank-you"],
  "led-lamps": ["birthday", "anniversary", "love-romance"],
  hampers: ["congratulations", "thank-you", "housewarming", "birthday", "anniversary"],
  "tote-bags": ["just-because", "thank-you", "housewarming", "birthday"],
  "fridge-magnets": ["just-because", "birthday", "thank-you"],
  keychains: ["birthday", "love-romance", "just-because"],
  magazines: ["birthday", "anniversary", "congratulations"],
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

/**
 * Real, photographed Feelaura Hub products. These lead the catalogue; the
 * generated demo products below fill out the extended range until more
 * photography arrives.
 */
interface RealDef {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  tags: ProductTag[];
  occasions: string[];
  hue: number;
  description: string;
}

const PERSONALISED = new Set([
  "mugs",
  "photo-frames",
  "photo-prints",
  "led-lamps",
  "fridge-magnets",
  "keychains",
  "magazines",
]);

const REAL_DEFS: RealDef[] = [
  // ---- Mugs ----
  { slug: "classic-white-photo-mug", name: "Customized White Mug", category: "mugs", price: 299, rating: 4.6, reviews: 741, tags: ["bestseller"], occasions: ["birthday", "thank-you", "just-because"], hue: 40, description: "The timeless all-white ceramic mug, printed edge to edge with your photo and text. Our most-gifted mug." },
  { slug: "magic-colour-changing-mug", name: "Magic Mug", category: "mugs", price: 499, compareAt: 699, rating: 4.9, reviews: 604, tags: ["bestseller", "sale"], occasions: ["birthday", "love-romance", "just-because"], hue: 260, description: "Matte black until hot liquid is poured in — then your photo magically appears. Guaranteed to make them smile." },
  { slug: "heart-handle-photo-mug", name: "Heart Handle Mug", category: "mugs", price: 399, compareAt: 549, rating: 4.9, reviews: 528, tags: ["bestseller", "sale"], occasions: ["love-romance", "anniversary", "birthday"], hue: 350, description: "The handle is shaped like a heart — impossibly cute, and printed with the photo of your choice. The sweetest way to say good morning." },
  { slug: "coral-handle-photo-mug", name: "Coral Patch Mug", category: "mugs", price: 349, compareAt: 499, rating: 4.8, reviews: 412, tags: ["sale"], occasions: ["birthday", "thank-you", "just-because"], hue: 15, description: "A crisp white mug with a warm coral handle and inner patch — printed with your favourite photo. Dishwasher and microwave safe." },
  { slug: "sunset-rim-photo-mug", name: "Orange Patch Mug", category: "mugs", price: 349, rating: 4.7, reviews: 233, tags: [], occasions: ["birthday", "thank-you"], hue: 25, description: "Clean white body finished with a warm orange rim and handle patch. Your photo, printed to last wash after wash." },
  { slug: "sky-blue-photo-mug", name: "Blue Inner Colour Mug", category: "mugs", price: 349, rating: 4.7, reviews: 188, tags: ["new"], occasions: ["birthday", "just-because"], hue: 205, description: "A calm sky-blue handle and inner colour on a bright white mug — personalised with your favourite memory." },
  { slug: "metallic-duo-mug-set", name: "Metallic Mug Set", category: "mugs", price: 899, rating: 4.8, reviews: 176, tags: ["new"], occasions: ["anniversary", "congratulations", "housewarming"], hue: 45, description: "A luxe pair of metallic gold and silver mugs — perfect for couples and housewarmings. Personalise each side." },

  // ---- Photo Frames ----
  { slug: "photo-collage-frame", name: "Photo Collage Frame", category: "photo-frames", price: 999, compareAt: 1299, rating: 4.8, reviews: 271, tags: ["bestseller", "sale"], occasions: ["birthday", "anniversary", "new-baby"], hue: 275, description: "A clean white frame arranging your favourite photos into a keepsake collage — ready to hang the moment it arrives." },
  { slug: "memories-collage-frame", name: "Memories Frame", category: "photo-frames", price: 1099, rating: 4.9, reviews: 318, tags: ["bestseller"], occasions: ["new-baby", "anniversary", "birthday"], hue: 285, description: "A refined black-and-white collage in a gallery frame — a timeless way to hold a whole year of memories." },
  { slug: "explosion-scrapbook-poster", name: "Explosion Scrapbook Frame", category: "photo-frames", price: 1499, compareAt: 1999, rating: 4.9, reviews: 427, tags: ["sale"], occasions: ["birthday", "love-romance", "anniversary"], hue: 320, description: "A handcrafted scrapbook exploding with photos, notes and little details. The gift that makes people cry (happy tears)." },

  // ---- Photo Prints ----
  { slug: "retro-polaroid-prints", name: "Polaroid Prints (3×4)", category: "photo-prints", price: 349, rating: 4.8, reviews: 655, tags: ["bestseller"], occasions: ["birthday", "just-because", "love-romance"], hue: 30, description: "Retro-style instant prints of your chosen photos in a 3×4 finish — perfect for photo walls, fridges and gifting." },
  { slug: "photo-prints-4x6", name: "Photo Prints (4×6)", category: "photo-prints", price: 399, rating: 4.7, reviews: 402, tags: ["new"], occasions: ["birthday", "just-because", "thank-you"], hue: 35, description: "Crisp glossy 4×6 photo prints of your favourite moments — the classic size, beautifully reproduced." },

  // ---- LED Lamps ----
  { slug: "rotating-photo-cube-lamp", name: "Rotating Photo LED Lamp", category: "led-lamps", price: 1199, compareAt: 1699, rating: 4.9, reviews: 486, tags: ["bestseller", "sale"], occasions: ["birthday", "anniversary", "love-romance"], hue: 280, description: "A warm-glow LED lamp that slowly rotates, lighting up your favourite photos on every side. Unforgettable on a bedside table." },

  // ---- Hampers ----
  { slug: "birthday-surprise-hamper", name: "Birthday Hamper", category: "hampers", price: 1799, compareAt: 2299, rating: 4.9, reviews: 512, tags: ["bestseller", "sale"], occasions: ["birthday", "congratulations"], hue: 45, description: "A show-stopping birthday box with a teddy, chocolates, a glow lamp, a diary and fairy lights — beautifully arranged and ready to wow." },
  { slug: "best-friend-explosion-box", name: "Girls Gift Hamper", category: "hampers", price: 1299, rating: 4.8, reviews: 287, tags: ["bestseller"], occasions: ["birthday", "just-because", "thank-you"], hue: 55, description: "A pop-open explosion box layered with photos, flowers and little treats — the ultimate gift for your best girl." },
  { slug: "scrunchie-bottle-hamper", name: "Self-Care Hamper", category: "hampers", price: 1499, compareAt: 1899, rating: 4.7, reviews: 194, tags: ["sale"], occasions: ["birthday", "thank-you", "congratulations"], hue: 340, description: "A curated self-care hamper of personalised bottles, silk scrunchies and treats, arranged in a keepsake box." },
  { slug: "evil-eye-gift-box", name: "Anniversary Gift Box", category: "hampers", price: 1699, rating: 4.9, reviews: 356, tags: ["new", "bestseller"], occasions: ["birthday", "anniversary", "housewarming"], hue: 220, description: "An elegant evil-eye themed box with a tumbler, dainty necklace and scrunchie — protective, pretty and thoughtfully packed." },

  // ---- Tote Bags ----
  { slug: "tulip-canvas-tote-bag", name: "Tulip Canvas Tote Bag", category: "tote-bags", price: 449, rating: 4.7, reviews: 214, tags: ["new"], occasions: ["just-because", "thank-you", "birthday"], hue: 340, description: "A sturdy natural-cotton tote printed with a bold tulip motif — roomy enough for everything, pretty enough to gift." },
  { slug: "floral-bird-canvas-tote", name: "Hand-Painted Floral Tote", category: "tote-bags", price: 599, compareAt: 799, rating: 4.9, reviews: 302, tags: ["bestseller", "sale"], occasions: ["just-because", "housewarming", "thank-you"], hue: 140, description: "A whimsical hand-painted floral and bird design on heavyweight canvas. A one-of-a-kind everyday carry." },
  { slug: "bloom-brightly-tote-bag", name: "'Bloom Brightly' Tote Bag", category: "tote-bags", price: 499, rating: 4.6, reviews: 158, tags: [], occasions: ["just-because", "birthday", "thank-you"], hue: 150, description: "Deep navy canvas with an embroidered-look tulip print and a 'bloom brightly' message. Carries a little joy everywhere." },

  // ---- Fridge Magnets ----
  { slug: "photo-fridge-magnet-set", name: "Fridge Badge Magnets", category: "fridge-magnets", price: 499, compareAt: 699, rating: 4.8, reviews: 389, tags: ["bestseller", "sale"], occasions: ["birthday", "just-because", "thank-you"], hue: 200, description: "A set of glossy photo badge magnets to turn any fridge into a gallery of favourite moments. Strong hold, vivid print." },

  // ---- Keychains ----
  { slug: "photo-keychain-set", name: "Photo Keychain Set", category: "keychains", price: 299, compareAt: 399, rating: 4.7, reviews: 233, tags: ["sale", "bestseller"], occasions: ["birthday", "love-romance", "just-because"], hue: 250, description: "Round, square and heart photo keychains — carry the people you love wherever you go. Sold as a set." },

  // ---- Magazines ----
  { slug: "personalised-photo-magazine", name: "Personalised Photo Magazine", category: "magazines", price: 699, rating: 4.7, reviews: 149, tags: ["new", "bestseller"], occasions: ["birthday", "anniversary", "congratulations"], hue: 300, description: "Turn their story into a glossy A4 or A5 magazine cover and spread — a genuinely original keepsake they'll show everyone." },
];

function buildReal(): Product[] {
  return REAL_DEFS.map((d, i) => {
    const details = PERSONALISED.has(d.category)
      ? ["Personalise with your own photos & text at checkout", ...DETAILS_BANK.slice(0, 3)]
      : d.category === "hampers"
        ? ["Curated & gift-wrapped by hand", ...DETAILS_BANK.slice(1, 4)]
        : ["Durable, high-quality print", ...DETAILS_BANK.slice(0, 3)];
    return {
      id: `real-${i + 1}`,
      slug: d.slug,
      name: d.name,
      category: d.category,
      price: d.price,
      compareAtPrice: d.compareAt,
      rating: d.rating,
      reviews: d.reviews,
      tags: d.tags,
      occasions: d.occasions,
      description: d.description,
      details,
      hue: d.hue,
      image: findImage(d.slug),
    };
  });
}

function buildCatalog(): Product[] {
  const rand = mulberry32(20260723);
  const products: Product[] = [];

  for (const cat of CATEGORIES) {
    const bank = NAME_BANK[cat.slug];
    if (!bank) continue; // real-photo categories have no generator bank
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
  if (!cache) cache = [...buildReal(), ...buildCatalog()];
  return cache;
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}
