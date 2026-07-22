"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Shared field chrome + text inputs. Tokenised (no raw hex), 390px-friendly,
// label-above like the reference (IMG_8295/8296). One accessible set every
// registration form draws on. Interactive/typeahead pieces live in choosers.tsx.

export const controlBase =
  "h-12 w-full rounded-xl border border-line-default bg-surface-primary px-4 text-[15px] text-content-primary " +
  "placeholder:text-content-tertiary transition-colors focus:border-brand-primary focus:outline-none " +
  "focus:ring-2 focus:ring-brand-subtle disabled:opacity-60";

export function Field({
  label, htmlFor, required, hint, error, children,
}: {
  label: string; htmlFor?: string; required?: boolean; hint?: string;
  error?: string; children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-content-secondary text-sm font-medium">
        {label}
        {required && <span className="text-content-tertiary"> *</span>}
      </label>
      {children}
      {error ? (
        // Non-clinical validation uses amber/neutral, never the clinical red.
        <p className="text-feedback-error text-xs">{error}</p>
      ) : hint ? (
        <p className="text-content-tertiary text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

type TextProps = {
  label: string; required?: boolean; hint?: string; error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ label, required, hint, error, id, ...props }: TextProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field label={label} htmlFor={fid} required={required} hint={hint} error={error}>
      <input id={fid} className={cn(controlBase, error && "border-feedback-error")} aria-invalid={!!error} {...props} />
    </Field>
  );
}

// A native date input, styled to match and keyboard-navigable (used for DOB and
// expiry). type=date gives the platform's accessible picker for free.
export function DateInput({ label, required, hint, error, id, ...props }: TextProps) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field label={label} htmlFor={fid} required={required} hint={hint} error={error}>
      <input id={fid} type="date" className={cn(controlBase, error && "border-feedback-error")} aria-invalid={!!error} {...props} />
    </Field>
  );
}
