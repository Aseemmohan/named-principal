import LoginClient from "./LoginClient";

/**
 * Sign-in route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/login/page.jsx  (replaces existing — UI moved to
 * app/login/LoginClient.jsx, unchanged in behaviour)
 */

export const metadata = {
  title: "Sign in",
  description: "Sign in to Named Principal to register agents, track approvals, and keep a persistent Agent Passport.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
