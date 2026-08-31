import Link from "next/link";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get help with AjoFlow. Email support or open a ticket in the app for questions about savings plans, payouts, KYC, or your account.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <MarketingChrome>
      <main>
        <header className="bg-brand-navy pt-32 pb-16 sm:pt-36 sm:pb-20">
          <Container>
            <Breadcrumbs items={[{ name: "Contact" }]} light />
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
              Support
            </p>
            <h1
              className="mt-3 max-w-3xl leading-[1.05] text-white"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
            >
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
                We are
              </span>{" "}
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                here to help.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/65">
              Questions about plans, payouts, KYC, or your {SITE_NAME} account can go to email or
              through the in-app support desk once you are signed in.
            </p>
          </Container>
        </header>

        <section className="bg-white py-16 sm:py-20">
          <Container>
            <div className="grid gap-6 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <Mail className="text-brand-primary" size={22} aria-hidden />
                <h2 className="mt-4 text-lg font-bold text-brand-navy">Email</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Write to us and we will route it to the right team.
                </p>
                <a
                  href={`mailto:${SITE_SUPPORT_EMAIL}`}
                  className="mt-4 inline-block text-sm font-bold text-brand-primary hover:underline"
                >
                  {SITE_SUPPORT_EMAIL}
                </a>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <MessageSquare className="text-brand-primary" size={22} aria-hidden />
                <h2 className="mt-4 text-lg font-bold text-brand-navy">In-app tickets</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Signed-in members can open and track support tickets from the dashboard.
                </p>
                <Link href="/support" className="mt-4 inline-block text-sm font-bold text-brand-primary hover:underline">
                  Open support
                </Link>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <LifeBuoy className="text-brand-primary" size={22} aria-hidden />
                <h2 className="mt-4 text-lg font-bold text-brand-navy">FAQs</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Most questions about plans, fees, KYC, and payouts are answered on the homepage.
                </p>
                <Link href="/#faq" className="mt-4 inline-block text-sm font-bold text-brand-primary hover:underline">
                  Read the FAQ
                </Link>
              </article>
            </div>

            <p className="mt-12 max-w-2xl text-sm leading-relaxed text-slate-500">
              {SITE_NAME} serves customers in Nigeria. We do not publish a walk-in office address.
              For legal notices, see our{" "}
              <Link href="/terms" className="font-semibold text-brand-navy hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-brand-navy hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </Container>
        </section>
      </main>
    </MarketingChrome>
  );
}
