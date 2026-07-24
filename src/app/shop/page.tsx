import type { Metadata } from "next";
import ShopView, { type ShopSearchParams } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop All Gifts",
  description: "Browse our full collection of flowers, cakes, hampers and keepsakes.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  return <ShopView params={params} />;
}
