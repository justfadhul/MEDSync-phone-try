"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TextInput, Select, Combobox, CascadingCombobox, Segmented, RadioCards,
  PasswordWithVerify, FileUpload, type Option,
} from "@/components/forms";

// Hospital onboarding (Gate O.5). TWO tracks, matching the substrate (0010):
//
//   Express interest  -> hospital_leads. No account. A short form anyone can
//                        send; write-only from outside (they can't read it
//                        back). We follow up. No PHI.
//   Full application  -> hospital_applications. Requires an account. Created
//                        PENDING and routed to a superadmin for approval — the
//                        applicant can never self-approve. Honest pending state.
//
// NOTE: reference options are inline placeholders; in the linked project they
// come from the O.1 reference tables (districts/subcounties) via a server query.
const DISTRICTS: Option[] = [
  { value: "kampala", label: "Kampala" },
  { value: "wakiso", label: "Wakiso" },
  { value: "mbarara", label: "Mbarara" },
  { value: "gulu", label: "Gulu" },
  { value: "jinja", label: "Jinja" },
];
const SUBCOUNTIES: Record<string, Option[]> = {
  kampala: [
    { value: "central", label: "Central Division" },
    { value: "kawempe", label: "Kawempe" },
    { value: "nakawa", label: "Nakawa" },
    { value: "rubaga", label: "Rubaga" },
    { value: "makindye", label: "Makindye" },
  ],
  wakiso: [
    { value: "nansana", label: "Nansana" },
    { value: "kira", label: "Kira" },
    { value: "entebbe", label: "Entebbe" },
  ],
  mbarara: [{ value: "mbarara_city", label: "Mbarara City" }],
  gulu: [{ value: "gulu_city", label: "Gulu City" }],
  jinja: [{ value: "jinja_city", label: "Jinja City" }],
};
const LEVELS: Option[] = [
  { value: "national_referral_hospital", label: "National Referral Hospital" },
  { value: "regional_referral_hospital", label: "Regional Referral Hospital" },
  { value: "general_hospital", label: "General Hospital" },
  { value: "hc_iv", label: "Health Centre IV" },
  { value: "hc_iii", label: "Health Centre III" },
  { value: "hc_ii", label: "Health Centre II" },
];
const OWNERSHIP: Option[] = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "pnfp", label: "PNFP" },
];
const TRACKS: Option[] = [
  { value: "interest", label: "Express interest", hint: "A quick note — no account needed. We'll reach out to walk you through onboarding." },
  { value: "apply", label: "Apply to onboard now", hint: "Create an account and submit your facility for approval." },
];

export default function HospitalRegister() {
  const [track, setTrack] = useState("");
  return (
    <main className="bg-surface-page flex min-h-dvh flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/register" className="text-content-tertiary text-sm">← Back</Link>
        <h1 className="text-content-primary mt-4 text-2xl font-bold tracking-tight">Bring your hospital onto MedSync</h1>
        <p className="text-content-secondary mt-1 text-[15px]">Start with a quick note, or apply to onboard now.</p>

        <div className="mt-6">
          <RadioCards label="How would you like to start?" options={TRACKS} value={track} onChange={setTrack} />
        </div>

        {track === "interest" && <ExpressInterest />}
        {track === "apply" && <FullApplication />}
      </div>
    </main>
  );
}

// --- Track A: express interest (no account) ----------------------------------
function ExpressInterest() {
  const [f, setF] = useState({ facility: "", name: "", role: "", email: "", phone: "", district: "", note: "" });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const canSend = f.facility && f.name && /\S+@\S+\.\S+/.test(f.email);

  if (sent) {
    return (
      <div className="border-line-default bg-surface-primary mt-6 rounded-2xl border p-5 text-center">
        <span className="bg-brand-subtle text-brand-primary mx-auto grid h-12 w-12 place-items-center rounded-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        <p className="text-content-primary mt-3 font-semibold">Thanks — we’ve got it.</p>
        <p className="text-content-secondary mt-1 text-sm">We’ll reach out to {f.email} to walk {f.facility} through onboarding.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <TextInput label="Facility name" required value={f.facility} onChange={(e) => set("facility", e.target.value)} />
      <TextInput label="Your name" required value={f.name} onChange={(e) => set("name", e.target.value)} />
      <TextInput label="Your role" placeholder="e.g. Medical Director, IT Lead" value={f.role} onChange={(e) => set("role", e.target.value)} />
      <TextInput label="Email" required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
      <TextInput label="Phone" type="tel" inputMode="tel" placeholder="07XX XXX XXX" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
      <Combobox label="District" options={DISTRICTS} value={f.district} onChange={(v) => set("district", v)} />
      <TextInput label="Anything we should know?" hint="Optional." value={f.note} onChange={(e) => set("note", e.target.value)} />
      <button type="button" disabled={!canSend} onClick={() => setSent(true)}
        className="bg-brand-primary text-content-on-brand mt-2 h-12 rounded-full text-sm font-semibold disabled:opacity-50">Send</button>
      <p className="text-content-tertiary text-center text-xs">No account is created. We only use this to contact you.</p>
    </div>
  );
}

// --- Track B: full application (account + pending approval) -------------------
const STEPS = ["Account", "Facility", "Verification"] as const;

function FullApplication() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    first: "", surname: "", email: "", pw: "", pv: "",
    facility: "", officialEmail: "", officialPhone: "",
    district: "", subcounty: "", level: "", ownership: "", regNo: "",
  });
  const [licence, setLicence] = useState<File | null>(null);
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  const isLast = step === STEPS.length - 1;

  const canNext = useMemo(() => {
    if (step === 0) return f.first && f.surname && /\S+@\S+\.\S+/.test(f.email) && f.pw.length >= 8 && f.pw === f.pv;
    if (step === 1) return f.facility && f.officialEmail && f.district && f.subcounty && f.level && f.ownership;
    if (step === 2) return !!f.regNo && !!licence;
    return false;
  }, [step, f, licence]);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-primary" : "bg-line-default"}`} />
        ))}
      </div>
      <p className="text-content-tertiary mt-2 text-xs">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>

      <div className="mt-5 flex flex-col gap-4">
        {step === 0 && (
          <>
            <p className="text-content-secondary text-sm">Your account — you’ll be the facility’s first administrator.</p>
            <TextInput label="First name" required value={f.first} onChange={(e) => set("first", e.target.value)} />
            <TextInput label="Surname" required value={f.surname} onChange={(e) => set("surname", e.target.value)} />
            <TextInput label="Work email" required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
            <PasswordWithVerify value={f.pw} verify={f.pv} onChange={(v) => set("pw", v)} onVerifyChange={(v) => set("pv", v)} required />
          </>
        )}
        {step === 1 && (
          <>
            <TextInput label="Facility name" required value={f.facility} onChange={(e) => set("facility", e.target.value)} />
            <TextInput label="Official facility email" required type="email" value={f.officialEmail} onChange={(e) => set("officialEmail", e.target.value)} />
            <TextInput label="Official phone" type="tel" inputMode="tel" placeholder="07XX XXX XXX" value={f.officialPhone} onChange={(e) => set("officialPhone", e.target.value)} />
            <CascadingCombobox
              parentLabel="District" childLabel="Subcounty / division" required
              parentOptions={DISTRICTS} childOptionsByParent={SUBCOUNTIES}
              value={{ parent: f.district, child: f.subcounty }}
              onChange={(v) => setF((s) => ({ ...s, district: v.parent, subcounty: v.child }))}
            />
            <Select label="Facility level" required options={LEVELS} value={f.level} onChange={(v) => set("level", v)} placeholder="Select level" />
            <Segmented label="Ownership" required options={OWNERSHIP} value={f.ownership} onChange={(v) => set("ownership", v)} />
          </>
        )}
        {step === 2 && (
          <>
            <TextInput label="Facility registration / licence number" required value={f.regNo} onChange={(e) => set("regNo", e.target.value)} hint="Encrypted before it's stored." />
            <FileUpload label="Operating licence" required value={licence} onChange={setLicence} hint="Photo or PDF of your current facility licence. Stored privately, encrypted." />
            <div className="border-line-subtle bg-surface-secondary rounded-2xl border p-4">
              <p className="text-content-primary text-sm font-semibold">What happens next</p>
              <p className="text-content-secondary mt-1 text-sm">Your application is submitted for approval and reviewed by the MedSync team. It stays <strong>pending</strong> until approved — no facility data is live until then. You’ll be notified of the decision.</p>
            </div>
          </>
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
            className="bg-brand-primary text-content-on-brand h-12 rounded-full px-7 text-sm font-semibold disabled:opacity-50">Submit for approval</button>
        )}
      </div>
    </div>
  );
}
