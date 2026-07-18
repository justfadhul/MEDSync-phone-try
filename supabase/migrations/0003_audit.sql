-- =============================================================================
-- 0003_audit — the append-only audit substrate + the audit trigger, attached to
-- every sensitive table (profiles, roles, user_roles). This is the migration
-- referenced by docs/SCHEMA-CONVENTIONS.md as the audit bootstrap: profiles
-- (created in 0001, before the audit table existed) gets its audit trigger HERE.
--
-- IMMUTABILITY (append-only) is enforced by TWO independent mechanisms so that
-- even service_role (which has BYPASSRLS) cannot alter or remove an audit row:
--   1. Privileges: only INSERT is granted; UPDATE/DELETE are revoked from all.
--   2. A BEFORE UPDATE OR DELETE trigger that unconditionally RAISEs — triggers
--      fire regardless of RLS bypass, so BYPASSRLS does not help an attacker.
-- =============================================================================

create schema if not exists audit;

create table audit.audit_log (
  id           uuid primary key default public.uuid_generate_v7(),
  occurred_at  timestamptz not null default now(),
  actor        uuid,                    -- auth.uid() of the actor (null = system)
  action       text not null check (action in ('INSERT','UPDATE','DELETE')),
  table_schema text not null,
  table_name   text not null,
  row_id       uuid,                    -- affected row's id, when it has one
  old_data     jsonb,                   -- prior state (UPDATE/DELETE)
  new_data     jsonb                    -- new state (INSERT/UPDATE)
);
comment on table audit.audit_log is
  'Append-only audit trail. No UPDATE/DELETE is permitted for ANY role, '
  'including service_role — enforced by revoked privileges + a hard trigger.';

create index audit_log_table_row_idx on audit.audit_log (table_schema, table_name, row_id);
create index audit_log_occurred_idx  on audit.audit_log (occurred_at);

-- --- the audit trigger function ---------------------------------------------
-- SECURITY DEFINER so it can always write the log regardless of the caller's
-- privileges on the audit schema. Captures actor, verb, table, row id, and
-- old/new state. PHI note: designated PHI columns are stored encrypted at the
-- application layer (packages/db/encryption.ts), so their values here are
-- already ciphertext — the audit trail never holds plaintext PHI.
create or replace function audit.log_change()
returns trigger
language plpgsql
security definer
set search_path = audit, public
as $$
declare
  v_old jsonb := case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) else null end;
  v_new jsonb := case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) else null end;
  v_row uuid  := coalesce((v_new ->> 'id')::uuid, (v_old ->> 'id')::uuid);
begin
  insert into audit.audit_log (actor, action, table_schema, table_name, row_id, old_data, new_data)
  values (auth.uid(), tg_op, tg_table_schema, tg_table_name, v_row, v_old, v_new);
  return coalesce(new, old);
end
$$;

-- --- the immutability guard --------------------------------------------------
create or replace function audit.prevent_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit.audit_log is append-only: % is not permitted', tg_op
    using errcode = 'insufficient_privilege';
end
$$;

create trigger audit_log_no_mutation
  before update or delete on audit.audit_log
  for each row execute function audit.prevent_mutation();

-- --- privileges: INSERT only; UPDATE/DELETE revoked from everyone -------------
revoke all on audit.audit_log from public;
grant usage on schema audit to authenticated, service_role;
-- Reads are admin-only (below via RLS). Writes happen only through the DEFINER
-- trigger, so no direct INSERT grant to end users is required.
grant select on audit.audit_log to authenticated;

alter table audit.audit_log enable row level security;
alter table audit.audit_log force  row level security;

-- SELECT basis: admins only may read the audit trail.
create policy audit_select_admin on audit.audit_log for select
  to authenticated using (auth.is_admin());
-- No INSERT policy for end users (writes are via SECURITY DEFINER trigger).
-- No UPDATE policy. No DELETE policy. For ANY role. (Belt: the trigger above
-- blocks UPDATE/DELETE even for BYPASSRLS roles.)

-- --- attach the audit trigger to every sensitive table -----------------------
create trigger profiles_audit
  after insert or update or delete on public.profiles
  for each row execute function audit.log_change();

create trigger roles_audit
  after insert or update or delete on public.roles
  for each row execute function audit.log_change();

create trigger user_roles_audit
  after insert or update or delete on public.user_roles
  for each row execute function audit.log_change();
