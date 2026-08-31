import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Security } from "@/components/sections/Security";
import { SocialProof } from "@/components/sections/SocialProof";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQS } from "@/lib/faq";
import { homeMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_PRODUCT, getSiteUrl } from "@/lib/site";

export const metadata = homeMetadata;

export default function LandingPage() {
  const siteUrl = getSiteUrl();

  return (
    <MarketingChrome>
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Security />
        <SocialProof />
        <FAQ />
        <CTA />
      </main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: SITE_NAME,
          alternateName: SITE_PRODUCT,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: siteUrl,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "NGN",
          },
          description:
            "Digital ajo savings for Nigeria with target and general plans, automated contributions, and bank payouts.",
        }}
      />
    </MarketingChrome>
  );
}
