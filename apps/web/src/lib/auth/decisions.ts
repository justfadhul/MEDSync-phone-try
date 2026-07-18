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
