import { View, Text } from "react-native";
import { cn } from "@/lib/cn";

// Clinical status pill — the safety channel, mirroring apps/web status-pill.tsx.
// The ONLY mobile component allowed to use the saturated status palette
// (stable / critical / caution / admitted). Everything else stays neutral or
// uses the decorative pastel wayfinding set.
export type ClinicalStatus = "stable" | "critical" | "caution" | "admitted";

const MAP: Record<ClinicalStatus, { text: string; dot: string; label: string }> = {
  stable: { text: "text-status-stable", dot: "bg-status-stable", label: "Stable" },
  critical: { text: "text-status-critical-strong", dot: "bg-status-critical", label: "Critical" },
  caution: { text: "text-status-caution", dot: "bg-status-caution", label: "Caution" },
  admitted: { text: "text-status-admitted", dot: "bg-status-admitted", label: "Admitted" },
};

export function StatusPill({
  status,
  label,
  className,
}: {
  status: ClinicalStatus;
  label?: string;
  className?: string;
}) {
  const s = MAP[status];
  return (
    <View
      className={cn(
        "border-line-subtle bg-surface-primary flex-row items-center gap-1.5 rounded-full border px-2.5 py-1",
        className,
      )}
    >
      <View className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      <Text className={cn("text-xs font-semibold", s.text)}>
        {label ?? s.label}
      </Text>
    </View>
  );
}
