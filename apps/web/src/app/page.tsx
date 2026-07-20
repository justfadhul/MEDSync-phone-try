import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { Reveal } from "@/components/landing/reveal";
import { HeroProof, IllustrativeChip } from "@/components/landing/fragments";

export const metadata: Metadata = {
  title: "MedSync — a digital hospital that doesn't stop at the gate",
  description:
    "MedSync is a digital hospital for Uganda — one record that stays open after the patient goes home. Built by and for Uganda's medical community.",
};

// Audience doors — the hero's primary CTA (no competing primary button). Each
// names the genuinely different next action. All three land on ONE honest
// holding route that acknowledges the role and opens the waitlist — no 404, no
// fake registration form. `d` is a single SVG path for the leading icon.
const DOORS: { as: string; label: string; sub: string; d: string }[] = [
  { as: "patient", label: "I'm a patient", sub: "Sign up — active immediately", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0" },
  { as: "clinician", label: "I'm a clinician", sub: "Sign up — approval-gated", d: "M6 3v6a5 5 0 0 0 10 0V3M8 21a3 3 0 0 0 6 0v-3M6 3H4m2 0h2m8 0h-2m2 0h2" },
  { as: "hospital", label: "I represent a hospital", sub: "Apply for a pilot", d: "M4 21V6l7-3 7 3v15M9 21v-4h4v4M9 9h.01M13 9h.01M9 13h.01M13 13h.01" },
];

function Logo() {
  return (
    <span className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
      <span className="bg-brand-primary text-content-on-brand grid h-7 w-7 place-items-center rounded-md">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M3 12h4l2 5 4-12 2 7h6" />
        </svg>
      </span>
      MedSync
    </span>
  );
}

// Minimal top bar — brand + one secondary action. Glass is allowed here (chrome,
// no body copy); the full nav is a later section. Solid fallback comes free from
// the .material-glass-nav utility.
function TopBar() {
  return (
    <header className="material-glass-nav sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" aria-label="MedSync home"><Logo /></Link>
        <Link
          href="/sign-in"
          className="text-content-secondary hover:text-content-primary text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

export default function Landing() {
  return (
    <div id="top" className="flex min-h-full flex-col">
      <TopBar />

      <main className="hero-wash flex-1">
        {/* Three ordered blocks. Mobile (single column): message → proof → doors,
            so the claim is proved before the choice. Desktop: message + doors in
            the left column, proof card on the right. */}
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 py-16 md:grid-cols-2 md:gap-x-16 md:gap-y-8 md:py-24">
          {/* A — message */}
          <div className="order-1 md:col-start-1 md:row-start-1 md:self-end">
            <span className="border-line-subtle bg-surface-primary text-content-secondary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
              <span className="bg-brand-primary h-1.5 w-1.5 rounded-full" aria-hidden="true" />
              Now onboarding founding hospitals
            </span>

            <h1 className="text-content-primary font-display mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
              A digital hospital that doesn&rsquo;t stop{" "}
              <span className="text-brand-primary italic">at the gate.</span>
            </h1>

            <p className="text-content-secondary mt-5 max-w-prose text-base">
              MedSync is a hospital operating system — from a rural health centre
              to a national referral hospital — and the one record it keeps stays
              open after the patient goes home.
            </p>
          </div>

          {/* B — proof */}
          <Reveal className="order-2 flex flex-col gap-3 md:col-start-2 md:row-span-2 md:row-start-1 md:items-end md:self-center">
            <HeroProof className="w-full max-w-sm" />
            <IllustrativeChip className="self-start md:self-end" />
          </Reveal>

          {/* C — doors + closing */}
          <div className="order-3 md:col-start-1 md:row-start-2 md:self-start">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              {DOORS.map((d) => (
                <Link
                  key={d.as}
                  href={`/get-started?as=${d.as}`}
                  className="group border-line-subtle bg-surface-primary hover:border-brand-primary focus-visible:outline-brand-primary flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-1 sm:flex-col sm:items-start sm:gap-2"
                >
                  <span className="bg-brand-subtle text-brand-primary grid h-8 w-8 flex-none place-items-center rounded-md">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d={d.d} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="text-content-primary group-hover:text-brand-primary block text-sm font-medium transition-colors">{d.label}</span>
                    <span className="text-content-tertiary block text-xs">{d.sub}</span>
                  </span>
                </Link>
              ))}
            </div>

            <p className="text-content-tertiary mt-6 text-sm">
              Built by and for Uganda&rsquo;s medical community.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
