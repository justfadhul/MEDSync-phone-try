-- =============================================================================
-- 0010_hospital_onboarding — Gate O.5. Two tracks for bringing a facility on:
--
--   hospital_leads         EXPRESS INTEREST — no account. A public form anyone
--                          can submit (facility + a contact). Write-only from
--                          the outside (INSERT only, never SELECT to the public)
--                          so the pipeline cannot be enumerated. No PHI.
--   hospital_applications  THE REAL APPLICATION — requires an account. Created
--                          PENDING (`submitted`) and routed to a SUPERADMIN (the
--                          platform owner) who approves it. The applicant can
--                          never self-approve or self-route.
--
-- Superadmin is the platform-level approver (distinct from a hospital's own
-- admin). Introduced here as roles.is_superadmin + public.is_superadmin(),
-- mirroring is_admin exactly.
-- =============================================================================

-- --- superadmin: the platform-level approver ---------------------------------
alter table public.roles
  add column is_superadmin boolean not null default false;
comment on column public.roles.is_superadmin is
  'Platform owner / approver. Approves hospital applications (Gate O.5). '
  'Strictly narrower than is_admin — a hospital admin is not a superadmin.';

create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid() and ur.deleted_at is null and r.is_superadmin
  );
$$;
grant execute on function public.is_superadmin() to authenticated;

-- =============================================================================
-- hospital_leads — public express-interest capture (no account).
-- =============================================================================
create table public.hospital_leads (
  id            uuid primary key default public.uuid_generate_v7(),
  facility_name text not null,
  contact_name  text not null,
  contact_email text not null,
  contact_phone text,
  district      text,
  role_of_contact text,               -- e.g. 'Medical Director', 'IT Lead'
  note          text,
  status        text not null default 'new' check (status in ('new','contacted','converted','declined')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.hospital_leads is
  'Public express-interest leads. INSERT-only for the outside world (no SELECT '
  'to anon), so the pipeline is write-only and cannot be enumerated. Not PHI. '
  'Triaged by a superadmin.';

alter table public.hospital_leads
  add constraint hospital_leads_email_shape
    check (contact_email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.hospital_leads enable row level security;
alter table public.hospital_leads force  row level security;
-- INSERT: anyone (anon or signed-in) may express interest. No USING clause.
create policy hospital_leads_insert_public on public.hospital_leads
  for insert to anon, authenticated
  with check (char_length(facility_name) > 1 and char_length(contact_name) > 1 and status = 'new');
-- SELECT / UPDATE: superadmin only. No anon SELECT => opaque from outside.
create policy hospital_leads_select_super on public.hospital_leads
  for select to authenticated using (public.is_superadmin());
create policy hospital_leads_update_super on public.hospital_leads
  for update to authenticated using (public.is_superadmin()) with check (public.is_superadmin());
create policy hospital_leads_delete_none on public.hospital_leads
  for delete to authenticated using (false);

grant insert on public.hospital_leads to anon, authenticated;
grant select, update on public.hospital_leads to authenticated;
create trigger hospital_leads_set_updated_at before update on public.hospital_leads for each row execute function public.set_updated_at();
create trigger hospital_leads_audit after insert or update or delete on public.hospital_leads for each row execute function audit.log_change();

-- =============================================================================
-- hospital_applications — the real application (account, pending approval).
-- =============================================================================
create table public.hospital_applications (
  id                 uuid primary key default public.uuid_generate_v7(),
  submitted_by       uuid not null references auth.users (id) on delete cascade,
  facility_name      text not null,
  official_email     text not null,
  official_phone     text,
  district_id        uuid references public.districts (id),
  subcounty_id       uuid references public.subcounties (id),
  level              text check (level is null or level in (
                       'national_referral_hospital','regional_referral_hospital',
                       'general_hospital','hc_iv','hc_iii','hc_ii')),
  ownership          text check (ownership is null or ownership in ('public','private','pnfp')),
  registration_no_ct text,              -- encrypted facility registration/licence no.
  licence_doc_path   text,              -- private, encrypted storage path
  status             public.application_status not null default 'submitted',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  created_by         uuid references auth.users (id)
);
comment on table public.hospital_applications is
  'Facility onboarding application. Created `submitted` (pending approval) and '
  'routed to a superadmin. The applicant can edit/withdraw their own but can '
  'NEVER move it into review or approve it — those transitions are superadmin '
  'only, enforced by the update WITH CHECK plus the lifecycle trigger.';

alter table public.hospital_applications enable row level security;
alter table public.hospital_applications force  row level security;

-- SELECT: the applicant sees their own; a superadmin sees all (routing queue).
create policy ha_select_own_or_super on public.hospital_applications
  for select to authenticated
  using (submitted_by = auth.uid() or public.is_superadmin());

-- INSERT: applicant creates their own, pending. Cannot start it anywhere but
-- `submitted` (or `draft` while still editing).
create policy ha_insert_own on public.hospital_applications
  for insert to authenticated
  with check (submitted_by = auth.uid() and created_by = auth.uid() and status in ('draft','submitted'));

-- UPDATE (applicant): may edit/withdraw their own, but the resulting status is
-- confined to the applicant-owned set — they cannot route (in_review) or
-- approve (active) themselves.
create policy ha_update_own on public.hospital_applications
  for update to authenticated
  using (submitted_by = auth.uid())
  with check (submitted_by = auth.uid() and status in ('draft','submitted','requires_info','deactivated'));

-- UPDATE (superadmin): the approver moves it through review to active/rejected.
create policy ha_update_super on public.hospital_applications
  for update to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

create policy ha_delete_none on public.hospital_applications
  for delete to authenticated using (false);

grant select, insert, update on public.hospital_applications to authenticated;
create trigger ha_transition before update on public.hospital_applications for each row execute function public.enforce_application_transition();
create trigger ha_set_updated_at before update on public.hospital_applications for each row execute function public.set_updated_at();
create trigger ha_audit after insert or update or delete on public.hospital_applications for each row execute function audit.log_change();
