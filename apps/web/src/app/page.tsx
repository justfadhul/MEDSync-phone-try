import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to MedSync",
  description:
    "MedSync — a digital hospital for Uganda. One record that stays open after the patient goes home. Now onboarding founding hospitals.",
};

// Welcome screen for the desktop app, in the teal + Poppins "Startup House"
// style (IMG_8297). A full-window two-panel screen — message + primary action
// on the left, a pictorial section (portrait cluster + honest onboarding card)
// on the right. The Dribbble mockup's soft canvas and floating icons were only
// presentation framing, so they are intentionally omitted. Photos are
// illustrative brand imagery; the onboarding card states no fabricated count.

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`text-content-primary flex items-center gap-2 font-semibold tracking-tight ${className ?? ""}`}>
      <span className="bg-brand-primary text-content-on-brand grid h-7 w-7 place-items-center rounded-lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M3 12h4l2 5 4-12 2 7h6" />
        </svg>
      </span>
      MedSync
    </span>
  );
}

// The pictorial cluster (IMG_8295): three staggered portraits of Uganda's
// medical community. Files live in /public/welcome. The centre card sits
// tallest and in front.
const PORTRAITS = [
  { src: "/welcome/portrait-1.jpg", alt: "Illustrative portrait — a Ugandan doctor", cls: "z-10 mt-8 h-72 w-32 sm:h-[24rem] sm:w-40 lg:h-[26rem] lg:w-44" },
  { src: "/welcome/portrait-2.jpg", alt: "Illustrative portrait — a Ugandan nurse", cls: "z-20 h-80 w-32 sm:h-[26rem] sm:w-40 lg:h-[30rem] lg:w-44" },
  { src: "/welcome/portrait-3.jpg", alt: "Illustrative portrait — a community health worker", cls: "z-10 mt-16 h-64 w-32 sm:h-[22rem] sm:w-40 lg:h-[24rem] lg:w-44" },
];

// Real, load-bearing capabilities — a compact row that fills the left panel and
// says what MedSync actually does (built for how Uganda's phones and money work).
const FEATURES: { label: string; d: string }[] = [
  { label: "Works offline", d: "M5 12.5 10 17l9-10M4 20h16" },
  { label: "SMS reminders", d: "M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9Z" },
  { label: "Mobile money", d: "M2 8h20M2 8v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8M2 8l2-3h16l2 3M7 13h4" },
];

export default function Welcome() {
  return (
    // Full-window app screen: a two-panel split that fills the viewport height.
    <main className="grid min-h-dvh w-full md:grid-cols-[1.05fr_0.95fr]">
      {/* LEFT — message + action */}
      <div className="bg-surface-primary flex flex-col justify-between px-8 py-10 sm:px-14 sm:py-14">
        <div className="rise">
          <Wordmark />
          <span className="bg-brand-accent accent-sweep mt-4 block h-1 w-16 rounded-full" aria-hidden="true" />
        </div>

        <div className="max-w-xl py-10">
          <p className="rise text-content-tertiary text-base font-medium" style={{ animationDelay: "0.1s" }}>👋 Welcome to MedSync</p>
          <h1 className="rise text-content-primary mt-4 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.18s" }}>
            A digital hospital that doesn&rsquo;t stop at the gate.
          </h1>
          <p className="rise text-content-secondary mt-6 max-w-lg text-lg leading-relaxed" style={{ animationDelay: "0.26s" }}>
            One record for the whole hospital — wards, vitals, medications and
            appointments — that stays open after the patient goes home.
          </p>

          <div className="rise mt-10 flex flex-col gap-5 sm:flex-row sm:items-center" style={{ animationDelay: "0.34s" }}>
            <Link
              href="/get-started"
              className="neu-btn group text-content-on-brand focus-visible:outline-brand-primary inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold transition-[filter,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0"
            >
              Get started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/sign-in" className="text-content-secondary hover:text-content-primary text-[15px] font-medium transition-colors">
              I already have an account
            </Link>
          </div>

          <ul className="rise mt-12 flex flex-wrap gap-3" style={{ animationDelay: "0.42s" }}>
            {FEATURES.map((f) => (
              <li key={f.label} className="border-line-subtle text-content-secondary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary h-4 w-4" aria-hidden="true">
                  <path d={f.d} />
                </svg>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="rise text-content-tertiary text-sm" style={{ animationDelay: "0.5s" }}>
          Built by and for Uganda&rsquo;s medical community.
        </p>
      </div>

      {/* RIGHT — pictorial section: a staggered portrait cluster of Uganda's
          medical community, with the honest onboarding card overlapping. */}
      <div className="bg-surface-tertiary flex flex-col justify-between px-8 py-10 sm:px-14 sm:py-14">
        <h2 className="rise text-content-primary max-w-[16ch] text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl" style={{ animationDelay: "0.2s" }}>
          Care that follows the patient home.
        </h2>

        <div className="relative py-8">
          {/* portrait cluster — the whole group floats slowly; each card rises in
              on load and lifts on hover (hover transform lives on the img, so it
              stays independent of the wrapper's ambient float). */}
          <div className="float-slow flex justify-center">
            {PORTRAITS.map((pt, i) => (
              <span
                key={pt.src}
                className={`portrait-in bg-surface-secondary relative block overflow-hidden rounded-[20px] shadow-md ${pt.cls} ${i > 0 ? "-ml-5" : ""}`}
                style={{ animationDelay: `${0.4 + i * 0.12}s` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pt.src}
                  alt={pt.alt}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.05]"
                />
              </span>
            ))}
          </div>

          {/* honest onboarding card — overlaps ON TOP of the cluster (z-30) */}
          <div className="neu-float rise relative z-30 mx-auto mt-6 flex items-start gap-3 rounded-2xl p-5 sm:absolute sm:bottom-6 sm:left-0 sm:mt-0 sm:max-w-[17rem]" style={{ animationDelay: "0.75s" }}>
            <span className="bg-brand-subtle text-brand-primary grid h-10 w-10 flex-none place-items-center rounded-xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-content-primary text-[15px] font-semibold">Now onboarding founding hospitals</p>
              <p className="text-content-secondary mt-1 text-sm">
                Kampala first — the founding cohort is open.
              </p>
            </div>
          </div>
        </div>

        <div className="rise flex items-center justify-between" style={{ animationDelay: "0.9s" }}>
          <span className="border-line-subtle text-content-tertiary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
            <span className="bg-content-tertiary h-1 w-1 rounded-full" />
            Illustrative imagery
          </span>
          <Wordmark className="text-xs" />
        </div>
      </div>
    </main>
  );
}
