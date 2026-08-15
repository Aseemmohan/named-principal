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
 *
 * ADDED FOR MULTILINGUAL SUPPORT: composes next-intl's locale routing
 * with the auth check above, rather than replacing it. Two things
 * changed from the previous version, both load-bearing:
 *
 *   1. THE MATCHER IS NOW BROAD, not just the four protected prefixes.
 *      next-intl needs to see every page request to resolve locale
 *      correctly (e.g. recognising /es/pilot vs /pilot) — but the
 *      auth check below still ONLY triggers a redirect for the same
 *      four protected paths as before (locale-stripped, so
 *      /es/estate is recognised as protected the same way /estate
 *      already is). Every public page's behaviour is unchanged.
 *
 *   2. /auth IS EXPLICITLY EXCLUDED from locale processing, on
 *      purpose. The Google OAuth callback route lives there, and its
 *      redirect URI is configured exactly in Google Cloud Console —
 *      getting that mismatched caused real, painful debugging earlier
 *      in this project. A locale rewrite touching that path could
 *      silently break sign-in again. Excluding it here means it's
 *      never at risk of that.
 *
 * ONE KNOWN, MINOR TRADE-OFF: on a protected route, if Supabase also
 * needs to refresh the session cookie on the same request, the fresh
 * response object it creates (per Supabase's own recommended SSR
 * cookie pattern) can end up not carrying whatever locale cookie
 * next-intl wanted to set on that exact request. It isn't a
 * functional break — next-intl just re-resolves locale on the next
 * request — but it's honest to note rather than pretend this
 * composition is perfectly seamless in every case.
 *
 * UPDATE: routing.js now uses localePrefix: "always" rather than
 * "as-needed" — confirmed on the preview deployment that "as-needed"
 * left every bare, unprefixed URL 404ing (the static pages only
 * existed at their prefixed paths). Under "always", every locale
 * including English gets a URL prefix, and next-intl's own middleware
 * automatically redirects a bare URL to its prefixed version — no
 * custom redirect logic needed here for that part. The one place that
 * DID need a code change is the login-redirect path below, which used
 * to special-case English as needing no prefix.
 */

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const PROTECTED = ["/dashboard", "/estate", "/approvals", "/account"];

const intlMiddleware = createMiddleware(routing);

function stripLocalePrefix(pathname) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
  }
  return pathname;
}

function currentLocaleFromPath(pathname) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale;
  }
  return routing.defaultLocale;
}

export async function middleware(request) {
  // Resolve locale routing first — for every request this matcher
  // catches, not just the protected ones. Handles the /es, /hi, etc.
  // prefixes; English stays unprefixed as the default.
  const intlResponse = await intlMiddleware(request);

  const pathnameWithoutLocale = stripLocalePrefix(request.nextUrl.pathname);
  const needsAuth = PROTECTED.some((p) => pathnameWithoutLocale.startsWith(p));

  if (!needsAuth) {
    // Public route — next-intl's own response is all that's needed,
    // exactly as before this change for every page outside the four
    // protected prefixes.
    return intlResponse;
  }

  // Protected route: same Supabase check as before, just built on
  // top of the intl response rather than a bare NextResponse.next().
  let response = intlResponse;

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

  if (!user) {
    const currentLocale = currentLocaleFromPath(request.nextUrl.pathname);
    // Under localePrefix: "always" (see i18n/routing.js), every valid
    // path — including English — carries a locale prefix. The old
    // "en gets no prefix" special case that used to live here was
    // correct for "as-needed" but would produce a bare, now-invalid
    // "/login" under "always". Always prefixed now.
    const loginPath = `/${currentLocale}/login`;
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  // Broad on purpose (see note above) — excludes API routes, the
  // OAuth callback under /auth, Next.js internals, and anything that
  // looks like a static file (has a "." in the last path segment).
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
