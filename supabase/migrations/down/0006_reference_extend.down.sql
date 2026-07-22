-- Down for 0006_reference_extend. Drop new tables, then reverse the column
-- additions/constraints on cadres + facilities.
drop table if exists public.reference_data_versions cascade;
drop table if exists public.subcounties cascade;
drop table if exists public.districts cascade;
drop table if exists public.cadre_grades cascade;

alter table public.facilities drop constraint if exists facilities_level_chk;
alter table public.facilities drop column if exists ownership;

alter table public.cadres drop constraint if exists cadres_clinical_requires_council;
alter table public.cadres alter column council_id set not null;
alter table public.cadres drop column if exists has_specialty;
alter table public.cadres drop column if exists is_clinical;
