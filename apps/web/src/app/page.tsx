import type { Metadata } from "next";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { Reveal } from "@/components/landing/reveal";
import {
  VitalsTrend,
  ThresholdBreach,
  StatusRow,
  CareAreaTiles,
  CareTeamFeed,
  IllustrativeChip,
} from "@/components/landing/fragments";

export const metadata: Metadata = {
  title: "MedSync — continuity of care, after the hospital gate",
  description:
    "MedSync keeps patients and their care teams connected after discharge: readings, reminders, and coordination on one record. A hospital operating system built for Ugandan facilities.",
};

const ctaPrimary =
  "inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium bg-brand-primary text-content-on-brand transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";
const ctaSecondary =
  "inline-flex h-11 items-center justify-center rounded-md border border-line-strong bg-surface-primary px-6 text-sm font-medium text-content-primary transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-content-tertiary font-mono text-xs tracking-[0.14em] uppercase">
      {children}
    </p>
  );
}

const LOOP = [
  ["Reading", "a glucose or blood-pressure reading, captured at home — on a shared phone if that’s what the household has."],
  ["Threshold", "checked against the limits this patient’s own clinician set, not a generic default."],
  ["Alert", "if it crosses the line, the right clinician is notified — no dashboard to sit and watch."],
  ["Care team", "sees the whole trajectory, not one number in isolation."],
  ["Intervention", "a call, an adjustment, a visit — and the next reading closes the loop."],
];

export default function Landing() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Without JS the reveal never fires; keep all content visible. */}
      <noscript>
        <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>
      {/* sticky, translucent, blurred nav */}
      <header className="sticky top-0 z-40 border-b border-line-subtle bg-[color-mix(in_srgb,var(--ms-surface-page)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
          <span className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
            <span className="bg-brand-primary text-content-on-brand grid h-7 w-7 place-items-center rounded-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M3 12h4l2 5 4-12 2 7h6" />
              </svg>
            </span>
            MedSync
          </span>
          <div className="flex items-center gap-4">
            <a href="/sign-in" className="text-content-secondary hover:text-content-primary text-sm font-medium">
              Sign in
            </a>
            <a href="#waitlist" className={`${ctaPrimary} h-9 px-4`}>
              Join waitlist
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        {/* 01 — Hero */}
        <section className="grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <Eyebrow>Continuity of care · Uganda</Eyebrow>
            <h1 className="text-content-primary mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Care shouldn&rsquo;t stop at the hospital gate.
            </h1>
            <p className="text-content-secondary mt-4 max-w-prose text-base">
              MedSync keeps patients and their care teams connected after
              discharge — the readings, reminders, and coordination that usually
              fall away the moment someone goes home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#waitlist" className={ctaPrimary}>Join the waitlist</a>
              <a href="#loop" className={ctaSecondary}>See how it works</a>
            </div>
          </div>
          {/* fragment cluster: F3 base, F1 overlapping (reflows to a stack on mobile) */}
          <div className="relative pb-14 md:pb-0">
            <Reveal>
              <StatusRow className="w-full max-w-xs md:ml-auto md:w-72" />
            </Reveal>
            <Reveal delay={140} className="mt-4 md:absolute md:-bottom-12 md:-left-4 md:mt-0">
              <VitalsTrend className="w-48 shadow-md" />
            </Reveal>
            <IllustrativeChip className="mt-4 md:absolute md:-top-3 md:right-0 md:mt-0" />
          </div>
        </section>

        {/* 02 — The gap */}
        <Reveal>
          <section className="border-line-subtle border-t py-16">
            <Eyebrow>The gap</Eyebrow>
            <h2 className="text-content-primary mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              After discharge, the signal goes dark.
            </h2>
            <p className="text-content-secondary mt-5 max-w-prose">
              A patient leaves the ward and the thread breaks. Home readings never
              reach the clinician who needs them, and medication routines quietly
              lapse — rarely from unwillingness, more often from distance, cost,
              and a network that drops. By the next appointment weeks of context
              are missing, and care restarts from a blank page. For the
              clinician, every consultation begins by reconstructing what happened
              in between — from memory and a paper card. For the patient, a small
              problem can grow quietly in that silence until it becomes an
              emergency. It is one gap wearing two faces: no monitoring between
              visits, and no support for staying on treatment. Where a patient may
              travel hours to reach a clinic, that lost context is not an
              inconvenience — it is the difference between catching something early
              and catching it too late.
            </p>
          </section>
        </Reveal>

        {/* 03 — The loop (the "one record" idea, exactly once) */}
        <section id="loop" className="border-line-subtle scroll-mt-20 border-t py-16">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-content-primary mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              One continuous loop, not a stack of disconnected visits.
            </h2>
            <p className="text-content-secondary mt-5 max-w-prose">
              MedSync closes the circle between a patient at home and the team
              responsible for them. Each step is recorded and attributed, so the
              record follows the patient — not the building they were last seen in.
              Nothing depends on one person remembering to check: the system
              watches the numbers so the team can watch the patient.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <ol className="flex flex-col gap-3">
                {LOOP.map(([title, rest], i) => (
                  <li key={title} className="flex items-baseline gap-3">
                    <span className="text-brand-primary font-mono text-xs font-semibold tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-sm">
                      <span className="text-content-primary font-medium">{title}</span>{" "}
                      <span className="text-content-secondary">— {rest}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="text-content-secondary mt-5 max-w-prose text-sm">
                In practice: a patient logs a high fasting glucose at home; it
                crosses the threshold their clinician set; the clinician sees it
                the same morning and adjusts the plan — days before the next
                appointment, instead of weeks after a missed one.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-2">
              <ThresholdBreach className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
          </div>
        </section>

        {/* 04 — What it is, structurally */}
        <section className="border-line-subtle border-t py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Eyebrow>The bigger picture</Eyebrow>
              <h2 className="text-content-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                A hospital operating system, not just an app.
              </h2>
              <p className="text-content-secondary mt-5 max-w-prose">
                Post-discharge continuity is one module of MedSync. The same
                platform runs wards, vitals, medications, and appointments on one
                record and one permission model — a clinician sees their patients,
                a pharmacist sees medications, an administrator sees the ward, each
                governed by the same roles rather than a pile of disconnected
                tools. Adopt the piece you need now; the rest already speaks the
                same language, shares one staff directory, and writes to one source
                of truth. It is not a point solution that will need ripping out when
                the next need appears.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-2">
              <CareAreaTiles className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
          </div>
        </section>

        {/* 05 — Trust & governance (merged) */}
        <section className="border-line-subtle border-t py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <Reveal>
              <Eyebrow>Trust</Eyebrow>
              <h2 className="text-content-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Built for Ugandan facilities, governed accordingly.
              </h2>
              <p className="text-content-secondary mt-5 max-w-prose">
                MedSync fits how care runs here — shared devices, intermittent
                networks, an SMS fallback when data won&rsquo;t hold. Health data
                is governed under Uganda&rsquo;s Data Protection and Privacy Act
                (2019): role-based access, encryption in transit and at rest, and
                an append-only audit trail where every action carries an actor and
                a time. Professional roles are anchored to their registering
                bodies, so whoever acts on a record is who they say they are.
                Patients consent to who sees their data, and can see who has. The
                audit trail is append-only and tamper-evident — the same record
                that satisfies a regulator is the one that keeps a care team honest
                with each other. Data stays governed under Ugandan law, not a
                distant provider&rsquo;s terms of service.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {["DPPA 2019", "Role-based access", "Encrypted", "Audit trail", "Pharmacy Board of Uganda"].map(
                  (chip) => (
                    <li key={chip} className="border-line-subtle bg-surface-secondary text-content-secondary rounded-full border px-3 py-1 font-mono text-xs">
                      {chip}
                    </li>
                  ),
                )}
              </ul>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-2">
              <CareTeamFeed className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
          </div>
        </section>

        {/* 06 — Conversion */}
        <Reveal>
          <section id="waitlist" className="border-line-subtle scroll-mt-20 border-t py-16">
            <Eyebrow>Get started</Eyebrow>
            <h2 className="text-content-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Be part of the first cohort.
            </h2>
            <p className="text-content-secondary mt-4 max-w-prose">
              We&rsquo;re onboarding facilities and clinicians in stages. Leave
              your email and we&rsquo;ll reach out when a place opens — no
              commitment, and we&rsquo;ll only write to you about getting started.
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
        </Reveal>
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
