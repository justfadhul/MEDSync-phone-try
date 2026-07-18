# MedSync — Edge Function Pattern

**Status:** established Gate 0.6. Every sensitive write is an Edge Function that
follows this pattern. Reference implementation:
`supabase/functions/update-profile-name/`. Shared logic:
`supabase/functions/_shared/secure-handler.ts`.

## The pipeline (order is mandatory)

1. **Zod validation** — parse the body and validate against a Zod schema before
   any auth or DB work. On failure return `400 { "error": "invalid_request" }`
   with **no** Zod issue details (schema internals must not leak to callers).
2. **Auth check** — extract the bearer token, call `getUser()` (revalidated
   JWT, never `getSession()`). No user → `401`.
3. **Role check** — read the caller's role keys via the `user_role_keys`
   SECURITY DEFINER helper; require the function's role (admins pass). Else
   `403`, logged as a denial with the actor id only.
4. **PII-safe logging** — one structured log line with the action and actor id.
   The validated payload is **never** logged (it may contain PHI). No log
   statement in the pipeline emits request bodies.
5. **Audit write + operation, transactionally together** — the operation
   performs its write (e.g. an `UPDATE` on `public.profiles`); the audit trigger
   (migration 0003) writes the audit row **in the same transaction**. A
   successful operation therefore always has its audit row — the operation
   cannot commit without it. Do not write audit rows by hand in the function;
   rely on the trigger so the two are atomic.

## Why dependency injection

`createSecureHandler` takes its auth provider, logger, and operation as
injected dependencies. The Deno entrypoint wires the real Supabase clients; the
test suite (`secure-handler.test.mjs`) wires fakes. This keeps **all** security
logic in one reviewed place, contains no domain logic (so it is safe to reuse
verbatim), and makes the pipeline verifiable without a live deploy.

## What a new function author writes

Only the wiring: the Zod `schema`, the `requiredRole`, an `action` name, and the
`operation`. Everything in the numbered pipeline above is inherited and must not
be re-implemented per function.

## Verification

`secure-handler.test.mjs` (Node) asserts, against the shared handler:

| Scenario                        | Expected                                   |
| ------------------------------- | ------------------------------------------ |
| malformed JSON / schema failure | `400 invalid_request`, no leak, op skipped |
| missing/invalid token           | `401`, op skipped                          |
| wrong role                      | `403`, op **not** called                   |
| admin                           | passes the role gate                       |
| valid + authed + role           | `200`, op receives the validated input     |
| any path                        | **no log line contains the PHI payload**   |
| operation throws                | `500 operation_failed` (generic)           |

**Residual (needs the live Supabase project):** `supabase functions deploy` and
an end-to-end call proving the audit row is written. The audit-with-operation
atomicity itself is already proven in Gate 0.5 (the trigger fires within the
operation's transaction).
