import Link from "next/link";
import Image from "next/image";

interface ShelfItem {
  slug: string;
  name: string;
  image: string;
}

/** Products standing on the shop counter — one per category. */
const ITEMS: ShelfItem[] = [
  { slug: "mugs", name: "Mugs", image: "/images/store/mugs.webp" },
  { slug: "photo-frames", name: "Frames", image: "/images/store/photo-frames.webp" },
  { slug: "led-lamps", name: "Lamps", image: "/images/store/led-lamps.webp" },
  { slug: "hampers", name: "Hampers", image: "/images/store/hampers.webp" },
  { slug: "tote-bags", name: "Totes", image: "/images/store/tote-bags.webp" },
  { slug: "keychains", name: "Keychains", image: "/images/store/keychains.webp" },
  { slug: "fridge-magnets", name: "Magnets", image: "/images/store/fridge-magnets.webp" },
];

/** Red + cream striped awning with a scalloped bottom edge. */
const AWNING = "repeating-linear-gradient(90deg,#b3242a 0 30px,#f4e9d2 30px 60px)";
const AWNING_MASK =
  "radial-gradient(15px at 50% 0,#000 98%,transparent) 0 100%/30px 15px repeat-x, linear-gradient(#000 0 0) 0 0/100% calc(100% - 14px) no-repeat";

export default function CategoryShelf() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-[#e7c9a8] shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)] max-sm:rounded-none">
      {/* real wall backdrop (arch, texture, diagonal light) */}
      <Image
        src="/images/store/wall.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* awning cast shadow */}
      <div aria-hidden className="absolute inset-x-0 top-[50px] z-10 h-7 bg-gradient-to-b from-black/18 to-transparent" />

      {/* awning */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 h-[54px] drop-shadow-[0_4px_5px_rgba(0,0,0,0.18)]"
        style={{ background: AWNING, WebkitMask: AWNING_MASK, mask: AWNING_MASK }}
      />

      {/* real wooden counter */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[64px]">
        <Image src="/images/store/counter.jpg" alt="" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-x-0 top-0 h-[6px] bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* products (horizontal scroll) */}
      <div className="no-scrollbar absolute inset-0 z-20 flex snap-x snap-mandatory items-stretch gap-2 overflow-x-auto px-4 sm:gap-4 sm:px-8">
        {ITEMS.map((it) => (
          <Link
            key={it.slug}
            href={`/shop/${it.slug}`}
            aria-label={it.name}
            className="press group relative block h-full w-[112px] shrink-0 snap-start sm:w-[134px]"
          >
            {/* contact shadow on the counter */}
            <div
              aria-hidden
              className="absolute bottom-[54px] left-1/2 h-3 w-[66px] -translate-x-1/2 rounded-[50%] bg-black/25 blur-md"
            />
            {/* product */}
            <div className="absolute bottom-[56px] left-1/2 h-[134px] w-[100px] -translate-x-1/2 sm:h-[148px] sm:w-[116px]">
              <Image
                src={it.image}
                alt={it.name}
                fill
                sizes="140px"
                className="object-contain object-bottom drop-shadow-[0_10px_9px_rgba(0,0,0,0.18)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5"
              />
            </div>
            {/* name tag */}
            <div className="absolute bottom-[18px] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-black/10 bg-[#fbf3d4] px-3 py-1.5 text-[12.5px] font-semibold text-[#3b3b3b] shadow-sm transition-colors group-hover:bg-[#fdf8e2]">
              {it.name} <span className="text-[#b3242a]">›</span>
            </div>
          </Link>
        ))}
      </div>

      {/* height */}
      <div className="h-[288px] sm:h-[320px]" />
    </div>
  );
}
