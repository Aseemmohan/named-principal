import EstateClient from "./EstateClient";

/**
 * AI Estate route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/estate/page.jsx  (replaces existing — UI moved to
 * app/estate/EstateClient.jsx, unchanged in behaviour)
 */

export const metadata = {
  title: "AI Agent Estate and Agent Passports",
  description: "The authoritative inventory of your organisation's registered AI agents — status, owner and risk tier, in one place.",
  robots: { index: false, follow: false },
};

export default function EstatePage() {
  return <EstateClient />;
}
