import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Sparkline } from "./sparkline";

// Analytics stat tile. Deltas are NEUTRAL with a direction arrow — never
// red/green for up/down (design system §7). `critical` colours the number red
// only for a genuinely clinical count.
export function KpiTile({
  label,
  value,
  unit,
  delta,
  deltaDir = "up",
  footnote,
  spark,
  sparkTone = "brand",
  critical = false,
  selected = false,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  delta?: string;
  deltaDir?: "up" | "down";
  footnote?: string;
  spark?: number[];
  sparkTone?: "brand" | "critical";
  critical?: boolean;
  selected?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-md border bg-surface-primary p-4 shadow-sm",
        selected
          ? "border-brand-primary ring-1 ring-brand-primary"
          : "border-line-subtle",
        className,
      )}
    >
      <span className="font-mono text-[10px] tracking-wider text-content-tertiary uppercase">
        {label}
      </span>
      <span
        className={cn(
          "text-2xl leading-none font-semibold tracking-tight tabular-nums",
          critical ? "text-status-critical-strong" : "text-content-primary",
        )}
      >
        {value}
        {unit && (
          <span className="text-content-tertiary text-sm font-normal">
            {" "}
            {unit}
          </span>
        )}
      </span>
      {spark && <Sparkline values={spark} tone={sparkTone} />}
      {(delta || footnote) && (
        <span className="text-content-tertiary flex items-center gap-1.5 text-xs">
          {delta && (
            <span className="text-content-secondary font-medium tabular-nums">
              {deltaDir === "down" ? "▼" : "▲"} {delta}
            </span>
          )}
          {footnote}
        </span>
      )}
    </div>
  );
}
