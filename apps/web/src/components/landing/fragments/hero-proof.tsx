import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { F_HERO_READING, F_HERO_RESPONSE } from "@/lib/landing-fixtures";

// Hero proof-of-loop. Two SOLID cards (never glass — glass over a clinical
// status colour makes its contrast depend on the backdrop, a safety regression):
//   Card A — a home READING that crosses this patient's target after hours.
//   Card B — the same event reaching the on-call clinician within the minute.
// The status pill is the ONE place the saturated palette is allowed. The
// resolved mark is BRAND, never green: colour stays a clinical signal.
export function HeroProof({ className }: { className?: string }) {
  const r = F_HERO_READING;
  const resp = F_HERO_RESPONSE;
  return (
    <div className={className}>
      {/* Card A — the reading */}
      <Card className="relative z-10 gap-3">
        <div className="flex items-center justify-between">
          <span className="flex items-baseline gap-2">
            <span className="text-content-primary text-sm font-medium">{r.who}</span>
            <span className="text-content-tertiary text-xs">{r.context}</span>
          </span>
          <span className="text-content-tertiary font-mono text-xs tabular-nums">{r.time}</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-content-secondary text-xs">{r.reading}</p>
            <p className="text-content-primary mt-0.5 text-2xl font-semibold tracking-tight tabular-nums">
              {r.value}
              <span className="text-content-tertiary ml-1 text-sm font-normal">{r.unit}</span>
            </p>
          </div>
          <StatusPill status="caution">{r.status}</StatusPill>
        </div>
      </Card>

      {/* connector — one continuous thread, not a decorative flourish */}
      <div className="relative z-0 -my-1 ml-6 flex items-center gap-2 pl-4">
        <span className="border-line-strong h-6 w-px border-l border-dashed" aria-hidden="true" />
        <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
          within the minute
        </span>
      </div>

      {/* Card B — the response */}
      <Card className="relative z-10 -mt-1 ml-6 gap-2">
        <div className="flex items-center justify-between">
          <span className="text-content-primary text-sm font-medium">{resp.action}</span>
          <span className="text-content-tertiary font-mono text-xs tabular-nums">{resp.time}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* resolved mark — brand, never green */}
          <span className="bg-brand-subtle text-brand-primary grid h-5 w-5 flex-none place-items-center rounded-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span className="text-content-secondary text-sm">
            {resp.note} · <span className="text-content-tertiary">{resp.actor}</span>
          </span>
        </div>
      </Card>
    </div>
  );
}
