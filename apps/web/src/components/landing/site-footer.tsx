// Footer skeleton. Legal status is honest: Privacy/Terms are shown as
// "in legal review" (unlinked) rather than pointing at nothing. Council chips
// are STANDARDS MedSync is built to meet — not endorsements, not partnerships.
// The pharmacy regulator is the Pharmacy Board of Uganda.
const COLUMNS: [string, [string, string | null][]][] = [
  ["Platform", [["The loop", "#the-loop"], ["For hospitals", "#for-hospitals"], ["Trust", "#trust"]]],
  ["Company", [["About", "#about"], ["The gap", "#the-gap"], ["Join the waitlist", "#waitlist"]]],
  ["Legal", [["Privacy — in legal review", null], ["Terms — in legal review", null], ["Data Protection Act 2019", null]]],
];

const COUNCILS = ["UMDPC", "UNMC", "AHPC", "Pharmacy Board of Uganda"];

export function SiteFooter() {
  return (
    <footer className="border-line-subtle border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <span className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
            <span className="bg-brand-primary text-content-on-brand grid h-7 w-7 place-items-center rounded-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M3 12h4l2 5 4-12 2 7h6" />
              </svg>
            </span>
            MedSync
          </span>
          <p className="text-content-tertiary mt-3 max-w-xs text-sm">
            A hospital operating system for Uganda — one record that stays open
            after the patient goes home.
          </p>
        </div>
        {COLUMNS.map(([heading, links]) => (
          <div key={heading}>
            <p className="text-content-tertiary font-mono text-[11px] tracking-wider uppercase">{heading}</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {links.map(([label, href]) => (
                <li key={label}>
                  {href ? (
                    <a href={href} className="text-content-secondary hover:text-content-primary text-sm">{label}</a>
                  ) : (
                    <span className="text-content-tertiary text-sm">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-line-subtle border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8">
          <div>
            <p className="text-content-tertiary font-mono text-[11px] tracking-wider uppercase">
              Built to meet the standards of
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {COUNCILS.map((c) => (
                <li key={c} className="border-line-subtle text-content-secondary rounded border px-2.5 py-1 font-mono text-xs">
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-content-tertiary mt-2 text-xs italic">
              Standards MedSync is built to meet — not endorsements, not partnerships.
            </p>
          </div>
          <p className="text-content-tertiary max-w-prose text-xs">
            Sample data on this page is fictional — no real patients, no real
            identifiers. MedSync provides telemetry and advisory intelligence; it
            is not a medical device and plays no part in dosing decisions.
          </p>
          <span className="text-content-tertiary text-xs">© 2026 MedSync · Kampala, Uganda.</span>
        </div>
      </div>
    </footer>
  );
}
