/**
 * i18n request configuration — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: i18n/request.js
 *
 * Loads the correct messages/<locale>.json file per request, and
 * falls back to English for any language whose translation isn't
 * complete yet — so selecting a language that's only partially
 * translated (true for every language except English and Spanish in
 * this first phase) shows English text for the missing pieces rather
 * than a blank string or a build error.
 */

import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../messages/en.json`)).default;
  }

  // Merge over English so any key missing from a partially-translated
  // locale file falls back to English rather than rendering blank.
  const english = (await import(`../messages/en.json`)).default;
  const merged = deepMerge(english, messages);

  return { locale, messages: merged };
});

function deepMerge(base, override) {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (override[key] && typeof override[key] === "object" && !Array.isArray(override[key])) {
      result[key] = deepMerge(base[key] || {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}
