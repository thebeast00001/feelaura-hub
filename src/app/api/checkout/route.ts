import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAllProducts } from "@/lib/catalog";
import { checkDelivery, isValidDeliveryDate, isValidPincode } from "@/lib/delivery";
import { getSupabase } from "@/lib/supabase-server";

interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CustomerFields {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  message?: string;
}

function makeOrderRef(): string {
  return `FA-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function cleanField(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Best-effort in-memory rate limiter: max 20 checkout attempts per IP per
 * minute. For a multi-instance production deployment, swap for a durable
 * store (Upstash Redis / Vercel KV).
 */
const hits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const MAX_BODY_BYTES = 10_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) hits.clear(); // memory cap
  const rec = hits.get(ip);
  if (!rec || now - rec.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

/**
 * Checkout endpoint.
 *
 * SECURITY:
 * - Prices are always resolved server-side from the catalog — the client
 *   only sends product IDs and quantities, so tampering has no effect.
 * - Same-origin check (CSRF), body size cap, strict field validation,
 *   per-IP rate limiting.
 *
 * With STRIPE_SECRET_KEY set this creates a real Stripe Checkout Session;
 * without it, it simulates success so the flow can be demoed.
 */
export async function POST(req: Request) {
  // CSRF: browsers always send Origin on cross-site POSTs — reject mismatches.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute." },
      { status: 429 }
    );
  }

  // Body size cap
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  let body: {
    items?: CheckoutItem[];
    pincode?: string;
    deliveryDate?: string;
  } & CustomerFields;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Delivery validation — same rules the UI uses, enforced server-side.
  const pincode = typeof body.pincode === "string" ? body.pincode : "";
  if (!isValidPincode(pincode)) {
    return NextResponse.json({ error: "Invalid PIN code" }, { status: 400 });
  }
  const deliveryInfo = checkDelivery(pincode);
  if (!deliveryInfo?.serviceable) {
    return NextResponse.json({ error: "PIN code not serviceable" }, { status: 400 });
  }
  const deliveryDate = typeof body.deliveryDate === "string" ? body.deliveryDate : "";
  if (!isValidDeliveryDate(deliveryDate)) {
    return NextResponse.json({ error: "Invalid delivery date" }, { status: 400 });
  }

  const catalog = getAllProducts();
  const resolved: Array<{ name: string; price: number; quantity: number }> = [];

  for (const item of items) {
    const product = catalog.find((p) => p.id === item.id);
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "Invalid cart item" }, { status: 400 });
    }
    resolved.push({ name: product.name, price: product.price, quantity });
  }

  const subtotal = resolved.reduce((n, i) => n + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 999 ? 0 : 99;
  const orderRef = makeOrderRef();

  // Identify the signed-in customer, if Clerk is configured.
  let clerkUserId: string | null = null;
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    try {
      const { auth } = await import("@clerk/nextjs/server");
      clerkUserId = (await auth()).userId;
    } catch {
      /* auth unavailable — guest checkout */
    }
  }

  // Persist the order to Supabase (best-effort — checkout still works if
  // the database isn't configured or is briefly unreachable).
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("orders").insert({
        order_ref: orderRef,
        clerk_user_id: clerkUserId,
        customer_name: cleanField(body.name, 80),
        email: cleanField(body.email, 120),
        phone: cleanField(body.phone, 20),
        address: cleanField(body.address, 300),
        city: cleanField(body.city, 80),
        pincode,
        delivery_date: deliveryDate,
        gift_message: cleanField(body.message, 300) || null,
        items: resolved,
        subtotal,
        delivery_fee: deliveryFee,
        total: subtotal + deliveryFee,
        status: process.env.STRIPE_SECRET_KEY ? "awaiting_payment" : "demo",
      });
    } catch (err) {
      console.error("Order persistence failed:", err);
    }
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!secretKey) {
    // Demo mode — no payment keys configured yet.
    return NextResponse.json({ demo: true, success: true, orderRef });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: resolved.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // paise
        },
        quantity: item.quantity,
      })),
      metadata: { pincode, deliveryDate, orderRef },
      success_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({ url: session.url, orderRef });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json(
      { error: "Payment could not be started. Please try again." },
      { status: 502 }
    );
  }
}
