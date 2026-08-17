"use client";

/**
 * Language switcher — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: components/LanguageSwitcher.jsx
 *
 * A plain <select> rather than a custom dropdown — genuinely simpler,
 * works correctly on every device including screen readers, and
 * needs no click-outside-to-close logic to get subtly wrong. Swaps
 * only the locale segment of the current path, so switching language
 * on /controls keeps you on /es/controls, not back at the homepage.
 *
 * Self-contained styling, same pattern as PublicNav — works
 * regardless of which page's CSS scope it's dropped into.
 */

import { useRouter, usePathname } from "../i18n/navigation";
import { useLocale } from "next-intl";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ta", label: "தமிழ்" },
  { code: "ar", label: "العربية" },
];

const STYLE = `
.langsw {
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  font-size: 12px; color: #26307A; background: #FFFFFF;
  border: 1px solid #D6DBE4; border-radius: 4px;
  padding: 6px 10px; cursor: pointer;
}
.langsw:hover { border-color: #26307A; }
.langsw:focus-visible { outline: 2px solid #26307A; outline-offset: 1px; }
`;

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  function handleChange(e) {
    const nextLocale = e.target.value;
    // pathname from next/navigation already excludes the current
    // locale prefix under next-intl's routing, so this is safe to
    // reuse directly as the path under the new locale.
    router.push(pathname, { locale: nextLocale });
  }

  return (
    <>
      <style>{STYLE}</style>
      <select
        className="langsw"
        value={currentLocale}
        onChange={handleChange}
        aria-label="Choose language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </>
  );
}
