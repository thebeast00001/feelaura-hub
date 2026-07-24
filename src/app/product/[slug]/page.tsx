import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/catalog";
import { getCategory, getProduct, getRelated } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/ui/ProductImage";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import PurchasePanel from "@/components/product/PurchasePanel";
import MobileBuyBar from "@/components/product/MobileBuyBar";
import PinCheck from "@/components/product/PinCheck";
import RecordView from "@/components/product/RecordView";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product
    ? { title: product.name, description: product.description }
    : { title: "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelated(product);
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="container-x pb-32 pt-24 md:pt-32 lg:pb-24">
      <RecordView product={product} />
      {/* Breadcrumb */}
      <Reveal>
        <nav className="mb-8 flex items-center gap-2 text-xs text-ink-faint" aria-label="Breadcrumb">
          <Link href="/shop" className="transition-colors hover:text-ink">Shop</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/shop/${category.slug}`} className="transition-colors hover:text-ink">
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink-soft">{product.name}</span>
        </nav>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <Reveal className="group lg:sticky lg:top-28 lg:self-start">
          <ProductImage
            name={product.name}
            hue={product.hue}
            image={product.image}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/5] w-full rounded-3xl"
          />
        </Reveal>

        {/* Info */}
        <div>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-cream-soft px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-soft">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-display mt-4 text-4xl font-semibold md:text-5xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <p className="flex items-center gap-1.5 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold)">
                  <path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" />
                </svg>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-ink-faint">({product.reviews} reviews)</span>
              </p>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-display text-3xl font-semibold">{formatPrice(product.price)}</p>
              {product.compareAtPrice && (
                <>
                  <p className="text-lg text-ink-faint line-through">{formatPrice(product.compareAtPrice)}</p>
                  <p className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                    {discount}% off
                  </p>
                </>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

            <PurchasePanel product={product} />

            <PinCheck />

            <ul className="mt-10 space-y-3 border-t border-line pt-8">
              {product.details.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-ink-soft">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <MobileBuyBar product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <h2 className="text-display mb-10 text-3xl font-semibold md:text-4xl">
              You may also love
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
