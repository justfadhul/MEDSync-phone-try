import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { Reveal } from "@/components/landing/reveal";
import {
  VitalsTrend,
  ThresholdBreach,
  StatusRow,
  CareAreaTiles,
  CareTeamFeed,
  Receipts,
  Horizons,
  IllustrativeChip,
} from "@/components/landing/fragments";

export const metadata: Metadata = {
  title: "MedSync — a hospital that doesn't stop at the gate",
  description:
    "MedSync is the operating system for Ugandan hospitals — one record that stays open after the patient goes home. Built for 3G, SMS, and mobile money.",
};

const ctaP =
  "inline-flex h-11 items-center justify-center rounded-md bg-brand-primary px-6 text-sm font-medium text-content-on-brand transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";
const ctaS =
  "inline-flex h-11 items-center justify-center rounded-md border border-line-strong bg-surface-primary px-6 text-sm font-medium text-content-primary transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-content-tertiary font-mono text-xs tracking-[0.14em] uppercase">{children}</p>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-content-primary font-display mt-3 max-w-[20ch] text-3xl font-medium tracking-tight sm:text-4xl">{children}</h2>;
}
function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-brand-primary italic">{children}</span>;
}

const LOOP = [
  ["Reading", "captured at home — on a shared phone, or written and sent by SMS."],
  ["Threshold", "checked against the limits this patient’s own clinician set."],
  ["Alert", "the right clinician is told when something crosses the line."],
  ["Care team", "sees the whole trajectory, not one number in isolation."],
  ["Intervention", "a call, a visit — and the next reading closes the loop."],
];
const REALS = [
  ["Works when the network doesn’t", "The clinician keeps charting; readings write locally and sync on reconnect.", "local-first cache · conflict-free sync"],
  ["Reaches the phone people have", "Reminders and reading requests travel as plain SMS and USSD to a basic handset.", "MTN · Airtel · Africa’s Talking"],
  ["Pays with the wallet on the phone", "Self-pay and pharmacy dispensing settle over mobile money.", "MTN MoMo · Airtel Money · NHIS-ready"],
  ["Data stays in Uganda", "Region-pinned infrastructure; cross-border transfer only with explicit authorisation.", "DPA 2019 · encrypted in transit & at rest"],
];
const ECO: [string, [string, string?][]][] = [
  ["Government & registries", [["MoH HMIS2", "DHIS2 reporting"], ["NIRA", "national ID"], ["NDA registries", "drug & practitioner"]]],
  ["Councils", [["UMDPC · UNMC · AHPC", "licence lookups"], ["Pharmacy Board of Uganda", "pharmacy regulation"]]],
  ["Networks & SMS", [["MTN · Airtel", "SMS / USSD / money"], ["Africa’s Talking", "aggregator"]]],
  ["Laboratories", [["Mulago central lab"], ["MBN · Lancet UG"], ["Regional referral labs"]]],
  ["Pharmacy & supply", [["NMS", "National Medical Stores"], ["JMS", "Joint Medical Store"], ["NDA-registered pharmacies"]]],
  ["Referral network", [["Mulago National"], ["Regional referral hospitals"], ["Mission hospitals", "Mengo · Nsambya · Lubaga"]]],
];
const FAQ = [
  ["Who is MedSync for?", "Ugandan hospitals up to national-referral scale, the clinicians in them, and the patients they keep caring for after discharge."],
  ["Is my data safe?", "Every record is role-gated, encrypted, and written to an audit trail that cannot be edited. Data stays in Uganda, under the Data Protection and Privacy Act (2019)."],
  ["Are you HIPAA / ISO 27001 / SOC 2 certified?", "No — those are work for a later quarter, and we won’t claim a badge we haven’t earned. What exists today is in the code, in the trust section above."],
  ["What happens when the internet goes down?", "The ward keeps working. Readings and notes write locally and sync when the connection returns; reminders still go out over SMS."],
  ["Why Uganda?", "Because that’s where the notebook was — and where a record that follows the patient home changes the most."],
];

export default function Landing() {
  return (
    <div id="top" className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        {/* Hero */}
        <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <Eyebrow>A digital hospital · Uganda</Eyebrow>
            <h1 className="text-content-primary font-display mt-4 text-5xl font-medium tracking-tight sm:text-6xl">
              Care that doesn’t stop <Accent>at the gate.</Accent>
            </h1>
            <p className="text-content-secondary mt-5 max-w-prose text-base">
              MedSync is the operating system for Ugandan hospitals — one record
              that stays open after the patient goes home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#waitlist" className={ctaP}>Join the waitlist</a>
              <a href="#the-loop" className={ctaS}>See how it works</a>
            </div>
          </div>
          <div className="relative pb-14 md:pb-0">
            <Reveal><StatusRow className="w-full max-w-xs md:ml-auto md:w-72" /></Reveal>
            <Reveal delay={140} className="mt-4 md:absolute md:-bottom-12 md:-left-4 md:mt-0">
              <VitalsTrend className="w-48 shadow-md" />
            </Reveal>
            <IllustrativeChip className="mt-4 md:absolute md:-top-3 md:right-0 md:mt-0" />
          </div>
        </section>

        {/* The gap */}
        <Reveal>
          <section id="the-gap" data-anchor className="border-line-subtle border-t py-16">
            <Eyebrow>The gap</Eyebrow>
            <H2>After discharge, the signal <Accent>goes dark.</Accent></H2>
            <p className="text-content-secondary mt-5 max-w-prose">
              A patient leaves the ward and the thread breaks. Home readings never
              reach the clinician who needs them, and medication routines quietly
              lapse — rarely from unwillingness, more often from distance, cost, and
              a network that drops. By the next appointment weeks of context are
              missing, and care restarts from a blank page.
            </p>
          </section>
        </Reveal>

        {/* The loop */}
        <section id="the-loop" data-anchor className="border-line-subtle scroll-mt-20 border-t py-16">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <H2>One continuous loop, <Accent>nothing lost</Accent> between visits.</H2>
          </Reveal>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <ol className="flex flex-col gap-3">
                {LOOP.map(([t, rest], i) => (
                  <li key={t} className="flex items-baseline gap-3">
                    <span className="text-brand-primary font-mono text-xs font-semibold tabular-nums">{i + 1}</span>
                    <span className="text-sm">
                      <span className="text-content-primary font-medium">{t}</span>{" "}
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

        {/* For hospitals — structural + areas + realities + ecosystem */}
        <section id="for-hospitals" data-anchor className="border-line-subtle border-t py-16">
          <Reveal>
            <Eyebrow>For hospitals</Eyebrow>
            <H2>A hospital operating system, <Accent>not just an app.</Accent></H2>
            <p className="text-content-secondary mt-5 max-w-prose">
              Post-discharge continuity is one module of MedSync. The same platform
              runs wards, vitals, medications, and appointments on one record and one
              permission model — adopt the piece you need now; the rest already speaks
              the same language.
            </p>
          </Reveal>
          <Reveal className="mt-8"><CareAreaTiles className="w-full" /></Reveal>

          <Reveal className="mt-14">
            <p className="text-content-primary font-display text-2xl font-medium tracking-tight">
              Made for the wards we <Accent>actually work in.</Accent>
            </p>
          </Reveal>
          <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {REALS.map(([h, p, tech]) => (
              <Reveal key={h} className="border-line-subtle border-t pt-4">
                <h3 className="text-content-primary text-base font-semibold">{h}</h3>
                <p className="text-content-secondary mt-1 text-sm">{p}</p>
                <p className="text-content-tertiary mt-2 font-mono text-[11px]">
                  <span className="text-content-tertiary/70 mr-2 tracking-wider uppercase">how</span>{tech}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14">
            <p className="text-content-primary font-display text-2xl font-medium tracking-tight">
              It plugs into the rails the country <Accent>already runs on.</Accent>
            </p>
            <p className="text-content-secondary mt-3 max-w-prose text-sm">
              A list of names, not a wall of logos — the systems MedSync is built to
              work with. Integration targets, not endorsements; not all live yet.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {ECO.map(([head, items]) => (
              <Reveal key={head}>
                <p className="text-content-tertiary border-line-subtle border-b pb-2 font-mono text-[10px] tracking-widest uppercase">{head}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {items.map(([name, sub]) => (
                    <li key={name}>
                      <span className="text-content-primary text-sm">{name}</span>
                      {sub && <span className="text-content-tertiary block text-xs italic">{sub}</span>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Trust */}
        <section id="trust" data-anchor className="border-line-subtle border-t py-16">
          <Reveal>
            <Eyebrow>Trust, built in</Eyebrow>
            <H2>We show the mechanism, <Accent>not a badge.</Accent></H2>
            <p className="text-content-secondary mt-5 max-w-prose">
              No certifications we haven’t earned. What we stand behind is in the code
              today — each control points at the file that implements it. Data is
              governed under Uganda’s Data Protection and Privacy Act (2019).
            </p>
          </Reveal>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <Reveal className="flex flex-col gap-2">
              <CareTeamFeed className="w-full" />
              <IllustrativeChip className="self-start" />
            </Reveal>
            <Reveal delay={120}><Receipts /></Reveal>
          </div>
        </section>

        {/* About — why + horizons */}
        <section id="about" data-anchor className="border-line-subtle border-t py-16">
          <Reveal>
            <Eyebrow>Why MedSync exists</Eyebrow>
            <blockquote className="text-content-primary font-display mt-4 max-w-2xl text-2xl font-medium tracking-tight sm:text-3xl">
              “A notebook held two months of warnings. <Accent>Nobody saw them.</Accent>”
            </blockquote>
            <p className="text-content-secondary mt-4 max-w-prose text-sm">
              MedSync started on the wards — home readings logged faithfully that no
              one was alerted to act on. It exists so no patient’s data sits silent
              while their health quietly slips away.
            </p>
            <p className="text-content-tertiary mt-3 font-mono text-xs">— Dr. Usama Fadhul · Co-founder &amp; Clinical Safety Officer</p>
          </Reveal>
          <Reveal className="mt-12">
            <p className="text-content-secondary mb-4 max-w-prose text-sm">What ships now, next, and what is genuinely research:</p>
            <Horizons />
          </Reveal>
        </section>

        {/* FAQ */}
        <Reveal>
          <section className="border-line-subtle border-t py-16">
            <Eyebrow>Questions</Eyebrow>
            <H2>Questions we keep getting asked.</H2>
            <div className="mt-8">
              {FAQ.map(([q, a]) => (
                <div key={q} className="border-line-subtle grid gap-2 border-t py-5 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
                  <p className="text-content-primary font-display text-lg font-medium">{q}</p>
                  <p className="text-content-secondary text-sm">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Join */}
        <Reveal>
          <section id="waitlist" data-anchor className="border-line-subtle scroll-mt-20 border-t py-16">
            <Eyebrow>Get started</Eyebrow>
            <H2>Be part of the first cohort.</H2>
            <p className="text-content-secondary mt-4 max-w-prose">
              We’re onboarding facilities and clinicians in stages. Leave your email —
              no commitment, and we’ll only write to you about getting started.
            </p>
            <div className="mt-6 max-w-md"><WaitlistForm /></div>
            <p className="text-content-tertiary mt-4 text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="text-content-link font-medium hover:underline">Sign in</a>.
            </p>
          </section>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
