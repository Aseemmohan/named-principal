import HomeClient from "./HomeClient";

/**
 * Homepage — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/page.jsx  (replaces the existing file — the actual UI
 * moved to app/HomeClient.jsx, unchanged in behaviour)
 *
 * WHY THE SPLIT: metadata can only be exported from a Server Component,
 * and the existing homepage is "use client" (it holds interactive state
 * for the assessment). Rather than restructure that working component,
 * this file stays a thin Server Component that just adds the canonical
 * URL and renders the client component as a child.
 *
 * Title and description aren't overridden here because the root
 * layout's defaults (app/layout.tsx) already are the homepage's
 * correct title and description — Next.js metadata inherits from the
 * nearest layout when a page doesn't set its own. Other routes (like
 * /agent) DO need their own override, since they need a different
 * title than the homepage default — see the same pattern applied there.
 */

export const metadata = {
  alternates: {
    canonical: "https://www.namedprincipal.com",
  },
};

export default function Home() {
  return <HomeClient />;
}
