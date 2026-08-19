import { getTranslations } from "next-intl/server";
import HomeClient from "./HomeClient";

/**
 * Homepage — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: app/[locale]/page.jsx  (replaces existing)
 *
 * FIX: the previous version relied on inheriting title/description
 * from the root layout's static defaults, since the homepage's
 * correct English title happened to match those defaults exactly.
 * That's no longer true once locale is in play — the root layout's
 * metadata has always been static English, so every non-English
 * visitor was silently getting an English browser tab title
 * regardless of their chosen language. This now sets its own
 * translated metadata explicitly, the same pattern every other page
 * already uses, rather than depending on inheritance that was never
 * actually locale-aware.
 *
 * ONE DETAIL WORTH FLAGGING: the root layout's title uses a template
 * ("%s — Named Principal") that every other page's title gets wrapped
 * in automatically. home.metaTitle already contains "Named Principal"
 * as part of the translated string itself, so applying the template
 * on top would produce a redundant, doubled title. Using
 * `{ absolute: ... }` here deliberately bypasses the template for
 * this one page, rather than letting a subtle formatting bug ship.
 */

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical: "https://www.namedprincipal.com" },
  };
}

export default function Home() {
  return <HomeClient />;
}
