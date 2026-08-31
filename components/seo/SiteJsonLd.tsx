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
            name: SITE_NAME,
            alternateName: SITE_PRODUCT,
            url: siteUrl,
            logo: `${siteUrl}/favicon.svg`,
            image: `${siteUrl}/favicon.svg`,
            email: SITE_SUPPORT_EMAIL,
            description:
              "Digital ajo savings platform for Nigeria. Target and general savings plans with automated contributions and bank payouts.",
            areaServed: {
              "@type": "Country",
              name: "Nigeria",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "NG",
            },
            priceRange: "Free",
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
            name: SITE_NAME,
            alternateName: SITE_PRODUCT,
            publisher: { "@id": `${siteUrl}/#organization` },
            inLanguage: "en-NG",
          },
        ],
      }}
    />
  );
}
