-- =============================================================================
-- PROBE — lifecycle (0007): the state machine's allowed/blocked edges, the
-- enforcement trigger on a table with a status column, and owner-scoped drafts.
-- =============================================================================
\set A 'bbbbbbbb-0000-7000-8000-0000000002a1'
\set B 'bbbbbbbb-0000-7000-8000-0000000002b1'

create or replace function pg_temp.expect_bool(actual boolean, wanted boolean, msg text)
returns void language plpgsql as $$
begin if actual is distinct from wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;
create or replace function pg_temp.expect(actual int, wanted int, msg text)
returns void language plpgsql as $$
begin if actual <> wanted then raise exception 'FAIL: % (got %, wanted %)', msg, actual, wanted; end if; end $$;

insert into auth.users(id,email) values (:'A','life_a@x'),(:'B','life_b@x') on conflict (id) do nothing;

-- === allowed / blocked edges =================================================
do $$ begin
  perform pg_temp.expect_bool(public.valid_application_transition('draft','submitted'),      true,  'draft->submitted');
  perform pg_temp.expect_bool(public.valid_application_transition('submitted','in_review'),  true,  'submitted->in_review');
  perform pg_temp.expect_bool(public.valid_application_transition('in_review','active'),     true,  'in_review->active');
  perform pg_temp.expect_bool(public.valid_application_transition('requires_info','submitted'), true, 'requires_info round-trip');
  perform pg_temp.expect_bool(public.valid_application_transition('active','suspended'),     true,  'active->suspended');
  -- blocked
  perform pg_temp.expect_bool(public.valid_application_transition('draft','active'),         false, 'draft->active blocked');
  perform pg_temp.expect_bool(public.valid_application_transition('rejected','active'),      false, 'rejected is terminal');
  perform pg_temp.expect_bool(public.valid_application_transition('active','draft'),         false, 'no going back to draft');
end $$;

-- === the enforcement trigger blocks an illegal edge on a real table ==========
create table pg_temp.fake_app (id int primary key, status public.application_status not null);
create trigger fake_app_txn before update on pg_temp.fake_app
  for each row execute function public.enforce_application_transition();
insert into pg_temp.fake_app values (1,'active');
do $$ begin
  begin
    update pg_temp.fake_app set status='draft' where id=1;   -- illegal
    raise exception 'FAIL: illegal transition active->draft was allowed';
  exception when check_violation then null; end;
end $$;
do $$ begin
  update pg_temp.fake_app set status='suspended' where id=1; -- legal
  perform pg_temp.expect((select 1 from pg_temp.fake_app where id=1 and status='suspended'), 1, 'legal transition applied');
end $$;

-- === drafts are owner-scoped (A cannot read B's draft) =======================
insert into public.onboarding_drafts(owner_id, intent, payload) values (:'A','patient','ciphertextA');
insert into public.onboarding_drafts(owner_id, intent, payload) values (:'B','staff','ciphertextB');

set role authenticated;
set request.jwt.claims to '{"sub":"bbbbbbbb-0000-7000-8000-0000000002a1"}';
do $$ begin perform pg_temp.expect((select count(*)::int from public.onboarding_drafts), 1, 'A sees only own draft'); end $$;
do $$
begin
  begin
    insert into public.onboarding_drafts(owner_id, intent, payload) values ('bbbbbbbb-0000-7000-8000-0000000002b1','staff','forgedForB');
    raise exception 'FAIL: A wrote a draft owned by B';
  exception when insufficient_privilege then null; end;
end $$;
reset role; reset request.jwt.claims;

select 'ALL LIFECYCLE PROBES PASSED' as done;
