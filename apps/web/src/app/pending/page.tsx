import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";

// Honest pending-approval state (Gate O.6). A staff or hospital applicant with
// valid credentials lands here — NOT in a workspace — until their application is
// approved. Access follows approval, not login. Server-rendered behind
// requireUser() (getUser(), re-verified); if they're actually approved we send
// them on to the workspace rather than showing a stale pending screen.
export const metadata = { title: "Application pending · MedSync" };

type Stage = {
  title: string; body: string; tone: "wait" | "action" | "stop";
  cta?: { href: string; label: string };
};

const STAGE: Record<string, Stage> = {
  submitted: {
    title: "Application received",
    body: "Thanks — we've got your application. It's queued for review. We'll notify you the moment there's a decision; you don't need to do anything right now.",
    tone: "wait",
  },
  in_review: {
    title: "Under review",
    body: "Your application is being reviewed against the council register and facility records. This usually takes a short while — we'll be in touch.",
    tone: "wait",
  },
  requires_info: {
    title: "We need a little more",
    body: "A reviewer has asked for more information before we can continue. Open your application to see what's needed.",
    tone: "action",
    cta: { href: "/register", label: "Update my application" },
  },
  rejected: {
    title: "Not approved",
    body: "We weren't able to approve this application. If you think this is a mistake, reach out and we'll take another look.",
    tone: "stop",
  },
};

// Used when the status is unknown/missing — the safest honest default is "we've
// received it and it's queued", never a workspace.
const FALLBACK: Stage = STAGE.submitted!;

async function currentStatus(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const [staff, hospital] = await Promise.all([
    supabase.from("staff_applications").select("status").eq("user_id", userId),
    supabase.from("hospital_applications").select("status").eq("submitted_by", userId),
  ]);
  const statuses = [...(staff.data ?? []), ...(hospital.data ?? [])].map((r) => r.status);
  if (statuses.length === 0) return null;
  if (statuses.includes("active")) return "active";
  // Show the most actionable stage first if several exist.
  return statuses.find((s) => s === "requires_info") ?? statuses[0] ?? null;
}

export default async function PendingPage() {
  const { user } = await requireUser();
  const status = await currentStatus(user.id);

  const toneRing: Record<Stage["tone"], string> = {
    wait: "border-brand-primary/40 bg-brand-subtle text-brand-primary",
    action: "border-feedback-warning/40 bg-surface-secondary text-content-primary",
    stop: "border-line-default bg-surface-secondary text-content-secondary",
  };
  const stage: Stage = (status ? STAGE[status] : undefined) ?? FALLBACK;

  return (
    <main className="bg-surface-page flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl border ${toneRing[stage.tone]}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
            <path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
        <h1 className="text-content-primary mt-5 text-2xl font-bold tracking-tight">{stage.title}</h1>
        <p className="text-content-secondary mx-auto mt-2 max-w-sm text-[15px]">{stage.body}</p>

        <div className="border-line-subtle bg-surface-primary mt-6 rounded-2xl border p-4 text-left">
          <p className="text-content-tertiary text-xs">
            Signed in as <span className="text-content-secondary font-medium">{user.email ?? user.phone}</span>. Your account is active, but MedSync stays locked to your role until this application is approved — no patient or facility data is accessible before then.
          </p>
        </div>

        {stage.cta && (
          <Link href={stage.cta.href}
            className="bg-brand-primary text-content-on-brand mt-6 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold">
            {stage.cta.label}
          </Link>
        )}

        {status === "active" && (
          <Link href="/dashboard"
            className="bg-brand-primary text-content-on-brand mt-6 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold">
            You’re approved — continue
          </Link>
        )}

        <form action="/auth/sign-out" method="post" className="mt-8">
          <button type="submit" className="text-content-tertiary text-sm hover:underline">Sign out</button>
        </form>
      </div>
    </main>
  );
}
