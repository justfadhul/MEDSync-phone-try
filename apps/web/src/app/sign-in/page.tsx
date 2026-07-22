"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { TextInput } from "@/components/forms";
import { signIn, type SignInResult } from "./actions";

// Unified sign-in (Gate O.6). One door for every kind of user. The form only
// collects an identifier + password; MFA, approval state and role routing are
// all decided server-side (actions.ts) after a correct password.
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="bg-brand-primary text-content-on-brand mt-2 h-12 w-full rounded-full text-sm font-semibold disabled:opacity-60">
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function SignInPage() {
  const [state, formAction] = useActionState<SignInResult, FormData>(signIn, null);
  const [show, setShow] = useState(false);

  return (
    <main className="bg-surface-page flex min-h-dvh flex-col items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" aria-label="MedSync home" className="text-content-primary flex items-center gap-2 font-semibold tracking-tight">
          <span className="bg-brand-primary text-content-on-brand grid h-8 w-8 place-items-center rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M3 12h4l2 5 4-12 2 7h6" />
            </svg>
          </span>
          MedSync
        </Link>

        <h1 className="text-content-primary mt-10 text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="text-content-secondary mt-1 text-[15px]">Patients, staff and hospitals — one sign-in.</p>

        <form action={formAction} className="mt-7 flex flex-col gap-4">
          <TextInput label="Email or phone" name="identifier" required autoComplete="username"
            placeholder="you@example.com or 07XX XXX XXX" />

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-content-secondary text-sm font-medium">Password</label>
              <Link href="/reset-password" className="text-content-link text-xs font-medium hover:underline">Forgot?</Link>
            </div>
            <div className="relative mt-1.5">
              <input id="password" name="password" type={show ? "text" : "password"} required autoComplete="current-password"
                className="border-line-default bg-surface-primary text-content-primary focus:border-brand-primary focus:ring-brand-subtle h-12 w-full rounded-xl border px-4 pr-16 text-[15px] outline-none focus:ring-4" />
              <button type="button" onClick={() => setShow((s) => !s)}
                className="text-content-tertiary hover:text-content-primary absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium">
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {state?.error && (
            <p role="alert" className="text-feedback-error text-sm">{state.error}</p>
          )}

          <SubmitButton />
        </form>

        <p className="text-content-tertiary mt-4 text-center text-xs">
          Clinical and admin accounts complete a second step after sign-in.
        </p>

        <p className="text-content-secondary mt-8 text-center text-sm">
          New to MedSync?{" "}
          <Link href="/register" className="text-content-link font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
