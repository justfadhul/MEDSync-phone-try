-- =============================================================================
-- 0008_patient_onboarding — Gate O.3. Patient identity (encrypted), consent
-- records (immutable, individually recorded), and hospital link requests
-- (PENDING — a patient is NEVER auto-linked). All owner-scoped by RLS + audited.
--
-- PII rule: NIN / DOB / names / phone are stored as CIPHERTEXT only (AES-256-GCM
-- app-side, packages/db/encryption.ts). The DB never holds plaintext for these.
-- =============================================================================

-- --- encrypted patient identity ----------------------------------------------
create table public.patient_identity (
  id                uuid primary key default public.uuid_generate_v7(),
  user_id           uuid not null unique references auth.users (id) on delete cascade,
  first_name_ct     text not null,       -- _ct = ciphertext
  surname_ct        text not null,
  nin_ct            text not null,
  dob_ct            text not null,
  phone_ct          text not null,
  gender            text not null check (gender in ('female','male','other','undisclosed')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references auth.users (id)
);
comment on table public.patient_identity is
  'Encrypted patient PII (ciphertext columns, _ct). Owner-scoped. Not the app '
  'profile row (public.profiles) — this holds the sensitive identity fields.';

-- --- consent records (one row per consent, immutable) ------------------------
create table public.consent_records (
  id             uuid primary key default public.uuid_generate_v7(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  kind           text not null check (kind in ('platform_terms','data_processing','data_sharing')),
  granted        boolean not null,
  -- [GATE A] real legal wording is pending; the version pins WHICH text was
  -- shown so a re-consent is required when it changes. Placeholder until signed.
  policy_version text not null default 'v0-placeholder-pending-legal',
  occurred_at    timestamptz not null default now(),
  created_by     uuid references auth.users (id)
);
comment on table public.consent_records is
  'Individually-recorded, append-only consent events. No UPDATE/DELETE — a '
  'change of mind is a NEW row, so the consent history is never rewritten.';

-- --- patient -> hospital link requests (pending; not an active link) ---------
create table public.patient_link_requests (
  id              uuid primary key default public.uuid_generate_v7(),
  patient_user_id uuid not null references auth.users (id) on delete cascade,
  facility_id     uuid not null references public.facilities (id),
  mrn_ct          text,                  -- encrypted MRN if the patient knows it
  status          public.application_status not null default 'submitted',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users (id)
);
comment on table public.patient_link_requests is
  'A request to link a patient to a facility, verified by that facility admin. '
  'Created as `submitted` — the patient is NOT auto-linked; a link becomes real '
  'only when an admin moves it to `active` (Gate O.4/admin workspace).';

-- =============================================================================
-- RLS. patient_identity + patient_link_requests: owner reads/writes own, with
-- the lifecycle enforced on link-request status. consent_records: owner reads +
-- inserts own; NO update/delete for anyone (append-only trail).
-- =============================================================================
grant select, insert, update, delete on public.patient_identity to authenticated;
alter table public.patient_identity enable row level security;
alter table public.patient_identity force  row level security;
create policy patient_identity_select_own on public.patient_identity for select to authenticated using (user_id = auth.uid());
create policy patient_identity_insert_own on public.patient_identity for insert to authenticated with check (user_id = auth.uid() and created_by = auth.uid());
create policy patient_identity_update_own on public.patient_identity for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy patient_identity_delete_none on public.patient_identity for delete to authenticated using (false);
create trigger patient_identity_set_updated_at before update on public.patient_identity for each row execute function public.set_updated_at();
create trigger patient_identity_audit after insert or update or delete on public.patient_identity for each row execute function audit.log_change();

grant select, insert on public.consent_records to authenticated;   -- no update/delete grant
alter table public.consent_records enable row level security;
alter table public.consent_records force  row level security;
create policy consent_select_own on public.consent_records for select to authenticated using (user_id = auth.uid());
create policy consent_insert_own on public.consent_records for insert to authenticated with check (user_id = auth.uid());
-- no UPDATE / DELETE policy => append-only for every role.
create trigger consent_records_audit after insert or update or delete on public.consent_records for each row execute function audit.log_change();

grant select, insert, update, delete on public.patient_link_requests to authenticated;
alter table public.patient_link_requests enable row level security;
alter table public.patient_link_requests force  row level security;
create policy plr_select_own on public.patient_link_requests for select to authenticated using (patient_user_id = auth.uid());
create policy plr_insert_own on public.patient_link_requests for insert to authenticated with check (patient_user_id = auth.uid() and status = 'submitted');
create policy plr_update_own on public.patient_link_requests for update to authenticated using (patient_user_id = auth.uid()) with check (patient_user_id = auth.uid());
create policy plr_delete_none on public.patient_link_requests for delete to authenticated using (false);
create trigger plr_transition before update on public.patient_link_requests for each row execute function public.enforce_application_transition();
create trigger plr_set_updated_at before update on public.patient_link_requests for each row execute function public.set_updated_at();
create trigger plr_audit after insert or update or delete on public.patient_link_requests for each row execute function audit.log_change();
