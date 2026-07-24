"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Editorial split hero — massive staggered type on the left, an interactive
 * fanned card stack on the right that tilts toward the cursor. One UI
 * minimalism: cream space, rounded geometry, pill controls, few elements.
 */

const CARDS = [
  {
    hue: 15,
    label: "Mugs",
    href: "/shop/mugs",
    image: "/images/products/heart-handle-photo-mug.jpeg",
    rotate: -10,
    depth: 0.7,
    position: "-translate-x-[102%] -translate-y-[54%] md:-translate-x-[115%]",
    z: "z-10",
  },
  {
    hue: 45,
    label: "Hampers",
    href: "/shop/hampers",
    image: "/images/products/birthday-surprise-hamper.jpeg",
    rotate: 3,
    depth: 1.2,
    position: "-translate-x-1/2 -translate-y-[58%]",
    z: "z-30",
  },
  {
    hue: 280,
    label: "Photo Frames",
    href: "/shop/photo-frames",
    image: "/images/products/photo-collage-frame.jpeg",
    rotate: 14,
    depth: 1.8,
    position: "translate-x-[2%] -translate-y-[50%] md:translate-x-[15%]",
    z: "z-20",
  },
];

function FanCard({
  card,
  index,
  tiltX,
  tiltY,
  reduce,
}: {
  card: (typeof CARDS)[number];
  index: number;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  reduce: boolean;
}) {
  const x = useTransform(tiltX, (v) => v * 18 * card.depth);
  const y = useTransform(tiltY, (v) => v * 14 * card.depth);

  return (
    <div className={`absolute left-1/2 top-1/2 ${card.position} ${card.z}`}>
      {/* Entrance */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 70, rotate: card.rotate + 10 }}
        animate={{ opacity: 1, y: 0, rotate: card.rotate }}
        transition={{ delay: 0.55 + index * 0.13, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cursor tilt */}
        <motion.div style={reduce ? undefined : { x, y }}>
          <Link href={card.href} className="group block" aria-label={`Shop ${card.label}`}>
            <motion.div
              whileHover={{ rotate: 0, scale: 1.04, y: -8 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative flex h-48 w-36 flex-col justify-end overflow-hidden rounded-[1.6rem] p-3 shadow-[0_24px_60px_-24px_rgb(27_23_18/0.35)] md:h-80 md:w-60 md:rounded-[2rem] md:p-4"
              style={{ background: `hsl(${card.hue} 40% 84%)` }}
            >
              <Image
                src={card.image}
                alt={card.label}
                fill
                sizes="(max-width:768px) 40vw, 240px"
                priority={index === 1}
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="relative flex items-center justify-between rounded-full bg-cream/85 py-2 pl-4 pr-2 text-xs font-semibold text-ink backdrop-blur md:text-sm">
                {card.label}
                <span className="grid size-6 place-items-center rounded-full bg-ink text-[0.65rem] text-cream transition-transform duration-300 group-hover:translate-x-0.5 md:size-7">
                  →
                </span>
              </span>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const yCards = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Cursor tilt (desktop) — springy, normalized -0.5..0.5
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(mx, { stiffness: 90, damping: 18 });
  const tiltY = useSpring(my, { stiffness: 90, damping: 18 });

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-[92svh] items-center overflow-hidden pb-16 pt-28 md:pb-20 md:pt-32"
    >
      {/* Single quiet wash — One UI restraint */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(55% 45% at 78% 30%, hsl(28 55% 90% / 0.9) 0%, transparent 70%),
            radial-gradient(40% 40% at 12% 82%, hsl(340 45% 92% / 0.7) 0%, transparent 70%)`,
        }}
      />

      <div className="container-x grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-6">
        {/* Copy */}
        <motion.div style={{ y: reduce ? 0 : yText, opacity }} className="lg:col-span-7">
          <h1 className="text-display text-[clamp(3rem,8.5vw,7rem)] font-semibold">
            {["Gifts that", "say what", "words can't."].map((line, i) => (
              <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.16em]">
                <motion.span
                  className={`block ${i === 2 ? "italic text-accent" : ""} ${i === 1 ? "font-light" : ""}`}
                  initial={reduce ? false : { y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line === "say what" ? (
                    <>
                      say{" "}
                      <span
                        aria-hidden
                        className="mx-1 inline-block h-[0.62em] w-[1.6em] translate-y-[0.06em] rounded-full align-baseline"
                        style={{
                          background:
                            "linear-gradient(120deg, hsl(340 50% 84%), hsl(45 60% 82%), hsl(200 45% 84%))",
                        }}
                      />{" "}
                      what
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...enter(0.6)}
            className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg"
          >
            Hand-picked flowers, cakes, hampers and keepsakes — wrapped, written and delivered
            with care.
          </motion.p>

          {/* CTAs */}
          <motion.div {...enter(0.72)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className="group flex items-center justify-center gap-3 rounded-full bg-ink py-3 pl-7 pr-3 text-sm font-semibold text-cream transition-colors duration-300 hover:bg-accent"
            >
              Shop the collection
              <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/shop?tag=bestseller"
              className="flex items-center justify-center rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-ink-soft transition-colors duration-300 hover:border-ink hover:text-ink"
            >
              Bestsellers
            </Link>
          </motion.div>

          {/* Trust stats */}
          <motion.ul {...enter(0.85)} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 md:mt-12 md:gap-x-8">
            {[
              ["5,000+", "gifts delivered"],
              ["4.9★", "average rating"],
              ["Same-day", "delivery"],
            ].map(([big, small]) => (
              <li key={small} className="border-l-2 border-line pl-4">
                <p className="text-display text-lg font-semibold leading-tight md:text-xl">{big}</p>
                <p className="text-xs text-ink-faint">{small}</p>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Interactive card fan */}
        <motion.div
          style={{ y: reduce ? 0 : yCards }}
          className="relative mx-auto h-[280px] w-full max-w-[340px] md:h-[440px] md:max-w-[400px] lg:col-span-5"
        >
          {CARDS.map((card, i) => (
            <FanCard key={card.href} card={card} index={i} tiltX={tiltX} tiltY={tiltY} reduce={!!reduce} />
          ))}
        </motion.div>
      </div>

    </section>
  );
}
