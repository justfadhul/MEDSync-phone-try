"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@medsync/types";
import { publicEnv } from "@/lib/env/public";

// Browser Supabase client. Uses the ANON key only. Any data access is still
// governed by RLS server-side. Never import the service-role client here.
export function createClient() {
  return createBrowserClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
  );
}
