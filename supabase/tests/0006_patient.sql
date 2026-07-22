-- =============================================================================
-- PROBE — patient onboarding (0008). Owner isolation on identity/consent/links,
-- consent immutability, and that a link request is created PENDING (submitted),
-- with the lifecycle blocking a patient from self-activating the link.
-- =============================================================================
\set A 'bbbbbbbb-0000-7000-8000-0000000003a1'
\set B 'bbbbbbbb-0000-7000-8000-0000000003b1'
\set FAC 'cccccccc-0000-7000-8000-0000000003f1'

create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

insert into auth.users(id,email) values (:'A','pat_a@x'),(:'B','pat_b@x') on conflict (id) do nothing;
insert into public.facilities(id,key,name,level,ownership) values (:'FAC','probe_fac','Probe Hospital','general_hospital','public');

-- --- A registers: encrypted identity, three consents, a link request ---------
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000003a1"}';
insert into public.patient_identity(user_id, first_name_ct, surname_ct, nin_ct, dob_ct, phone_ct, gender, created_by)
  values (:'A','ENC(a)','ENC(a)','ENC(nin)','ENC(dob)','ENC(phone)','female', :'A');
insert into public.consent_records(user_id, kind, granted, created_by) values
  (:'A','platform_terms',true,:'A'),(:'A','data_processing',true,:'A'),(:'A','data_sharing',true,:'A');
insert into public.patient_link_requests(patient_user_id, facility_id, mrn_ct, created_by)
  values (:'A', :'FAC', 'ENC(mrn)', :'A');

-- link request is PENDING, not active
do $$ begin perform pg_temp.expect((select count(*)::int from public.patient_link_requests where status='submitted'), 1, 'link request is pending (submitted)'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.consent_records), 3, 'three consent rows recorded'); end $$;

-- patient CANNOT self-activate the link (lifecycle: submitted -> active blocked)
do $$
begin
  begin
    update public.patient_link_requests set status='active' where patient_user_id='bbbbbbbb-0000-7000-8000-0000000003a1';
    raise exception 'FAIL: patient self-activated a link request';
  exception when check_violation then null; end;
end $$;

-- consent is append-only (no UPDATE)
do $$
begin
  begin
    update public.consent_records set granted=false where user_id='bbbbbbbb-0000-7000-8000-0000000003a1';
    raise exception 'FAIL: consent was updated (should be append-only)';
  exception when insufficient_privilege then null; end;
end $$;
reset role; reset request.jwt.claims;

-- --- B cannot see A's identity / consent / link request ----------------------
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000003b1"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.patient_identity), 0, 'B cannot read A identity'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.consent_records), 0, 'B cannot read A consent'); end $$;
do $$ begin perform pg_temp.expect((select count(*)::int from public.patient_link_requests), 0, 'B cannot read A link request'); end $$;
reset role; reset request.jwt.claims;

select 'ALL PATIENT PROBES PASSED' as done;
