"use client";

import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Switch = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Switch({ className, ...props }, ref) {
  return (
    <label
      className={cn(
        "relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer",
        className,
      )}
    >
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="absolute inset-0 rounded-full bg-line-strong transition-colors peer-checked:bg-brand-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring" />
      {/* thumb: content-on-brand is white in both themes */}
      <span className="absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-content-on-brand shadow-sm transition-transform peer-checked:translate-x-4" />
    </label>
  );
});
