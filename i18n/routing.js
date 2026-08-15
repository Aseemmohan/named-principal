/**
 * i18n routing configuration — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: i18n/routing.js
 *
 * CHANGED: localePrefix is now "always" instead of "as-needed".
 *
 * "as-needed" (English unprefixed, other locales get /es, /hi, etc.)
 * was the original choice, specifically to avoid touching any
 * existing indexed URL. Tested directly on the preview deployment:
 * every locale-prefixed URL (/en/security, /en/agent, etc.) rendered
 * correctly; every bare, unprefixed URL (/security, /, /pilot) 404'd.
 * The statically-generated pages only exist at their prefixed paths,
 * and the runtime rewrite "as-needed" depends on to serve English at
 * the bare URL wasn't resolving correctly against those static files
 * in this configuration.
 *
 * "always" is the version that's actually confirmed working end to
 * end. English now lives at /en/... same as every other locale, and
 * next-intl's own middleware automatically redirects a bare URL
 * (e.g. /security) to its prefixed version (/en/security) — that
 * redirect is what was missing before, not something added manually.
 *
 * Trade-off, stated plainly: every existing bare URL now resolves via
 * a redirect hop rather than serving directly. That's a real, if
 * minor, change from the original "as-needed" goal — but it's the
 * version that's actually been tested and confirmed to work, rather
 * than a theoretically-nicer version that 404s in practice.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "hi", "zh", "ms", "id", "ta"],
  defaultLocale: "en",
  localePrefix: "always",
});
