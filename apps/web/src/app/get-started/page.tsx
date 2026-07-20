import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { WaitlistForm } from "@/components/landing/waitlist-form";

export const metadata: Metadata = {
  title: "Get started — MedSync",
  description:
    "MedSync is onboarding in stages. Tell us who you are and we'll write when the door opens for you.",
};

// Honest holding route. All three hero doors land here. It acknowledges the
// role, says plainly where registration stands, and offers the waitlist — no
// 404, and no registration form we can't yet honour. `as` is validated against
// a known set; anything else falls back to the neutral copy.
type Role = "patient" | "clinician" | "hospital";

const COPY: Record<Role, { eyebrow: string; heading: string; body: string; note: string }> = {
  patient: {
    eyebrow: "For patients",
    heading: "Your care will find you here.",
    body: "MedSync reaches patients through the hospital treating them — so a patient account opens once your facility comes online. It works on a basic phone, over SMS, no smartphone needed.",
    note: "Leave your email and we'll tell you the moment MedSync reaches a hospital near you.",
  },
  clinician: {
    eyebrow: "For clinicians",
    heading: "One record, on the ward and after.",
    body: "Clinician access opens as each facility joins the founding cohort. If your hospital is coming online, your account comes with it — nothing to install on the ward.",
    note: "Leave your email and we'll reach out as your facility is onboarded — or connect you with the team if you'd like to bring MedSync to it.",
  },
  hospital: {
    eyebrow: "For hospitals",
    heading: "Bring your hospital onto one platform.",
    body: "We're onboarding a small founding cohort of Ugandan hospitals now, one facility at a time so each goes live properly. Wards, vitals, medications, appointments, and post-discharge continuity on one record.",
    note: "Leave your email and the team will be in touch to talk through your facility.",
  },
};

const FALLBACK: (typeof COPY)[Role] = {
  eyebrow: "Get started",
  heading: "MedSync is opening in stages.",
  body: "We're onboarding Ugandan hospitals one at a time, and patients and clinicians come online as their facility does. There's no public sign-up yet — but there is a place in the queue.",
  note: "Leave your email and we'll write when the door opens for you.",
};

function resolve(as: string | string[] | undefined): (typeof COPY)[Role] {
  const key = Array.isArray(as) ? as[0] : as;
  if (key === "patient" || key === "clinician" || key === "hospital") return COPY[key];
  return FALLBACK;
}

export default async function GetStarted({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { as } = await searchParams;
  const c = resolve(as);

  return (
    <div className="flex min-h-full flex-col">
      <header className="material-glass-nav sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <Link href="/" aria-label="MedSync home" className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
            <span className="bg-brand-primary text-content-on-brand grid h-7 w-7 place-items-center rounded-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M3 12h4l2 5 4-12 2 7h6" />
              </svg>
            </span>
            MedSync
          </Link>
          <Link href="/" className="text-content-secondary hover:text-content-primary text-sm font-medium">
            ← Back
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-16 md:py-24">
        <p className="text-content-tertiary font-mono text-xs tracking-[0.14em] uppercase">{c.eyebrow}</p>
        <h1 className="text-content-primary font-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          {c.heading}
        </h1>
        <p className="text-content-secondary mt-5 text-base">{c.body}</p>

        <div className="border-line-subtle mt-8 border-t pt-8">
          <p className="text-content-secondary mb-4 text-sm">{c.note}</p>
          <WaitlistForm />
        </div>

        <p className="text-content-tertiary mt-8 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-content-link font-medium hover:underline">Sign in</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
