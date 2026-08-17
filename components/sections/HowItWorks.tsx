'use client';

import { Container } from '../ui/Container';
import {
    motion,
    useInView,
    useMotionValueEvent,
    useScroll,
    useSpring,
    useTransform,
} from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { UserPlus, Search, CreditCard, Wallet } from 'lucide-react';

const steps = [
    {
        number: '1',
        title: 'Create your account',
        description: 'Sign up in under 2 minutes. Quick KYC keeps your account secure.',
        icon: UserPlus,
    },
    {
        number: '2',
        title: 'Create your savings plan',
        description: 'Create target plans or general plans across daily, weekly, or monthly frequency.',
        icon: Search,
    },
    {
        number: '3',
        title: 'Automate contributions',
        description: 'Link your bank account, set a schedule — we handle the rest.',
        icon: CreditCard,
    },
    {
        number: '4',
        title: 'Track and withdraw on schedule',
        description: 'Monitor contributions in passbook and process payouts with clear bank account records.',
        icon: Wallet,
    },
];

const StepItem = ({
    step,
    desktopActive,
    isDesktop,
    cardRef,
}: {
    step: (typeof steps)[number];
    desktopActive: boolean;
    isDesktop: boolean;
    cardRef: (el: HTMLDivElement | null) => void;
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const inView = useInView(wrapRef, { once: true, amount: 0.55, margin: '0px 0px -18% 0px' });
    const active = isDesktop ? desktopActive : inView;
    const Icon = step.icon;

    return (
        <div ref={wrapRef} className="relative z-10 flex flex-col items-center text-center">
            <div
                ref={cardRef}
                className="relative w-[92px] h-[92px] rounded-[22px] bg-white flex items-center justify-center"
                style={{
                    border: '1px solid rgba(13,26,110,0.06)',
                    boxShadow: '0 10px 28px rgba(13,26,110,0.07)',
                }}
            >
                <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-colors duration-300"
                    style={{
                        fontFamily: 'var(--font-display)',
                        backgroundColor: active ? '#1A35D4' : '#E8ECF8',
                        color: active ? '#FFFFFF' : 'rgba(13,26,110,0.4)',
                    }}
                >
                    {step.number}
                </span>
                <Icon
                    size={28}
                    strokeWidth={1.6}
                    className="transition-colors duration-300"
                    color={active ? '#1A35D4' : 'rgba(26,53,212,0.35)'}
                />
            </div>

            <h3
                className="mt-6 font-bold text-[16px] mb-2 leading-tight"
                style={{ fontFamily: 'var(--font-display)', color: '#0D1A6E' }}
            >
                {step.title}
            </h3>
            <p className="text-brand-gray text-[13.5px] leading-relaxed max-w-[230px]">
                {step.description}
            </p>
        </div>
    );
};

export const HowItWorks = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [rail, setRail] = useState({ left: 0, width: 0, top: 0 });
    const [reached, setReached] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const isDesktopRef = useRef(false);

    useLayoutEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const sync = () => {
            isDesktopRef.current = mq.matches;
            setIsDesktop(mq.matches);
        };
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 90,
        damping: 28,
        mass: 0.28,
        restDelta: 0.0005,
    });

    const fillScale = useTransform(progress, [0, 1], [0, 1]);
    const beadX = useTransform(progress, [0, 1], ['0%', '100%']);

    useMotionValueEvent(progress, 'change', (v) => {
        if (!isDesktopRef.current) return;
        setReached(Math.round(v * (steps.length - 1)));
    });

    useLayoutEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const measure = () => {
            if (window.innerWidth < 1024) {
                setRail({ left: 0, width: 0, top: 0 });
                return;
            }
            const first = cardRefs.current[0];
            const last = cardRefs.current[steps.length - 1];
            if (!first || !last) return;
            const g = track.getBoundingClientRect();
            const a = first.getBoundingClientRect();
            const b = last.getBoundingClientRect();
            const start = a.left - g.left + a.width / 2;
            const end = b.left - g.left + b.width / 2;
            setRail({
                left: start,
                width: Math.max(0, end - start),
                top: a.top - g.top + a.height / 2,
            });
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(track);
        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="relative scroll-mt-[7rem] max-lg:overflow-x-hidden lg:h-[240vh]"
            style={{ backgroundColor: '#EEF1FB' }}
        >
            <div className="relative overflow-x-hidden lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center py-24 lg:py-0 lg:pt-28 lg:pb-12">
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100%)] h-[300px] rounded-full bg-brand-accent/[0.04] blur-[80px]" />
                </div>

                <Container className="relative z-10">
                    <div className="mb-14 lg:mb-16 lg:text-center">
                        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#1A35D4] mb-4">
                            How It Works
                        </p>
                        <h2
                            className="leading-[1.04] max-w-md lg:max-w-xl lg:mx-auto"
                            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#0D1A6E' }}
                        >
                            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>Four steps </span>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em' }}>to your first savings win.</span>
                        </h2>
                    </div>

                    <div ref={trackRef} className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                        {rail.width > 0 && (
                            <div
                                className="hidden lg:block absolute h-[3px] pointer-events-none z-0"
                                style={{ top: rail.top, left: rail.left, width: rail.width }}
                                aria-hidden
                            >
                                <div className="absolute inset-0 rounded-full bg-[#1A35D4]/12" />
                                <motion.div
                                    className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                                    style={{ backgroundColor: '#1A35D4', scaleX: fillScale }}
                                />
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full"
                                    style={{
                                        left: beadX,
                                        backgroundColor: '#1A35D4',
                                        boxShadow: '0 0 0 6px rgba(26,53,212,0.14)',
                                    }}
                                />
                            </div>
                        )}

                        {steps.map((step, i) => (
                            <StepItem
                                key={step.number}
                                step={step}
                                desktopActive={reached >= i}
                                isDesktop={isDesktop}
                                cardRef={(el) => {
                                    cardRefs.current[i] = el;
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-14 pt-8 border-t border-brand-navy/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p className="text-[13px] text-brand-gray">
                            No hidden fees. No manual tracking. Clear savings history.
                        </p>
                        <a
                            href="/signup"
                            className="inline-flex items-center gap-1.5 text-[13px] font-bold px-5 py-2.5 rounded-full bg-[#F5A623] text-[#6B3C00] hover:bg-[#FBBF24] transition-colors shadow-[0_4px_16px_rgba(245,162,35,0.22)]"
                        >
                            Start saving
                            <span aria-hidden>→</span>
                        </a>
                    </div>
                </Container>
            </div>
        </section>
    );
};
