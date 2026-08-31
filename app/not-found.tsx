import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "That page does not exist on AjoFlow. Return home or open your dashboard.",
  path: "/404",
  index: false,
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <BrandLogo href="/" size="md" dark />
        </div>
        <p className="font-display text-6xl font-bold text-brand-navy tracking-tight">
          404
        </p>
        <h1 className="font-display text-2xl font-bold text-brand-navy">
          Page not found
        </h1>
        <p className="text-sm text-brand-gray leading-relaxed">
          That link doesn&apos;t lead anywhere on Subtech Ajo Solution. Head home or open your dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white hover:bg-brand-primary-hover transition-colors"
          >
            Go to home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-brand-navy/15 bg-white px-5 py-3 text-sm font-bold text-brand-navy hover:bg-white/80 transition-colors"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
