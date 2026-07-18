// Reference Edge Function — the ONLY thing new functions copy is the wiring
// below; all security logic lives in _shared/secure-handler.ts. Deno runtime.
//
// Transactional audit: the operation issues a single UPDATE on public.profiles;
// the AFTER trigger (migration 0003) writes the audit row within the SAME
// transaction, so a successful update always has its audit row.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { z } from "npm:zod@4";
import { createSecureHandler } from "../_shared/secure-handler.ts";

const schema = z.object({
  full_name: z.string().min(1).max(200),
});

const handler = createSecureHandler({
  schema,
  requiredRole: "patient", // any authenticated patient may edit their own name
  action: "update_profile_name",
  deps: {
    auth: {
      async getUser(token: string) {
        const sb = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: `Bearer ${token}` } } },
        );
        const { data, error } = await sb.auth.getUser();
        return { user: data.user ? { id: data.user.id } : null, error };
      },
      async getRoleKeys(_userId: string) {
        // Uses the caller's JWT so the SECURITY DEFINER helper sees auth.uid().
        const sb = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
        );
        const { data } = await sb.rpc("user_role_keys");
        return (data as string[] | null) ?? [];
      },
    },
    log(event, fields) {
      // Structured, PII-safe. Never logs the validated payload (may hold PHI).
      console.log(JSON.stringify({ event, ...fields }));
    },
  },
  async operation({ user, input }) {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
    );
    // RLS still restricts this to the caller's own row; the audit trigger fires
    // atomically with the update.
    const { error } = await sb
      .from("profiles")
      .update({ full_name: input.full_name })
      .eq("user_id", user.id);
    if (error) throw new Error("update_failed");
    return { updated: true };
  },
});

Deno.serve(handler);
