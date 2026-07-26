import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, getCategoryLead, getOccasion, queryProducts } from "@/lib/products";
import type { ProductQuery, ProductTag, SortKey } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import SortSelect from "./SortSelect";

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
    <div>
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

      {/* Category chip bar — edge-to-edge scroll on mobile, wraps on desktop */}
      <div className="no-scrollbar -mx-5 mt-8 flex gap-2.5 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-10 lg:flex-wrap lg:px-0">
          {/* All */}
          <Link
            href={buildHref("/shop", params, { page: undefined })}
            className={cn(
              "group flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors duration-300",
              !category
                ? "border-transparent bg-ink text-cream"
                : "border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
            )}
          >
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-full text-cream"
              style={{
                background:
                  "conic-gradient(from 210deg,#c42126,#c9552e,#caa23a,#3f7a52,#4a2560,#c42126)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
            All
          </Link>

          {CATEGORIES.map((c) => {
            const active = category === c.slug;
            const lead = getCategoryLead(c.slug);
            return (
              <Link
                key={c.slug}
                href={buildHref(`/shop/${c.slug}`, params, { page: undefined })}
                style={
                  active
                    ? {
                        background: `linear-gradient(135deg, hsl(${c.hue} 62% 46%), hsl(${c.hue} 68% 34%))`,
                      }
                    : undefined
                }
                className={cn(
                  "group flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors duration-300",
                  active
                    ? "border-transparent text-white"
                    : "border-line bg-surface text-ink-soft hover:border-ink-faint hover:text-ink"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "relative size-7 shrink-0 overflow-hidden rounded-full ring-2 transition-all",
                    active ? "ring-white/60" : "ring-transparent group-hover:ring-2"
                  )}
                  style={{ background: `hsl(${c.hue} 45% 86%)`, ...(active ? {} : {}) }}
                >
                  {lead?.image ? (
                    <Image src={lead.image} alt="" fill sizes="28px" className="object-cover" />
                  ) : (
                    <span
                      className="absolute inset-0"
                      style={{ background: `hsl(${c.hue} 55% 60%)` }}
                    />
                  )}
                </span>
                {c.name}
              </Link>
            );
          })}
      </div>

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
    </div>
  );
}
