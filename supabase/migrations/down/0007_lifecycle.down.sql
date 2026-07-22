drop table if exists public.onboarding_drafts cascade;
drop function if exists public.enforce_application_transition() cascade;
drop function if exists public.valid_application_transition(public.application_status, public.application_status);
drop type if exists public.application_status;
