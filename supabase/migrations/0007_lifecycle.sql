-- =============================================================================
-- 0007_lifecycle — Gate O.2: the shared application lifecycle state machine and
-- encrypted draft-save, used by every registration path (O.3-O.5).
--
--   application_status              the explicit states an applicant/affiliation
--                                   moves through
--   valid_application_transition()  the allowed edges of the state machine
--   enforce_application_transition() reusable trigger: rejects illegal edges on
--                                   any table with a `status` column
--   onboarding_drafts               partial drafts so a long form survives a
--                                   dropped connection; payload stays ENCRYPTED
--                                   (AES-256-GCM app-side) and is owner-scoped
-- =============================================================================

create type public.application_status as enum (
  'draft','submitted','in_review','requires_info','active',
  'rejected','suspended','deactivated'
);

-- --- the state machine (allowed edges) ---------------------------------------
create or replace function public.valid_application_transition(
  old_s public.application_status, new_s public.application_status)
returns boolean language sql immutable as $$
  select case
    when old_s = new_s then true               -- non-status edits are fine
    when old_s = 'draft'         and new_s in ('submitted','deactivated')          then true
    when old_s = 'submitted'     and new_s in ('in_review','requires_info','rejected') then true
    when old_s = 'in_review'     and new_s in ('requires_info','active','rejected') then true
    when old_s = 'requires_info' and new_s in ('submitted','in_review','rejected') then true
    when old_s = 'active'        and new_s in ('suspended','deactivated')          then true
    when old_s = 'suspended'     and new_s in ('active','deactivated')             then true
    else false
  end;
$$;
comment on function public.valid_application_transition is
  'Allowed edges of the onboarding lifecycle. requires_info round-trips back to '
  'submitted/in_review. Terminal-ish: rejected/deactivated have no outward edge.';

-- --- reusable enforcement trigger (attached to each application table later) --
create or replace function public.enforce_application_transition()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status
     and not public.valid_application_transition(old.status, new.status) then
    raise exception 'invalid application transition: % -> %', old.status, new.status
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

-- --- encrypted, owner-scoped draft-save --------------------------------------
create table public.onboarding_drafts (
  id         uuid primary key default public.uuid_generate_v7(),
  owner_id   uuid not null references auth.users (id),
  intent     text not null check (intent in ('patient','staff','hospital')),
  -- ciphertext only (AES-256-GCM, packages/db/encryption.ts) — a partial draft
  -- may contain PII, which is never persisted in plaintext.
  payload    text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);
comment on table public.onboarding_drafts is
  'Partial registration drafts (encrypted). Owner-scoped by RLS; lets a long '
  'form survive a dropped connection on a Ugandan mobile network.';

grant select, insert, update, delete on public.onboarding_drafts to authenticated;
alter table public.onboarding_drafts enable row level security;
alter table public.onboarding_drafts force  row level security;

-- A user reads/writes ONLY their own drafts.
create policy drafts_select_own on public.onboarding_drafts for select to authenticated using (owner_id = auth.uid());
create policy drafts_insert_own on public.onboarding_drafts for insert to authenticated with check (owner_id = auth.uid());
create policy drafts_update_own on public.onboarding_drafts for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy drafts_delete_own on public.onboarding_drafts for delete to authenticated using (owner_id = auth.uid());

create trigger onboarding_drafts_set_updated_at before update on public.onboarding_drafts
  for each row execute function public.set_updated_at();
create trigger onboarding_drafts_audit after insert or update or delete on public.onboarding_drafts
  for each row execute function audit.log_change();
