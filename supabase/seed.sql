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

-- --- cadres (national catalogue) ---------------------------------------------
-- CLINICAL cadres are anchored to a council (council_key set) — enforced as a
-- DB invariant (0006: a clinical cadre must have a council). NON-CLINICAL cadres
-- (reception, records, administration) have no council and grant no clinical
-- scope. `is_clinical` is the flag the registration branch keys off (Gate O.4);
-- `has_specialty` gates the specialty picker (Gate O.4 F4). LEFT JOIN so a null
-- council_key yields a null council_id for non-clinical rows.
insert into public.cadres (key, name, council_id, is_clinical, has_specialty, requires_registration)
select v.key, v.name, c.id, v.is_clinical, v.has_specialty, v.requires_registration
from (values
  -- key,                     name,                       council, clinical, specialty, requires_reg
  ('medical_officer',        'Medical Officer',           'umdpc', true,  true,  true),
  ('consultant_physician',   'Consultant Physician',      'umdpc', true,  true,  true),
  ('medical_intern',         'Medical Intern',            'umdpc', true,  false, true),
  ('dental_surgeon',         'Dental Surgeon',            'umdpc', true,  true,  true),
  ('registered_nurse',       'Registered Nurse',          'unmc',  true,  true,  true),
  ('enrolled_nurse',         'Enrolled Nurse',            'unmc',  true,  false, true),
  ('midwife',                'Midwife',                   'unmc',  true,  false, true),
  ('enrolled_midwife',       'Enrolled Midwife',          'unmc',  true,  false, true),
  ('pharmacist',             'Pharmacist',                'pbu',   true,  false, true),
  ('pharmacy_technician',    'Pharmacy Technician',       'pbu',   true,  false, true),
  ('clinical_officer',       'Clinical Officer',          'ahpc',  true,  false, true),
  ('laboratory_technologist','Laboratory Technologist',   'ahpc',  true,  false, true),
  ('radiographer',           'Radiographer',              'ahpc',  true,  false, true),
  ('physiotherapist',        'Physiotherapist',           'ahpc',  true,  false, true),
  ('anaesthetic_officer',    'Anaesthetic Officer',       'ahpc',  true,  false, true),
  ('nutritionist',           'Nutritionist',              'ahpc',  true,  false, true),
  -- non-clinical (no council; no clinical scope)
  ('receptionist',           'Receptionist',              null,    false, false, false),
  ('records_officer',        'Records Officer',           null,    false, false, false),
  ('hospital_administrator', 'Hospital Administrator',    null,    false, false, false),
  ('cashier',                'Cashier / Billing Officer', null,    false, false, false)
) as v(key, name, council_key, is_clinical, has_specialty, requires_registration)
left join public.councils c on c.key = v.council_key
on conflict (key) do update
  set name = excluded.name,
      council_id = excluded.council_id,
      is_clinical = excluded.is_clinical,
      has_specialty = excluded.has_specialty,
      requires_registration = excluded.requires_registration;

-- --- cadre grades (role/grade dropdown options) ------------------------------
insert into public.cadre_grades (key, name, cadre_id)
select v.key, v.name, ca.id
from (values
  ('mo_medical_officer',   'Medical Officer',           'medical_officer'),
  ('mo_senior',            'Senior Medical Officer',    'medical_officer'),
  ('mo_principal',         'Principal Medical Officer', 'medical_officer'),
  ('cons_consultant',      'Consultant',                'consultant_physician'),
  ('cons_senior',          'Senior Consultant',         'consultant_physician'),
  ('rn_nursing_officer',   'Nursing Officer',           'registered_nurse'),
  ('rn_senior',            'Senior Nursing Officer',    'registered_nurse'),
  ('rn_principal',         'Principal Nursing Officer', 'registered_nurse'),
  ('pharm_pharmacist',     'Pharmacist',                'pharmacist'),
  ('pharm_senior',         'Senior Pharmacist',         'pharmacist'),
  ('co_clinical_officer',  'Clinical Officer',          'clinical_officer'),
  ('co_senior',            'Senior Clinical Officer',   'clinical_officer')
) as v(key, name, cadre_key)
join public.cadres ca on ca.key = v.cadre_key
on conflict (key) do update set name = excluded.name, cadre_id = excluded.cadre_id;

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

-- --- facility (D5 taxonomy: level + ownership) -------------------------------
insert into public.facilities (key, name, level, ownership) values
  ('mulago_nrh', 'Mulago National Referral Hospital', 'national_referral_hospital', 'public')
on conflict (key) do update
  set name = excluded.name, level = excluded.level, ownership = excluded.ownership;

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

-- --- D1 geography: districts (central subset — full UBOS set pending) ---------
insert into public.districts (key, name) values
  ('kampala', 'Kampala'),
  ('wakiso',  'Wakiso'),
  ('mukono',  'Mukono'),
  ('mpigi',   'Mpigi'),
  ('jinja',   'Jinja')
on conflict (key) do update set name = excluded.name;

-- --- D1 geography: subcounties (cascading by district) -----------------------
insert into public.subcounties (key, name, district_id)
select v.key, v.name, d.id
from (values
  ('kla_central',            'Kampala Central Division', 'kampala'),
  ('kla_kawempe',            'Kawempe Division',         'kampala'),
  ('kla_makindye',           'Makindye Division',        'kampala'),
  ('kla_nakawa',             'Nakawa Division',          'kampala'),
  ('kla_rubaga',             'Rubaga Division',          'kampala'),
  ('wak_nansana',            'Nansana',                  'wakiso'),
  ('wak_kira',               'Kira',                     'wakiso'),
  ('wak_makindye_ssabagabo', 'Makindye-Ssabagabo',       'wakiso'),
  ('muk_central',            'Mukono Central',           'mukono'),
  ('muk_goma',               'Goma',                     'mukono')
) as v(key, name, district_key)
join public.districts d on d.key = v.district_key
on conflict (key) do update set name = excluded.name, district_id = excluded.district_id;

-- --- reference-data versions (auditable dataset versioning) ------------------
insert into public.reference_data_versions (dataset, version, notes) values
  ('cadres',     1, 'National cadre catalogue v1 — UMDPC/UNMC/Pharmacy Board/AHPC + non-clinical.'),
  ('geography',  1, 'Central districts subset (Kampala + neighbours). Full UBOS dataset pending [GATE A].'),
  ('facilities', 1, 'Mulago National Referral Hospital.')
on conflict (dataset, version) do update set notes = excluded.notes;
