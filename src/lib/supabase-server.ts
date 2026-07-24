import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY Supabase client using the service-role key.
 * Never import this from a client component.
 *
 * Security model: RLS is enabled on every table with NO public policies,
 * so the database is completely closed to browsers — only this server
 * client (which bypasses RLS) can read/write. Returns null when env vars
 * aren't configured, so the site works before Supabase is set up.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
