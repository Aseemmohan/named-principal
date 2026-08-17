/**
 * i18n routing configuration — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: i18n/routing.js
 *
 * localePrefix is "always" (English lives at /en/... like every other
 * locale). "as-needed" was the original choice but left every bare,
 * unprefixed URL 404ing on the preview deployment — the statically
 * generated pages only existed at their prefixed paths. "always" is
 * the version actually confirmed working end to end; a bare URL now
 * redirects to its prefixed version automatically via next-intl's own
 * middleware, rather than serving directly.
 *
 * ADDED: Arabic ("ar"). Unlike every other language here, Arabic is
 * read right-to-left — not just a translation-file difference, it
 * needs actual layout direction support. See app/[locale]/layout.tsx
 * for where dir="rtl" gets set. Stated plainly: dir="rtl" correctly
 * flips text flow and native form controls, but this codebase's CSS
 * uses physical properties (margin-left, padding-right) throughout
 * rather than logical ones (margin-inline-start), so custom layouts —
 * the nav bar, cards, grids — won't visually mirror automatically.
 * Text will read correctly; the overall page layout won't yet feel
 * fully native to an Arabic reader. Full RTL layout mirroring is
 * real, separate, additional work beyond what's included here.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "hi", "zh", "ms", "id", "ta", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});
