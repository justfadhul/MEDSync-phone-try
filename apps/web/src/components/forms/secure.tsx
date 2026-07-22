"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { Field, controlBase } from "./field";

// Password + verify, with a show/hide toggle and a live match check.
export function PasswordWithVerify({
  value, verify, onChange, onVerifyChange, required,
}: {
  value: string; verify: string; onChange: (v: string) => void; onVerifyChange: (v: string) => void; required?: boolean;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const mismatch = verify.length > 0 && verify !== value;
  return (
    <div className="flex flex-col gap-4">
      <Field label="Password" htmlFor={id} required={required} hint="At least 8 characters.">
        <div className="relative">
          <input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
            autoComplete="new-password" minLength={8} className={cn(controlBase, "pr-16")} />
          <button type="button" onClick={() => setShow((s) => !s)}
            className="text-content-tertiary hover:text-content-primary absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium">
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </Field>
      <Field label="Confirm password" required={required} error={mismatch ? "Passwords don't match." : undefined}>
        <input type={show ? "text" : "password"} value={verify} onChange={(e) => onVerifyChange(e.target.value)}
          autoComplete="new-password" className={cn(controlBase, mismatch && "border-feedback-error")} />
      </Field>
    </div>
  );
}

// File upload (image/PDF, size-limited). Stored to a PRIVATE bucket, encrypted
// app-side (wired in the registration Edge Functions, Gate O.3+); this primitive
// is the accessible input + client-side type/size guard.
export function FileUpload({
  label, accept = "image/*,application/pdf", maxMB = 8, required, hint, value, onChange,
}: {
  label: string; accept?: string; maxMB?: number; required?: boolean; hint?: string;
  value: File | null; onChange: (f: File | null) => void;
}) {
  const id = useId();
  const [error, setError] = useState<string>();
  return (
    <Field label={label} htmlFor={id} required={required} hint={hint ?? `Image or PDF, up to ${maxMB} MB. Stored privately, encrypted.`} error={error}>
      <label htmlFor={id}
        className="border-line-default bg-surface-primary hover:border-brand-primary flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3.5 transition-colors">
        <span className="bg-brand-subtle text-brand-primary grid h-9 w-9 flex-none place-items-center rounded-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="M12 16V4M8 8l4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
        </span>
        <span className="min-w-0">
          <span className="text-content-primary block truncate text-sm font-medium">{value ? value.name : "Choose a file"}</span>
          <span className="text-content-tertiary block text-xs">{value ? "Tap to replace" : "Tap to upload"}</span>
        </span>
        <input id={id} type="file" accept={accept} className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f && f.size > maxMB * 1024 * 1024) { setError(`File is larger than ${maxMB} MB.`); onChange(null); return; }
            setError(undefined); onChange(f);
          }} />
      </label>
    </Field>
  );
}
