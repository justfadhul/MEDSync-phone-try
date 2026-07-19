"use client";

import { useEffect, useState } from "react";

// Announcement bar (glass, dismissible) + sticky nav (transparent at top,
// glass on scroll) + a SOLID mobile sheet under md. Glass comes only from the
// .material-glass-nav utility (token-driven, with @supports / reduced-
// transparency fallbacks) — never an inline backdrop-filter. Nav items are
// on-page anchors, not routes.
const NAV = [
  ["The gap", "#the-gap"],
  ["The loop", "#the-loop"],
  ["For hospitals", "#for-hospitals"],
  ["Trust", "#trust"],
  ["About", "#about"],
];

const cta =
  "inline-flex h-9 items-center justify-center rounded-md bg-brand-primary px-4 text-sm font-medium text-content-on-brand transition-colors hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

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

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [announce, setAnnounce] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // setScrolled is only ever called inside the handler — never synchronously
    // in the effect body — so the initial (top-of-page) state stands.
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => setAnnounce(false);

  return (
    <>
      {announce && (
        <div className="material-glass-nav relative z-40 text-center">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-6 py-2 text-sm">
            <p className="text-content-secondary">
              MedSync is onboarding its first hospital cohort in Kampala.{" "}
              <a href="#for-hospitals" className="text-content-link font-medium hover:underline">
                See where we are →
              </a>
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="text-content-tertiary hover:text-content-primary absolute right-4 top-1/2 -translate-y-1/2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-50 transition-colors ${scrolled ? "material-glass-nav" : "border-b border-transparent"}`}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <a href="#top" aria-label="MedSync home"><Logo /></a>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="text-content-secondary hover:text-content-primary text-sm font-medium">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a href="/sign-in" className="text-content-secondary hover:text-content-primary text-sm font-medium">Sign in</a>
            <a href="#waitlist" className={cta}>Join the waitlist</a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="text-content-primary md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
          </button>
        </div>
      </header>

      {/* mobile sheet — SOLID (surface-page), never glass */}
      {open && (
        <div className="bg-surface-page fixed inset-0 z-[60] flex flex-col px-6 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="text-content-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="text-content-primary text-2xl font-medium tracking-tight">
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pb-6">
            <a href="/sign-in" onClick={() => setOpen(false)} className="text-content-secondary text-center text-sm font-medium">Sign in</a>
            <a href="#waitlist" onClick={() => setOpen(false)} className={`${cta} h-11`}>Join the waitlist</a>
          </div>
        </div>
      )}
    </>
  );
}
