import { getUserAppUrl } from "@/lib/app-urls";

export const SITE_NAME = "Subtech Ajo Solution";
export const SITE_PRODUCT = "AjoFlow";
export const SITE_TAGLINE = "Digital Ajo Savings";
export const SITE_DEFAULT_TITLE = "Subtech Ajo Solution — Digital Ajo Savings in Nigeria";
export const SITE_DESCRIPTION =
  "Save toward a target or a general plan with Subtech Ajo Solution. Digital ajo savings for Nigeria — automated contributions, a live passbook, and payouts to your bank.";
export const SITE_SUPPORT_EMAIL = "support@ajoflow.com";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || getUserAppUrl()
  );
}
