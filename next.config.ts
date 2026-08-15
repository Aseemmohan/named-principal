import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * FIX: the previous version called createNextIntlPlugin() with no
 * argument, relying on auto-discovery to find i18n/request.js. That
 * failed on Vercel's Turbopack build ("Couldn't find next-intl config
 * file") even though the file exists at the correct default location
 * — a known, documented reliability gap with auto-discovery,
 * especially under Turbopack. Passing the path explicitly removes the
 * guesswork entirely.
 */
const withNextIntl = createNextIntlPlugin("./i18n/request.js");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);