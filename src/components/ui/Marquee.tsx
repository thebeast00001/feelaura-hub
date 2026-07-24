import { cn } from "@/lib/utils";
import Logo from "./Logo";

/**
 * Seamless infinite marquee. Each half is repeated enough times to always
 * exceed the viewport width, so the -50% loop never reveals a blank gap.
 */
export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  // Repeat the item list so a single half is always wider than any screen.
  const half = Array.from({ length: 4 }).flatMap(() => items);
  const row = [...half, ...half];

  return (
    <div className={cn("overflow-hidden py-4", className)} aria-hidden>
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-display text-xl italic text-ink-soft md:text-2xl">{item}</span>
            <Logo variant="mark" className="!h-4 !w-4 shrink-0 opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
}
