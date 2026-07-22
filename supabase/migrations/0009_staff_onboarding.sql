-- =============================================================================
-- 0009_staff_onboarding — Gate O.4 (engine). One staff registration that
-- BRANCHES on the cadre's is_clinical flag (0006), not on hardcoded role names.
--
--   staff_applications            the applicant + lifecycle status
--   staff_professional_identity   the CLINICAL anchor: council + registration
--                                 number (encrypted) + licence document
--   staff_affiliations            one or more (locums span facilities): facility
--                                 / department / cadre / grade / employment type
--
-- SAFETY INVARIANT (§D.2, tested): a CLINICAL affiliation cannot exist unless
-- the application carries a professional identity (council + registration +
-- licence). Non-clinical affiliations need no council and grant no clinical
-- scope. Enforced by a trigger keyed off cadres.is_clinical — the branch is the
-- flag, never a role name. All owner-scoped RLS + lifecycle + audit.
-- =============================================================================

create table public.staff_applications (
  id           uuid primary key default public.uuid_generate_v7(),
  user_id      uuid not null unique references auth.users (id) on delete cascade,
  is_returning boolean not null default false,
  status       public.application_status not null default 'draft',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  created_by   uuid references auth.users (id)
);

create table public.staff_professional_identity (
  id                  uuid primary key default public.uuid_generate_v7(),
  application_id      uuid not null unique references public.staff_applications (id) on delete cascade,
  council_id          uuid not null references public.councils (id),
  registration_no_ct  text not null,          -- encrypted registration/licence number
  licence_doc_path    text not null,          -- private, encrypted storage path
  registration_expiry date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references auth.users (id)
);

create table public.staff_affiliations (
  id              uuid primary key default public.uuid_generate_v7(),
  application_id  uuid not null references public.staff_applications (id) on delete cascade,
  facility_id     uuid not null references public.facilities (id),
  department_id   uuid not null references public.departments (id),
  cadre_id        uuid not null references public.cadres (id),
  grade_id        uuid references public.cadre_grades (id),
  employment_type text not null check (employment_type in ('full_time','visiting','locum')),
  status          public.application_status not null default 'submitted',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users (id)
);

-- --- the clinical-anchor invariant -------------------------------------------
create or replace function public.enforce_clinical_anchor()
returns trigger language plpgsql as $$
declare v_clinical boolean;
begin
  select is_clinical into v_clinical from public.cadres where id = new.cadre_id;
  if v_clinical and not exists (
    select 1 from public.staff_professional_identity where application_id = new.application_id
  ) then
    raise exception 'clinical affiliation requires a professional identity (council + registration + licence)'
      using errcode = 'check_violation';
  end if;
  return new;
end $$;

-- =============================================================================
-- RLS — owner-scoped via the parent application (user_id = auth.uid()).
-- =============================================================================
grant select, insert, update, delete on public.staff_applications to authenticated;
alter table public.staff_applications enable row level security;
alter table public.staff_applications force  row level security;
create policy sa_select_own on public.staff_applications for select to authenticated using (user_id = auth.uid());
create policy sa_insert_own on public.staff_applications for insert to authenticated with check (user_id = auth.uid() and created_by = auth.uid());
create policy sa_update_own on public.staff_applications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy sa_delete_none on public.staff_applications for delete to authenticated using (false);
create trigger sa_transition before update on public.staff_applications for each row execute function public.enforce_application_transition();
create trigger sa_set_updated_at before update on public.staff_applications for each row execute function public.set_updated_at();
create trigger sa_audit after insert or update or delete on public.staff_applications for each row execute function audit.log_change();

do $$
declare t text;
begin
  foreach t in array array['staff_professional_identity','staff_affiliations']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force  row level security', t);
    -- ownership: the row's application belongs to the caller.
    execute format($p$create policy %I on public.%I for select to authenticated using (exists (select 1 from public.staff_applications a where a.id = application_id and a.user_id = auth.uid()))$p$, t||'_select_own', t);
    execute format($p$create policy %I on public.%I for insert to authenticated with check (exists (select 1 from public.staff_applications a where a.id = application_id and a.user_id = auth.uid()))$p$, t||'_insert_own', t);
    execute format($p$create policy %I on public.%I for update to authenticated using (exists (select 1 from public.staff_applications a where a.id = application_id and a.user_id = auth.uid())) with check (exists (select 1 from public.staff_applications a where a.id = application_id and a.user_id = auth.uid()))$p$, t||'_update_own', t);
    execute format('create policy %I on public.%I for delete to authenticated using (false)', t||'_delete_none', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t||'_set_updated_at', t);
    execute format('create trigger %I after insert or update or delete on public.%I for each row execute function audit.log_change()', t||'_audit', t);
  end loop;
end $$;

-- the clinical anchor + lifecycle on affiliations (added after the table + RLS).
create trigger staff_affiliations_clinical_anchor before insert or update on public.staff_affiliations
  for each row execute function public.enforce_clinical_anchor();
create trigger staff_affiliations_transition before update on public.staff_affiliations
  for each row execute function public.enforce_application_transition();
