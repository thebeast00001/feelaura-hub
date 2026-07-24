import type { Metadata } from "next";
import { OCCASIONS } from "@/lib/products";
import QuizFlow from "@/components/finder/QuizFlow";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Gift Finder",
  description: "Three quick questions. One perfect gift.",
};

export default function GiftFinderPage() {
  return (
    <div className="container-x flex min-h-[85vh] flex-col justify-center pb-24 pt-28 md:pt-32">
      <Reveal className="mx-auto mb-10 w-full max-w-2xl text-center md:mb-14">
        <h1 className="text-display text-4xl font-semibold md:text-6xl">
          Find the <span className="italic text-accent">perfect</span> gift
        </h1>
        <p className="mt-3 text-sm text-ink-soft md:text-base">
          Three quick taps — we&apos;ll do the thinking.
        </p>
      </Reveal>
      <QuizFlow occasions={OCCASIONS} />
    </div>
  );
}
