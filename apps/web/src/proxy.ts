import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// =============================================================================
// Next.js 16 Proxy (formerly middleware). This is a CONVENIENCE that refreshes
// the Supabase auth cookie and redirects obviously-unauthenticated requests
// away from protected paths. It is NOT a security boundary — Next 16 has had
// proxy/middleware auth-bypass advisories, so real authorization is re-done
// server-side in every route/action via lib/auth/guards (requireUser()).
// =============================================================================

const PROTECTED = ["/dashboard", "/admin"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() (not getSession) so the refresh revalidates the JWT.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on everything except static assets and image optimization.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg)$).*)",
  ],
};
