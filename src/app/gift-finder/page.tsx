import type { Metadata } from "next";
import { OCCASIONS, getProduct } from "@/lib/products";
import QuizFlow from "@/components/finder/QuizFlow";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Gift Finder",
  description: "Three quick questions. One perfect gift.",
};

const OCCASION_HERO: Record<string, string> = {
  birthday: "birthday-surprise-hamper",
  anniversary: "evil-eye-gift-box",
  "love-romance": "rotating-photo-cube-lamp",
  congratulations: "personalised-photo-magazine",
  "thank-you": "floral-bird-canvas-tote",
  "new-baby": "photo-collage-frame",
  housewarming: "metallic-duo-mug-set",
  "just-because": "photo-keychain-set",
};

export default function GiftFinderPage() {
  const occasions = OCCASIONS.map((o) => ({
    slug: o.slug,
    name: o.name,
    tagline: o.tagline,
    hue: o.hue,
    image: getProduct(OCCASION_HERO[o.slug] ?? "")?.image ?? null,
  }));

  return (
    <div className="container-x flex min-h-[85vh] flex-col justify-center pb-28 pt-28 md:pt-32">
      <Reveal className="mx-auto mb-10 w-full max-w-2xl text-center md:mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Gift finder</p>
        <h1 className="text-display mt-3 text-4xl font-semibold md:text-6xl">
          Find the <span className="italic text-accent">perfect</span> gift
        </h1>
        <p className="mt-3 text-sm text-ink-soft md:text-base">
          Three quick taps — we&apos;ll do the thinking.
        </p>
      </Reveal>
      <QuizFlow occasions={occasions} />
    </div>
  );
}
