import type { Metadata } from "next";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import {
  ContinuityLine,
  BrokenLine,
  LoopDiagram,
} from "@/components/landing/visuals";

export const metadata: Metadata = {
  title: "MedSync — continuity of care, after the hospital gate",
  description:
    "MedSync keeps patients and their care teams connected after discharge: readings, reminders, and coordination in one continuous loop. Built for Ugandan facilities.",
};

const cta =
  "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-content-tertiary font-mono text-xs tracking-[0.14em] uppercase">
      {children}
    </p>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-full flex-col">
      {/* header */}
      <header className="border-line-subtle border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
            <span className="bg-brand-primary text-content-on-brand grid h-7 w-7 place-items-center rounded-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M3 12h4l2 5 4-12 2 7h6" />
              </svg>
            </span>
            MedSync
          </span>
          <a href="/sign-in" className="text-content-secondary hover:text-content-primary text-sm font-medium">
            Sign in
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        {/* 01 — Hero */}
        <section className="grid items-center gap-8 py-16 sm:py-24 md:grid-cols-2">
          <div>
            <Eyebrow>Continuity of care · Uganda</Eyebrow>
            <h1 className="text-content-primary mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Care shouldn&rsquo;t stop at the hospital gate.
            </h1>
            <p className="text-content-secondary mt-4 max-w-prose text-base sm:text-lg">
              MedSync keeps patients and their care teams connected after
              discharge — the readings, reminders, and coordination that usually
              fall away the moment someone goes home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#waitlist" className={`${cta} bg-brand-primary text-content-on-brand hover:bg-brand-primary-hover`}>
                Join the waitlist
              </a>
              <a href="#loop" className={`${cta} border-line-strong bg-surface-primary text-content-primary hover:bg-surface-secondary border`}>
                See how it works
              </a>
            </div>
          </div>
          <div className="text-content-primary">
            <ContinuityLine />
          </div>
        </section>

        {/* 02 — The gap */}
        <section className="border-line-subtle border-t py-16">
          <Eyebrow>The gap</Eyebrow>
          <h2 className="text-content-primary mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            After discharge, the signal goes dark.
          </h2>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
            <p className="text-content-secondary max-w-prose">
              A patient leaves the ward and the thread breaks. The home glucose
              reading that should reach a clinician never arrives. The medication
              routine quietly lapses — rarely from unwillingness, more often from
              distance, cost, and a network that drops. Warning signs that could
              be caught early are noticed late, and by the next appointment weeks
              of context are missing. For the clinician, every consultation
              starts by reconstructing what happened in between — from memory and
              a paper card. For the patient, a small problem can grow quietly in
              that silence until the next visit — or until it becomes an
              emergency. It is one gap wearing two faces: no monitoring between
              visits, and no support for staying on treatment.
            </p>
            <div className="text-content-primary">
              <BrokenLine />
            </div>
          </div>
        </section>

        {/* 03 — The loop (signature; the "one record" idea, exactly once) */}
        <section id="loop" className="border-line-subtle scroll-mt-20 border-t py-16">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-content-primary mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            One continuous loop, not a stack of disconnected visits.
          </h2>
          <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-8">
            <div>
              <p className="text-content-secondary max-w-prose">
                MedSync closes the circle between a patient at home and the team
                responsible for them. Each step is recorded and attributed, so the
                record follows the patient — not the building they were last seen
                in.
              </p>
              <p className="text-content-secondary mt-4 max-w-prose">
                The result is fewer surprises at the next visit, and decisions
                made on a full trajectory rather than a single reading in
                isolation.
              </p>
              <p className="text-content-secondary mt-4 max-w-prose">
                In practice: a patient logs a high fasting glucose at home; it
                crosses the threshold their clinician set; the clinician sees it
                the same morning and adjusts the plan — the same day, not weeks
                later at a rescheduled appointment.
              </p>
            </div>
            <div className="border-line-subtle bg-surface-primary rounded-lg border p-5 shadow-sm">
              <LoopDiagram />
            </div>
          </div>
        </section>

        {/* 04 — Trust & context (merged) */}
        <section className="border-line-subtle border-t py-16">
          <Eyebrow>Built for here</Eyebrow>
          <h2 className="text-content-primary mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Designed for Ugandan facilities — and the people in them.
          </h2>
          <p className="text-content-secondary mt-6 max-w-prose">
            MedSync fits how care actually runs: shared devices, intermittent
            networks, and an SMS fallback for when data won&rsquo;t hold. Health
            data is governed under Uganda&rsquo;s Data Protection and Privacy Act
            (2019) — held for the patient, visible to their care team, and never
            sold. Professional roles are anchored to their registering bodies, so
            whoever acts on a record is who they say they are. Nothing essential
            depends on a permanent connection: when the network drops, medication
            reminders still go out over SMS, and home readings sync as soon as a
            signal returns. It works on the phones people already carry.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {["DPPA 2019", "Pharmacy Board of Uganda", "SMS-first", "Role-verified access"].map(
              (chip) => (
                <li
                  key={chip}
                  className="border-line-subtle bg-surface-secondary text-content-secondary rounded-full border px-3 py-1 font-mono text-xs"
                >
                  {chip}
                </li>
              ),
            )}
          </ul>
          <p className="text-content-tertiary mt-6 max-w-prose text-sm">
            Longer term, MedSync is researching continuous telemetry for
            implantable devices — strictly as an advisory layer for care teams,
            never as the device itself and never in the dosing decision.
          </p>
        </section>

        {/* 05 — Conversion */}
        <section id="waitlist" className="border-line-subtle scroll-mt-20 border-t py-16">
          <Eyebrow>Get started</Eyebrow>
          <h2 className="text-content-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Be part of the first cohort.
          </h2>
          <p className="text-content-secondary mt-4 max-w-prose">
            We&rsquo;re onboarding facilities and clinicians in stages. Leave your
            email and we&rsquo;ll reach out when a place opens — no commitment, and
            we&rsquo;ll only write to you about getting started.
          </p>
          <div className="mt-6 max-w-md">
            <WaitlistForm />
          </div>
          <p className="text-content-tertiary mt-4 text-sm">
            Already have an account?{" "}
            <a href="/sign-in" className="text-content-link font-medium hover:underline">
              Sign in
            </a>
            .
          </p>
        </section>
      </main>

      {/* footer */}
      <footer className="border-line-subtle border-t">
        <div className="text-content-tertiary mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-content-secondary font-medium">
              MedSync — a continuous record for continuous care.
            </span>
            <nav className="flex gap-5">
              <a href="#loop" className="hover:text-content-primary">How it works</a>
              <a href="/sign-in" className="hover:text-content-primary">Sign in</a>
              <a href="/privacy" className="hover:text-content-primary">Privacy</a>
            </nav>
          </div>
          <p className="max-w-prose">
            MedSync provides telemetry and advisory intelligence to care teams. It
            is not a medical device and plays no part in dosing decisions. Health
            data is handled under Uganda&rsquo;s Data Protection and Privacy Act
            (2019); pharmacy regulation falls under the Pharmacy Board of Uganda.
          </p>
          <span>© 2026 MedSync.</span>
        </div>
      </footer>
    </div>
  );
}
