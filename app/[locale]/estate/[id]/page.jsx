import PassportClient from "./PassportClient";

/**
 * Agent Passport detail route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/estate/[id]/page.jsx  (replaces existing — UI moved to
 * app/estate/[id]/PassportClient.jsx, unchanged in behaviour)
 *
 * A genuinely per-agent title (e.g. "Invoice bot — Agent Passport")
 * would need server-side data fetching here, which would mean
 * duplicating the Supabase auth/org-lookup logic that currently lives
 * client-side in PassportClient.jsx. Given this route sits behind
 * sign-in already — so it's not being indexed regardless — a generic
 * title covers the real win here (a correct browser tab title) without
 * that duplication. Worth revisiting if per-agent titles become
 * valuable for some other reason later (e.g. browser history search).
 */

export const metadata = {
  title: "Agent Passport",
  description: "Identity, accountability, risk, controls and approval history for a registered agent.",
  robots: { index: false, follow: false },
};

export default function PassportPage() {
  return <PassportClient />;
}
