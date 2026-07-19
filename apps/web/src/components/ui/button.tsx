import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

// MedSync Button. Semantic tokens only (no raw hex — see the raw-hex lint rule).
// `danger` is a NEUTRAL treatment, never red: red is reserved for clinical
// emergencies (design system §2), so a destructive action must not use it.

type Variant = "primary" | "cta" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-primary text-content-on-brand hover:bg-brand-primary-hover active:bg-brand-primary-active",
  cta: "bg-brand-cta text-content-on-brand hover:brightness-110",
  secondary:
    "bg-surface-primary text-content-primary border border-line-strong hover:bg-surface-secondary",
  ghost:
    "bg-transparent text-content-secondary hover:bg-surface-secondary hover:text-content-primary",
  danger:
    "bg-surface-primary text-content-secondary border border-line-strong hover:bg-surface-inverse hover:text-content-inverse hover:border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-[18px] text-[13px]",
  md: "h-11 px-6 text-sm", // 24px / ~12px — the 2× horizontal padding rule
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  },
);
