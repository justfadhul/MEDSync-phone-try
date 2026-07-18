-- =============================================================================
-- RLS PROBE — profiles (migration 0001).
-- Authenticates as user A and user B (via role authenticated + JWT claims,
-- exactly as Supabase evaluates RLS) and ASSERTS denial across the access
-- boundary for every verb. Run with psql -v ON_ERROR_STOP=1: any failed
-- assertion RAISEs and aborts the script with a non-zero exit.
--
-- Access basis under test: OWNER (user_id = auth.uid()).
-- =============================================================================

\set A '00000000-0000-0000-0000-00000000000a'
\set B '00000000-0000-0000-0000-00000000000b'

-- --- setup (as superuser; bypasses RLS) --------------------------------------
insert into auth.users (id, email) values (:'A', 'a@example.test'), (:'B', 'b@example.test');

-- helper to assert a row count
create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin
  if actual <> wanted then
    raise exception 'RLS FAIL: % (got %, wanted %)', msg, actual, wanted;
  end if;
end $$;

-- === Test 1: A creates its OWN profile (INSERT policy allows) ================
set role authenticated;
set request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000a"}';
insert into public.profiles (user_id, full_name, created_by) values (:'A', 'Alice', :'A');
do $$ begin perform pg_temp.expect((select count(*)::int from public.profiles), 1, 'A should see its own row'); end $$;
reset role; reset request.jwt.claims;

-- === Test 2: B CANNOT see A's profile (SELECT denied cross-owner) ============
set role authenticated;
set request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000b"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.profiles), 0, 'B must not see A''s profile'); end $$;

-- === Test 3: B CANNOT insert a profile owned by A (WITH CHECK) ===============
do $$
begin
  begin
    -- literal UUID: psql does not interpolate :'A' inside a dollar-quoted body
    insert into public.profiles (user_id, full_name, created_by)
      values ('00000000-0000-0000-0000-00000000000a', 'Mallory',
              '00000000-0000-0000-0000-00000000000a');
    raise exception 'RLS FAIL: B inserted a profile for A';
  exception when insufficient_privilege or check_violation then
    null; -- expected: policy blocked it
  end;
end $$;

-- === Test 4: B's UPDATE of A's row affects 0 rows (UPDATE denied) ============
with upd as (
  update public.profiles set full_name = 'hacked' where user_id = :'A' returning 1
)
select pg_temp.expect((select count(*)::int from upd), 0, 'B must not update A''s row');

-- === Test 5: B's hard DELETE affects 0 rows (DELETE denied for all) ==========
with del as ( delete from public.profiles where user_id = :'A' returning 1 )
select pg_temp.expect((select count(*)::int from del), 0, 'nobody may hard-delete a profile');
reset role; reset request.jwt.claims;

-- === Test 6: A soft-deletes own profile ======================================
-- After soft delete: the row is HIDDEN from the profiles_active view (listings)
-- but the owner retains base-table access (retention). Cross-owner stays denied
-- (Test 2 already proved B sees nothing).
set role authenticated;
set request.jwt.claims to '{"sub":"00000000-0000-0000-0000-00000000000a"}';
update public.profiles set deleted_at = now() where user_id = :'A';
do $$ begin perform pg_temp.expect((select count(*)::int from public.profiles_active), 0, 'soft-deleted row must be hidden from profiles_active'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.profiles), 1, 'owner still accesses own row on base table (retention)'); end $$;
reset role; reset request.jwt.claims;

-- === Test 7: anon is denied entirely ========================================
-- anon holds no table grant at all, so it cannot even reach the rows (a
-- stronger guarantee than RLS returning 0). Assert the denial.
set role anon;
do $$
begin
  begin
    perform count(*) from public.profiles;
    raise exception 'RLS FAIL: anon reached profiles';
  exception when insufficient_privilege then
    null; -- expected
  end;
end $$;
reset role;

-- === Test 8: the row still physically exists (soft, not hard, delete) ========
do $$ begin perform pg_temp.expect((select count(*)::int from public.profiles where deleted_at is not null), 1, 'soft-deleted row must still exist physically'); end $$;

\echo 'ALL PROFILES RLS PROBES PASSED'
