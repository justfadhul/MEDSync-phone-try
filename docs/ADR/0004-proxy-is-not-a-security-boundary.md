# ADR 0004 — The proxy is not a security boundary

**Status:** Accepted (Gate 0.4)

## Context

Next.js 16 renamed middleware to `proxy.ts` and has had proxy/middleware
auth-bypass advisories. Authorization that trusts only the proxy is unsafe.

## Decision

`proxy.ts` only refreshes the Supabase cookie and performs convenience
redirects. EVERY protected route and EVERY Server Action independently
re-verifies identity server-side via `lib/auth/guards` using `getUser()` (which
revalidates the JWT). `getSession()` is banned by an ESLint rule. RLS in the
database is the final backstop.

## Consequences

- Defence in depth: proxy → server guard → RLS. A proxy bypass still hits the
  server guard and RLS.
  − Every protected handler must call a guard explicitly; forgetting is a review
  failure (and RLS still protects the data).
