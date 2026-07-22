import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to MedSync",
  description:
    "MedSync — a digital hospital for Uganda. One record that stays open after the patient goes home. Now onboarding founding hospitals.",
};

// Splash / welcome screen for the desktop app, in the teal + Poppins
// "Startup House" style (IMG_8295 / IMG_8297). A neumorphic canvas with one
// floating two-panel surface: message + primary action on the left, an honest
// illustrative preview on the right. No fabricated social proof; the clinical
// no-dose rule still holds (a med tile shows name + time + adherence, no dose).

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

// Floating rounded-square icon tiles that hover around the surface (IMG_8295).
// Decorative only; hidden on small screens where they'd crowd the layout.
function FloatTile({ d, className }: { d: string; className?: string }) {
  return (
    <span className={`neu-float text-brand-primary pointer-events-none absolute z-20 hidden place-items-center rounded-2xl lg:grid ${className ?? ""}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
        <path d={d} />
      </svg>
    </span>
  );
}

// One illustrative preview tile (pastel wayfinding tone — decorative, never a
// clinical signal). Copy is sample data, marked as such on the cluster.
function PreviewTile({
  tone, label, value, meta,
}: { tone: string; label: string; value: string; meta: string }) {
  return (
    <div className={`${tone} flex flex-col gap-1 rounded-2xl p-4`}>
      <span className="text-content-secondary text-[11px] font-medium">{label}</span>
      <span className="text-content-primary text-sm font-semibold">{value}</span>
      <span className="text-content-tertiary text-[11px]">{meta}</span>
    </div>
  );
}

export default function Welcome() {
  return (
    <main className="splash-canvas flex min-h-full flex-1 items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-6xl">
        {/* floating decoration */}
        <FloatTile d="M12 21s-7-4.6-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 6c-2.2 4.4-9.2 9-9.2 9Z" className="-left-5 top-16 h-14 w-14 -rotate-6" />
        <FloatTile d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3Z" className="-right-6 top-8 h-16 w-16 rotate-6" />
        <FloatTile d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm0 0h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" className="-left-7 bottom-14 h-16 w-16 rotate-3" />
        <FloatTile d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9Z" className="-right-4 bottom-10 h-14 w-14 -rotate-6" />

        {/* main surface */}
        <div className="neu-surface relative z-10 grid overflow-hidden rounded-[28px] md:grid-cols-[1.08fr_0.92fr]">
          {/* LEFT — message + action */}
          <div className="flex flex-col p-8 sm:p-12">
            <div>
              <Wordmark />
              <span className="bg-brand-accent mt-4 block h-1 w-16 rounded-full" aria-hidden="true" />
            </div>

            <div className="mt-10 md:mt-14">
              <p className="text-content-tertiary text-sm font-medium">👋 Welcome to MedSync</p>
              <h1 className="text-content-primary mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                A digital hospital that doesn&rsquo;t stop at the gate.
              </h1>
              <p className="text-content-secondary mt-4 max-w-md text-[15px]">
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

            <p className="text-content-tertiary mt-auto pt-10 text-xs">
              Built by and for Uganda&rsquo;s medical community.
            </p>
          </div>

          {/* RIGHT — honest illustrative preview */}
          <div className="bg-surface-tertiary relative flex flex-col p-8 sm:p-10">
            <h2 className="text-content-primary max-w-[16ch] text-xl font-bold tracking-tight">
              Care that follows the patient home.
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <PreviewTile tone="bg-tint-sky" label="Home reading" value="Capillary glucose" meta="6.4 mmol/L · 06:05" />
              <PreviewTile tone="bg-tint-mint" label="Medication" value="Metformin · taken" meta="06:12 · confirmed" />
              <PreviewTile tone="bg-tint-lavender" label="Care team" value="Dr. K. reviewed" meta="results · 08:14" />
              <PreviewTile tone="bg-tint-peach" label="Next visit" value="Clinic follow-up" meta="in 12 days" />
            </div>

            {/* honest stat card — no fabricated count */}
            <div className="neu-float mt-5 flex items-start gap-3 rounded-2xl p-4">
              <span className="bg-brand-subtle text-brand-primary grid h-9 w-9 flex-none place-items-center rounded-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-content-primary text-sm font-semibold">Now onboarding founding hospitals</p>
                <p className="text-content-secondary mt-0.5 text-xs">
                  Kampala first — the founding cohort is open. Built for 3G, SMS, and mobile money.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="border-line-subtle text-content-tertiary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                <span className="bg-content-tertiary h-1 w-1 rounded-full" />
                Illustrative · sample data
              </span>
              <Wordmark className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
