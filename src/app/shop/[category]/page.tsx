import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/products";
import ShopView, { type ShopSearchParams } from "@/components/shop/ShopView";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  return {
    title: cat ? cat.name : "Shop",
    description: cat ? `${cat.name} — ${cat.tagline}.` : undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<ShopSearchParams>;
}) {
  const [{ category }, sp] = await Promise.all([params, searchParams]);
  if (!getCategory(category)) notFound();
  return <ShopView category={category} params={sp} />;
}
