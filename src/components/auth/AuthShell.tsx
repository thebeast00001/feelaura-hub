import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/** Shared layout for the sign-in / sign-up pages. */
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-x flex min-h-[85vh] flex-col items-center justify-center pb-24 pt-28 md:pt-32">
      <Reveal className="mb-8 max-w-md text-center">
        <h1 className="text-display text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink-soft">{subtitle}</p>
      </Reveal>

      {clerkEnabled ? (
        <Reveal delay={0.1}>{children}</Reveal>
      ) : (
        <Reveal delay={0.1} className="max-w-md rounded-[2rem] border border-line bg-cream-soft p-8 text-center">
          <p className="text-display text-xl font-semibold">Auth isn&apos;t configured yet</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Create a free application at{" "}
            <a href="https://clerk.com" className="link-underline font-medium text-accent" target="_blank" rel="noreferrer">
              clerk.com
            </a>{" "}
            and add its two keys to <code className="rounded-md bg-surface px-1.5 py-0.5 text-xs">.env.local</code>{" "}
            (see <code className="rounded-md bg-surface px-1.5 py-0.5 text-xs">.env.example</code>), then restart the
            dev server.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-accent"
          >
            Back home
          </Link>
        </Reveal>
      )}
    </div>
  );
}
