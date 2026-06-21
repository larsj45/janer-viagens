import 'server-only';
import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY Supabase client using the service_role key.
// NEVER import this from a Client Component ('use client') — it would leak the
// service key into the browser bundle. Use it only inside Server Components,
// route handlers, or server actions. It bypasses RLS, so it is the only way to
// read tables that have NO public-read policy (e.g. loyalty_accounts), keeping
// that data accessible solely through the login-gated server render.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin environment variables');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
