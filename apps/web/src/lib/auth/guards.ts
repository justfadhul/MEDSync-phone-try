import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isMfaSatisfied, isRoleAuthorized } from "@/lib/auth/decisions";

// =============================================================================
// SERVER-SIDE AUTHORIZATION GUARDS.
// The proxy (proxy.ts) is a redirect convenience, NOT a security boundary
// (Next 16 has had proxy/middleware auth-bypass advisories). EVERY protected
// route handler and EVERY Server Action re-verifies identity here, server-side,
// with getUser() — which revalidates the JWT against the auth server. We never
// use getSession() for an authorization decision.
// =============================================================================

export type AuthContext = {
  user: User;
  roleKeys: string[];
  isAdmin: boolean;
  requiresMfa: boolean;
  hasAal2: boolean;
};

/** Revalidated identity or a redirect to sign-in. Use in protected routes. */
export async function requireUser(): Promise<AuthContext> {
  const supabase = await createClient();

  // getUser() re-verifies the JWT with Supabase Auth (unlike getSession()).
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/sign-in");

  // Assurance level is checked server-side, not inferred from UI state.
  const { data: aal } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const hasAal2 = aal?.currentLevel === "aal2";

  // Role facts come from the DB (SECURITY DEFINER helpers), governed by RLS.
  const [{ data: roleKeys }, { data: isAdmin }, { data: requiresMfa }] =
    await Promise.all([
      supabase.rpc("user_role_keys"),
      supabase.rpc("is_admin"),
      supabase.rpc("user_requires_mfa"),
    ]);

  return {
    user,
    roleKeys: (roleKeys as string[] | null) ?? [],
    isAdmin: Boolean(isAdmin),
    requiresMfa: Boolean(requiresMfa),
    hasAal2,
  };
}

/** Require MFA (AAL2) when the user's role demands it. Server-enforced. */
export async function requireMfa(ctx?: AuthContext): Promise<AuthContext> {
  const c = ctx ?? (await requireUser());
  if (!isMfaSatisfied(c)) {
    // Not authorized until a second factor is completed this session.
    redirect("/mfa");
  }
  return c;
}

/** Require a specific role key (and satisfied MFA). Throws 403 semantics. */
export async function requireRole(roleKey: string): Promise<AuthContext> {
  const c = await requireUser();
  if (!isMfaSatisfied(c)) redirect("/mfa");
  if (!isRoleAuthorized(c, roleKey)) {
    // Do not leak which roles exist; a flat forbidden.
    throw new Error("FORBIDDEN");
  }
  return c;
}
