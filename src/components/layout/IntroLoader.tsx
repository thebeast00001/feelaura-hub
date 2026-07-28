"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Logo from "@/components/ui/Logo";

/**
 * First-visit intro: wordmark + progress bar, then a curtain lift.
 * - Rendered in the SSR HTML, so it covers the page from the very first
 *   paint (no content flash).
 * - Plays once per browser session; repeat navigations exit instantly.
 * - Respects prefers-reduced-motion.
 */
export default function IntroLoader() {
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("feelaura-intro") === "1";
      sessionStorage.setItem("feelaura-intro", "1");
    } catch {
      /* private mode */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setPhase("exit"), seen || reduce ? 60 : 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => phase === "exit" && setPhase("done")}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 rounded-b-[3rem] bg-cream"
    >
      <Logo variant="full" priority className="h-28 w-auto md:h-36" />
      <div className="h-[3px] w-44 overflow-hidden rounded-full bg-cream-soft md:w-56">
        <div className="intro-bar h-full rounded-full bg-accent" />
      </div>
    </motion.div>
  );
}
