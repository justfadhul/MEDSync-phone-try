import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to MedSync",
  description:
    "MedSync — a digital hospital for Uganda. One record that stays open after the patient goes home. Now onboarding founding hospitals.",
};

// Splash / welcome screen for the desktop app, in the teal + Poppins
// "Startup House" style (IMG_8295 / IMG_8297). A neumorphic canvas with one
// floating two-panel surface: message + primary action on the left, a pictorial
// section (portrait cluster + honest onboarding card) on the right. Photos are
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

// The pictorial cluster (IMG_8295): three staggered portraits of Uganda's
// medical community. SVG placeholders ship in /public/welcome — replace each
// file with a realistic image (see the generation prompts) and, if you export
// as .jpg, update the extension here. The centre card sits tallest and in front.
const PORTRAITS = [
  { src: "/welcome/portrait-1.svg", alt: "Illustrative portrait — a Ugandan doctor", cls: "z-10 mt-5 h-56 w-24 sm:h-64 sm:w-28" },
  { src: "/welcome/portrait-2.svg", alt: "Illustrative portrait — a Ugandan nurse", cls: "z-20 h-60 w-24 sm:h-72 sm:w-28" },
  { src: "/welcome/portrait-3.svg", alt: "Illustrative portrait — a community health worker", cls: "z-10 mt-10 h-52 w-24 sm:h-60 sm:w-28" },
];

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

          {/* RIGHT — pictorial section (IMG_8295): a staggered portrait cluster
              of Uganda's medical community, with the honest onboarding card
              overlapping. Photos are illustrative brand imagery (swap the SVG
              placeholders in /public/welcome for realistic images). */}
          <div className="bg-surface-tertiary relative flex flex-col p-8 sm:p-10">
            <h2 className="text-content-primary max-w-[16ch] text-xl font-bold tracking-tight">
              Care that follows the patient home.
            </h2>

            <div className="relative mt-8 grow">
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

              {/* honest onboarding card — overlaps ON TOP of the cluster (z-30),
                  no fabricated count */}
              <div className="neu-float relative z-30 mt-5 flex items-start gap-3 rounded-2xl p-4 md:absolute md:-bottom-3 md:left-0 md:mt-0 md:max-w-[14rem]">
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

            <div className="mt-6 flex items-center justify-between">
              <span className="border-line-subtle text-content-tertiary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                <span className="bg-content-tertiary h-1 w-1 rounded-full" />
                Illustrative imagery
              </span>
              <Wordmark className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
