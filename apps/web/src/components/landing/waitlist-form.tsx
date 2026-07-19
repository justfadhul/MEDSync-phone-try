"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { joinWaitlist, type WaitlistResult } from "@/app/actions/waitlist";

// Public waitlist capture — a single email, not a registration form. Success
// and error states use BRAND + NEUTRAL only: red/green/amber are clinical
// signals and never appear on a marketing surface (design system §2).
export function WaitlistForm() {
  const [state, action, pending] = useActionState<WaitlistResult | null, FormData>(
    joinWaitlist,
    null,
  );

  if (state?.ok) {
    return (
      <div
        role="status"
        className="bg-brand-subtle border-line-subtle text-content-primary flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-primary h-5 w-5 flex-none"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span>You&rsquo;re on the list. We&rsquo;ll be in touch.</span>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="wl-email" className="sr-only">
          Email address
        </label>
        <input
          id="wl-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@facility.org"
          aria-describedby={state && !state.ok ? "wl-error" : undefined}
          className="border-line-strong bg-surface-primary text-content-primary placeholder:text-content-tertiary focus-visible:outline-brand-primary h-11 flex-1 rounded-md border px-3.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding…" : "Join the waitlist"}
        </Button>
      </div>
      {state && !state.ok && (
        <p id="wl-error" className="text-content-secondary text-xs">
          {state.message}
        </p>
      )}
    </form>
  );
}
