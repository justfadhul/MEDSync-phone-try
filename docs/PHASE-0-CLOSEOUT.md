# MedSync v2 — Phase 0 Closeout

**Phase 0 = platform foundation. It contains NO clinical functionality.**
This document records what exists, why it was built the way it was, the
verification evidence, and — critically — **what does NOT exist yet and must
not be assumed by any later prompt.**

---

## 1. What exists

| Gate | Delivered                                                                                                                                                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1  | pnpm + Turborepo monorepo; `apps/web` (Next.js 16.2, TS strict), `apps/mobile` (Expo SDK 54, TS strict); `packages/{tokens,types,db}`; shared ESLint/Prettier; `.env.example` (names only).               |
| 0.2  | `@medsync/tokens` single source of truth: primitive + semantic layers, light+dark maps (dark disabled), Tailwind preset shared by both apps, raw-hex lint rule, swappable font layer.                     |
| 0.3  | `docs/SCHEMA-CONVENTIONS.md`; migrations `0000` (uuid v7, updated_at) + `0001` (`profiles` reference table); Drizzle schema → `@medsync/types`; local Postgres verification harness with a Supabase shim. |
| 0.4  | Auth: `@supabase/ssr`, `getUser()` only, `proxy.ts`, server-side guards, role model (`roles`/`user_roles`, migration `0002`), MFA helpers, mobile SecureStore client.                                     |
| 0.5  | Append-only `audit.audit_log` + trigger (migration `0003`); AES-256-GCM PHI encryption (`packages/db/encryption.ts`).                                                                                     |
| 0.6  | Canonical secure Edge Function pattern (`supabase/functions/_shared/secure-handler.ts`) + reference function; `docs/EDGE-FUNCTION-PATTERN.md`.                                                            |
| 0.7  | Reference schema (migration `0004`) + idempotent, production-guarded seed (Mulago NRH, Internal Medicine + sub-specialties, cadres, councils, roles).                                                     |
| 0.8  | This closeout, ADRs (`docs/ADR/`), CI (`.github/workflows/ci.yml`).                                                                                                                                       |

## 2. Architectural decisions (ADRs)

`docs/ADR/`: 0001 monorepo · 0002 dark-mode deferral · 0003 app-level encryption
over pgcrypto · 0004 proxy-is-not-a-security-boundary · 0005 engine-first law ·
0006 UUID v7 keys · 0007 audit immutability via two mechanisms.

## 3. Conventions established

- `docs/SCHEMA-CONVENTIONS.md` — mandatory columns, RLS+audit+tests in the same
  migration, soft-delete/no-hard-delete for clinical records, UUID v7, naming,
  no out-of-band schema changes.
- Tokens: components use semantic tokens only; red = clinical emergency only.
- Auth: `getUser()` not `getSession()`; every protected route/action
  re-verifies server-side; MFA enforced server-side and data-driven.
- Edge Functions: Zod → auth → role → PII-safe log → audit + operation.

## 4. Verification evidence (all green)

- **RLS probes** (real Postgres): cross-owner denial on every verb for
  `profiles`; no self-granting + admin-only writes for `user_roles`; anon
  denied; MFA data-driven; audit log immutable even to `service_role`.
- **Migrations**: apply → rollback → re-apply clean across all five.
- **Encryption**: 9/9 (round trip, IV uniqueness ×1000, tamper→throw, rotation).
- **Edge handler**: 9/9 (no schema leak, wrong-role skips op, PHI never logged).
- **Seed**: idempotent (identical content hash ×2), production guard blocks,
  Pharmacy Board of Uganda (not PSU), cadres anchored to councils.
- **Toolchain**: `turbo typecheck` 5/5, `lint` 2/2, `test` 3/3; web builds;
  service-role key absent from client bundle; raw-hex + getSession lint rules
  proven to fire.
- **CI** runs lint, typecheck, unit tests, Edge tests, AND the RLS probes +
  seed idempotency against a Postgres service on every push.

## 5. WHAT DOES NOT EXIST YET — do not assume it

**No clinical functionality exists.** None of the following has been built; no
later prompt may assume any of it is present:

- **Encounter / EMR engine** — no encounters, notes, problems, orders, results.
- **Monitoring / vitals engine + alerts** — no vitals, thresholds, or alerting.
- **Notifications engine** — no channels, delivery, or preferences.
- **Care-team workspace** — no care teams or assignment engine.
- **Role workspaces / surfaces** — no doctor, nurse, pharmacist, clinical
  officer, records, or patient screens; no triage; no scheduling.
- **Patient-facing clinical screens** of any kind.

Build order (engine-first law, ADR 0005):
**Encounter/EMR → Monitoring/vitals + alerts → Notifications → Care-team → then
role surfaces.**

Also not yet present at the platform level: patient/clinical data tables beyond
`profiles`; `supabase gen types` output (the `Database` type in `@medsync/types`
is hand-written to match migrations and is replaced on project link); any
deployed Edge Function; any real authentication UI (sign-in/MFA pages are
routing targets only).

## 6. Residual manual steps (require the owner)

1. **Create the NEW Supabase project**, set env vars, `supabase link`, apply
   migrations, run the seed, and `supabase gen types typescript` → replace the
   hand-written `Database` type. (Not an existing MedSync project.)
2. **Enable branch protection on `main`** (require the CI checks above,
   require PR review). Needs repo admin — not settable from code.
3. **Deploy the reference Edge Function** and run the authed/unauthed/wrong-role
   end-to-end checks against the live project.
4. Generate real **PHI encryption keys** into env (never the repo).

## 7. Open CSO decisions — `[GATE A]` (Fadhul owns these)

These require clinical/legal judgement and were deliberately NOT assumed:

- **Retention periods** for clinical records (Uganda record-retention + DPA).
- **Cadre → permission** mappings and the exact **per-role MFA policy** (seed
  ships sensible defaults: all clinical + records + admin require MFA).
- **Access basis** for care-team/clinical reads (only owner-basis exists today).
- Clinical **thresholds** (vitals/alerting) — belong to the monitoring engine.

## 8. Known open issues (recorded, not resolved)

- **Neue Haas Grotesk** app-bundling licence unresolved; the font family is
  swappable from `packages/tokens/src/fonts.cjs` (falls back to Helvetica/Arial).
- **Legal documents** (DPA, consent text, ToS, privacy policy) do not exist —
  placeholders/blockers, owner to supply.
