import { F8_HORIZONS } from "@/lib/landing-fixtures";

// F8 — horizons. Now / Next / Research, honestly separated. The research column
// is labelled as research (never a product line, never a dose value). Neutral +
// brand only.
export function Horizons({ className }: { className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-3 ${className ?? ""}`}>
      {F8_HORIZONS.map((col) => (
        <div key={col.when} className="border-line-subtle bg-surface-primary flex flex-col gap-3 rounded-lg border p-5">
          <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
            {col.when}
          </span>
          <ul className="flex flex-col gap-2">
            {col.items.map((item) => (
              <li key={item} className="text-content-secondary flex gap-2 text-sm">
                <span className="bg-brand-primary mt-1.5 h-1 w-1 flex-none rounded-full" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          {col.research && (
            <span className="text-content-tertiary mt-auto text-[11px] italic">
              Research only — subject to ethics &amp; regulatory review.
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
