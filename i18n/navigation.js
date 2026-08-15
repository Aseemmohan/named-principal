/**
 * Locale-aware navigation helpers — Named Principal
 * © 2026 Aseem Mohan.
 *
 * INSTALL AT: i18n/navigation.js
 *
 * Plain Next.js `useRouter`/`usePathname` from "next/navigation" don't
 * know about locales at all — `router.push(path, { locale })` is not
 * a real option on that API in the App Router. next-intl's own
 * `createNavigation` wraps the standard hooks with locale-aware
 * versions that do support this, which LanguageSwitcher.jsx depends
 * on directly. Import navigation hooks from THIS file everywhere in
 * the app going forward, not from "next/navigation".
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
