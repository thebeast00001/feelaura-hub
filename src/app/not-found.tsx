import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-20 text-center">
      <p className="text-display text-[clamp(5rem,20vw,10rem)] font-semibold leading-none text-ink/10">404</p>
      <h1 className="text-display mt-2 text-3xl font-semibold md:text-4xl">This gift got lost in the post</h1>
      <p className="mt-4 max-w-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist — but there&apos;s plenty more to discover.
      </p>
      <Link
        href="/shop"
        className="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-accent"
      >
        Back to shopping
      </Link>
    </div>
  );
}
