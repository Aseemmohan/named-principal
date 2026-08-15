import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Looks for ./i18n/request.js by default (that's where it lives —
// see i18n/request.js), so no path argument needed here.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
