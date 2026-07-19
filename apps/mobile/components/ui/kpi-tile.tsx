import { View, Text } from "react-native";
import { cn } from "@/lib/cn";
import { Sparkline } from "./sparkline";

// Analytics stat tile, parity with apps/web kpi-tile.tsx. Deltas are NEUTRAL
// with a direction arrow — never red/green for up/down. `critical` colours the
// number red only for a genuinely clinical count.
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
  value: string;
  unit?: string;
  delta?: string;
  deltaDir?: "up" | "down";
  footnote?: string;
  spark?: number[];
  sparkTone?: "brand" | "critical" | "neutral";
  critical?: boolean;
  selected?: boolean;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "bg-surface-primary flex-1 gap-1.5 rounded-md border p-3.5",
        selected ? "border-brand-primary" : "border-line-subtle",
        className,
      )}
    >
      <Text className="text-content-tertiary font-mono text-[10px] uppercase">
        {label}
      </Text>
      <Text
        className={cn(
          "text-2xl font-semibold",
          critical ? "text-status-critical-strong" : "text-content-primary",
        )}
      >
        {value}
        {unit ? (
          <Text className="text-content-tertiary text-sm font-normal"> {unit}</Text>
        ) : null}
      </Text>
      {delta ? (
        <Text className="text-content-tertiary text-[11px]">
          {deltaDir === "up" ? "▲" : "▼"} {delta}
        </Text>
      ) : null}
      {footnote ? (
        <Text className="text-content-tertiary text-[11px]">{footnote}</Text>
      ) : null}
      {spark ? <Sparkline values={spark} tone={sparkTone} /> : null}
    </View>
  );
}
