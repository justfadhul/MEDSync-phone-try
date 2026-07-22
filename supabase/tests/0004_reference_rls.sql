-- =============================================================================
-- RLS PROBE — reference extensions (migration 0006). Asserts:
--   * read-all for authenticated, admin-only writes on the new reference tables
--   * the DB safety invariant: a CLINICAL cadre cannot exist without a council
--   * FK integrity on the districts -> subcounties cascade
-- Runs after 0001-0003 probes against the SAME db, so roles are upserted.
-- =============================================================================
\set ADMIN 'bbbbbbbb-0000-7000-8000-0000000001a1'
\set DOC   'bbbbbbbb-0000-7000-8000-0000000001d0'

create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

-- --- setup (superuser; bypasses RLS, but NOT check constraints) ---------------
insert into auth.users(id,email) values (:'ADMIN','refadmin@x'),(:'DOC','refdoc@x')
  on conflict (id) do nothing;
insert into public.roles(key,label,requires_mfa,is_admin) values
  ('admin','Administrator',true,true),
  ('doctor','Doctor',true,false)
  on conflict (key) do nothing;
insert into public.user_roles(user_id, role_id)
  select (:'ADMIN')::uuid, id from public.roles where key='admin'
  union all select (:'DOC')::uuid, id from public.roles where key='doctor';

-- a district + a non-clinical cadre to read back
insert into public.districts(id, key, name)
  values ('cccccccc-0000-7000-8000-000000000001','probe_kla','Kampala (probe)');
insert into public.cadres(key,name,is_clinical,has_specialty)
  values ('probe_nc','Probe Non-clinical',false,false);

-- === SAFETY INVARIANT: a CLINICAL cadre with NO council is rejected ==========
do $$
begin
  begin
    insert into public.cadres(key,name,council_id,is_clinical)
      values ('probe_bad_clin','Bad Clinical', null, true);
    raise exception 'FAIL: a clinical cadre was inserted without a council';
  exception when check_violation then null; end;
end $$;

-- === authenticated (non-admin DOC) CAN read reference data ===================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000001d0"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.districts where key='probe_kla'), 1, 'DOC can read districts'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.cadres where key='probe_nc'), 1, 'DOC can read cadres'); end $$;

-- === DOC (non-admin) CANNOT write reference data (admin-only) =================
do $$
begin
  begin
    insert into public.districts(key,name) values ('probe_wak','Wakiso');
    raise exception 'FAIL: DOC wrote a district';
  exception when insufficient_privilege then null; end;
end $$;
do $$
begin
  begin
    insert into public.reference_data_versions(dataset,version,notes) values ('probe',1,'x');
    raise exception 'FAIL: DOC wrote a reference-data version';
  exception when insufficient_privilege then null; end;
end $$;
reset role; reset request.jwt.claims;

-- === ADMIN CAN write; FK on subcounties is enforced ==========================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000001a1"}';
do $$
begin
  insert into public.districts(key,name) values ('probe_wak','Wakiso');
  perform pg_temp.expect((select count(*)::int from public.districts where key like 'probe_%'), 2, 'ADMIN wrote a district');
  begin
    insert into public.subcounties(key,name,district_id)
      values ('probe_bad_sc','No District','dddddddd-0000-7000-8000-000000000999');
    raise exception 'FAIL: subcounty inserted with a non-existent district';
  exception when foreign_key_violation then null; end;
end $$;
reset role; reset request.jwt.claims;

select 'ALL REFERENCE RLS PROBES PASSED' as done;
