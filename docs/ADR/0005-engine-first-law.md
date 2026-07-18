# ADR 0005 — The engine-first law

**Status:** Accepted (Gate 0.0, restated every gate)

## Context

The prior build shipped role-facing surfaces (doctor/nurse/patient workspaces,
triage) before the engines they consume, backed by stubbed data. The stubs
became compounding debt: many screens with nothing real behind them.

## Decision

No user-facing surface may read/write a data engine that does not yet exist in
the database with real tables, RLS, and passing tests. No stubs, no mock data
layers, no "wire to real API later" placeholders. If a surface needs an engine,
the engine is built first. Build order after Phase 0: Encounter/EMR →
Monitoring/vitals + alerts → Notifications → Care-team → then role surfaces.

## Consequences

- Every shipped surface is backed by real, tested data access.
  − Visible UI progress lags backend progress in early phases (intended).
