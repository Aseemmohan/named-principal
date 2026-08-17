import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Locale layout — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/[locale]/layout.jsx
 *
 * Takes over everything the old root layout.tsx used to own directly
 * — the <html>/<body> tags, metadata, fonts, Analytics — since every
 * page now lives under this locale segment. The root app/layout.tsx
 * is reduced to a bare pass-through; see that file's own comment for
 * why that's correct and not a mistake.
 *
 * Content and metadata values themselves are UNCHANGED from the
 * previous root layout — this is a relocation, not a rewrite.
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Guards against a manually-typed, unsupported locale segment in
  // the URL (e.g. /fr/pilot when French was never one of the seven
  // configured languages) — renders Next.js's normal 404 rather than
  // an unhandled error.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // Arabic is the only RTL locale configured today. dir correctly
  // flips text flow and native form controls; it does not, on its
  // own, mirror the custom CSS layouts across this codebase — see
  // i18n/routing.js for the full explanation of what's covered and
  // what isn't yet.
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
