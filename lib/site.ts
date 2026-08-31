import { getUserAppUrl } from "@/lib/app-urls";

/** Legal entity shown in copyright and company copy. */
export const SITE_NAME = "Subtech Ajo Solution";
/** Public product brand used in titles, OG, and schema. */
export const SITE_PRODUCT = "AjoFlow";
export const SITE_TAGLINE = "Digital Ajo Savings";
export const SITE_DEFAULT_TITLE =
  "AjoFlow | Digital Ajo & Automated Savings in Nigeria";
export const SITE_DESCRIPTION =
  "AjoFlow makes Ajo and group savings simple. Automate contributions, track every naira, manage savings goals, and stay on top of payouts in one secure platform.";
export const SITE_OG_DESCRIPTION =
  "A simpler way to save, manage Ajo groups, automate contributions, and track your money.";
export const SITE_SUPPORT_EMAIL = "support@ajoflow.com";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || getUserAppUrl()
  );
}

/** Absolute canonical URL. Homepage always ends with a trailing slash. */
export function getCanonicalUrl(path: string) {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
