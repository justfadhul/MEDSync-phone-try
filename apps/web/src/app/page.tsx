import type { Metadata } from "next";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { Reveal } from "@/components/landing/reveal";
import {
  VitalsTrend,
  ThresholdBreach,
  StatusRow,
  CareAreaTiles,
  CareTeamFeed,
  OfflineSms,
  Receipts,
  Horizons,
  IllustrativeChip,
} from "@/components/landing/fragments";

export const metadata: Metadata = {
  title: "MedSync — a digital hospital that doesn't stop at the gate",
  description:
    "MedSync is the operating system for Ugandan hospitals — running the wards, supporting clinicians, and keeping the record open after patients go home.",
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

const DOORS = [
  ["For patients", "Your readings, reminders, and care team in one place."],
  ["For clinicians", "One record across every specialty — no note written twice."],
  ["For hospitals", "Run the wards and the wards-at-home on one platform."],
];

export default function Landing() {
  return (
    <div className="flex min-h-full flex-col">
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
            <a href="/sign-in" className="text-content-secondary hover:text-content-primary text-sm font-medium">Sign in</a>
            <a href="#waitlist" className={`${ctaPrimary} h-9 px-4`}>Join waitlist</a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        {/* 01 — Hero + audience doors */}
        <section className="py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <Eyebrow>A digital hospital · Uganda</Eyebrow>
              <h1 className="text-content-primary mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Care that doesn&rsquo;t stop at the hospital gate.
              </h1>
              <p className="text-content-secondary mt-4 max-w-prose text-base">
                MedSync is the operating system for Ugandan hospitals — running the
                wards, supporting clinicians, and keeping the record open after
                patients go home.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#waitlist" className={ctaPrimary}>Join the waitlist</a>
                <a href="#loop" className={ctaSecondary}>See how it works</a>
              </div>
            </div>
            <div className="relative pb-14 md:pb-0">
              <Reveal>
                <StatusRow className="w-full max-w-xs md:ml-auto md:w-72" />
              </Reveal>
              <Reveal delay={140} className="mt-4 md:absolute md:-bottom-12 md:-left-4 md:mt-0">
                <VitalsTrend className="w-48 shadow-md" />
              </Reveal>
              <IllustrativeChip className="mt-4 md:absolute md:-top-3 md:right-0 md:mt-0" />
            </div>
          </div>
          <Reveal>
            <ul className="mt-14 grid gap-3 sm:grid-cols-3">
              {DOORS.map(([title, line]) => (
                <li key={title}>
                  <a href="#waitlist" className="border-line-subtle bg-surface-primary hover:border-line-strong flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors">
                    <span className="text-content-primary text-sm font-semibold">{title}</span>
                    <span className="text-content-secondary text-xs">{line}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
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
              lapse — rarely from unwillingness, more often from distance, cost, and
              a network that drops. By the next appointment weeks of context are
              missing, and care restarts from a blank page. Where a patient may
              travel hours to reach a clinic, that lost context is the difference
              between catching something early and catching it too late. It is one
              gap wearing two faces: no monitoring between visits, and no support
              for staying on treatment.
            </p>
          </section>
        </Reveal>

        {/* 03 — The loop */}
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
            </p>
          </Reveal>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <ol className="flex flex-col gap-3">
                {LOOP.map(([title, rest], i) => (
                  <li key={title} className="flex items-baseline gap-3">
                    <span className="text-brand-primary font-mono text-xs font-semibold tabular-nums">{i + 1}</span>
                    <span className="text-sm">
                      <span className="text-content-primary font-medium">{title}</span>{" "}
                      <span className="text-content-secondary">— {rest}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-2">
              <ThresholdBreach className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
          </div>
        </section>

        {/* 04 — One record, every specialty */}
        <section className="border-line-subtle border-t py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Eyebrow>One record, every specialty</Eyebrow>
              <h2 className="text-content-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                The record adapts to the ward — not the other way around.
              </h2>
              <p className="text-content-secondary mt-5 max-w-prose">
                The same patient record follows the team using it. Diabetology sees
                glycaemic trends where cardiology sees rhythm; nephrology sees kidney
                function. Nothing is re-keyed at handover, and no specialty rebuilds
                what another already captured. Switch wards and the surface
                rearranges — the record underneath does not. Post-discharge
                continuity is simply one more module of the same platform.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-2">
              <CareAreaTiles className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
          </div>
        </section>

        {/* 05 — Built for Ugandan realities */}
        <section className="border-line-subtle border-t py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <Eyebrow>Built for here</Eyebrow>
              <h2 className="text-content-primary mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Designed for the wards we actually work in.
              </h2>
              <p className="text-content-secondary mt-5 max-w-prose">
                Load-shedding, fibre breaks, basic phones, patchy data — MedSync is
                built for them, not around them. The clinician keeps charting when the
                network drops; readings write locally and sync on reconnect. Reminders
                and glucose-reading requests reach a basic handset over SMS and USSD,
                and self-pay runs on mobile money. First paint is engineered for 3G,
                not a demo-room fibre line.
              </p>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-2">
              <OfflineSms className="w-full max-w-xs" />
              <IllustrativeChip className="self-start" />
            </Reveal>
          </div>
        </section>

        {/* 06 — Trust: engineering receipts */}
        <section className="border-line-subtle border-t py-16">
          <Reveal>
            <Eyebrow>Trust, built in</Eyebrow>
            <h2 className="text-content-primary mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              We show the mechanism, not a badge.
            </h2>
            <p className="text-content-secondary mt-5 max-w-prose">
              MedSync holds no certifications it hasn&rsquo;t earned. What it stands
              behind is in the code today — role-based access checked on every query,
              an audit trail that cannot be edited, encryption on sensitive fields, and
              authentication that revalidates rather than trusts a cookie. Each control
              points at the file that implements it. Data stays governed under
              Uganda&rsquo;s Data Protection and Privacy Act (2019); pharmacy regulation
              falls under the Pharmacy Board of Uganda.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <Reveal className="flex flex-col gap-2">
              <CareTeamFeed className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
            <Reveal delay={120}>
              <Receipts />
            </Reveal>
          </div>
        </section>

        {/* 07 — Why it exists */}
        <Reveal>
          <section className="border-line-subtle border-t py-16">
            <Eyebrow>Why MedSync exists</Eyebrow>
            <blockquote className="text-content-primary mt-4 max-w-2xl text-xl font-medium tracking-tight sm:text-2xl">
              &ldquo;A patient&rsquo;s notebook held two months of warnings. Nobody
              saw them.&rdquo;
            </blockquote>
            <p className="text-content-secondary mt-4 max-w-prose text-sm">
              MedSync started on the wards — home readings logged faithfully that no
              one was alerted to act on. It exists so that no patient&rsquo;s data sits
              silent while their health quietly slips away.
            </p>
            <p className="text-content-tertiary mt-3 font-mono text-xs">
              — Dr. Usama Fadhul, co-founder &amp; Clinical Safety Officer
            </p>
          </section>
        </Reveal>

        {/* 08 — Conversion + horizons */}
        <section id="waitlist" className="border-line-subtle scroll-mt-20 border-t py-16">
          <Reveal>
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
              <a href="/sign-in" className="text-content-link font-medium hover:underline">Sign in</a>.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <p className="text-content-secondary mb-4 max-w-prose text-sm">
              What ships now, what&rsquo;s next, and what is genuinely research —
              named as research, never a product line:
            </p>
            <Horizons />
          </Reveal>
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
            MedSync provides telemetry and advisory intelligence to care teams. It is
            not a medical device and plays no part in dosing decisions. Health data is
            handled under Uganda&rsquo;s Data Protection and Privacy Act (2019);
            pharmacy regulation falls under the Pharmacy Board of Uganda.
          </p>
          <span>© 2026 MedSync.</span>
        </div>
      </footer>
    </div>
  );
}
