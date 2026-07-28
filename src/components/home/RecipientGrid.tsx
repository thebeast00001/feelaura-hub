"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import HScroller from "@/components/ui/HScroller";

interface Recipient {
  name: string;
  href: string;
  image: string;
}

const RECIPIENTS: Recipient[] = [
  { name: "Him", href: "/shop?occasion=anniversary&sort=rating", image: "/images/recipients/him.jpg" },
  { name: "Her", href: "/shop?occasion=love-romance", image: "/images/recipients/her.jpg" },
  { name: "Kids", href: "/shop?occasion=birthday", image: "/images/recipients/kids.jpg" },
  { name: "Friend", href: "/shop?occasion=just-because", image: "/images/recipients/friend.jpg" },
  { name: "Wife", href: "/shop?occasion=anniversary", image: "/images/recipients/wife.jpg" },
  { name: "Husband", href: "/shop?occasion=anniversary&sort=rating", image: "/images/recipients/husband.jpg" },
  { name: "Girlfriend", href: "/shop?occasion=love-romance&sort=newest", image: "/images/recipients/girlfriend.jpg" },
  { name: "Boyfriend", href: "/shop?occasion=love-romance&sort=price-desc", image: "/images/recipients/boyfriend.jpg" },
];

export default function RecipientGrid() {
  const reduce = useReducedMotion();

  return (
    <HScroller
      className="-mx-5 gap-3 px-5 pb-1 snap-x snap-mandatory sm:-mx-8 sm:gap-4 sm:px-8 lg:mx-0 lg:px-0"
      arrowTop="top-[40%]"
    >
      {RECIPIENTS.map((r, i) => (
        <motion.div
          key={r.name}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ delay: (i % 5) * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-[42%] shrink-0 snap-start sm:w-[30%] lg:w-[18.6%]"
        >
          <Link href={r.href} aria-label={`Gifts for ${r.name}`} className="press group block">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[1.25rem]">
              <Image
                src={r.image}
                alt={r.name}
                fill
                sizes="(max-width:640px) 42vw, 19vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
            </div>
            <p className="mt-3 text-center text-sm font-medium text-ink md:text-base">{r.name}</p>
          </Link>
        </motion.div>
      ))}
    </HScroller>
  );
}
