drop table if exists public.hospital_applications cascade;
drop table if exists public.hospital_leads cascade;
drop function if exists public.is_superadmin() cascade;
alter table public.roles drop column if exists is_superadmin;
