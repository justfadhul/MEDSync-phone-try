import { Card } from "@/components/ui/card";
import { F6_OFFLINE } from "@/lib/landing-fixtures";

// F6 — offline-first. A reading saved with no signal, plus an SMS reminder that
// reaches a basic phone. Brand + neutral only; no dose, no status colours.
export function OfflineSms({ className }: { className?: string }) {
  const { reading, savedNote, sms } = F6_OFFLINE;
  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
          {reading.label}
        </span>
        <span className="text-content-tertiary inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3" aria-hidden="true">
            <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" strokeLinecap="round" />
            <path d="M2 2l20 20" strokeLinecap="round" />
          </svg>
          Offline
        </span>
      </div>
      <p className="text-content-primary mt-1 text-2xl font-semibold tabular-nums">
        {reading.value}
        <span className="text-content-tertiary text-sm font-normal"> {reading.unit}</span>
      </p>
      <p className="text-content-secondary border-line-subtle mt-3 flex items-center gap-2 border-t pt-3 text-xs">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary h-4 w-4 flex-none" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {savedNote}
      </p>
      <p className="text-content-tertiary bg-surface-secondary mt-2 rounded-md px-3 py-2 text-xs">
        {sms}
      </p>
    </Card>
  );
}
