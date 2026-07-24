"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useMediaQuery } from "@/lib/use-media";

/**
 * Sticky wrapper that slides out of the way while scrolling down and
 * returns when scrolling up — mobile only (it's a static inline block
 * on desktop, where hiding would be wrong).
 */
export default function StickyBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y > prev && y > 220) setHidden(true);
    else if (y < prev - 4) setHidden(false);
  });

  const hide = hidden && !isDesktop;

  return (
    <motion.div
      animate={{ y: hide ? "-130%" : 0, opacity: hide ? 0 : 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={{ pointerEvents: hide ? "none" : "auto" }}
    >
      {children}
    </motion.div>
  );
}
