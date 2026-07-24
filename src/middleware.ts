import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

/**
 * Clerk authentication middleware.
 * Runs only when Clerk keys are configured in .env.local, so the site
 * works out of the box before auth is set up.
 *
 * To require login for specific routes later:
 *   const isProtected = createRouteMatcher(["/account(.*)"]);
 *   clerkMiddleware(async (auth, req) => {
 *     if (isProtected(req)) await auth.protect();
 *   });
 */
export default clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
