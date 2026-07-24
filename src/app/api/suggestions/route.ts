import { NextResponse } from "next/server";
import { getSuggestions } from "@/lib/products";

/** Light per-IP rate limit: 120 requests/minute. */
const hits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) hits.clear();
  const rec = hits.get(ip);
  if (!rec || now - rec.windowStart > 60_000) {
    hits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  return rec.count > 120;
}

/** "Complete the gift" suggestions for the cart drawer + checkout. */
export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const raw = new URL(req.url).searchParams.get("ids") ?? "";
  if (raw.length > 2_000) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[a-z0-9-]{1,40}$/.test(s))
    .slice(0, 50);

  return NextResponse.json(
    { items: getSuggestions(ids) },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}
