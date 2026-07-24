"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Dot {
  id: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

let dotId = 1;

/** Renders the flying dot from an "add to cart" tap to the header cart icon. */
export default function FlyToCart() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    function onFly(e: Event) {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const target = document.getElementById("cart-btn");
      if (!target || !x || !y) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = target.getBoundingClientRect();
      const id = dotId++;
      setDots((d) => [
        ...d.slice(-3),
        { id, x0: x, y0: y, x1: rect.left + rect.width / 2, y1: rect.top + rect.height / 2 },
      ]);
      setTimeout(() => setDots((d) => d.filter((dot) => dot.id !== id)), 700);
    }
    window.addEventListener("feelaura:fly", onFly);
    return () => window.removeEventListener("feelaura:fly", onFly);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          initial={{ x: d.x0 - 6, y: d.y0 - 6, scale: 1, opacity: 1 }}
          animate={{ x: d.x1 - 6, y: d.y1 - 6, scale: 0.35, opacity: 0.5 }}
          transition={{ duration: 0.55, ease: [0.3, 0, 0.2, 1] }}
          className="absolute left-0 top-0 block size-3 rounded-full bg-accent shadow-md"
        />
      ))}
    </div>
  );
}
