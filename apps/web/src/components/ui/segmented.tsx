"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedOption {
  label: string;
  value: string;
}

export function Segmented({
  options,
  value,
  defaultValue,
  onValueChange,
  className,
}: {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  className?: string;
}) {
  const [internal, setInternal] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const active = value ?? internal;
  function set(v: string) {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  }
  return (
    <div
      role="group"
      className={cn(
        "inline-flex gap-0.5 rounded border border-line-subtle bg-surface-secondary p-[3px]",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={active === o.value}
          onClick={() => set(o.value)}
          className={cn(
            "rounded-sm px-3 py-1.5 text-[13px] transition-colors",
            active === o.value
              ? "bg-surface-primary text-content-primary font-medium shadow-sm"
              : "text-content-secondary hover:text-content-primary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
