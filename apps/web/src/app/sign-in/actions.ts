"use server";

import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@medsync/types";
import { createClient } from "@/lib/supabase/server";
import {
  resolveAccess, pathForAccess, type ApplicationState,
} from "@/lib/auth/decisions";

// Unified sign-in (Gate O.6). ONE door for patients, staff, hospital admins and
// superadmins. After a correct password we decide the destination SERVER-SIDE
// with getUser() (never getSession, never trusting UI): MFA first, then the
// honest pending-approval state, then the workspace. The role, not the URL,
// unlocks what a user sees.

export type SignInResult = { error: string } | null;

export async function signIn(
  _prev: SignInResult,
  formData: FormData,
): Promise<SignInResult> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) {
    return { error: "Enter your email or phone and your password." };
  }

  const supabase = await createClient();
  const creds = identifier.includes("@")
    ? { email: identifier.toLowerCase(), password }
    : { phone: normalizePhone(identifier), password };

  const { error } = await supabase.auth.signInWithPassword(creds);
  // One flat message — never reveal whether the identifier exists.
  if (error) {
    return { error: "We couldn't sign you in. Check your details and try again." };
  }

  redirect(await resolveDestination(supabase));
}

// The post-sign-in routing decision, made from re-verified server state.
async function resolveDestination(
  supabase: SupabaseClient<Database>,
): Promise<string> {
  // getUser() re-verifies the JWT with the auth server (unlike getSession()).
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "/sign-in";

  const { data: aal } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const [{ data: requiresMfa }, application] = await Promise.all([
    supabase.rpc("user_requires_mfa"),
    strongestApplication(supabase, user.id),
  ]);

  const state = resolveAccess(
    { requiresMfa: Boolean(requiresMfa), hasAal2: aal?.currentLevel === "aal2" },
    application,
  );
  return pathForAccess(state);
}

// A user's strongest onboarding application, if any: `active` wins (they're in),
// otherwise the first pending one keeps them on the honest pending screen. RLS
// scopes each query to the caller's own rows.
async function strongestApplication(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<ApplicationState> {
  const [staff, hospital] = await Promise.all([
    supabase.from("staff_applications").select("status").eq("user_id", userId),
    supabase.from("hospital_applications").select("status").eq("submitted_by", userId),
  ]);
  const statuses = [
    ...(staff.data ?? []),
    ...(hospital.data ?? []),
  ].map((r) => r.status);

  if (statuses.length === 0) return null;              // e.g. a patient
  if (statuses.includes("active")) return { status: "active" };
  return { status: statuses[0]! };                     // still pending
}

// Uganda numbers: local 07XX… -> +2567XX…; pass through anything already E.164.
function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+256${digits.slice(1)}`;
  return digits;
}
