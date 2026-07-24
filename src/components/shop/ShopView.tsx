import Link from "next/link";
import { CATEGORIES, getOccasion, queryProducts } from "@/lib/products";
import type { ProductQuery, ProductTag, SortKey } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import SortSelect from "./SortSelect";
import StickyBar from "./StickyBar";

type ParamValue = string | string[] | undefined;

export interface ShopSearchParams {
  search?: ParamValue;
  sort?: ParamValue;
  tag?: ParamValue;
  price?: ParamValue;
  page?: ParamValue;
  occasion?: ParamValue;
}

/** Duplicate query params arrive as arrays — always take the first value. */
function first(v: ParamValue): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s ? s.slice(0, 120) : undefined;
}

const PRICE_BANDS: Array<{ key: string; label: string; min?: number; max?: number }> = [
  { key: "under-500", label: `Under ${formatPrice(500)}`, max: 500 },
  { key: "500-1500", label: `${formatPrice(500)}–${formatPrice(1500)}`, min: 500, max: 1500 },
  { key: "over-1500", label: `${formatPrice(1500)}+`, min: 1500 },
];

type CleanParams = { [K in keyof ShopSearchParams]: string | undefined };

function buildHref(base: string, params: CleanParams, overrides: Partial<CleanParams>) {
  const merged = { ...params, ...overrides };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) {
    if (v) qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export default function ShopView({
  category,
  params: rawParams,
}: {
  category?: string;
  params: ShopSearchParams;
}) {
  const params: CleanParams = {
    search: first(rawParams.search),
    sort: first(rawParams.sort),
    tag: first(rawParams.tag),
    price: first(rawParams.price),
    page: first(rawParams.page),
    occasion: first(rawParams.occasion),
  };

  const cat = CATEGORIES.find((c) => c.slug === category);
  const occ = params.occasion ? getOccasion(params.occasion) : undefined;
  const band = PRICE_BANDS.find((b) => b.key === params.price);

  const query: ProductQuery = {
    category,
    occasion: occ?.slug,
    search: params.search,
    sort: (params.sort as SortKey) || "featured",
    tag: params.tag as ProductTag | undefined,
    minPrice: band?.min,
    maxPrice: band?.max,
    page: Number(params.page) || 1,
    perPage: 12,
  };

  const { items, total, page, totalPages } = queryProducts(query);
  const base = category ? `/shop/${category}` : "/shop";

  return (
    <div className="container-x pb-24 pt-28 md:pt-36">
      {/* Heading */}
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          {total} {total === 1 ? "gift" : "gifts"}
          {params.search ? ` for “${params.search}”` : ""}
        </p>
        <h1 className="text-display mt-3 text-5xl font-semibold md:text-7xl">
          {cat ? cat.name : occ ? occ.name : params.search ? "Search" : "Shop All"}
        </h1>
        {(cat || occ) && (
          <p className="mt-3 text-ink-soft">
            {cat ? cat.tagline : occ?.tagline}.
            {cat && occ ? ` For ${occ.name.toLowerCase()}.` : ""}
          </p>
        )}
      </Reveal>

      {/* Category pill bar — sticky on mobile, slides away while scrolling down */}
      <StickyBar className="sticky top-[4.5rem] z-30 -mx-5 mt-8 bg-cream/85 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 md:top-[5.5rem] lg:static lg:mx-0 lg:mt-10 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-wrap">
          <Link
            href={buildHref("/shop", params, { page: undefined })}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
              !category
                ? "border-ink bg-ink text-cream"
                : "border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
            )}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={buildHref(`/shop/${c.slug}`, params, { page: undefined })}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
                category === c.slug
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </StickyBar>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto max-sm:-mx-5 max-sm:w-[calc(100%+2.5rem)] max-sm:px-5">
          {occ && (
            <Link
              href={buildHref(base, params, { occasion: undefined, page: undefined })}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-accent"
            >
              {occ.name}
              <span aria-hidden>✕</span>
            </Link>
          )}
          {PRICE_BANDS.map((b) => (
            <Link
              key={b.key}
              href={buildHref(base, params, {
                price: params.price === b.key ? undefined : b.key,
                page: undefined,
              })}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors",
                params.price === b.key
                  ? "bg-accent text-cream"
                  : "bg-cream-soft text-ink-soft hover:text-ink"
              )}
            >
              {b.label}
            </Link>
          ))}
          <Link
            href={buildHref(base, params, {
              tag: params.tag === "sale" ? undefined : "sale",
              page: undefined,
            })}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors",
              params.tag === "sale"
                ? "bg-accent text-cream"
                : "bg-cream-soft text-ink-soft hover:text-ink"
            )}
          >
            On Sale
          </Link>
        </div>
        <SortSelect current={query.sort ?? "featured"} />
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-display text-3xl">No gifts found</p>
          <p className="mt-3 text-ink-soft">Try a different search or clear your filters.</p>
          <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-accent">
            Reset filters
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {items.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.05}>
              <ProductCard product={product} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildHref(base, params, { page: p === 1 ? undefined : String(p) })}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid size-10 place-items-center rounded-full text-sm font-medium transition-colors",
                p === page ? "bg-ink text-cream" : "text-ink-soft hover:bg-cream-soft hover:text-ink"
              )}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
