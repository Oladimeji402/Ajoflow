import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SponsorBar } from "@/components/layout/SponsorBar";

export function MarketingChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col scroll-smooth">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-navy"
      >
        Skip to content
      </a>
      <SponsorBar />
      <Navbar />
      <div id="main-content" className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
