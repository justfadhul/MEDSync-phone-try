# ADR 0007 — Audit immutability via two independent mechanisms

**Status:** Accepted (Gate 0.5)

## Context

`service_role` has BYPASSRLS, so RLS alone cannot make the audit log
append-only against it.

## Decision

`audit.audit_log` immutability is enforced by BOTH (1) revoked UPDATE/DELETE
privileges and (2) a hard `BEFORE UPDATE OR DELETE` trigger that always raises —
triggers fire regardless of RLS bypass. Reads are admin-only via RLS.

## Consequences

- Even a BYPASSRLS role cannot alter/remove audit rows.
  − A true superuser could disable the trigger; that is a separate, higher-trust
  threat outside the application's role model.
