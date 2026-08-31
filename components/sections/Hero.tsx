import { Container } from '../ui/Container';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { HeroProductVisual } from './HeroProductVisual';

const TRUST_ITEMS = [
    'Automated contributions',
    'Real-time tracking',
    'Zero missed payouts',
] as const;

export const Hero = () => {
    return (
        <section className="relative overflow-x-hidden bg-brand-primary">
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 0.5px, transparent 0.5px)',
                    backgroundSize: '30px 30px',
                }}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute top-1/2 right-[8%] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-brand-accent/[0.08] blur-[110px]"
                aria-hidden
            />

            <Container className="relative z-10 w-full min-w-0 pt-[108px] pb-12 sm:pt-[116px] sm:pb-16 lg:pt-[132px] lg:pb-20">
                <div className="grid w-full min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
                    <div className="w-full min-w-0 max-w-[540px]">
                        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45 sm:mb-5 sm:tracking-[0.18em]">
                            Digital Ajo • Savings • Payouts
                        </p>

                        <h1 className="mb-5 w-full max-w-full text-[2.05rem] leading-[1.08] font-normal sm:mb-6 sm:text-[clamp(2.5rem,4.6vw,3.65rem)]">
                            <span className="text-white">
                                Your{' '}
                                <span
                                    style={{
                                        fontFamily: 'var(--font-serif)',
                                        fontStyle: 'italic',
                                        fontWeight: 400,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Ajo,
                                </span>
                            </span>
                            <span
                                className="mt-1 block tracking-[-0.04em] text-brand-accent sm:mt-1.5"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    fontWeight: 800,
                                }}
                            >
                                finally organized.
                            </span>
                        </h1>

                        <p className="mb-7 max-w-[440px] text-[15px] leading-[1.65] text-pretty text-white/70 sm:mb-8 sm:text-[17px]">
                            Save with friends, automate contributions, track every naira, and know exactly when
                            your next payout is due.
                        </p>

                        <div className="mb-8 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-center">
                            <Link
                                href="/signup"
                                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-accent px-7 py-3.5 text-[15px] font-bold text-brand-accent-dark shadow-[0_10px_28px_rgba(245,162,35,0.28)] transition-colors hover:bg-[#FBBF24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A35D4] sm:w-auto"
                            >
                                Start Saving — Free
                                <ArrowRight size={16} aria-hidden />
                            </Link>
                            <Link
                                href="/#how-it-works"
                                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 bg-transparent px-7 py-3.5 text-[15px] font-semibold text-white/85 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A35D4] sm:w-auto"
                            >
                                See How It Works
                            </Link>
                        </div>

                        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                            {TRUST_ITEMS.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2 text-[13px] font-semibold text-white/85"
                                >
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                                        aria-hidden
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <HeroProductVisual />
                    </div>
                </div>
            </Container>
        </section>
    );
};
