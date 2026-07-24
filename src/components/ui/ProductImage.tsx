import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  name: string;
  hue: number;
  image: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders the real product photo when one exists in /public/images/products,
 * otherwise an editorial gradient placeholder derived from the product's hue —
 * so the site looks finished even before photography arrives.
 */
export default function ProductImage({
  name,
  hue,
  image,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: ProductImageProps) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={image}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `
          radial-gradient(120% 90% at 20% 10%, hsl(${hue} 48% 88%) 0%, transparent 60%),
          radial-gradient(120% 100% at 85% 90%, hsl(${(hue + 40) % 360} 42% 78%) 0%, transparent 55%),
          hsl(${hue} 38% 84%)`,
      }}
    >
      <span
        className="text-display select-none text-[clamp(4rem,10vw,7rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        style={{ color: `hsl(${hue} 45% 38% / 0.35)` }}
      >
        {name.charAt(0)}
      </span>
    </div>
  );
}
