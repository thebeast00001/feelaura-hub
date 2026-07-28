import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy.
 * Allows self, Clerk (auth) and Stripe (payments) — nothing else can load
 * scripts, connect, or frame the site. 'unsafe-eval' is dev-only (HMR).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.clerk.accounts.dev https://*.clerk.com https://js.stripe.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://img.clerk.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://api.stripe.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com https://*.clerk.accounts.dev",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so a stray lockfile elsewhere on the machine
  // can't confuse Next.js.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for a year so the optimizer isn't re-run on
    // every request (source-keyed, so updated files still bust the cache).
    minimumCacheTTL: 31536000,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
