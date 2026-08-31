import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_PRODUCT, SITE_SUPPORT_EMAIL, getSiteUrl } from "@/lib/site";

export function SiteJsonLd() {
  const siteUrl = getSiteUrl();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["Organization", "FinancialService"],
            "@id": `${siteUrl}/#organization`,
            name: SITE_PRODUCT,
            legalName: SITE_NAME,
            alternateName: [SITE_NAME, "Subtech"],
            url: siteUrl,
            logo: `${siteUrl}/subtech-ajo-logo.svg`,
            image: `${siteUrl}/subtech-ajo-logo.svg`,
            email: SITE_SUPPORT_EMAIL,
            description:
              "AjoFlow is a digital Ajo and automated savings platform for Nigeria. Target and general savings plans, scheduled contributions, and bank payouts.",
            areaServed: {
              "@type": "Country",
              name: "Nigeria",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "NG",
            },
            currenciesAccepted: "NGN",
            parentOrganization: {
              "@type": "Organization",
              name: "Subtech",
            },
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: SITE_PRODUCT,
            alternateName: SITE_NAME,
            publisher: { "@id": `${siteUrl}/#organization` },
            inLanguage: "en-NG",
          },
        ],
      }}
    />
  );
}
