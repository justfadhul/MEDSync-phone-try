// Landing product fragments — real UI primitives rendering marketing fixtures.
// The fixtures import is confined to components/landing/ by a lint rule.
export { VitalsTrend } from "./vitals-trend";
export { ThresholdBreach } from "./threshold-breach";
export { StatusRow } from "./status-row";
export { CareAreaTiles } from "./care-area-tiles";
export { CareTeamFeed } from "./care-team-feed";
export { OfflineSms } from "./offline-sms";
export { Receipts } from "./receipts";
export { Horizons } from "./horizons";

// A small, quiet marker placed next to a fragment cluster — signals the data is
// illustrative without a disclaimer paragraph. Neutral only.
export function IllustrativeChip({ className }: { className?: string }) {
  return (
    <span
      className={`border-line-subtle bg-surface-primary text-content-tertiary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase ${className ?? ""}`}
    >
      <span className="bg-content-tertiary h-1 w-1 rounded-full" />
      Illustrative
    </span>
  );
}
