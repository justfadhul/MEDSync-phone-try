import "server-only";

// Server-only environment. Importing this file into a client component is a
// build error (server-only), so the service-role key can never reach the bundle.
//
// Access is LAZY (getters): reading a value throws only when it is actually
// used at request time, never at module import. This keeps `next build` from
// requiring runtime secrets — importing a route that references serverEnv does
// not force the service-role key to exist at build.
function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const serverEnv = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  // NEVER expose. Only used by trusted server code (admin operations, seeds).
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
};
