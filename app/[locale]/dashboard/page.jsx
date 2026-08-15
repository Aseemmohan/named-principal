import DashboardClient from "./DashboardClient";

/**
 * Command Center route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/dashboard/page.jsx  (replaces existing — UI moved to
 * app/dashboard/DashboardClient.jsx, unchanged in behaviour)
 */

export const metadata = {
  title: "Command Center",
  description: "Portfolio view of your organisation's registered agents, risk tiers and pending decisions.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
