# MedSync — Schema Conventions

**Status:** established Gate 0.3. Binding on every migration thereafter.
**Audience:** anyone writing a migration or a table.

These conventions are enforced, not aspirational. A migration that violates them
does not ship. `profiles` (migration `0001`) is the reference implementation and
must satisfy every rule here.

---

## 1. The migration discipline (the load-bearing rule)

> **Every migration ships its RLS policies, its audit trigger, and its tests in
> the same migration — never as a follow-up.** A table created in one migration
> and secured in the next has a window in which it is unprotected, and a "we'll
> add policies later" TODO is exactly how the previous build accumulated holes.

Concretely, a migration that creates a table `t` MUST, in the same change:

1. Create `t` with the full mandatory-column set (§3).
2. `ALTER TABLE t ENABLE ROW LEVEL SECURITY;` **and** `FORCE ROW LEVEL SECURITY`.
3. Define a policy for **each** of `select`, `insert`, `update`, `delete`
   (§4). A missing verb is a silent hole and fails review.
4. Attach the `updated_at` touch trigger and the audit trigger (§6).
5. Be accompanied by a probe test (`supabase/tests/<nnnn>_*.sql`) that
   authenticates as one user and **asserts denial** when reaching another
   user's rows, for every policy.

**Bootstrap exception (the only one):** the audit substrate itself
(`audit.audit_log`, the trigger function) is created in migration `0003`
(Gate 0.5), because a table cannot have an audit trigger before the audit table
exists. Tables created before `0003` (only `profiles`) have their audit trigger
attached in `0003`, and this is the single documented deferral. From `0003`
onward the audit trigger ships in the table's own creation migration.

## 2. No out-of-band schema changes

The database is changed **only** through versioned migrations in
`supabase/migrations/`, reviewed in git. Creating or altering tables via the
Supabase dashboard SQL editor, `psql` against production, or any ad-hoc path is
prohibited: such changes are unreviewed, untested, carry no RLS guarantee, and
drift the Drizzle schema out of sync. CI diffs the Drizzle schema against the
migrations; an out-of-band change is caught as drift. Production database
credentials are not used interactively.

## 3. Mandatory columns

Every table carries:

| Column       | Type          | Rule                                                     |
| ------------ | ------------- | -------------------------------------------------------- |
| `id`         | `uuid`        | PK, default `uuid_generate_v7()` (§5). Never client-set. |
| `created_at` | `timestamptz` | `not null default now()`. Never updated.                 |
| `updated_at` | `timestamptz` | `not null default now()`. Maintained by trigger (§6).    |
| `created_by` | `uuid`        | FK → `auth.users(id)`. The actor who created the row.    |

Clinical and user-data tables additionally carry `deleted_at timestamptz`
(nullable) for soft delete (§7).

## 4. Row Level Security

- RLS is `ENABLE`d **and** `FORCE`d on every table (FORCE so the table owner is
  not exempt).
- Exactly one policy per verb minimum: `select`, `insert`, `update`, `delete`.
- Every policy names its **access basis** in a comment: the explicit reason a
  row is visible/writable (e.g. "owner: `id = auth.uid()`"; "same care team").
- `auth.uid()` is null for the `anon` role; every policy must evaluate to false
  under null (never accidentally true). No policy may be satisfiable by `anon`
  unless the table is deliberately public (none are in Phase 0).
- Authorization uses `auth.uid()` (revalidated JWT). Application code uses
  `getUser()`, never `getSession()`.

## 5. Primary keys — UUID v7

Primary keys are **UUID v7** (time-ordered: index locality of a sequence,
non-enumerability of a UUID). Generated server-side by `uuid_generate_v7()`
(created in migration `0000`). Clients never supply `id`. Rationale: v4 keys
fragment B-tree indexes on high-insert clinical tables; v7's time prefix keeps
inserts local while remaining unguessable.

## 6. Timestamps & triggers

- `updated_at` is maintained by a shared `set_updated_at()` trigger
  (`before update`), created in migration `0000`. Application code never sets
  `updated_at` directly.
- `created_at` / `created_by` are immutable after insert.
- The audit trigger (§ audit, Gate 0.5) fires `after insert/update/delete`.

## 7. Soft delete & retention

- **Clinical records may never be hard-deleted.** They are soft-deleted by
  setting `deleted_at`; the row remains for the legally-mandated retention
  period. `DELETE` policies on clinical tables deny all callers (including
  service_role at the policy layer); removal, when ever lawful, is a controlled
  administrative migration, not an application action.
- Tables that MAY be hard-deleted are only transient/non-clinical ones (e.g.
  ephemeral session or cache tables), and each must say so explicitly in its
  migration.
- **Retention periods are a clinical/legal decision owned by the CSO
  (`[GATE A]`), not chosen here.** Uganda's patient-record retention obligation
  and any Data Protection Act requirements set the floor; until the CSO fixes
  the value, migrations reference the policy, not a hardcoded number, and the
  open value is recorded as a blocker.

## 8. Naming

- `snake_case` for schemas, tables, columns, constraints, indexes.
- Table names are **plural** (`profiles`, `encounters`).
- Constraints: `t_column_fkey`, `t_column_key`, `t_column_check`.
- Policies: verb-and-basis, e.g. `profiles_select_own`, `profiles_update_own`.
- Enums live in the `public` schema, singular (`user_role`).

## 9. Types generation

Drizzle schema (`packages/db/src/schema/`) mirrors the migrations and is the
source of the TypeScript types re-exported from `@medsync/types`. Type
generation is deterministic and checked in CI; the schema and the applied
migrations must agree (drift check).
