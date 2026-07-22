import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create your MedSync account",
  description: "Register as a patient, as clinical or hospital staff, or on behalf of a hospital.",
};

// Intent selector (Gate O.2 §D.3): the three registration doors + unified sign
// in. Superadmin uses the same sign-in; the role unlocks the workspace after
// MFA, so there is no separate admin URL.
const DOORS: { as: string; label: string; sub: string; d: string }[] = [
  { as: "patient", label: "I'm a patient", sub: "For yourself or someone you care for", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0" },
  { as: "staff", label: "I'm clinical or hospital staff", sub: "Council-registered clinicians and support staff", d: "M6 3v6a5 5 0 0 0 10 0V3M8 21a3 3 0 0 0 6 0v-3M6 3H4m2 0h2m8 0h-2m2 0h2" },
  { as: "hospital", label: "I represent a hospital", sub: "Apply to bring your facility onto MedSync", d: "M4 21V6l7-3 7 3v15M9 21v-4h4v4M9 9h.01M13 9h.01M9 13h.01M13 13h.01" },
];

export default function Register() {
  return (
    <main className="bg-surface-page flex min-h-dvh flex-col items-center px-6 py-14">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="MedSync home" className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
          <span className="bg-brand-primary text-content-on-brand grid h-8 w-8 place-items-center rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M3 12h4l2 5 4-12 2 7h6" />
            </svg>
          </span>
          MedSync
        </Link>

        <h1 className="text-content-primary mt-10 text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-content-secondary mt-2 text-[15px]">How will you use MedSync?</p>

        <div className="mt-6 flex flex-col gap-3">
          {DOORS.map((d) => (
            <Link key={d.as} href={`/register/${d.as}`}
              className="group border-line-default bg-surface-primary hover:border-brand-primary focus-visible:outline-brand-primary flex items-center gap-4 rounded-2xl border px-4 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2">
              <span className="bg-brand-subtle text-brand-primary grid h-11 w-11 flex-none place-items-center rounded-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d={d.d} />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-content-primary block text-[15px] font-semibold">{d.label}</span>
                <span className="text-content-tertiary block text-xs">{d.sub}</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-content-tertiary group-hover:text-brand-primary h-5 w-5 flex-none transition-colors" aria-hidden="true">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>

        <p className="text-content-secondary mt-8 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-content-link font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
