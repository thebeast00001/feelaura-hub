"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import BannerMotif, { type Motif } from "./BannerMotif";

interface Card {
  label: string;
  sub: string;
  href: string;
  image: string;
}

interface Banner {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  discount: string;
  gradient: string;
  glow: string;
  accentColor: string;
  motif: Motif;
  cards: [Card, Card];
}

const BANNERS: Banner[] = [
  {
    id: "festive-sale",
    eyebrow: "",
    title: "Gifts for every",
    accent: "celebration.",
    discount: "Up to 40% off this festive season",
    gradient: "linear-gradient(150deg,#c42126 0%,#a01a20 55%,#7a1418 100%)",
    glow: "radial-gradient(60% 55% at 50% 0%, rgba(255,220,150,0.3) 0%, transparent 70%)",
    accentColor: "#ffd9a8",
    motif: "confetti",
    cards: [
      { label: "Hampers", sub: "Festive boxes", href: "/shop/hampers", image: "/images/products/birthday-surprise-hamper.jpeg" },
      { label: "Mugs", sub: "From ₹299", href: "/shop/mugs", image: "/images/products/magic-colour-changing-mug.jpeg" },
    ],
  },
  {
    id: "rakhi",
    eyebrow: "",
    title: "Celebrate",
    accent: "Raksha Bandhan.",
    discount: "Thoughtful gifts to spoil your sibling",
    gradient: "linear-gradient(150deg,#e8952f 0%,#d1481f 55%,#a81f1f 100%)",
    glow: "radial-gradient(60% 55% at 50% 0%, rgba(255,224,176,0.34) 0%, transparent 70%)",
    accentColor: "#ffe0b0",
    motif: "rakhi",
    cards: [
      { label: "Hampers", sub: "Rakhi boxes", href: "/shop/hampers", image: "/images/products/best-friend-explosion-box.jpeg" },
      { label: "Photo Frames", sub: "Shared memories", href: "/shop/photo-frames", image: "/images/products/photo-collage-frame.jpeg" },
    ],
  },
  {
    id: "memories",
    eyebrow: "",
    title: "Memories, made",
    accent: "magical.",
    discount: "Frames, lamps & keepsakes to light up the season",
    gradient: "linear-gradient(150deg,#2a4a7a 0%,#223f6b 55%,#193253 100%)",
    glow: "radial-gradient(60% 55% at 50% 0%, rgba(200,225,255,0.3) 0%, transparent 70%)",
    accentColor: "#cfe0ff",
    motif: "bokeh",
    cards: [
      { label: "Photo Frames", sub: "Framed forever", href: "/shop/photo-frames", image: "/images/products/photo-collage-frame.jpeg" },
      { label: "LED Lamps", sub: "Your photos aglow", href: "/shop/led-lamps", image: "/images/products/rotating-photo-cube-lamp.jpeg" },
    ],
  },
  {
    id: "hampers",
    eyebrow: "",
    title: "Hampers that",
    accent: "dazzle.",
    discount: "Beautifully packed boxes of joy",
    gradient: "linear-gradient(150deg,#caa23a 0%,#b0842a 55%,#8a651f 100%)",
    glow: "radial-gradient(60% 55% at 50% 0%, rgba(255,248,220,0.35) 0%, transparent 70%)",
    accentColor: "#fff2c8",
    motif: "ribbons",
    cards: [
      { label: "Hampers", sub: "Curated crates", href: "/shop/hampers", image: "/images/products/scrunchie-bottle-hamper.jpeg" },
      { label: "Tote Bags", sub: "Hand-printed", href: "/shop/tote-bags", image: "/images/products/floral-bird-canvas-tote.jpeg" },
    ],
  },
  {
    id: "prints",
    eyebrow: "",
    title: "Your story,",
    accent: "printed.",
    discount: "Polaroids, prints & photo magazines",
    gradient: "linear-gradient(150deg,#c9552e 0%,#a83d20 60%,#88301a 100%)",
    glow: "radial-gradient(60% 55% at 50% 0%, rgba(255,240,210,0.32) 0%, transparent 70%)",
    accentColor: "#ffe6c0",
    motif: "photos",
    cards: [
      { label: "Photo Prints", sub: "Polaroids & 4×6", href: "/shop/photo-prints", image: "/images/products/retro-polaroid-prints.jpeg" },
      { label: "Magazines", sub: "A4 & A5", href: "/shop/magazines", image: "/images/products/personalised-photo-magazine.jpeg" },
    ],
  },
  {
    id: "little-touches",
    eyebrow: "",
    title: "Small gifts,",
    accent: "big smiles.",
    discount: "Fridge magnets & photo keychains",
    gradient: "linear-gradient(150deg,#3f7a52 0%,#2f6547 55%,#234f39 100%)",
    glow: "radial-gradient(60% 55% at 50% 0%, rgba(225,255,220,0.28) 0%, transparent 70%)",
    accentColor: "#c8f0cf",
    motif: "stars",
    cards: [
      { label: "Fridge Magnets", sub: "Badge sets", href: "/shop/fridge-magnets", image: "/images/products/photo-fridge-magnet-set.jpeg" },
      { label: "Keychains", sub: "Photo sets", href: "/shop/keychains", image: "/images/products/photo-keychain-set.jpeg" },
    ],
  },
];


const AUTOPLAY_MS = 2000;

export default function BannerCarousel({
  banners = BANNERS,
  autoplayMs = AUTOPLAY_MS,
}: {
  banners?: Banner[];
  autoplayMs?: number;
} = {}) {
  const reduce = useReducedMotion();
  const [[index, dir], setIndex] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number, direction: number) => {
      const n = (next + banners.length) % banners.length;
      setIndex([n, direction]);
    },
    [banners.length]
  );

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(() => go(index + 1, 1), autoplayMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, paused, go, autoplayMs]);

  const banner = banners[index];

  return (
    <section
      className="container-x pb-4 pt-24 md:pb-8 md:pt-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <div className="relative">
        <div className="relative h-[500px] overflow-hidden rounded-[1.75rem] sm:h-[440px] md:h-[420px] md:rounded-[2.5rem]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={banner.id}
              custom={dir}
              initial={reduce ? { opacity: 0 } : { x: dir > 0 ? "100%" : "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: dir > 0 ? "-100%" : "100%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(index + 1, 1);
                else if (info.offset.x > 80) go(index - 1, -1);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{ background: banner.gradient }}
            >
              {/* glow + dot texture */}
              <div aria-hidden className="absolute inset-0" style={{ background: banner.glow }} />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />

              {/* Per-banner live motif */}
              <BannerMotif type={banner.motif} color={banner.accentColor} reduce={!!reduce} />

              <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-7 md:p-8">
                {/* Heading */}
                <div className="text-center">
                  <h2 className="text-display font-semibold leading-[0.95] text-white">
                    <motion.span
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[clamp(2rem,6vw,3.4rem)]"
                    >
                      {banner.title}{" "}
                      <span className="italic" style={{ color: banner.accentColor }}>
                        {banner.accent}
                      </span>
                    </motion.span>
                  </h2>
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/85 sm:text-sm"
                  >
                    {banner.discount}
                  </motion.p>
                </div>

                {/* Widget cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {banner.cards.map((card, i) => (
                    <motion.div
                      key={card.label + i}
                      initial={reduce ? false : { opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.36 + i * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={card.href}
                        className="group relative block h-[240px] overflow-hidden rounded-[1.25rem] bg-white/10 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] sm:h-[248px] md:h-[230px] md:rounded-[1.5rem]"
                      >
                        <Image
                          src={card.image}
                          alt={card.label}
                          fill
                          sizes="(max-width:768px) 45vw, 320px"
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                        />
                        {/* bottom gradient + label */}
                        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                          <div>
                            <p className="text-display text-lg font-semibold leading-tight text-white sm:text-xl">
                              {card.label}
                            </p>
                            <p className="text-[0.68rem] font-medium text-white/75">{card.sub}</p>
                          </div>
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                            →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Go to ${b.eyebrow}`}
              aria-current={i === index}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-7 bg-accent" : "w-2 bg-line hover:bg-ink-faint"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
