# MedSync

A digital hospital operating system for the Ugandan healthcare context.

> **THE ENGINE-FIRST LAW.** No user-facing surface may be built that reads
> from or writes to a data engine that does not yet exist in the database with
> real tables, real RLS policies, and passing tests. No stubs, no mock data
> layers, no placeholder surfaces.

This repository is a **pnpm + Turborepo monorepo**.

```
medsync/
  apps/
    web/          # Next.js 16.2.x (App Router, Turbopack, TS strict)
    mobile/       # Expo SDK 54 (Expo Router, TS strict, NativeWind v4)
  packages/
    tokens/       # design tokens — SINGLE SOURCE OF TRUTH (web + mobile)
    types/        # shared TS types + generated Supabase types
    db/           # Drizzle schema + migrations + PHI encryption
  supabase/
    migrations/
    functions/
```

## Prerequisites

- Node >= 20, pnpm 10.x

## Getting started

```bash
pnpm install
pnpm dev         # all apps via Turborepo
pnpm typecheck   # tsc --noEmit across the workspace
pnpm lint
```

Copy `.env.example` to your local env file and fill values — never commit real
secrets. Only `.env.example` (names only) is tracked.

## Phase 0

This is the platform foundation. It builds **no clinical functionality** — no
EMR/encounter engine, no vitals/monitoring engine, no notifications engine, no
role workspaces. See `docs/` (added across Gates 0.3–0.8) for conventions,
ADRs, and the Phase 0 closeout.
