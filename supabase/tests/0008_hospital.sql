-- =============================================================================
-- PROBE — hospital onboarding (0010). Proves:
--   * hospital_leads is write-only from outside: authenticated may INSERT but
--     NOT SELECT; a superadmin may SELECT; an ADMIN (not superadmin) may NOT —
--     superadmin is strictly distinct from admin
--   * a hospital_application is created PENDING and the applicant can NEVER
--     self-route (->in_review) or self-approve (->active); a superadmin can
--   * owner isolation: applicant B cannot read applicant A's application
-- =============================================================================
\set SUPER 'bbbbbbbb-0000-7000-8000-000000000551'
\set ADM   'bbbbbbbb-0000-7000-8000-000000000521'
\set A     'bbbbbbbb-0000-7000-8000-0000000005a1'
\set B     'bbbbbbbb-0000-7000-8000-0000000005b1'

create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

-- --- setup (superuser) --------------------------------------------------------
insert into auth.users(id,email) values
  (:'SUPER','super@x'),(:'ADM','hadm@x'),(:'A','hosp_a@x'),(:'B','hosp_b@x') on conflict (id) do nothing;
insert into public.roles(key,label,requires_mfa,is_admin,is_superadmin) values
  ('superadmin','Platform Owner',true,false,true),
  ('admin','Administrator',true,true,false)
  on conflict (key) do update set is_admin = excluded.is_admin, is_superadmin = excluded.is_superadmin;
insert into public.user_roles(user_id, role_id)
  select (:'SUPER')::uuid, id from public.roles where key='superadmin'
  union all select (:'ADM')::uuid, id from public.roles where key='admin'
  on conflict do nothing;

-- === hospital_leads: authenticated may INSERT but NOT SELECT =================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000005a1"}';
insert into public.hospital_leads(facility_name, contact_name, contact_email)
  values ('Hope Clinic','Dr Nakato','nakato@hope.ug');
do $$ begin perform pg_temp.expect((select count(*)::int from public.hospital_leads), 0, 'applicant cannot enumerate leads'); end $$;
reset role; reset request.jwt.claims;

-- an ADMIN (is_admin, NOT superadmin) still cannot read leads
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-000000000521"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.hospital_leads), 0, 'admin (not superadmin) cannot read leads'); end $$;
reset role; reset request.jwt.claims;

-- the SUPERADMIN can read the lead pipeline
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-000000000551"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.hospital_leads where facility_name='Hope Clinic'), 1, 'superadmin reads leads'); end $$;
reset role; reset request.jwt.claims;

-- === hospital_applications: applicant A creates PENDING ======================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000005a1"}';
insert into public.hospital_applications(id, submitted_by, facility_name, official_email, level, ownership, created_by)
  values ('dddddddd-0000-7000-8000-0000000005a9', :'A','Hope Clinic','admin@hope.ug','hc_iii','private', :'A');
do $$ begin perform pg_temp.expect((select count(*)::int from public.hospital_applications where status='submitted'), 1, 'application created pending (submitted)'); end $$;

-- applicant CANNOT self-route (->in_review): blocked by RLS WITH CHECK
do $$
begin
  begin
    update public.hospital_applications set status='in_review' where submitted_by='bbbbbbbb-0000-7000-8000-0000000005a1';
    raise exception 'FAIL: applicant self-routed to in_review';
  exception when insufficient_privilege then null; end;
end $$;
-- applicant CANNOT self-approve (->active): the lifecycle state machine forbids
-- the submitted->active jump outright (second layer, before RLS is even reached)
do $$
begin
  begin
    update public.hospital_applications set status='active' where submitted_by='bbbbbbbb-0000-7000-8000-0000000005a1';
    raise exception 'FAIL: applicant self-approved';
  exception when check_violation then null; end;
end $$;
reset role; reset request.jwt.claims;

-- === the SUPERADMIN routes then approves =====================================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-000000000551"}';
update public.hospital_applications set status='in_review' where id='dddddddd-0000-7000-8000-0000000005a9';
update public.hospital_applications set status='active'    where id='dddddddd-0000-7000-8000-0000000005a9';
do $$ begin perform pg_temp.expect((select count(*)::int from public.hospital_applications where status='active'), 1, 'superadmin approved the application'); end $$;
reset role; reset request.jwt.claims;

-- === owner isolation: B cannot read A's application =========================
set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000005b1"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.hospital_applications), 0, 'B cannot read A application'); end $$;
reset role; reset request.jwt.claims;

select 'ALL HOSPITAL PROBES PASSED' as done;
