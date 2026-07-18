// Gate 0.2 token showcase. Every colour below is a SEMANTIC token class
// (bg-surface-*, text-content-*, border-line-*, bg-brand-*, text-status-*).
// No raw hex, no primitive, no default Tailwind palette — those are unavailable.

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div className="border-line-subtle overflow-hidden rounded-md border">
      <div className={`h-12 ${className}`} />
      <p className="text-content-secondary bg-surface-primary px-2 py-1 font-mono text-xs">
        {label}
      </p>
    </div>
  );
}

function StatusPill({
  label,
  dot,
  text,
}: {
  label: string;
  dot: string;
  text: string;
}) {
  return (
    <span className="border-line-subtle bg-surface-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <span className={text}>{label}</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <p className="text-content-tertiary font-mono text-xs">[02]</p>
      <h1 className="text-content-primary mt-1 text-3xl font-semibold tracking-tight">
        MedSync design tokens
      </h1>
      <p className="text-content-secondary mt-2 text-sm">
        Semantic tokens only. Monochrome + teal. Red is reserved for clinical
        emergencies.
      </p>

      <section className="mt-8">
        <h2 className="text-content-primary text-sm font-semibold">Surfaces</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Swatch label="surface-page" className="bg-surface-page" />
          <Swatch label="surface-primary" className="bg-surface-primary" />
          <Swatch label="surface-secondary" className="bg-surface-secondary" />
          <Swatch label="surface-tertiary" className="bg-surface-tertiary" />
          <Swatch label="surface-inverse" className="bg-surface-inverse" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-content-primary text-sm font-semibold">
          Brand / interactive
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Swatch label="brand-primary" className="bg-brand-primary" />
          <Swatch
            label="brand-primary-hover"
            className="bg-brand-primary-hover"
          />
          <Swatch label="brand-cta" className="bg-brand-cta" />
          <Swatch label="brand-subtle" className="bg-brand-subtle" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="bg-brand-primary hover:bg-brand-primary-hover text-content-on-brand h-11 rounded-md px-5 text-sm font-medium transition-colors"
          >
            Primary action
          </button>
          <button
            type="button"
            className="bg-brand-cta text-content-on-brand h-11 rounded-md px-5 text-sm font-medium"
          >
            Dark CTA
          </button>
          <button
            type="button"
            className="border-line-default text-content-primary hover:bg-surface-secondary h-11 rounded-md border px-5 text-sm font-medium transition-colors"
          >
            Secondary
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-content-primary text-sm font-semibold">
          Clinical status (the safety channel)
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusPill
            label="Stable"
            dot="bg-status-stable"
            text="text-status-stable"
          />
          <StatusPill
            label="Critical"
            dot="bg-status-critical"
            text="text-status-critical"
          />
          <StatusPill
            label="Caution"
            dot="bg-status-caution"
            text="text-status-caution"
          />
          <StatusPill
            label="Admitted"
            dot="bg-status-admitted"
            text="text-status-admitted"
          />
        </div>
        <p className="text-content-tertiary mt-3 text-xs">
          Only <span className="font-mono">status-critical</span> resolves to
          red. Form errors use{" "}
          <span className="text-feedback-error font-medium">amber</span>, not
          red.
        </p>
      </section>
    </main>
  );
}
