import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { createSecureHandler } from "./secure-handler.ts";

const SECRET_PHI = "DiagnosisText-CONFIDENTIAL-12345";
const schema = z.object({ note: z.string().min(1) });

function build({ user, roleKeys, opThrows = false } = {}) {
  const logs = [];
  let opCalled = false;
  let opInput = null;
  const handler = createSecureHandler({
    schema,
    requiredRole: "doctor",
    action: "write_note",
    deps: {
      auth: {
        async getUser() {
          return { user: user ?? null, error: user ? null : "no user" };
        },
        async getRoleKeys() {
          return roleKeys ?? [];
        },
      },
      log: (event, fields) => logs.push({ event, ...fields }),
    },
    async operation({ input }) {
      opCalled = true;
      opInput = input;
      if (opThrows) throw new Error("boom");
      return { ok: true };
    },
  });
  return {
    handler,
    logs,
    get opCalled() {
      return opCalled;
    },
    get opInput() {
      return opInput;
    },
  };
}

function req({ body, auth } = {}) {
  const headers = { "content-type": "application/json" };
  if (auth) headers.authorization = `Bearer ${auth}`;
  return new Request("https://fn.local/write-note", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("malformed JSON -> 400 invalid_request (no schema leak)", async () => {
  const h = build();
  const res = await h.handler(req({ body: "{not json", auth: "t" }));
  assert.equal(res.status, 400);
  const j = await res.json();
  assert.equal(j.error, "invalid_request");
  assert.equal(j.issues, undefined, "must not leak zod issues");
});

test("schema violation -> 400 invalid_request, no field details leaked", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["doctor"] });
  const res = await h.handler(req({ body: { note: "" }, auth: "t" }));
  assert.equal(res.status, 400);
  const j = await res.json();
  assert.deepEqual(Object.keys(j), ["error"]);
  assert.equal(h.opCalled, false, "operation must not run on invalid input");
});

test("no bearer token -> 401", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["doctor"] });
  const res = await h.handler(req({ body: { note: "x" } }));
  assert.equal(res.status, 401);
  assert.equal(h.opCalled, false);
});

test("unauthenticated (getUser fails) -> 401", async () => {
  const h = build({ user: null });
  const res = await h.handler(req({ body: { note: "x" }, auth: "bad" }));
  assert.equal(res.status, 401);
  assert.equal(h.opCalled, false);
});

test("wrong role -> 403, operation NOT called", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["nurse"] });
  const res = await h.handler(req({ body: { note: "x" }, auth: "t" }));
  assert.equal(res.status, 403);
  const j = await res.json();
  assert.equal(j.error, "forbidden");
  assert.equal(h.opCalled, false);
});

test("admin passes the doctor gate", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["admin"] });
  const res = await h.handler(req({ body: { note: "x" }, auth: "t" }));
  assert.equal(res.status, 200);
  assert.equal(h.opCalled, true);
});

test("authed + right role -> 200, operation gets validated input", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["doctor"] });
  const res = await h.handler(req({ body: { note: SECRET_PHI }, auth: "t" }));
  assert.equal(res.status, 200);
  assert.equal(h.opCalled, true);
  assert.equal(h.opInput.note, SECRET_PHI);
});

test("PII-safe logging: no log line ever contains the PHI payload", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["doctor"] });
  await h.handler(req({ body: { note: SECRET_PHI }, auth: "t" }));
  const serialized = JSON.stringify(h.logs);
  assert.ok(
    !serialized.includes(SECRET_PHI),
    "PHI must never appear in logs",
  );
  // and a denial also logs no PHI
  const h2 = build({ user: { id: "u1" }, roleKeys: ["nurse"] });
  await h2.handler(req({ body: { note: SECRET_PHI }, auth: "t" }));
  assert.ok(!JSON.stringify(h2.logs).includes(SECRET_PHI));
});

test("operation error -> 500 operation_failed (generic)", async () => {
  const h = build({ user: { id: "u1" }, roleKeys: ["doctor"], opThrows: true });
  const res = await h.handler(req({ body: { note: "x" }, auth: "t" }));
  assert.equal(res.status, 500);
  const j = await res.json();
  assert.equal(j.error, "operation_failed");
});
