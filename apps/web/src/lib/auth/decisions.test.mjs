import { test } from "node:test";
import assert from "node:assert/strict";
import { isMfaSatisfied, isRoleAuthorized } from "./decisions.ts";

test("MFA: role requiring MFA without AAL2 is NOT satisfied", () => {
  assert.equal(isMfaSatisfied({ requiresMfa: true, hasAal2: false }), false);
});
test("MFA: role requiring MFA with AAL2 is satisfied", () => {
  assert.equal(isMfaSatisfied({ requiresMfa: true, hasAal2: true }), true);
});
test("MFA: role not requiring MFA is satisfied without AAL2", () => {
  assert.equal(isMfaSatisfied({ requiresMfa: false, hasAal2: false }), true);
});
test("role: doctor without MFA (required) is denied even with the role", () => {
  assert.equal(
    isRoleAuthorized(
      { roleKeys: ["doctor"], isAdmin: false, requiresMfa: true, hasAal2: false },
      "doctor",
    ),
    false,
  );
});
test("role: doctor with MFA satisfied is authorized", () => {
  assert.equal(
    isRoleAuthorized(
      { roleKeys: ["doctor"], isAdmin: false, requiresMfa: true, hasAal2: true },
      "doctor",
    ),
    true,
  );
});
test("role: admin passes any role gate (MFA satisfied)", () => {
  assert.equal(
    isRoleAuthorized(
      { roleKeys: [], isAdmin: true, requiresMfa: true, hasAal2: true },
      "doctor",
    ),
    true,
  );
});
test("role: non-holder without the role is denied", () => {
  assert.equal(
    isRoleAuthorized(
      { roleKeys: ["nurse"], isAdmin: false, requiresMfa: false, hasAal2: false },
      "doctor",
    ),
    false,
  );
});
