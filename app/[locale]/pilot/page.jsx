import { getTranslations } from "next-intl/server";
import PilotClient from "./PilotClient";

/**
 * Pilot route — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/[locale]/pilot/page.jsx  (replaces existing)
 *
 * This wrapper stays a Server Component (same reason as before —
 * metadata can only be exported from one). generateMetadata replaces
 * the previous static `metadata` object so the title and description
 * can come from the translation system too, not just the page body.
 */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pilot" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com/pilot" },
  };
}

export default function PilotPage() {
  return <PilotClient />;
}
