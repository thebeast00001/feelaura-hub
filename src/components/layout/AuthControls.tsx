"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Sign-in pill / user avatar for the floating nav bar.
 * Renders nothing until Clerk keys are configured, so the site
 * works before auth is set up.
 */
export default function AuthControls() {
  if (!clerkEnabled) return null;
  return <AuthControlsInner />;
}

function AuthControlsInner() {
  const { isLoaded, isSignedIn } = useUser();

  // Reserve space while Clerk loads to avoid layout shift.
  if (!isLoaded) return <div className="size-10" aria-hidden />;

  if (isSignedIn) {
    return (
      <div className="grid size-10 place-items-center">
        <UserButton
          appearance={{
            elements: { userButtonAvatarBox: "size-8" },
          }}
        />
      </div>
    );
  }

  return (
    <>
      {/* Icon on mobile, pill with label on desktop */}
      <Link
        href="/sign-in"
        aria-label="Sign in"
        className="grid size-10 place-items-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
      </Link>
      <Link
        href="/sign-in"
        className="hidden shrink-0 rounded-full bg-ink px-5 py-2.5 text-[0.82rem] font-semibold text-cream transition-colors hover:bg-accent lg:block"
      >
        Sign in
      </Link>
    </>
  );
}
