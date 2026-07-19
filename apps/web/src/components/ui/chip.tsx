"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Chip({
  children,
  onRemove,
  className,
}: {
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded border border-line-strong bg-surface-primary py-1.5 pr-1.5 pl-3 text-[13px] text-content-primary",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="grid h-4 w-4 place-items-center rounded-sm text-content-tertiary hover:bg-surface-secondary hover:text-content-primary"
        >
          ✕
        </button>
      )}
    </span>
  );
}
