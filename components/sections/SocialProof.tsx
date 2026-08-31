'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '../ui/Container';
import { SectionHeader } from './SectionHeader';
import { motion } from 'motion/react';
import { BookOpen, ShieldCheck, Target, Wallet } from 'lucide-react';
import { MonicreditLogo } from '../ui/MonicreditLogo';

const audiences = [
  {
    icon: Target,
    title: 'Saving toward a goal',
    body: 'Set an amount and a date for rent, school fees, inventory, or a ceremony. Contributions run on a daily, weekly, or monthly rhythm until the target is met.',
  },
  {
    icon: Wallet,
    title: 'Keeping a general plan',
    body: 'No single end-goal required. A general plan is ongoing savings you can inspect in the passbook and withdraw according to the plan schedule.',
  },
  {
    icon: BookOpen,
    title: 'Replacing paper and group chats',
    body: 'Every contribution and payout is recorded. You do not have to reconstruct who paid from screenshots or a notebook when a cycle closes.',
  },
];

const safeguards = [
  {
    title: 'AMK 69 Project 1',
    body: 'Proud sponsor',
    visual: 'sponsor' as const,
  },
  {
    title: 'Monicredit',
    body: 'Licensed payments',
    visual: 'pay' as const,
  },
  {
    title: 'KYC before payouts',
    body: 'Verified accounts only',
    visual: 'kyc' as const,
  },
  {
    title: '256-bit SSL',
    body: 'Encrypted in transit',
    visual: 'ssl' as const,
  },
];

export const SocialProof = () => {
  return (
    <section id="proof" className="py-24 lg:py-32 bg-brand-light relative overflow-hidden scroll-mt-[7rem]">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 lg:mb-16"
        >
          <SectionHeader
            eyebrow="Who it's for"
            serif="Made for"
            rest="how people already save."
            subhead={
              <>
                Set a{' '}
                <Link href="/#features" className="font-semibold text-brand-navy hover:underline">
                  target savings
                </Link>{' '}
                goal, keep a{' '}
                <Link href="/#features" className="font-semibold text-brand-navy hover:underline">
                  general savings
                </Link>{' '}
                plan running, or stop reconstructing payments from chat screenshots — with payouts through a licensed partner.
              </>
            }
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {audiences.map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 lg:p-7 shadow-sm shadow-slate-200/60"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                <item.icon size={20} aria-hidden />
              </div>
              <h3
                className="text-[1.15rem] leading-snug text-brand-navy mb-2"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                {item.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-brand-gray">{item.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-bold text-brand-gray uppercase tracking-[0.15em] mb-4">
            What you can verify
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {safeguards.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
                  {item.visual === 'sponsor' ? (
                    <Image
                      src="/amk69-logo.svg"
                      alt=""
                      width={36}
                      height={20}
                      className="h-5 w-auto"
                    />
                  ) : item.visual === 'pay' ? (
                    <MonicreditLogo size={22} />
                  ) : item.visual === 'kyc' ? (
                    <ShieldCheck size={16} className="text-brand-primary" aria-hidden />
                  ) : (
                    <ShieldCheck size={16} className="text-brand-emerald" aria-hidden />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-brand-navy leading-none">{item.title}</p>
                  <p className="text-[12px] text-brand-gray mt-1">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
