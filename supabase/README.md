# supabase/

Migrations and Edge Functions for the MedSync Supabase project.

- `migrations/` — every migration ships WITH its RLS policies, audit trigger,
  and tests in the SAME migration (see `docs/SCHEMA-CONVENTIONS.md`, Gate 0.3).
- `functions/` — Edge Functions following the canonical pattern
  (Zod → auth → role → PII-safe log → audit write → operation; Gate 0.6).

A NEW Supabase project is used — never an existing MedSync project.
Project linking happens in Gate 0.3.
