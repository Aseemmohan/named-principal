import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Root metadata — Named Principal
 * © 2026 Aseem Mohan.
 *
 * This is the SITEWIDE FALLBACK. Individual routes (home, /agent,
 * /estate, /login, etc.) should override this via their own
 * `export const metadata` in a Server Component wrapper — see the
 * per-route metadata files being added alongside this change.
 * `title.template` means a route that sets title: "Agent Risk
 * Profiler" renders as "Agent Risk Profiler — Named Principal"
 * automatically, without repeating the suffix everywhere.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.namedprincipal.com"),
  title: {
    default: "Named Principal — AI Agent Governance and Accountability",
    template: "%s — Named Principal",
  },
  description:
    "Discover, assess and govern enterprise AI agents with named human accountability, risk-based approvals, bounded privileges and audit-ready Agent Passports.",
  openGraph: {
    title: "Named Principal — AI Agent Governance and Accountability",
    description:
      "Discover, assess and govern enterprise AI agents with named human accountability, risk-based approvals, bounded privileges and audit-ready Agent Passports.",
    url: "https://www.namedprincipal.com",
    siteName: "Named Principal",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Named Principal — AI Agent Governance" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Named Principal — AI Agent Governance and Accountability",
    description:
      "Discover, assess and govern enterprise AI agents with named human accountability, risk-based approvals, bounded privileges and audit-ready Agent Passports.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
