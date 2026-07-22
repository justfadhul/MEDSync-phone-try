-- =============================================================================
-- PROBE — staff onboarding (0009). The crown-jewel safety property:
--   * a NON-clinical affiliation inserts fine with NO professional identity
--   * a CLINICAL affiliation WITHOUT a professional identity is REJECTED
--     (check_violation) — the anti-impersonation anchor, enforced in the DB
--   * once the application carries a professional identity, the clinical
--     affiliation is allowed
--   * owner isolation: B cannot read A's application / identity / affiliations
-- The branch keys off cadres.is_clinical (0006), never a role name.
-- =============================================================================
\set A   'bbbbbbbb-0000-7000-8000-0000000004a1'
\set B   'bbbbbbbb-0000-7000-8000-0000000004b1'
\set COU 'aaaaaaaa-0000-7000-8000-0000000004c1'
\set CLN 'aaaaaaaa-0000-7000-8000-0000000004d1'
\set NCL 'aaaaaaaa-0000-7000-8000-0000000004d2'
\set FAC 'cccccccc-0000-7000-8000-0000000004f1'
\set DEP 'cccccccc-0000-7000-8000-0000000004e1'

create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

-- --- reference setup (superuser; bypasses RLS, not check constraints) ---------
insert into auth.users(id,email) values (:'A','staff_a@x'),(:'B','staff_b@x') on conflict (id) do nothing;
insert into public.councils(id,key,name) values (:'COU','probe_council','Probe Council');
insert into public.cadres(id,key,name,council_id,is_clinical) values (:'CLN','probe_clin','Probe Clinician',:'COU',true);
insert into public.cadres(id,key,name,is_clinical) values (:'NCL','probe_reception','Probe Receptionist',false);
insert into public.facilities(id,key,name,level,ownership) values (:'FAC','probe_staff_fac','Probe Hospital','general_hospital','public');
insert into public.departments(id,key,name,facility_id) values (:'DEP','probe_staff_dep','Probe Department',:'FAC');

-- === A: application + affiliations ===========================================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000004a1"}';

insert into public.staff_applications(id, user_id, created_by)
  values ('dddddddd-0000-7000-8000-0000000004a9', :'A', :'A');

-- a NON-clinical affiliation needs NO professional identity — inserts fine
insert into public.staff_affiliations(application_id, facility_id, department_id, cadre_id, employment_type, created_by)
  values ('dddddddd-0000-7000-8000-0000000004a9', :'FAC', :'DEP', :'NCL', 'full_time', :'A');
do $$ begin perform pg_temp.expect((select count(*)::int from public.staff_affiliations), 1, 'non-clinical affiliation inserted without professional identity'); end $$;

-- a CLINICAL affiliation WITHOUT a professional identity is REJECTED ----------
do $$
begin
  begin
    insert into public.staff_affiliations(application_id, facility_id, department_id, cadre_id, employment_type, created_by)
      values ('dddddddd-0000-7000-8000-0000000004a9', 'cccccccc-0000-7000-8000-0000000004f1',
              'cccccccc-0000-7000-8000-0000000004e1', 'aaaaaaaa-0000-7000-8000-0000000004d1', 'full_time',
              'bbbbbbbb-0000-7000-8000-0000000004a1');
    raise exception 'FAIL: clinical affiliation inserted with NO professional identity';
  exception when check_violation then null; end;
end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.staff_affiliations), 1, 'clinical affiliation was blocked'); end $$;

-- once the professional identity exists, the clinical affiliation is allowed ---
insert into public.staff_professional_identity(application_id, council_id, registration_no_ct, licence_doc_path, created_by)
  values ('dddddddd-0000-7000-8000-0000000004a9', :'COU', 'ENC(regno)', 'enc/path/licence.pdf', :'A');
insert into public.staff_affiliations(application_id, facility_id, department_id, cadre_id, employment_type, created_by)
  values ('dddddddd-0000-7000-8000-0000000004a9', :'FAC', :'DEP', :'CLN', 'locum', :'A');
do $$ begin perform pg_temp.expect((select count(*)::int from public.staff_affiliations), 2, 'clinical affiliation allowed once professional identity exists'); end $$;

reset role; reset request.jwt.claims;

-- === B cannot read A's application / identity / affiliations =================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000004b1"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.staff_applications), 0, 'B cannot read A application'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.staff_professional_identity), 0, 'B cannot read A professional identity'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.staff_affiliations), 0, 'B cannot read A affiliations'); end $$;
reset role; reset request.jwt.claims;

select 'ALL STAFF PROBES PASSED' as done;
