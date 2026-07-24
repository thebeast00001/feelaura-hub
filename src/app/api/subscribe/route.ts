import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

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
  return rec.count > 10;
}

/** Newsletter signup — stored in Supabase when configured. */
export async function POST(req: Request) {
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
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let email = "";
  try {
    const body = await req.json();
    email = typeof body.email === "string" ? body.email.trim().slice(0, 120) : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("newsletter_subscribers")
        .upsert({ email: email.toLowerCase() }, { onConflict: "email" });
    } catch (err) {
      console.error("Subscribe persistence failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
