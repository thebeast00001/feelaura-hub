import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

/**
 * Official Feelaura Hub brand logo.
 * - variant="mark": the flower-F icon only (nav, favicon-scale contexts)
 * - variant="full": the complete stacked lockup with wordmark
 */
export default function Logo({
  variant = "mark",
  className,
  priority = false,
}: {
  variant?: "mark" | "full";
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "full" ? "/images/brand/logo-full.png" : "/images/brand/logo-mark.png";
  const ratio = variant === "full" ? 641 / 584 : 425 / 440;

  return (
    <Image
      src={src}
      alt={`${BRAND.name} logo`}
      width={Math.round(200 * ratio)}
      height={200}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
    />
  );
}
