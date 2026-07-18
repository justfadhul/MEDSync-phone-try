"use server";

import { requireMfa } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

// Server Action. Re-verifies identity + MFA server-side BEFORE any write — it
// does not trust that the proxy allowed the request through.
export async function updateFullName(fullName: string) {
  const { user } = await requireMfa();
  const supabase = await createClient();
  // RLS still independently enforces that a user can only update their own row.
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("user_id", user.id);
  if (error) throw new Error("Update failed");
}
