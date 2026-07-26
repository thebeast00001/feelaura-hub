"use client";

import { motion } from "motion/react";

export type Motif = "confetti" | "bokeh" | "ribbons" | "photos" | "stars" | "rakhi";

/**
 * A distinct live animation for each banner. All transform/opacity only, so
 * it stays smooth; renders nothing for reduced-motion users.
 */
export default function BannerMotif({
  type,
  color,
  reduce,
}: {
  type: Motif;
  color: string;
  reduce: boolean;
}) {
  if (reduce) return null;
  const wrap = "pointer-events-none absolute inset-0 overflow-hidden";

  if (type === "confetti") {
    const pieces = [
      { x: "8%", d: 3.4, delay: 0, c: "#ffffff" },
      { x: "20%", d: 4.2, delay: 0.8, c: color },
      { x: "33%", d: 3.0, delay: 1.6, c: "#ffd27a" },
      { x: "50%", d: 4.6, delay: 0.4, c: "#ffffff" },
      { x: "63%", d: 3.6, delay: 1.2, c: color },
      { x: "78%", d: 4.0, delay: 2.0, c: "#ffd27a" },
      { x: "90%", d: 3.2, delay: 0.6, c: "#ffffff" },
    ];
    return (
      <div className={wrap} aria-hidden>
        {pieces.map((p, i) => (
          <motion.span
            key={i}
            className="absolute left-0 top-0 block h-3 w-1.5 rounded-[2px]"
            style={{ left: p.x, background: p.c }}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: [-30, 520], x: [0, 12, -8, 0], rotate: [0, 220, 400], opacity: [0, 1, 1, 0] }}
            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    );
  }

  if (type === "bokeh") {
    const dots = [
      { s: 90, x: "12%", d: 7, delay: 0 },
      { s: 60, x: "30%", d: 9, delay: 1.5 },
      { s: 120, x: "55%", d: 8, delay: 0.6 },
      { s: 70, x: "72%", d: 10, delay: 2.2 },
      { s: 100, x: "88%", d: 7.5, delay: 1 },
    ];
    return (
      <div className={wrap} aria-hidden>
        {dots.map((d, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full blur-xl"
            style={{ width: d.s, height: d.s, left: d.x, bottom: -60, background: color }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [-20, -460], opacity: [0, 0.5, 0] }}
            transition={{ duration: d.d, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }

  if (type === "ribbons") {
    const rib = [
      { x: "14%", top: "8%", a: 14, d: 5, delay: 0 },
      { x: "40%", top: "-4%", a: -10, d: 6.5, delay: 1 },
      { x: "66%", top: "10%", a: 18, d: 5.5, delay: 0.5 },
      { x: "84%", top: "-2%", a: -14, d: 7, delay: 1.6 },
    ];
    return (
      <div className={wrap} aria-hidden>
        {rib.map((r, i) => (
          <motion.span
            key={i}
            className="absolute h-40 w-1.5 rounded-full"
            style={{ left: r.x, top: r.top, background: `linear-gradient(${color}, transparent)`, opacity: 0.5 }}
            animate={{ rotate: [r.a, -r.a, r.a], y: [0, 14, 0] }}
            transition={{ duration: r.d, delay: r.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }

  if (type === "photos") {
    const pics = [
      { x: "10%", top: "24%", r: -12, d: 6, delay: 0 },
      { x: "34%", top: "12%", r: 8, d: 7, delay: 1 },
      { x: "60%", top: "20%", r: -6, d: 6.5, delay: 0.5 },
      { x: "80%", top: "60%", r: 12, d: 7.5, delay: 1.5 },
      { x: "22%", top: "66%", r: 6, d: 6.2, delay: 2 },
    ];
    return (
      <div className={wrap} aria-hidden>
        {pics.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-md border-2 border-white/70 bg-white/15 backdrop-blur-sm"
            style={{ width: 26, height: 32, left: p.x, top: p.top }}
            animate={{ y: [0, -16, 0], rotate: [p.r, p.r + 10, p.r], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    );
  }

  if (type === "stars") {
    const stars = [
      { x: "12%", top: "22%", s: 13, d: 2.6, delay: 0 },
      { x: "44%", top: "12%", s: 9, d: 2.2, delay: 0.6 },
      { x: "72%", top: "18%", s: 15, d: 3, delay: 1.1 },
      { x: "86%", top: "58%", s: 10, d: 2.4, delay: 0.3 },
      { x: "24%", top: "70%", s: 11, d: 2.8, delay: 0.9 },
      { x: "58%", top: "74%", s: 8, d: 2.3, delay: 1.4 },
    ];
    return (
      <div className={wrap} aria-hidden>
        {stars.map((st, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: st.x, top: st.top, color }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 90, 0] }}
            transition={{ duration: st.d, delay: st.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width={st.s} height={st.s} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c.6 6 5.4 10.8 12 12-6.6 1.2-11.4 6-12 12-.6-6-5.4-10.8-12-12C6.6 10.8 11.4 6 12 0Z" />
            </svg>
          </motion.span>
        ))}
      </div>
    );
  }

  // rakhi — hanging decorated discs that gently swing
  const rakhis = [
    { x: "14%", s: 30, a: 10, d: 4, delay: 0 },
    { x: "38%", s: 22, a: -8, d: 5, delay: 0.8 },
    { x: "66%", s: 34, a: 12, d: 4.5, delay: 0.4 },
    { x: "86%", s: 24, a: -10, d: 5.5, delay: 1.2 },
  ];
  return (
    <div className={wrap} aria-hidden>
      {rakhis.map((r, i) => (
        <motion.div
          key={i}
          className="absolute top-0 origin-top"
          style={{ left: r.x }}
          animate={{ rotate: [r.a, -r.a, r.a] }}
          transition={{ duration: r.d, delay: r.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mx-auto h-16 w-px" style={{ background: `linear-gradient(${color}, transparent)` }} />
          <svg width={r.s} height={r.s} viewBox="0 0 24 24" fill="none" className="-mt-1" style={{ color }}>
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25" />
            <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="12"
                y1="12"
                x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />
            ))}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
