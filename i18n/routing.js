/**
 * i18n routing configuration — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: i18n/routing.js
 *
 * English is the default locale with NO url prefix ("localePrefix:
 * as-needed") — every URL already built and indexed tonight
 * (namedprincipal.com/controls, /pilot, /methodology, etc.) keeps
 * working exactly as it does today. Only the other six languages get
 * a prefix: namedprincipal.com/es/controls, /hi/pilot, and so on.
 *
 * This is deliberate, not a default left unconsidered: changing every
 * English URL to /en/... would undo the SEO/canonical-URL work done
 * earlier tonight and break every existing bookmark or indexed link.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "hi", "zh", "ms", "id", "ta"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});
