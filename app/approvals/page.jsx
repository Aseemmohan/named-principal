import ApprovalsClient from "./ApprovalsClient";

/**
 * Approvals route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/approvals/page.jsx  (replaces existing — UI moved to
 * app/approvals/ApprovalsClient.jsx, unchanged in behaviour)
 */

export const metadata = {
  title: "Approvals",
  description: "Agents submitted for approval, awaiting a named principal's decision.",
  robots: { index: false, follow: false }, // behind sign-in — nothing here for search engines to index
};

export default function ApprovalsPage() {
  return <ApprovalsClient />;
}
