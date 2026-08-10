import EstateNewClient from "./EstateNewClient";

/**
 * New Agent Intake route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/estate/new/page.jsx  (replaces existing — UI moved to
 * app/estate/new/EstateNewClient.jsx, unchanged in behaviour)
 */

export const metadata = {
  title: "Register an Agent",
  description: "Run the nine-question risk profiler and create a persistent Agent Passport.",
  robots: { index: false, follow: false },
};

export default function EstateNewPage() {
  return <EstateNewClient />;
}
