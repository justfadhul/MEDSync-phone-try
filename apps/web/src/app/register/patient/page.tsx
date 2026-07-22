"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  TextInput, DateInput, Select, Combobox, RadioCards, PasswordWithVerify, type Option,
} from "@/components/forms";

// Patient registration (Gate O.3). Phone-centric, dropdown-first, and NEVER
// gated behind choosing a hospital. Multi-step so a long form on a mobile
// network can draft-save (onboarding_drafts, 0007). Identity fields (NIN, DOB,
// names, phone) are encrypted server-side before write; submission goes through
// the registration Edge Function (Zod -> auth -> role -> PII-safe log -> audit
// -> encrypt -> write) — wired when the Supabase project is linked.
//
// NOTE: reference options below are an inline placeholder. In the linked
// project they come from the O.1 reference tables (facilities/districts) via a
// server query — this is the "selectable data, least typing" spine.
const HOSPITALS: Option[] = [
  { value: "mulago_nrh", label: "Mulago National Referral Hospital" },
  { value: "nsambya", label: "Nsambya Hospital" },
  { value: "mengo", label: "Mengo Hospital" },
];
const GENDER: Option[] = [
  { value: "female", label: "Female" }, { value: "male", label: "Male" },
  { value: "other", label: "Other" }, { value: "undisclosed", label: "Prefer not to say" },
];
const CARE: Option[] = [
  { value: "yes", label: "Yes, at a hospital", hint: "We'll route a link request to that hospital to verify — you're not linked automatically." },
  { value: "self", label: "No — I want to self-monitor", hint: "Straight to your dashboard." },
  { value: "soon", label: "Not yet, but about to visit", hint: "A soft association, no verified link yet." },
];
const CONSENTS = [
  { key: "platform_terms", label: "I accept the platform terms." },
  { key: "data_processing", label: "I consent to my data being processed to provide care." },
  { key: "data_sharing", label: "I consent to sharing my data with my care team." },
] as const;

const STEPS = ["Account", "Identity", "Care", "Consent"] as const;

export default function PatientRegister() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState({
    first: "", surname: "", phone: "", email: "", pw: "", pv: "",
    nin: "", dob: "", gender: "", care: "", hospital: "", mrn: "",
  });
  const [consent, setConsent] = useState<Record<string, boolean>>({});
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const canNext = useMemo(() => {
    if (step === 0) return f.first && f.surname && f.phone && f.pw.length >= 8 && f.pw === f.pv;
    if (step === 1) return f.nin && f.dob && f.gender;
    if (step === 2) return f.care && (f.care === "self" || f.hospital);
    if (step === 3) return CONSENTS.every((c) => consent[c.key]);
    return false;
  }, [step, f, consent]);

  return (
    <main className="bg-surface-page flex min-h-dvh flex-col items-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/register" className="text-content-tertiary text-sm">← Back</Link>
        <h1 className="text-content-primary mt-4 text-2xl font-bold tracking-tight">Create your patient account</h1>

        {/* progress */}
        <div className="mt-5 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-primary" : "bg-line-default"}`} />
          ))}
        </div>
        <p className="text-content-tertiary mt-2 text-xs">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>

        <div className="mt-6 flex flex-col gap-4">
          {step === 0 && (
            <>
              <TextInput label="First name" required value={f.first} onChange={(e) => set("first", e.target.value)} />
              <TextInput label="Surname" required value={f.surname} onChange={(e) => set("surname", e.target.value)} />
              <TextInput label="Phone" required type="tel" inputMode="tel" placeholder="07XX XXX XXX" hint="We'll send a one-time code by SMS." value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              <TextInput label="Email" type="email" hint="Optional." value={f.email} onChange={(e) => set("email", e.target.value)} />
              <PasswordWithVerify value={f.pw} verify={f.pv} onChange={(v) => set("pw", v)} onVerifyChange={(v) => set("pv", v)} required />
            </>
          )}
          {step === 1 && (
            <>
              <TextInput label="National ID (NIN)" required value={f.nin} onChange={(e) => set("nin", e.target.value)} hint="Encrypted before it's stored." />
              <DateInput label="Date of birth" required value={f.dob} onChange={(e) => set("dob", e.target.value)} />
              <Select label="Gender" required options={GENDER} value={f.gender} onChange={(v) => set("gender", v)} />
            </>
          )}
          {step === 2 && (
            <>
              <RadioCards label="Are you currently a patient at a hospital?" required options={CARE} value={f.care} onChange={(v) => set("care", v)} />
              {(f.care === "yes" || f.care === "soon") && (
                <Combobox label="Which hospital?" required options={HOSPITALS} value={f.hospital} onChange={(v) => set("hospital", v)} />
              )}
              {f.care === "yes" && (
                <TextInput label="Medical record number (MRN)" hint="If you know it — optional." value={f.mrn} onChange={(e) => set("mrn", e.target.value)} />
              )}
            </>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-2.5">
              {CONSENTS.map((c) => (
                <button key={c.key} type="button" aria-pressed={!!consent[c.key]}
                  onClick={() => setConsent((s) => ({ ...s, [c.key]: !s[c.key] }))}
                  className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${consent[c.key] ? "border-brand-primary bg-brand-subtle" : "border-line-default bg-surface-primary"}`}>
                  <span className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border ${consent[c.key] ? "border-brand-primary bg-brand-primary text-content-on-brand" : "border-line-strong"}`}>
                    {consent[c.key] && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-3 w-3" aria-hidden="true"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                  <span className="text-content-primary text-sm">{c.label}</span>
                </button>
              ))}
              <p className="text-content-tertiary mt-1 text-xs">Each consent is recorded separately and can be reviewed later.</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="text-content-secondary text-sm font-medium">← Back</button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button type="button" disabled={!canNext} onClick={() => setStep((s) => s + 1)}
              className="bg-brand-primary text-content-on-brand h-12 rounded-full px-7 text-sm font-semibold disabled:opacity-50">Continue</button>
          ) : (
            <button type="button" disabled={!canNext}
              className="bg-brand-primary text-content-on-brand h-12 rounded-full px-7 text-sm font-semibold disabled:opacity-50">Create account</button>
          )}
        </div>
      </div>
    </main>
  );
}
