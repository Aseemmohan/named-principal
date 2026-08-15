/**
 * Middleware — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: middleware.js (project root, next to package.json)
 *
 * Gates the authenticated Estate/Approvals/Dashboard system behind
 * login. The public assessment (/), the agent risk profiler (/agent),
 * the report page (/report) and privacy notice stay open — this is
 * deliberate. The free tools are the trust-building front door; only
 * the persistent Passport system requires an account.
 */

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard", "/estate", "/approvals", "/account"];

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const needsAuth = PROTECTED.some(p => request.nextUrl.pathname.startsWith(p));
  if (needsAuth && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/estate/:path*", "/approvals/:path*", "/account/:path*"],
};
