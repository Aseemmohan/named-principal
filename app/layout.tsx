/**
 * Root layout — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/layout.tsx  (replaces existing)
 *
 * Deliberately minimal. Every route now lives under app/[locale]/,
 * and that layout owns the <html>/<body> tags, metadata, fonts, and
 * Analytics — everything this file used to hold directly. Next.js
 * allows a root layout to be a bare pass-through like this as long as
 * exactly one layout further down the tree renders the actual <html>
 * shell, which app/[locale]/layout.tsx does. Nothing outside the
 * [locale] segment renders a page (the API routes and the OAuth
 * callback are Route Handlers, not pages — they return data or
 * redirects, never HTML), so this is correct, not a stopgap.
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
