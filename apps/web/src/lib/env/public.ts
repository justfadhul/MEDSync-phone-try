// Public env — safe for the browser bundle (anon key is designed to be public;
// RLS is the security boundary, not key secrecy).
function requiredPublic(name: string, v: string | undefined): string {
  if (!v) throw new Error(`Missing required public env var: ${name}`);
  return v;
}

export const publicEnv = {
  supabaseUrl: requiredPublic(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  supabaseAnonKey: requiredPublic(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
};
