-- =============================================================================
-- 0006_reference_extend — Gate O.1 extensions to the reference spine (0004).
--
--   D4 spine     cadres.is_clinical      drives the clinical/non-clinical branch
--                cadres.has_specialty    whether a specialty selection applies
--                cadres.council_id        made NULLABLE for non-clinical cadres
--                cadre_grades            role/grade options per cadre (dropdowns)
--   D5 taxonomy  facilities.ownership    public / private / pnfp
--                facilities.level         constrained to the D5 facility-level set
--   D1 geography districts -> subcounties (cascading comboboxes, least typing)
--   Versioning   reference_data_versions  auditable dataset versioning
--
-- SAFETY INVARIANT (anti-impersonation, §D.2), enforced in the DATABASE, not
-- just the form: a CLINICAL cadre MUST be anchored to a professional council.
-- New tables ship WITH RLS (four verbs) + updated_at + audit, identical to 0004.
-- Column additions land on tables already carrying the audit trigger (0004), so
-- those changes remain audited.
-- =============================================================================

-- --- D4: clinical flag, specialty applicability, council now optional ---------
alter table public.cadres
  add column is_clinical   boolean not null default false,
  add column has_specialty boolean not null default false;

comment on column public.cadres.is_clinical is
  'Drives the clinical vs non-clinical registration branch (Gate O.4). Must be '
  'present for EVERY cadre row; the branch keys off this flag, never role names.';

-- Non-clinical cadres (reception, records, administration) have no professional
-- council to anchor to, so council_id becomes optional...
alter table public.cadres alter column council_id drop not null;

-- ...but a CLINICAL cadre must still be council-anchored. This makes the
-- anti-impersonation rule a database invariant: no clinical cadre can exist
-- without a registering council.
alter table public.cadres
  add constraint cadres_clinical_requires_council
    check (is_clinical = false or council_id is not null);

-- --- role/grade options per cadre --------------------------------------------
create table public.cadre_grades (
  id         uuid primary key default public.uuid_generate_v7(),
  key        text not null unique,
  name       text not null,
  cadre_id   uuid not null references public.cadres (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);
comment on table public.cadre_grades is
  'Grade/rank options for a cadre (e.g. Senior Medical Officer). Feeds the '
  'role/grade dropdown so staff registration is selection, not free text.';

-- --- D5 facility taxonomy: ownership + constrained level ----------------------
alter table public.facilities
  add column ownership text check (ownership in ('public','private','pnfp'));

-- level was free text in 0004; constrain it to the D5 facility-level set.
alter table public.facilities
  add constraint facilities_level_chk
    check (level is null or level in (
      'national_referral_hospital','regional_referral_hospital',
      'general_hospital','hc_iv','hc_iii','hc_ii'));

-- --- D1 geography: districts -> subcounties (cascading) -----------------------
create table public.districts (
  id         uuid primary key default public.uuid_generate_v7(),
  key        text not null unique,
  name       text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);
create table public.subcounties (
  id          uuid primary key default public.uuid_generate_v7(),
  key         text not null unique,
  name        text not null,
  district_id uuid not null references public.districts (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references auth.users (id)
);

-- --- reference-data versioning ------------------------------------------------
create table public.reference_data_versions (
  id         uuid primary key default public.uuid_generate_v7(),
  dataset    text not null,             -- 'geography' | 'cadres' | 'facilities'
  version    integer not null,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  unique (dataset, version)
);
comment on table public.reference_data_versions is
  'Auditable versioning of reference datasets — a change is recorded, not silent.';

-- =============================================================================
-- RLS + grants + updated_at + audit for the NEW reference tables, applied
-- uniformly (read-all authenticated, admin write) — identical to 0004.
-- =============================================================================
do $$
declare t text;
begin
  foreach t in array array['cadre_grades','districts','subcounties','reference_data_versions']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force  row level security', t);
    execute format('create policy %I on public.%I for select to authenticated using (true)', t||'_select_all', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_admin())', t||'_insert_admin', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t||'_update_admin', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin())', t||'_delete_admin', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t||'_set_updated_at', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function audit.log_change()', t||'_audit', t);
  end loop;
end $$;
