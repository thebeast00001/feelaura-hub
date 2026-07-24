# feelaura-hub — Premium Gifting Storefront

An awwwards-style, ultra-smooth e-commerce storefront built with Next.js 15, Tailwind CSS 4, Motion (Framer Motion) and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Adding real product images

Drop photos into `public/images/products/`, named after the product slug:

```
public/images/products/blush-rose-bouquet.jpg
public/images/products/classic-chocolate-truffle-cake.webp
```

Accepted formats: `.jpg` `.jpeg` `.png` `.webp` `.avif`. The site detects them automatically — any product without a photo shows a styled placeholder, so nothing ever looks broken. Product slugs are visible in each product's URL (`/product/<slug>`).

**Recommended:** 1200×1500px (4:5), JPG or WebP, under 400KB. Next.js automatically serves AVIF/WebP, resizes per device, and lazy-loads.

## Re-branding for the client

1. `src/lib/brand.ts` — name, tagline, currency.
2. `src/app/globals.css` — color + font tokens under `@theme` (one block).
3. `src/app/layout.tsx` — swap Google fonts if the brand uses different ones.

## Authentication (Clerk)

1. Create a free application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy the publishable + secret keys into `.env.local` (see `.env.example`)
3. Restart the dev server

Sign-in/up pages live at `/sign-in` and `/sign-up`; the header shows a Sign in
pill (or the user's avatar) automatically. Without keys, all auth UI hides and
the store works as guest-only. To require login for a route, see the comment in
`src/middleware.ts`.

## Database (Supabase)

Orders and newsletter signups persist to Supabase once configured:

1. Create a free project at [supabase.com](https://supabase.com)
2. Open SQL Editor → paste and run `supabase-schema.sql` (in the project root)
3. Copy Project Settings → API → the project URL and the `service_role` key
   into `.env.local` (see `.env.example`), restart the server

Security model: Row Level Security is enabled with **no public policies** — the
database is completely closed to browsers. Only server API routes (using the
service-role key, which never reaches the client) can read or write. Orders
record the Clerk user id when the customer is signed in.

Without keys, checkout still works — orders just aren't persisted.

## Payments (Stripe)

Checkout runs in demo mode until keys are added:

```bash
cp .env.example .env.local   # then fill in STRIPE_SECRET_KEY
```

Prices are always resolved server-side from the catalog (`src/app/api/checkout/route.ts`) — the client only sends product IDs, so browser tampering can't change what's charged.

## Swapping in a real product database (phase 2)

All product reads go through `src/lib/products.ts` / `src/lib/catalog.ts`. Replace the generator in `catalog.ts` with your database/CMS queries and every page keeps working.

## Performance & scale

- Home, category and product pages are statically generated at build time and served from CDN edge — effectively unlimited concurrent users on Vercel/Cloudflare.
- Client JS is kept to interactive islands (header, cart, checkout); everything else is server components.
- Deploy: push to GitHub → import on [Vercel](https://vercel.com) → done. Set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` in project env vars.
