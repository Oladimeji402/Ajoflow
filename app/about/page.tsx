import Link from "next/link";
import { Mail, ShieldCheck, Target, BookOpen, Landmark } from "lucide-react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_PRODUCT } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Subtech Ajo Solution brings Nigeria's ajo tradition online. Learn how AjoFlow helps savings groups automate contributions, track every naira, and manage target or general savings with bank payouts.",
  path: "/about",
});

const pillars = [
  {
    icon: Target,
    title: "Target and general plans",
    body: "Save toward a defined goal, or keep a general plan running on a daily, weekly, or monthly rhythm.",
  },
  {
    icon: BookOpen,
    title: "A passbook you can audit",
    body: "Every contribution is recorded. Nothing is guessed, and payout history stays in one place.",
  },
  {
    icon: Landmark,
    title: "Payouts to your bank",
    body: "When a cycle completes, funds go to a verified bank account through licensed payment partners.",
  },
  {
    icon: ShieldCheck,
    title: "KYC and encryption",
    body: "Accounts are verified, traffic is encrypted, and payout details are checked before money moves.",
  },
];

export default function AboutPage() {
  return (
    <MarketingChrome>
      <main>
        <header className="bg-brand-navy pt-32 pb-16 sm:pt-36 sm:pb-20">
          <Container>
            <Breadcrumbs items={[{ name: "About" }]} light />
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
              Company
            </p>
            <h1
              className="mt-3 max-w-3xl leading-[1.05] text-white"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
            >
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>
                Ajo,
              </span>{" "}
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                built for how Nigeria already saves.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/65">
              {SITE_NAME} is the company behind {SITE_PRODUCT}. We digitise rotating and personal
              savings so groups and individuals can contribute on schedule, see every naira, and
              get paid out without chasing records on paper.
            </p>
          </Container>
        </header>

        <section className="bg-white py-16 sm:py-20">
          <Container>
            <div className="grid gap-6 md:grid-cols-2">
              {pillars.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
                >
                  <item.icon className="text-brand-primary" size={22} aria-hidden />
                  <h2 className="mt-4 text-lg font-bold text-brand-navy">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-slate-100 bg-brand-light py-16 sm:py-20">
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold text-brand-navy">How we operate</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-slate-600">
              <p>
                Ajo is already how millions of people in Nigeria save together. We did not invent
                the circle — we made the bookkeeping, reminders, and payouts run on a schedule you
                can inspect.
              </p>
              <p>
                {SITE_PRODUCT} is a software platform, not a bank. Contributions and payouts move
                through licensed payment partners. You must be 18 or older and complete KYC before
                full payout access.
              </p>
              <p>
                The product is sponsored by AMK 69 Project 1. Public policies are on our{" "}
                <Link href="/terms" className="font-semibold text-brand-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-brand-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                pages.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-brand-accent px-6 py-3 text-sm font-bold text-brand-accent-dark hover:bg-[#FBBF24] transition-colors"
              >
                Create an account
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-white px-6 py-3 text-sm font-bold text-brand-navy hover:bg-white/80 transition-colors"
              >
                Contact us
              </Link>
            </div>
          </Container>
        </section>
      </main>
    </MarketingChrome>
  );
}
