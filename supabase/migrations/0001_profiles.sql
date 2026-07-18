-- =============================================================================
-- 0001_profiles — reference implementation the schema conventions are proven
-- against (docs/SCHEMA-CONVENTIONS.md). Identity/profile row per auth user.
--
-- Ships in THIS migration: table + mandatory columns + RLS (enabled AND forced)
-- + a policy for EACH verb + updated_at trigger. Its audit trigger is attached
-- in 0005 (the documented bootstrap exception — the audit table does not yet
-- exist). RLS probe tests: supabase/tests/0001_profiles_rls.sql.
-- =============================================================================

create table public.profiles (
  id          uuid primary key default public.uuid_generate_v7(),
  user_id     uuid not null unique references auth.users (id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid not null references auth.users (id),
  deleted_at  timestamptz            -- soft delete; profiles are PII, never hard-deleted
);

comment on table public.profiles is
  'One profile per auth user. Reference table for schema conventions. PII.';

-- updated_at maintenance (created_at/created_by frozen by the trigger fn).
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- --- Grants ------------------------------------------------------------------
-- Table-level DML is granted to `authenticated`; RLS (below) is what actually
-- restricts which ROWS each caller may touch. `anon` gets nothing (no policy
-- would admit it anyway, but we do not even grant the privilege). This mirrors
-- Supabase's model: GRANT gates the verb, RLS gates the row.
grant select, insert, update, delete on public.profiles to authenticated;

-- --- Row Level Security ------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.profiles force  row level security;

-- Access basis for every policy below: OWNER — the profile belongs to the
-- calling user (user_id = auth.uid()). auth.uid() is NULL for anon, so every
-- clause is false for anon (no anon access). Broader read bases (admin,
-- care-team) require the role model and are added in later gates, not assumed.

-- SELECT: a user may read only their OWN profile. Access basis = ownership.
-- NOTE (deliberate): the soft-delete filter (deleted_at is null) is NOT in this
-- policy. A SELECT policy that hides soft-deleted rows also makes the
-- soft-delete UPDATE fail — Postgres applies the SELECT USING clause as a check
-- against the updated row, so `set deleted_at = now()` would violate its own
-- SELECT policy. RLS governs ACCESS (ownership); hiding soft-deleted rows from
-- listings is presentation, done via the profiles_active view below. The owner
-- retaining read access to their own soft-deleted row is correct (retention).
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());

-- INSERT: a user may create only their own profile, and must stamp themselves
-- as creator. WITH CHECK guards the incoming row.
create policy profiles_insert_own
  on public.profiles for insert
  to authenticated
  with check (user_id = auth.uid() and created_by = auth.uid());

-- UPDATE: a user may update only their own profile (this is also the path for
-- soft delete: setting deleted_at). Cannot reassign the row to another user.
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- DELETE: hard delete is denied for everyone (profiles are PII, soft-delete
-- only). USING (false) means no row is ever deletable via the API.
create policy profiles_delete_none
  on public.profiles for delete
  to authenticated
  using (false);

-- --- Active-rows view --------------------------------------------------------
-- Presentation layer for soft delete: normal reads/listings go through this
-- view, which hides soft-deleted rows. security_invoker=true so the base
-- table's RLS (ownership) still applies to the caller — the view does not
-- widen access, it only narrows the row set to the non-deleted ones.
create view public.profiles_active
  with (security_invoker = true)
  as select * from public.profiles where deleted_at is null;

grant select on public.profiles_active to authenticated;
