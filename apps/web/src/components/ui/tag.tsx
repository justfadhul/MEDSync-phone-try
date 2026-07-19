import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

// Neutral metadata tag. Active state uses teal — never a clinical hue, and
// never the Attio-style per-category rainbow (design system §6).
export function Tag({
  active = false,
  children,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-sm border px-[9px] py-0.5 text-[12.5px]",
        active
          ? "border-brand-primary bg-brand-subtle text-brand-primary"
          : "border-line-strong bg-surface-secondary text-content-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
