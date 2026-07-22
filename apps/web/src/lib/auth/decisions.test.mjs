import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isMfaSatisfied, isRoleAuthorized, resolveAccess, pathForAccess,
} from "./decisions.ts";

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

// --- resolveAccess (Gate O.6) ------------------------------------------------
test("access: MFA-required role without AAL2 goes to MFA before anything else", () => {
  // even with an active application, the second factor is demanded first
  assert.equal(
    resolveAccess({ requiresMfa: true, hasAal2: false }, { status: "active" }),
    "needs_mfa",
  );
});
test("access: patient (no application), MFA satisfied, is ready", () => {
  assert.equal(resolveAccess({ requiresMfa: false, hasAal2: false }, null), "ready");
});
test("access: valid login but application still submitted is pending, not ready", () => {
  assert.equal(
    resolveAccess({ requiresMfa: false, hasAal2: false }, { status: "submitted" }),
    "pending_approval",
  );
});
test("access: application in_review is still pending", () => {
  assert.equal(
    resolveAccess({ requiresMfa: true, hasAal2: true }, { status: "in_review" }),
    "pending_approval",
  );
});
test("access: approved (active) application with MFA satisfied is ready", () => {
  assert.equal(
    resolveAccess({ requiresMfa: true, hasAal2: true }, { status: "active" }),
    "ready",
  );
});
test("paths map each access state to its route", () => {
  assert.equal(pathForAccess("needs_mfa"), "/mfa");
  assert.equal(pathForAccess("pending_approval"), "/pending");
  assert.equal(pathForAccess("ready"), "/dashboard");
});
