import { requireRole } from "@/lib/auth/guards";

// Admin route. Requires the admin role AND satisfied MFA — both enforced
// server-side by requireRole (which calls requireMfa).
export default async function AdminPage() {
  await requireRole("admin");
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-content-primary text-2xl font-semibold">Admin</h1>
      <p className="text-content-secondary mt-2 text-sm">
        You reached this because you are an admin with MFA satisfied.
      </p>
    </main>
  );
}
