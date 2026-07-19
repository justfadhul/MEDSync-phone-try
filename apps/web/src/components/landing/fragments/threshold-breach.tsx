import { Card } from "@/components/ui/card";
import { ThresholdChart } from "@/components/ui/threshold-chart";
import { F2_TEMP } from "@/lib/landing-fixtures";

// F2 — a threshold breach. The chart colours the breaching portion in the
// reserved clinical red; the caption states the breach in NEUTRAL text, so the
// meaning never depends on colour alone (the system's real safety property).
export function ThresholdBreach({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-content-tertiary font-mono text-[10px] tracking-wider uppercase">
          Temperature °C · 24h
        </span>
        <span className="text-content-secondary text-xs font-medium">
          {F2_TEMP.breachLabel}
        </span>
      </div>
      <ThresholdChart
        values={F2_TEMP.values}
        threshold={F2_TEMP.threshold}
        yMin={F2_TEMP.yMin}
        yMax={F2_TEMP.yMax}
        ticks={F2_TEMP.ticks}
      />
    </Card>
  );
}
