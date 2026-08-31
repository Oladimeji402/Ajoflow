'use client';

import { Container } from '../ui/Container';
import { SectionHeader } from './SectionHeader';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowDownLeft, Zap } from 'lucide-react';

const GhostNumber = ({ n }: { n: string }) => (
    <span
        className="absolute -top-2 right-4 text-[5.5rem] font-black leading-none select-none pointer-events-none"
        style={{ fontFamily: 'var(--font-display)', color: '#F5A623', opacity: 0.12 }}
    >
        {n}
    </span>
);

const AutomationCard = () => (
    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
        <GhostNumber n="01" />
        <div className="relative grid h-full items-center gap-6 sm:grid-cols-2">
            <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-primary">Automation</p>
                <h3
                    className="mb-2 text-[1.4rem] leading-tight text-brand-navy"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    Never miss a contribution
                </h3>
                <p className="text-[14px] leading-relaxed text-brand-gray">
                    Set your amount and schedule once. Automatic deductions happen on time — daily, weekly, or monthly.
                </p>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-brand-light p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gray">Contribution Schedule</p>
                {[
                    { label: 'Daily deduction', amount: '₦5,000', on: true },
                    { label: 'Weekly deduction', amount: '₦25,000', on: false },
                    { label: 'Monthly target', amount: '₦100,000', on: true },
                ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[12px] font-semibold text-brand-navy">{row.label}</p>
                            <p className="text-[11px] text-brand-gray">{row.amount}</p>
                        </div>
                        <div className={`relative h-5 w-10 shrink-0 rounded-full ${row.on ? 'bg-brand-accent' : 'bg-slate-300'}`}>
                            <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow ${row.on ? 'left-[22px]' : 'left-0.5'}`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PassbookCard = () => {
    const cycles = [
        { period: 'Cycle 1', status: 'paid' as const },
        { period: 'Cycle 2', status: 'paid' as const },
        { period: 'Cycle 3', status: 'paid' as const },
        { period: 'Cycle 4', status: 'current' as const },
        { period: 'Cycle 5', status: 'pending' as const },
        { period: 'Cycle 6', status: 'pending' as const },
    ];

    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
            <GhostNumber n="02" />
            <div className="relative mb-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-primary">Transparency</p>
                <h3
                    className="mb-2 text-[1.35rem] leading-tight text-brand-navy"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    Digital passbook clarity
                </h3>
                <p className="text-[14px] leading-relaxed text-brand-gray">
                    See every paid vs. pending cycle in real time — clear records, no guesswork.
                </p>
            </div>

            <div className="relative mt-auto rounded-xl border border-slate-200 bg-brand-light p-4">
                <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gray">Passbook · Month 4</p>
                    <p className="text-[11px] font-bold text-brand-primary">₦150,000 saved</p>
                </div>
                <div className="space-y-0">
                    {cycles.map((c, i) => (
                        <div key={c.period} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                    c.status === 'paid' ? 'bg-brand-primary/15' :
                                    c.status === 'current' ? 'bg-brand-accent/25' : 'bg-slate-200'
                                }`}>
                                    {c.status === 'paid' && <CheckCircle2 size={9} className="text-brand-primary" />}
                                    {c.status === 'current' && <div className="h-1.5 w-1.5 rounded-full bg-brand-accent" />}
                                    {c.status === 'pending' && <div className="h-1 w-1 rounded-full bg-slate-400" />}
                                </div>
                                {i < cycles.length - 1 && (
                                    <div className={`min-h-[14px] w-px flex-1 ${c.status === 'paid' ? 'bg-brand-primary/30' : 'bg-slate-200'}`} />
                                )}
                            </div>
                            <div className="-mt-0.5 flex flex-1 items-center justify-between pb-3.5">
                                <span className="text-[12px] text-brand-gray">{c.period}</span>
                                <span className={`text-[11px] font-bold ${
                                    c.status === 'paid' ? 'text-brand-primary' :
                                    c.status === 'current' ? 'text-brand-accent-dark' : 'text-slate-400'
                                }`}>
                                    {c.status === 'paid' ? 'Paid' : c.status === 'current' ? 'Due' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PayoutCard = () => (
    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
        <GhostNumber n="03" />
        <div className="relative grid h-full items-center gap-6 sm:grid-cols-2">
            <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-primary">Scheduled payouts</p>
                <h3
                    className="mb-2 text-[1.4rem] leading-tight text-brand-navy"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                    Money lands in seconds
                </h3>
                <p className="text-[14px] leading-relaxed text-brand-gray">
                    When your payout is due, funds transfer instantly to your verified bank account.
                </p>
            </div>

            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex items-center gap-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-3.5"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent/20">
                        <Zap size={16} className="text-brand-accent-dark" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold leading-tight text-brand-navy">Payout Sent</p>
                        <p className="mt-0.5 text-[10px] text-brand-accent-dark">+₦600,000 to Access Bank</p>
                    </div>
                    <span className="shrink-0 rounded bg-brand-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-accent-dark">
                        Success
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.28, duration: 0.4 }}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-brand-light p-3"
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-primary">
                        <ArrowDownLeft size={13} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold text-brand-navy">Target Savings Plan</p>
                        <p className="text-[10px] text-brand-gray">2 min ago</p>
                    </div>
                    <p className="text-[12px] font-bold text-brand-primary">+₦600,000</p>
                </motion.div>
            </div>
        </div>
    </div>
);

export const Features = () => {
    return (
        <section id="features" className="relative scroll-mt-[7rem] overflow-hidden bg-white py-24 lg:py-32">
            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 lg:mb-16"
                >
                    <SectionHeader
                        eyebrow="Savings features"
                        serif="Savings"
                        rest="Features"
                        subhead="Automate contributions, track Ajo savings, and manage payouts — built around how people in Nigeria already save."
                    />
                </motion.div>

                <div className="bento-features">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.5 }}
                        className="[grid-area:automation]"
                    >
                        <AutomationCard />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="[grid-area:passbook]"
                    >
                        <PassbookCard />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="[grid-area:payout]"
                    >
                        <PayoutCard />
                    </motion.div>
                </div>
            </Container>
        </section>
    );
};
