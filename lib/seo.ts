import type { Metadata } from "next";
import {
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_DESCRIPTION,
  SITE_PRODUCT,
  getCanonicalUrl,
} from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  ogDescription?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  ogDescription,
}: PageMetaInput): Metadata {
  const url = getCanonicalUrl(path);
  const isHome = path === "/";
  const fullTitle = isHome ? SITE_DEFAULT_TITLE : `${title} | ${SITE_PRODUCT}`;
  const socialDescription = ogDescription ?? (isHome ? SITE_OG_DESCRIPTION : description);

  return {
    title: isHome ? { absolute: SITE_DEFAULT_TITLE } : title,
    description,
    applicationName: SITE_PRODUCT,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title: fullTitle,
      description: socialDescription,
      url,
      siteName: SITE_PRODUCT,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: socialDescription,
    },
  };
}

export const homeMetadata: Metadata = pageMetadata({
  title: SITE_DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  ogDescription: SITE_OG_DESCRIPTION,
});
