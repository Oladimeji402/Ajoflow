import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import {
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_OG_DESCRIPTION,
  SITE_PRODUCT,
  getSiteUrl,
} from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: `%s | ${SITE_PRODUCT}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_PRODUCT,
  authors: [{ name: SITE_PRODUCT, url: siteUrl }],
  creator: SITE_PRODUCT,
  publisher: SITE_PRODUCT,
  category: "finance",
  keywords: [
    "AjoFlow",
    "digital ajo",
    "ajo savings",
    "automated savings",
    "savings groups",
    "esusu",
    "target savings",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/`,
    siteName: SITE_PRODUCT,
    title: SITE_DEFAULT_TITLE,
    description: SITE_OG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_OG_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A35D4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-NG"
      className={`${dmSans.variable} ${syne.variable} ${instrumentSerif.variable}`}
    >
      <body suppressHydrationWarning>
        <SiteJsonLd />
        <ToastProvider>
          {children}
          <CookieBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
