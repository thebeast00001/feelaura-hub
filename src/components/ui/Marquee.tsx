import { cn } from "@/lib/utils";

/** Infinite CSS marquee — GPU-only, zero JS. Content is duplicated for the loop. */
export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("overflow-hidden border-y border-line py-4", className)} aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-display text-xl italic text-ink-soft md:text-2xl">{item}</span>
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
