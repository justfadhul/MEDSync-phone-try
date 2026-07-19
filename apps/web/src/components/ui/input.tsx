import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

// Text input. `invalid` uses AMBER (feedback-error), never red — validation is
// not a clinical emergency (design system §2).
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full rounded border bg-surface-primary px-3 py-2.5 text-sm text-content-primary",
        "placeholder:text-content-disabled focus:outline-none",
        "focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-focus-ring",
        invalid
          ? "border-feedback-error focus-visible:border-feedback-error focus-visible:ring-feedback-error"
          : "border-line-strong",
        className,
      )}
      {...props}
    />
  );
});
