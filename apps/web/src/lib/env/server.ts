import "server-only";

// Server-only environment. Importing this file into a client component is a
// build error (server-only), so the service-role key can never reach the bundle.
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const serverEnv = {
  supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  // NEVER expose. Only used by trusted server code (admin operations, seeds).
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
};
