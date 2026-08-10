import AgentClient from "./AgentClient";

/**
 * Agent Risk Profiler route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/agent/page.jsx  (replaces the existing file — the
 * actual UI moved to app/agent/AgentClient.jsx, unchanged in behaviour)
 *
 * Same split pattern as the homepage (see app/page.jsx) — the existing
 * page is "use client", which can't export metadata, so this thin
 * Server Component wrapper carries the metadata and renders the
 * client component as a child.
 */

export const metadata = {
  title: "Agent Risk Profiler",
  description:
    "Nine questions about one AI agent. Returns its risk tier, the OWASP agentic risks it exposes you to, the controls that become mandatory before deployment, and the regulatory provisions engaged.",
  alternates: {
    canonical: "https://www.namedprincipal.com/agent",
  },
};

export default function AgentPage() {
  return <AgentClient />;
}
