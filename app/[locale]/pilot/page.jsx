import PilotClient from "./PilotClient";

/**
 * Pilot route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/pilot/page.jsx  (replaces existing — UI moved to
 * app/pilot/PilotClient.jsx, unchanged in behaviour except the two
 * content fixes noted in PilotClient.jsx's own header comment)
 *
 * BUG FIXED: the previous app/pilot/page.jsx was directly "use client"
 * with no metadata export, so this route silently inherited the
 * homepage's title and description — Next.js requires metadata to
 * come from a Server Component, which a "use client" file can never
 * be. Same split pattern already used for /agent, /estate, etc.
 */

export const metadata = {
  title: "30-Day AI Agent Governance Pilot",
  description: "Build a governed inventory and Agent Passports for up to ten enterprise AI agents, including risk assessment, controls, approvals, material-change testing and an executive roadmap.",
  alternates: { canonical: "https://www.namedprincipal.com/pilot" },
};

export default function PilotPage() {
  return <PilotClient />;
}
