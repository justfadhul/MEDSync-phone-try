"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TextInput, DateInput, Select, Combobox, CascadingCombobox, Segmented,
  PasswordWithVerify, FileUpload, type Option,
} from "@/components/forms";

// Staff registration (Gate O.4). ONE form that BRANCHES on the cadre's
// is_clinical flag (0006) — never on a hardcoded role name. A clinical cadre
// pulls in the professional-identity step (council-anchored registration +
// licence); a non-clinical cadre (reception, records, admin) skips it and grants
// no clinical scope. This mirrors the DB invariant enforce_clinical_anchor()
// (0009): a clinical affiliation cannot exist without a professional identity.
//
// SECURITY: clinical identity is council-ANCHORED, never self-selected — the
// council is derived from the cadre and shown read-only, not picked. MFA is
// mandatory before the application enters the review queue, enforced
// server-side (the step here starts that enrolment; the OTP/TOTP handshake and
// the encrypt->audit->write submission run in the registration Edge Function
// when the Supabase project is linked).
//
// NOTE: the reference options below are an inline placeholder. In the linked
// project they come from the O.1 reference tables (cadres/councils/facilities/
// departments/cadre_grades) via a server query — the "selectable data, least
// typing" spine. is_clinical + council travel WITH each cadre, exactly as the
// row carries them.
type Cadre = Option & { clinical: boolean; council?: string };

const COUNCILS: Record<string, string> = {
  umdpc: "Uganda Medical & Dental Practitioners Council",
  unmc: "Uganda Nurses & Midwives Council",
  pharmacy_board: "Pharmacy Board of Uganda",
  ahpc: "Allied Health Professionals Council",
};

const CADRES: Cadre[] = [
  { value: "medical_officer", label: "Medical Officer", clinical: true, council: "umdpc" },
  { value: "specialist", label: "Specialist / Consultant", clinical: true, council: "umdpc" },
  { value: "dental_surgeon", label: "Dental Surgeon", clinical: true, council: "umdpc" },
  { value: "registered_nurse", label: "Registered Nurse", clinical: true, council: "unmc" },
  { value: "midwife", label: "Midwife", clinical: true, council: "unmc" },
  { value: "pharmacist", label: "Pharmacist", clinical: true, council: "pharmacy_board" },
  { value: "pharmacy_technician", label: "Pharmacy Technician", clinical: true, council: "pharmacy_board" },
  { value: "clinical_officer", label: "Clinical Officer", clinical: true, council: "ahpc" },
  { value: "lab_technologist", label: "Laboratory Technologist", clinical: true, council: "ahpc" },
  { value: "radiographer", label: "Radiographer", clinical: true, council: "ahpc" },
  // non-clinical — no council, no clinical scope
  { value: "receptionist", label: "Receptionist", clinical: false },
  { value: "records_officer", label: "Records Officer", clinical: false },
  { value: "hospital_administrator", label: "Hospital Administrator", clinical: false },
  { value: "cashier", label: "Cashier / Billing", clinical: false },
];

const GRADES: Record<string, Option[]> = {
  medical_officer: [
    { value: "intern", label: "Intern Medical Officer" },
    { value: "mo", label: "Medical Officer" },
    { value: "smo", label: "Senior Medical Officer" },
    { value: "pmo", label: "Principal Medical Officer" },
  ],
  registered_nurse: [
    { value: "enrolled", label: "Enrolled Nurse" },
    { value: "registered", label: "Registered Nurse" },
    { value: "senior", label: "Senior Nursing Officer" },
    { value: "principal", label: "Principal Nursing Officer" },
  ],
};
const GRADES_DEFAULT: Option[] = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Officer" },
  { value: "senior", label: "Senior" },
  { value: "principal", label: "Principal / Head" },
];

const FACILITIES: Option[] = [
  { value: "mulago_nrh", label: "Mulago National Referral Hospital" },
  { value: "mbarara_rrh", label: "Mbarara Regional Referral Hospital" },
  { value: "nsambya", label: "Nsambya Hospital" },
  { value: "mengo", label: "Mengo Hospital" },
];
const DEPARTMENTS: Option[] = [
  { value: "opd", label: "Outpatient (OPD)" },
  { value: "emergency", label: "Emergency / Casualty" },
  { value: "medicine", label: "Internal Medicine" },
  { value: "surgery", label: "Surgery" },
  { value: "paediatrics", label: "Paediatrics" },
  { value: "maternity", label: "Maternity" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "laboratory", label: "Laboratory" },
  { value: "radiology", label: "Radiology" },
  { value: "records", label: "Medical Records" },
  { value: "administration", label: "Administration" },
];
const DEPARTMENTS_BY_FACILITY: Record<string, Option[]> = Object.fromEntries(
  FACILITIES.map((fac) => [fac.value, DEPARTMENTS]),
);
const EMPLOYMENT: Option[] = [
  { value: "full_time", label: "Full-time" },
  { value: "visiting", label: "Visiting" },
  { value: "locum", label: "Locum" },
];

export default function StaffRegister() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    first: "", surname: "", phone: "", email: "", pw: "", pv: "",
    returning: "new", cadre: "", grade: "", regNo: "", regExpiry: "",
    facility: "", department: "", employment: "full_time",
  });
  const [licence, setLicence] = useState<File | null>(null);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const cadre = CADRES.find((c) => c.value === f.cadre);
  const isClinical = !!cadre?.clinical;
  const councilName = cadre?.council ? COUNCILS[cadre.council] : undefined;
  const grades = GRADES[f.cadre] ?? GRADES_DEFAULT;

  // The step list itself is the branch: clinical inserts "Credentials".
  const steps = useMemo(
    () => (isClinical
      ? ["Account", "Role", "Credentials", "Placement", "Security"]
      : ["Account", "Role", "Placement", "Security"]),
    [isClinical],
  );
  const current = steps[Math.min(step, steps.length - 1)];
  const isLast = step === steps.length - 1;

  const canNext = useMemo(() => {
    switch (current) {
      case "Account": return f.first && f.surname && f.phone && f.pw.length >= 8 && f.pw === f.pv;
      case "Role": return !!f.cadre;
      case "Credentials": return !!f.regNo && !!licence;
      case "Placement": return f.facility && f.department && f.employment;
      case "Security": return true;
      default: return false;
    }
  }, [current, f, licence]);

  return (
    <main className="bg-surface-page flex min-h-dvh flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/register" className="text-content-tertiary text-sm">← Back</Link>
        <h1 className="text-content-primary mt-4 text-2xl font-bold tracking-tight">Register as staff</h1>
        <p className="text-content-secondary mt-1 text-[15px]">Clinical and hospital support roles.</p>

        {/* progress */}
        <div className="mt-5 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-primary" : "bg-line-default"}`} />
          ))}
        </div>
        <p className="text-content-tertiary mt-2 text-xs">Step {step + 1} of {steps.length} · {current}</p>

        <div className="mt-6 flex flex-col gap-4">
          {current === "Account" && (
            <>
              <Segmented label="Is this your first time on MedSync?" options={[
                { value: "new", label: "New to MedSync" }, { value: "returning", label: "Returning" },
              ]} value={f.returning} onChange={(v) => set("returning", v)} />
              <TextInput label="First name" required value={f.first} onChange={(e) => set("first", e.target.value)} />
              <TextInput label="Surname" required value={f.surname} onChange={(e) => set("surname", e.target.value)} />
              <TextInput label="Phone" required type="tel" inputMode="tel" placeholder="07XX XXX XXX" hint="We'll send a one-time code by SMS." value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              <TextInput label="Work email" type="email" hint="Optional but recommended for verification." value={f.email} onChange={(e) => set("email", e.target.value)} />
              <PasswordWithVerify value={f.pw} verify={f.pv} onChange={(v) => set("pw", v)} onVerifyChange={(v) => set("pv", v)} required />
            </>
          )}

          {current === "Role" && (
            <>
              <Combobox label="Your cadre / role" required options={CADRES} value={f.cadre}
                onChange={(v) => setF((s) => ({ ...s, cadre: v, grade: "" }))} hint="Start typing to find your role." />
              {cadre && (
                <Select label="Grade / rank" options={grades} value={f.grade} onChange={(v) => set("grade", v)}
                  hint="Optional — helps route your application." placeholder="Select grade" />
              )}
              {cadre && (
                <div className={`rounded-xl border px-4 py-3 text-sm ${isClinical ? "border-brand-primary/40 bg-brand-subtle text-content-primary" : "border-line-default bg-surface-secondary text-content-secondary"}`}>
                  {isClinical ? (
                    <>Clinical role — you’ll verify your <strong>{councilName}</strong> registration next. Clinical identity is council-verified, never self-declared.</>
                  ) : (
                    <>Support role — no clinical registration needed. This role grants no access to clinical records by itself.</>
                  )}
                </div>
              )}
            </>
          )}

          {current === "Credentials" && (
            <>
              {/* council is DERIVED from the cadre and shown read-only — never self-selected */}
              <div>
                <span className="text-content-secondary text-sm font-medium">Registering council</span>
                <div className="border-line-default bg-surface-secondary text-content-primary mt-1.5 flex h-12 items-center rounded-xl border px-4 text-[15px]">
                  {councilName}
                </div>
                <p className="text-content-tertiary mt-1.5 text-xs">Set by your cadre — this is verified against the council register.</p>
              </div>
              <TextInput label="Registration / licence number" required value={f.regNo} onChange={(e) => set("regNo", e.target.value)} hint="Encrypted before it's stored." />
              <DateInput label="Registration expiry" value={f.regExpiry} onChange={(e) => set("regExpiry", e.target.value)} />
              <FileUpload label="Practising licence" required value={licence} onChange={setLicence} hint="Photo or PDF of your current licence. Stored privately, encrypted." />
            </>
          )}

          {current === "Placement" && (
            <>
              <CascadingCombobox
                parentLabel="Facility" childLabel="Department" required
                parentOptions={FACILITIES} childOptionsByParent={DEPARTMENTS_BY_FACILITY}
                value={{ parent: f.facility, child: f.department }}
                onChange={(v) => setF((s) => ({ ...s, facility: v.parent, department: v.child }))}
              />
              <Segmented label="Employment type" required options={EMPLOYMENT} value={f.employment} onChange={(v) => set("employment", v)} />
              <p className="text-content-tertiary text-xs">Locum or visiting? You can add more facilities after your first is approved.</p>
            </>
          )}

          {current === "Security" && (
            <div className="flex flex-col gap-4">
              <div className="border-line-default bg-surface-primary flex items-start gap-3 rounded-2xl border p-4">
                <span className="bg-brand-subtle text-brand-primary grid h-10 w-10 flex-none place-items-center rounded-xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3ZM9 12l2 2 4-4" />
                  </svg>
                </span>
                <div>
                  <p className="text-content-primary text-sm font-semibold">Two-factor authentication is required</p>
                  <p className="text-content-secondary mt-1 text-sm">Every staff account uses a second factor. You’ll set it up on the next screen — your application enters review only after MFA is enrolled.</p>
                </div>
              </div>
              <div className="border-line-subtle bg-surface-secondary rounded-2xl border p-4">
                <p className="text-content-secondary text-sm">
                  Submitting sends your application for verification against the {isClinical ? "council register and facility" : "facility"}. You’ll be notified when it’s reviewed — access is granted only after approval.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="text-content-secondary text-sm font-medium">← Back</button>
          ) : <span />}
          {!isLast ? (
            <button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)}
              className="bg-brand-primary text-content-on-brand h-12 rounded-full px-7 text-sm font-semibold disabled:opacity-50">Continue</button>
          ) : (
            <button type="button" disabled={!canNext}
              className="bg-brand-primary text-content-on-brand h-12 rounded-full px-7 text-sm font-semibold disabled:opacity-50">Set up MFA & submit</button>
          )}
        </div>
      </div>
    </main>
  );
}
