// Public env — safe for the browser bundle (anon key is designed to be public;
// RLS is the security boundary, not key secrecy).
//
// Lazy getters so a missing value throws at use, not at import. NEXT_PUBLIC_*
// references are still statically inlined by Next at build (they must be set at
// build time to be baked into the client bundle — see turbo.json build env).
function requiredPublic(name: string, v: string | undefined): string {
  if (!v) throw new Error(`Missing required public env var: ${name}`);
  return v;
}

export const publicEnv = {
  get supabaseUrl() {
    return requiredPublic(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get supabaseAnonKey() {
    return requiredPublic(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
};
