-- =============================================================================
-- RLS PROBE — roles + user_roles (migration 0002), and the MFA helpers.
-- Asserts: no self-granting, admin-only writes, own-visibility of assignments,
-- and that MFA enforcement is data-driven (requires_mfa + aal2).
-- =============================================================================

-- role ids
\set RADMIN 'aaaaaaaa-0000-7000-8000-000000000001'
\set RDOC   'aaaaaaaa-0000-7000-8000-000000000002'
\set RCLERK 'aaaaaaaa-0000-7000-8000-000000000003'
-- user ids
\set ADMIN 'bbbbbbbb-0000-7000-8000-0000000000a1'
\set DOC   'bbbbbbbb-0000-7000-8000-0000000000d0'
\set CLERK 'bbbbbbbb-0000-7000-8000-0000000000c1'

create or replace function pg_temp.expect_bool(actual boolean, wanted boolean, msg text)
returns void language plpgsql as $$
begin if actual is distinct from wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;
create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

-- --- setup (superuser; bypasses RLS) -----------------------------------------
insert into auth.users(id,email) values (:'ADMIN','admin@x'),(:'DOC','doc@x'),(:'CLERK','clerk@x');
insert into public.roles(id,key,label,requires_mfa,is_admin) values
  (:'RADMIN','admin','Administrator',true,true),
  (:'RDOC','doctor','Doctor',true,false),
  (:'RCLERK','records_clerk','Records Clerk',false,false);
insert into public.user_roles(user_id,role_id) values
  (:'ADMIN',:'RADMIN'),(:'DOC',:'RDOC'),(:'CLERK',:'RCLERK');

-- === A non-admin (DOC) CANNOT self-grant admin (the impersonation guard) =====
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000000d0"}';
do $$
begin
  begin
    insert into public.user_roles(user_id, role_id)
      values ('bbbbbbbb-0000-7000-8000-0000000000d0','aaaaaaaa-0000-7000-8000-000000000001');
    raise exception 'FAIL: DOC self-granted admin';
  exception when insufficient_privilege or check_violation then null; end;
end $$;

-- === DOC cannot mint a role ==================================================
do $$
begin
  begin
    insert into public.roles(key,label) values ('superuser','x');
    raise exception 'FAIL: DOC inserted a role';
  exception when insufficient_privilege or check_violation then null; end;
end $$;

-- === DOC sees only their OWN assignment ======================================
do $$ begin perform pg_temp.expect((select count(*)::int from public.user_roles), 1, 'DOC sees only own role'); end $$;

-- === MFA helpers for DOC (requires_mfa role) =================================
-- without aal2:
do $$ begin
  perform pg_temp.expect_bool(public.user_requires_mfa(), true,  'DOC role requires MFA');
  perform pg_temp.expect_bool(public.has_aal2(),          false, 'DOC has no aal2 yet');
  perform pg_temp.expect_bool(public.mfa_satisfied(),     false, 'DOC not MFA-satisfied w/o aal2');
  perform pg_temp.expect_bool(public.is_admin(),          false, 'DOC is not admin');
end $$;
reset role; reset request.jwt.claims;

-- with aal2:
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000000d0","aal":"aal2"}';
do $$ begin
  perform pg_temp.expect_bool(public.has_aal2(),      true, 'DOC now has aal2');
  perform pg_temp.expect_bool(public.mfa_satisfied(), true, 'DOC MFA-satisfied with aal2');
end $$;
reset role; reset request.jwt.claims;

-- === CLERK (requires_mfa=false) is MFA-satisfied even without aal2 ===========
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000000c1"}';
do $$ begin
  perform pg_temp.expect_bool(public.user_requires_mfa(), false, 'clerk role does not require MFA');
  perform pg_temp.expect_bool(public.mfa_satisfied(),     true,  'clerk MFA-satisfied w/o aal2');
end $$;
reset role; reset request.jwt.claims;

-- === ADMIN sees all assignments and CAN grant a role =========================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000000a1","aal":"aal2"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.user_roles), 3, 'admin sees all assignments'); end $$;
insert into public.user_roles(user_id, role_id, created_by)
  values ('bbbbbbbb-0000-7000-8000-0000000000c1','aaaaaaaa-0000-7000-8000-000000000002',
          'bbbbbbbb-0000-7000-8000-0000000000a1');
do $$ begin perform pg_temp.expect((select count(*)::int from public.user_roles), 4, 'admin granted a new role'); end $$;

-- === hard delete of an assignment denied even for admin ======================
with del as (delete from public.user_roles returning 1)
select pg_temp.expect((select count(*)::int from del), 0, 'assignments cannot be hard-deleted');
reset role; reset request.jwt.claims;

\echo 'ALL ROLES/MFA RLS PROBES PASSED'
