import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Clinical status pill — the safety channel. The ONLY components allowed to use
// the saturated status palette (stable/critical/caution/admitted).
export type ClinicalStatus = "stable" | "critical" | "caution" | "admitted";

const MAP: Record<
  ClinicalStatus,
  { text: string; dot: string; label: string }
> = {
  stable: {
    text: "text-status-stable",
    dot: "bg-status-stable",
    label: "Stable",
  },
  critical: {
    text: "text-status-critical-strong",
    dot: "bg-status-critical",
    label: "Critical",
  },
  caution: {
    text: "text-status-caution",
    dot: "bg-status-caution",
    label: "Caution",
  },
  admitted: {
    text: "text-status-admitted",
    dot: "bg-status-admitted",
    label: "Admitted",
  },
};

export function StatusPill({
  status,
  children,
  className,
}: {
  status: ClinicalStatus;
  children?: ReactNode;
  className?: string;
}) {
  const s = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line-subtle bg-surface-primary px-3 py-1 text-sm font-medium",
        s.text,
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", s.dot)} aria-hidden="true" />
      {children ?? s.label}
    </span>
  );
}
