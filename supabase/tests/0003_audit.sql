-- =============================================================================
-- AUDIT PROBE — audit.audit_log (migration 0003).
-- Proves: the trigger fires on INSERT/UPDATE/DELETE for a sensitive table; the
-- audit row captures actor/action/table/row_id/old+new; and the log is
-- immutable for EVERY role, including service_role (which bypasses RLS).
-- =============================================================================

\set U 'cccccccc-0000-7000-8000-000000000001'

create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'AUDIT FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

insert into auth.users(id,email) values (:'U','u@audit');

-- Act as the user for the three verbs on profiles (a sensitive, audited table).
set role authenticated;
set request.jwt.claims to '{"sub":"cccccccc-0000-7000-8000-000000000001"}';
insert into public.profiles(user_id, full_name, created_by) values (:'U','Audited User',:'U');
update public.profiles set full_name = 'Renamed' where user_id = :'U';
update public.profiles set deleted_at = now() where user_id = :'U';  -- soft delete = UPDATE
reset role; reset request.jwt.claims;

-- === trigger fired for INSERT + 2x UPDATE ====================================
-- (Probes share one DB, so isolate by THIS test's user_id in the payload.)
do $$ begin
  perform pg_temp.expect((select count(*)::int from audit.audit_log where table_name='profiles' and action='INSERT' and new_data->>'user_id'='cccccccc-0000-7000-8000-000000000001'), 1, 'one INSERT audited');
  perform pg_temp.expect((select count(*)::int from audit.audit_log where table_name='profiles' and action='UPDATE' and new_data->>'user_id'='cccccccc-0000-7000-8000-000000000001'), 2, 'two UPDATEs audited');
end $$;

-- === audit row captures actor + old/new state ================================
do $$
declare r record;
begin
  select * into r from audit.audit_log where action='UPDATE' and (new_data->>'full_name')='Renamed' limit 1;
  if r.actor is distinct from 'cccccccc-0000-7000-8000-000000000001'::uuid then raise exception 'AUDIT FAIL: actor not captured (%).', r.actor; end if;
  if r.old_data->>'full_name' <> 'Audited User' then raise exception 'AUDIT FAIL: old_data not captured'; end if;
  if r.row_id is null then raise exception 'AUDIT FAIL: row_id not captured'; end if;
end $$;

-- === DELETE on a sensitive table is audited ==================================
delete from public.profiles where user_id = :'U';  -- superuser hard-delete for the probe
do $$ begin perform pg_temp.expect((select count(*)::int from audit.audit_log where table_name='profiles' and action='DELETE' and old_data->>'user_id'='cccccccc-0000-7000-8000-000000000001'), 1, 'DELETE audited'); end $$;

-- === IMMUTABILITY: no role may UPDATE or DELETE an audit row ==================
-- as the table owner / superuser (postgres): blocked by the hard trigger
do $$
begin
  begin update audit.audit_log set action='TAMPER'; raise exception 'AUDIT FAIL: postgres updated audit row';
  exception when insufficient_privilege then null; end;
  begin delete from audit.audit_log; raise exception 'AUDIT FAIL: postgres deleted audit row';
  exception when insufficient_privilege then null; end;
end $$;

-- as service_role (BYPASSRLS): still blocked by the trigger + revoked privilege
set role service_role;
do $$
begin
  begin update audit.audit_log set action='TAMPER'; raise exception 'AUDIT FAIL: service_role updated audit row';
  exception when insufficient_privilege then null; end;
  begin delete from audit.audit_log; raise exception 'AUDIT FAIL: service_role deleted audit row';
  exception when insufficient_privilege then null; end;
end $$;
reset role;

-- === audit rows still all present after the tamper attempts ==================
do $$ begin perform pg_temp.expect((select count(*)::int from audit.audit_log where table_name='profiles' and coalesce(new_data->>'user_id', old_data->>'user_id')='cccccccc-0000-7000-8000-000000000001'), 4, 'all 4 audit rows intact (1 ins + 2 upd + 1 del)'); end $$;

\echo 'ALL AUDIT PROBES PASSED'
