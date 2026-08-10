/**
 * Supabase client — Named Principal
 * © 2026 Aseem Mohan. All rights reserved.
 *
 * INSTALL AT: lib/supabaseClient.js
 *
 * REQUIRES: npm install @supabase/ssr
 * (@supabase/supabase-js is already installed)
 *
 * ENV VARS — this project's OWN Supabase instance (agent-of-record1),
 * separate from Healthyram's. Get these from the Supabase dashboard →
 * Project Settings → API:
 *   NEXT_PUBLIC_SUPABASE_URL=https://loarnmyftknpdmpylmtt.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *
 * NOTE: route.js already uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * (no NEXT_PUBLIC_ prefix) for server-side writes to readiness_leads —
 * that pair stays exactly as is. These are additional, separate
 * variables for the new browser-facing auth flow.
 */

import { createBrowserClient, createServerClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseBrowser() {
  return createBrowserClient(URL, ANON_KEY);
}

export function supabaseServer(cookieStore) {
  return createServerClient(URL, ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component context — middleware handles the refresh.
        }
      },
    },
  });
}
