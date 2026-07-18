-- =============================================================================
-- 0004_reference — organisational + professional reference tables.
--   councils        professional regulatory councils (registration authorities)
--   cadres          professional cadres, ANCHORED to a council (not free-text)
--   facilities      health facilities (e.g. Mulago National Referral Hospital)
--   departments     departments within a facility
--   sub_specialties sub-specialties within a department
-- Rows are system-seeded (supabase/seed.sql, Gate 0.7). All read-all for
-- authenticated, admin-write, audited. RLS enabled + forced, all four verbs.
-- =============================================================================

-- --- councils ----------------------------------------------------------------
create table public.councils (
  id          uuid primary key default public.uuid_generate_v7(),
  key         text not null unique,
  name        text not null,
  abbreviation text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);
comment on table public.councils is
  'Professional regulatory councils. A cadre registers with exactly one. '
  'The pharmacy regulator is the Pharmacy Board of Uganda (NOT the PSU).';

-- --- cadres (anchored to a council) ------------------------------------------
create table public.cadres (
  id          uuid primary key default public.uuid_generate_v7(),
  key         text not null unique,
  name        text not null,
  -- Anchoring cadres to a registering council (rather than free-text
  -- self-selection) is a deliberate anti-impersonation control and a
  -- correction from the prior build.
  council_id  uuid not null references public.councils (id),
  requires_registration boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

-- --- facilities --------------------------------------------------------------
create table public.facilities (
  id          uuid primary key default public.uuid_generate_v7(),
  key         text not null unique,
  name        text not null,
  level       text,                    -- e.g. 'national_referral_hospital'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

-- --- departments -------------------------------------------------------------
create table public.departments (
  id          uuid primary key default public.uuid_generate_v7(),
  key         text not null unique,
  name        text not null,
  facility_id uuid not null references public.facilities (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

-- --- sub_specialties ---------------------------------------------------------
create table public.sub_specialties (
  id            uuid primary key default public.uuid_generate_v7(),
  key           text not null unique,
  name          text not null,
  department_id uuid not null references public.departments (id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references auth.users (id)
);

-- =============================================================================
-- RLS + grants + audit for every reference table (read-all authenticated,
-- admin write). Applied uniformly via a DO block to avoid copy-paste drift.
-- =============================================================================
do $$
declare t text;
begin
  foreach t in array array['councils','cadres','facilities','departments','sub_specialties']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force  row level security', t);
    -- SELECT basis: any authenticated user may read reference data (no PII).
    execute format('create policy %I on public.%I for select to authenticated using (true)', t||'_select_all', t);
    -- WRITE basis: admins only.
    execute format('create policy %I on public.%I for insert to authenticated with check (auth.is_admin())', t||'_insert_admin', t);
    execute format('create policy %I on public.%I for update to authenticated using (auth.is_admin()) with check (auth.is_admin())', t||'_update_admin', t);
    execute format('create policy %I on public.%I for delete to authenticated using (auth.is_admin())', t||'_delete_admin', t);
    -- updated_at trigger + audit trigger
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t||'_set_updated_at', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function audit.log_change()', t||'_audit', t);
  end loop;
end $$;
