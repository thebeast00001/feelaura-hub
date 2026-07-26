"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

interface Recipient {
  name: string;
  href: string;
  h1: number;
  image: string;
}

const RECIPIENTS: Recipient[] = [
  { name: "Her", href: "/shop?occasion=love-romance", h1: 335, image: "/images/products/heart-handle-photo-mug.jpeg" },
  { name: "Him", href: "/shop?occasion=love-romance&sort=rating", h1: 210, image: "/images/products/magic-colour-changing-mug.jpeg" },
  { name: "Wife", href: "/shop?occasion=anniversary", h1: 350, image: "/images/products/evil-eye-gift-box.jpeg" },
  { name: "Husband", href: "/shop?occasion=anniversary&sort=rating", h1: 190, image: "/images/products/metallic-duo-mug-set.jpeg" },
  { name: "Girlfriend", href: "/shop?occasion=love-romance&sort=newest", h1: 340, image: "/images/products/rotating-photo-cube-lamp.jpeg" },
  { name: "Boyfriend", href: "/shop?occasion=love-romance&sort=price-desc", h1: 150, image: "/images/products/photo-keychain-set.jpeg" },
];

export default function RecipientGrid() {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {RECIPIENTS.map((r, i) => (
        <motion.div
          key={r.name}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ delay: (i % 3) * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={r.href}
            aria-label={`Gifts for ${r.name}`}
            className="press group relative flex h-40 items-end overflow-hidden rounded-[1.5rem] p-5 md:h-52"
          >
            {/* Product photo */}
            <Image
              src={r.image}
              alt=""
              fill
              sizes="(max-width:768px) 46vw, 30vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            {/* Hue-tinted gradient wash for legibility */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(150deg, hsl(${r.h1} 60% 30% / 0.55) 0%, hsl(${r.h1} 55% 16% / 0.85) 100%)`,
              }}
            />

            <div className="relative">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-xs">
                Gifts for
              </p>
              <p className="text-display text-2xl font-semibold text-white md:text-3xl">{r.name}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 sm:text-sm">
                Shop
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
