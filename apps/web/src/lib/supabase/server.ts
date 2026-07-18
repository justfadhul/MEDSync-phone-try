import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@medsync/types";
import { serverEnv } from "@/lib/env/server";

// Cookie-bound server client for RSC / route handlers / server actions.
// Authorization decisions MUST use getUser() (revalidates the JWT with the
// auth server), never getSession() (which trusts the local cookie).
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    serverEnv.supabaseUrl,
    serverEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // called from a Server Component render — safe to ignore; the
            // proxy refreshes the cookie on the next request.
          }
        },
      },
    },
  );
}
