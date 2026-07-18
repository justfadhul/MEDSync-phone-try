-- =============================================================================
-- MedSync reference-data seed. IDEMPOTENT (safe to re-run — upserts on `key`).
-- Contains NO real personal data of any real person. System-authored rows have
-- created_by = null.
--
-- PRODUCTION GUARD: refuses to run when app.environment = 'production'. The
-- runner sets this GUC (see supabase/_local/seed.sh); seeding prod reference
-- data must be a deliberate, separate, reviewed action — never this script.
-- =============================================================================

do $$
begin
  if coalesce(current_setting('app.environment', true), '') = 'production' then
    raise exception 'refusing to run the seed against a production database';
  end if;
end $$;

-- --- councils (regulators) ---------------------------------------------------
-- NOTE: the pharmacy regulator is the PHARMACY BOARD OF UGANDA, not the
-- Pharmaceutical Society of Uganda (PSU, a professional society, not a
-- regulator). Do not "correct" this to PSU.
insert into public.councils (key, name, abbreviation) values
  ('umdpc', 'Uganda Medical and Dental Practitioners Council', 'UMDPC'),
  ('unmc',  'Uganda Nurses and Midwives Council', 'UNMC'),
  ('pbu',   'Pharmacy Board of Uganda', 'PBU'),
  ('ahpc',  'Allied Health Professionals Council', 'AHPC')
on conflict (key) do update
  set name = excluded.name, abbreviation = excluded.abbreviation;

-- --- cadres (anchored to a council) ------------------------------------------
insert into public.cadres (key, name, council_id, requires_registration)
select v.key, v.name, c.id, true
from (values
  ('medical_officer',    'Medical Officer',            'umdpc'),
  ('consultant_physician','Consultant Physician',      'umdpc'),
  ('medical_intern',     'Medical Intern',             'umdpc'),
  ('registered_nurse',   'Registered Nurse',           'unmc'),
  ('enrolled_nurse',     'Enrolled Nurse',             'unmc'),
  ('midwife',            'Midwife',                    'unmc'),
  ('pharmacist',         'Pharmacist',                 'pbu'),
  ('pharmacy_technician','Pharmacy Technician',        'pbu'),
  ('clinical_officer',   'Clinical Officer',           'ahpc')
) as v(key, name, council_key)
join public.councils c on c.key = v.council_key
on conflict (key) do update
  set name = excluded.name, council_id = excluded.council_id;

-- --- app roles (public.roles from migration 0002) ----------------------------
-- requires_mfa / is_admin are safety-relevant defaults. The exact MFA policy
-- per role and any role→permission mapping are CSO decisions ([GATE A]); these
-- are sensible defaults (all clinical + records + admin require MFA).
insert into public.roles (key, label, requires_mfa, is_admin) values
  ('admin',            'Administrator',   true,  true),
  ('doctor',           'Doctor',          true,  false),
  ('nurse',            'Nurse',           true,  false),
  ('pharmacist',       'Pharmacist',      true,  false),
  ('clinical_officer', 'Clinical Officer',true,  false),
  ('records_clerk',    'Records Clerk',   true,  false),
  ('patient',          'Patient',         false, false)
on conflict (key) do update
  set label = excluded.label,
      requires_mfa = excluded.requires_mfa,
      is_admin = excluded.is_admin;

-- --- facility ----------------------------------------------------------------
insert into public.facilities (key, name, level) values
  ('mulago_nrh', 'Mulago National Referral Hospital', 'national_referral_hospital')
on conflict (key) do update set name = excluded.name, level = excluded.level;

-- --- department: Internal Medicine ------------------------------------------
insert into public.departments (key, name, facility_id)
select 'internal_medicine', 'Internal Medicine', f.id
from public.facilities f where f.key = 'mulago_nrh'
on conflict (key) do update set name = excluded.name, facility_id = excluded.facility_id;

-- --- sub-specialties of Internal Medicine ------------------------------------
insert into public.sub_specialties (key, name, department_id)
select v.key, v.name, d.id
from (values
  ('im_cardiology',          'Cardiology'),
  ('im_nephrology',          'Nephrology'),
  ('im_endocrinology',       'Endocrinology'),
  ('im_gastroenterology',    'Gastroenterology'),
  ('im_pulmonology',         'Pulmonology'),
  ('im_neurology',           'Neurology'),
  ('im_infectious_diseases', 'Infectious Diseases'),
  ('im_hematology',          'Haematology'),
  ('im_rheumatology',        'Rheumatology'),
  ('im_dermatology',         'Dermatology')
) as v(key, name)
join public.departments d on d.key = 'internal_medicine'
on conflict (key) do update set name = excluded.name, department_id = excluded.department_id;
