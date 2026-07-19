"use server";

import { createClient } from "@/lib/supabase/server";

export type WaitlistResult =
  | { ok: true }
  | { ok: false; message: string };

// Minimal public waitlist capture. NOT registration — a single email, written
// to the write-only `public.waitlist` table (anon may INSERT, never SELECT).
// A duplicate is treated as success: "you're already on the list" is not an
// error the visitor needs to see, and it avoids revealing who has signed up.
export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData,
): Promise<WaitlistResult> {
  const raw = String(formData.get("email") ?? "").trim().toLowerCase();

  // Same shape the DB constraint enforces — checked here for a friendly message.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("waitlist")
    .insert({ email: raw, source: "landing" });

  // 23505 = unique_violation → already on the list, which we treat as success.
  if (error && error.code !== "23505") {
    return {
      ok: false,
      message: "Something went wrong. Please try again shortly.",
    };
  }

  return { ok: true };
}
