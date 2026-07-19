-- =============================================================================
-- 0002_roles — the role model + MFA-enforcement helpers.
--   public.roles       reference catalog of roles/cadres (rows seeded in 0.7)
--   public.user_roles  assignment of roles to users (admin-controlled)
-- Plus SECURITY DEFINER helpers used by RLS and by server code to answer
-- "what roles does the caller have", "is the caller admin", "does the caller's
-- role require MFA", "has the caller reached AAL2 (passed MFA)".
--
-- What is NOT decided here (owned by CSO, [GATE A]): which cadres exist and
-- what each may do. This migration establishes STRUCTURE + enforcement only.
-- Cadre rows and their requires_mfa/is_admin flags are seed data (Gate 0.7),
-- anchored to professional-council registration, not free-text self-selection.
-- =============================================================================

-- --- roles (reference catalog) ----------------------------------------------
create table public.roles (
  id           uuid primary key default public.uuid_generate_v7(),
  key          text not null unique,          -- stable machine key, e.g. 'doctor'
  label        text not null,                 -- human label
  requires_mfa boolean not null default true, -- clinical/admin roles require MFA
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id) -- null for system-seeded rows
);
comment on table public.roles is
  'Reference catalog of roles/cadres. Rows are system-seeded (Gate 0.7). '
  'requires_mfa/is_admin drive MFA enforcement and admin gating.';

create trigger roles_set_updated_at before update on public.roles
  for each row execute function public.set_updated_at();

-- --- user_roles (assignment) -------------------------------------------------
create table public.user_roles (
  id          uuid primary key default public.uuid_generate_v7(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  role_id     uuid not null references public.roles (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id), -- admin who granted (null = system)
  deleted_at  timestamptz,
  unique (user_id, role_id)
);
comment on table public.user_roles is
  'Role assignments. Users can NEVER grant themselves a role (impersonation '
  'risk, a correction from the prior build) — only admins write here.';

create trigger user_roles_set_updated_at before update on public.user_roles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- SECURITY DEFINER helpers. Definer-rights so they can read role tables without
-- being blocked by (or recursing into) the caller's RLS. They read auth.uid()
-- of the CALLER (stable), and are the single source of role truth for policies.
-- =============================================================================
create or replace function public.user_role_keys()
returns setof text language sql stable security definer set search_path = public
as $$
  select r.key
  from public.user_roles ur
  join public.roles r on r.id = ur.role_id
  where ur.user_id = auth.uid() and ur.deleted_at is null;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and ur.deleted_at is null and r.is_admin
  );
$$;

create or replace function public.user_requires_mfa()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and ur.deleted_at is null and r.requires_mfa
  );
$$;

-- AAL2 == the caller completed a second factor this session. Supabase stamps
-- the 'aal' claim in the JWT; auth.jwt() reads it.
create or replace function public.has_aal2()
returns boolean language sql stable
as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2';
$$;

-- Convenience: caller is authorized for a clinical/admin action = has passed
-- MFA if their role requires it. Server code re-checks this too (defence in
-- depth); it is NOT only a UI concern.
create or replace function public.mfa_satisfied()
returns boolean language sql stable security definer set search_path = public
as $$
  select (not public.user_requires_mfa()) or public.has_aal2();
$$;

-- --- Grants ------------------------------------------------------------------
grant select on public.roles to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant execute on function public.user_role_keys(), public.is_admin(),
  public.user_requires_mfa(), public.has_aal2(), public.mfa_satisfied() to authenticated;

-- --- RLS: roles --------------------------------------------------------------
alter table public.roles enable row level security;
alter table public.roles force  row level security;

-- SELECT basis: any authenticated user may read the role catalog (needed to
-- render role names). No PII in this table.
create policy roles_select_all on public.roles for select
  to authenticated using (true);
-- WRITE basis: admins only. Non-admins cannot mint or edit roles.
create policy roles_insert_admin on public.roles for insert
  to authenticated with check (public.is_admin());
create policy roles_update_admin on public.roles for update
  to authenticated using (public.is_admin()) with check (public.is_admin());
create policy roles_delete_admin on public.roles for delete
  to authenticated using (public.is_admin());

-- --- RLS: user_roles ---------------------------------------------------------
alter table public.user_roles enable row level security;
alter table public.user_roles force  row level security;

-- SELECT basis: a user sees their OWN assignments; admins see all.
create policy user_roles_select_own_or_admin on public.user_roles for select
  to authenticated using (user_id = auth.uid() or public.is_admin());
-- INSERT basis: admins ONLY. Crucially a user may NOT insert a row for
-- themselves — self-granting is forbidden even for one's own user_id.
create policy user_roles_insert_admin on public.user_roles for insert
  to authenticated with check (public.is_admin());
-- UPDATE basis: admins only (also the soft-delete path).
create policy user_roles_update_admin on public.user_roles for update
  to authenticated using (public.is_admin()) with check (public.is_admin());
-- DELETE basis: hard delete denied for everyone (assignments are soft-deleted
-- for audit; who held what role is retained).
create policy user_roles_delete_none on public.user_roles for delete
  to authenticated using (false);
