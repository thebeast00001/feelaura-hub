"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface OccasionItem {
  slug: string;
  name: string;
  tagline: string;
  hue: number;
  image: string | null;
}

/**
 * Expanding image accordion. On desktop, hovering a panel grows it to reveal
 * the occasion's photo, tagline and CTA while the others slim to a rail with a
 * vertical label. On mobile it becomes a horizontal snap carousel of full cards.
 */
export default function OccasionShowcase({ items }: { items: OccasionItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="no-scrollbar mt-8 flex gap-2.5 overflow-x-auto pb-1 max-md:-mx-5 max-md:snap-x max-md:snap-mandatory max-md:px-5 md:mt-10 md:gap-3 md:overflow-visible">
      {items.map((o, i) => {
        const isActive = active === i;
        return (
          <motion.div
            key={o.slug}
            onMouseEnter={() => setActive(i)}
            style={{ flexGrow: isActive ? 5 : 1 }}
            className="relative h-[380px] w-[74%] shrink-0 snap-start transition-[flex-grow] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:h-[460px] md:w-auto md:min-w-0 md:shrink"
          >
            <Link
              href={`/shop?occasion=${o.slug}`}
              className="group relative block size-full overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem]"
              aria-label={`Shop ${o.name}`}
            >
              {/* Photo */}
              {o.image ? (
                <Image
                  src={o.image}
                  alt={o.name}
                  fill
                  sizes="(max-width:768px) 74vw, 40vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: `hsl(${o.hue} 45% 82%)` }}
                />
              )}

              {/* Colour-tinted gradient overlay */}
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to top, hsl(${o.hue} 60% 12% / 0.9) 0%, hsl(${o.hue} 55% 20% / 0.35) 45%, transparent 80%)`,
                }}
              />

              {/* Expanded content (mobile always, desktop when active) */}
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 p-5 transition-all duration-500 md:p-6",
                  "md:translate-y-2 md:opacity-0",
                  isActive && "md:translate-y-0 md:opacity-100"
                )}
              >
                <p className="text-display text-2xl font-semibold text-white md:text-3xl">
                  {o.name}
                </p>
                <p className="mt-1 max-w-xs text-xs text-white/80 md:text-sm">{o.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/95 py-2 pl-4 pr-2 text-xs font-bold text-ink">
                  Find a gift
                  <span className="grid size-6 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>

              {/* Collapsed vertical label (desktop, inactive only) */}
              <div
                className={cn(
                  "absolute inset-0 hidden items-end justify-center pb-6 transition-opacity duration-300",
                  !isActive && "md:flex"
                )}
              >
                <span
                  className="text-display whitespace-nowrap text-lg font-semibold text-white/90"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {o.name}
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
