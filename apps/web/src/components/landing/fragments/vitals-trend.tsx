import { KpiTile } from "@/components/ui/kpi-tile";
import { F1_VITALS } from "@/lib/landing-fixtures";

// F1 — a single vitals metric with a neutral trend. A reading, never a dose.
// The delta is a neutral arrow (KpiTile enforces this); no red/green up/down.
export function VitalsTrend({ className }: { className?: string }) {
  return (
    <KpiTile
      label={F1_VITALS.label}
      value={F1_VITALS.value}
      unit={F1_VITALS.unit}
      delta={F1_VITALS.delta}
      deltaDir={F1_VITALS.deltaDir}
      spark={F1_VITALS.spark}
      className={className}
    />
  );
}
