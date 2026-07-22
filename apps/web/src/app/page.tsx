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
  { src: "/welcome/portrait-1.jpg", alt: "Illustrative portrait — a Ugandan doctor", cls: "z-10 mt-6 h-60 w-28 sm:h-72 sm:w-32" },
  { src: "/welcome/portrait-2.jpg", alt: "Illustrative portrait — a Ugandan nurse", cls: "z-20 h-64 w-28 sm:h-80 sm:w-32" },
  { src: "/welcome/portrait-3.jpg", alt: "Illustrative portrait — a community health worker", cls: "z-10 mt-12 h-56 w-28 sm:h-64 sm:w-32" },
];

export default function Welcome() {
  return (
    // Full-window app screen: a two-panel split that fills the viewport height.
    <main className="grid min-h-dvh w-full md:grid-cols-[1.05fr_0.95fr]">
      {/* LEFT — message + action */}
      <div className="bg-surface-primary flex flex-col justify-between px-8 py-10 sm:px-14 sm:py-14">
        <div>
          <Wordmark />
          <span className="bg-brand-accent mt-4 block h-1 w-16 rounded-full" aria-hidden="true" />
        </div>

        <div className="max-w-lg py-10">
          <p className="text-content-tertiary text-sm font-medium">👋 Welcome to MedSync</p>
          <h1 className="text-content-primary mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            A digital hospital that doesn&rsquo;t stop at the gate.
          </h1>
          <p className="text-content-secondary mt-5 max-w-md text-[15px]">
            One record for the whole hospital — wards, vitals, medications,
            appointments — that stays open after the patient goes home.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/get-started"
              className="neu-btn text-content-on-brand focus-visible:outline-brand-primary inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-[filter] hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Get started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/sign-in" className="text-content-secondary hover:text-content-primary text-sm font-medium">
              I already have an account
            </Link>
          </div>
        </div>

        <p className="text-content-tertiary text-xs">
          Built by and for Uganda&rsquo;s medical community.
        </p>
      </div>

      {/* RIGHT — pictorial section: a staggered portrait cluster of Uganda's
          medical community, with the honest onboarding card overlapping. */}
      <div className="bg-surface-tertiary flex flex-col justify-between px-8 py-10 sm:px-14 sm:py-14">
        <h2 className="text-content-primary max-w-[18ch] text-xl font-bold tracking-tight sm:text-2xl">
          Care that follows the patient home.
        </h2>

        <div className="relative py-8">
          {/* portrait cluster */}
          <div className="flex justify-center">
            {PORTRAITS.map((pt, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={pt.src}
                src={pt.src}
                alt={pt.alt}
                className={`bg-surface-secondary rounded-[20px] object-cover shadow-md ${pt.cls} ${i > 0 ? "-ml-5" : ""}`}
              />
            ))}
          </div>

          {/* honest onboarding card — overlaps ON TOP of the cluster (z-30) */}
          <div className="neu-float relative z-30 mx-auto mt-5 flex items-start gap-3 rounded-2xl p-4 sm:absolute sm:bottom-4 sm:left-0 sm:mt-0 sm:max-w-[15rem]">
            <span className="bg-brand-subtle text-brand-primary grid h-9 w-9 flex-none place-items-center rounded-xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-content-primary text-sm font-semibold">Now onboarding founding hospitals</p>
              <p className="text-content-secondary mt-0.5 text-xs">
                Kampala first — the founding cohort is open.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
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
