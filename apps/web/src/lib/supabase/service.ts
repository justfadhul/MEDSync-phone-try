import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@medsync/types";
import { serverEnv } from "@/lib/env/server";

// SERVICE-ROLE client. Bypasses RLS entirely — use ONLY in trusted server code
// (admin ops, seeds, Edge Functions). The `server-only` import makes importing
// this module from any client component a build-time error, so the key can
// never be traced into the browser bundle.
export function createServiceClient() {
  return createSupabaseClient<Database>(
    serverEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
