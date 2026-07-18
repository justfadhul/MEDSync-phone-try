# ADR 0006 — UUID v7 primary keys

**Status:** Accepted (Gate 0.3)

## Context

High-insert clinical tables need index locality; identifiers must not be
enumerable. UUID v4 fragments B-tree indexes; bigserial is enumerable.

## Decision

All primary keys are UUID v7 (`public.uuid_generate_v7()`), generated
server-side. Clients never supply `id`.

## Consequences

- Time-ordered inserts (index locality) with non-enumerable keys.
  − Custom generation function until Postgres ships native uuidv7 (PG18).
