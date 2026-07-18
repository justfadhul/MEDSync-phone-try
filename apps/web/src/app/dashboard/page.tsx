import { requireUser } from "@/lib/auth/guards";

// Protected route. Even though the proxy also redirects, this page independently
// re-verifies identity server-side (the proxy is not a security boundary).
export default async function DashboardPage() {
  const { user, roleKeys } = await requireUser();
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-content-primary text-2xl font-semibold">Dashboard</h1>
      <p className="text-content-secondary mt-2 text-sm">
        Signed in as {user.email}. Roles: {roleKeys.join(", ") || "none"}.
      </p>
    </main>
  );
}
