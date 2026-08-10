/**
 * OAuth callback — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: app/auth/callback/route.js
 *
 * After exchanging the code for a session, ensures the user has an
 * organization (creating "<name>'s organisation" on first sign-in if
 * not) — every Passport belongs to an org, so this can't be deferred.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "../../../lib/supabaseClient";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/estate";

  if (code) {
    const cookieStore = await cookies();
    const supabase = supabaseServer(cookieStore);
    const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeErr) {
      console.error("auth/callback: exchangeCodeForSession failed:", exchangeErr);
    }

    // Re-fetch the user explicitly rather than trusting the session object
    // returned directly from exchangeCodeForSession — that object can be
    // set before the client's internal auth state has fully synced from
    // the cookie write, which then makes the .from() calls below run
    // unauthenticated and fail RLS silently. getUser() forces a real
    // check and reliably has the fresh session.
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) console.error("auth/callback: getUser after exchange failed:", userErr);

    if (user) {
      const { data: existing, error: lookupErr } = await supabase
        .from("memberships")
        .select("org_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (lookupErr) console.error("auth/callback: membership lookup failed:", lookupErr);

      if (!existing) {
        const displayName = user.user_metadata?.full_name || user.email;
        const { data: org, error: orgErr } = await supabase
          .from("organizations")
          .insert({ name: `${displayName}'s organisation`, created_by: user.id })
          .select("id")
          .single();

        if (orgErr) console.error("auth/callback: organization insert failed:", orgErr);

        if (!orgErr && org) {
          const { error: memErr } = await supabase.from("memberships").insert({
            org_id: org.id, user_id: user.id, role: "owner",
          });
          if (memErr) console.error("auth/callback: membership insert failed:", memErr);
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}