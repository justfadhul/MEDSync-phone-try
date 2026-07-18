# ADR 0001 — Monorepo (pnpm workspaces + Turborepo)

**Status:** Accepted (Gate 0.1)

## Context

Web (Next.js) and mobile (Expo) must share a single design-token layer and
shared TypeScript types. The prior build duplicated these, causing drift.

## Decision

One monorepo: `apps/web`, `apps/mobile`, `packages/{tokens,types,db}`, plus
`supabase/`. pnpm workspaces for linking, Turborepo for task orchestration.
`node-linker=hoisted` because Expo/Metro cannot resolve pnpm's default isolated
node_modules.

## Consequences

- One source of truth for tokens and types; changes propagate to both apps.
- Turborepo caches lint/typecheck/test per package.
  − Hoisted node_modules is less strict than pnpm's default isolation.
