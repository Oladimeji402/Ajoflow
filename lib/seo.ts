import type { Metadata } from "next";
import { SITE_DEFAULT_TITLE, SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetaInput): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const isHome = path === "/";
  const fullTitle = isHome ? SITE_DEFAULT_TITLE : `${title} | ${SITE_NAME}`;

  return {
    title: isHome ? { absolute: SITE_DEFAULT_TITLE } : title,
    description,
    alternates: { canonical: path },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export const homeMetadata: Metadata = pageMetadata({
  title: SITE_DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});
