// Pure authorization decisions, separated from the I/O guards so they can be
// unit-tested directly. The guards (guards.ts) call getUser() server-side and
// then apply exactly these predicates.

export type RoleFacts = {
  roleKeys: string[];
  isAdmin: boolean;
  requiresMfa: boolean;
  hasAal2: boolean;
};

/** MFA is satisfied when the role does not require it, or AAL2 was reached. */
export function isMfaSatisfied(f: Pick<RoleFacts, "requiresMfa" | "hasAal2">) {
  return !f.requiresMfa || f.hasAal2;
}

/** Authorized for a role when MFA is satisfied AND (holds the role OR admin). */
export function isRoleAuthorized(f: RoleFacts, roleKey: string) {
  if (!isMfaSatisfied(f)) return false;
  return f.isAdmin || f.roleKeys.includes(roleKey);
}

// --- unified sign-in routing (Gate O.6) --------------------------------------
// After a correct password, where a user lands is decided server-side (never
// inferred from UI). Order matters: a second factor is demanded BEFORE we reveal
// anything about approval state, and an unapproved application NEVER reaches a
// workspace — it lands on an honest pending screen.
export type AccessState = "needs_mfa" | "pending_approval" | "ready";

/** The strongest onboarding application a signed-in user owns, if any. */
export type ApplicationState = { status: string } | null | undefined;

/**
 * Resolve where a just-authenticated user goes.
 *  1. role requires MFA and AAL2 not reached  -> needs_mfa
 *  2. owns an application that isn't `active`  -> pending_approval
 *  3. otherwise                                -> ready
 * A patient (no application) with MFA satisfied is `ready`. A staff/hospital
 * applicant whose application is still submitted/in_review is `pending_approval`
 * even though their credentials are valid — access follows approval, not login.
 */
export function resolveAccess(
  f: Pick<RoleFacts, "requiresMfa" | "hasAal2">,
  application?: ApplicationState,
): AccessState {
  if (!isMfaSatisfied(f)) return "needs_mfa";
  if (application && application.status !== "active") return "pending_approval";
  return "ready";
}

/** Route for an access state. Single source of truth for post-sign-in paths. */
export function pathForAccess(state: AccessState): string {
  switch (state) {
    case "needs_mfa": return "/mfa";
    case "pending_approval": return "/pending";
    case "ready": return "/dashboard";
  }
}
