import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sign-out (Gate O.6). POST-only so a cross-site GET can't force a sign-out.
// Clears the Supabase session cookies, then sends the user back to sign-in.
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/sign-in", request.url), { status: 303 });
}
