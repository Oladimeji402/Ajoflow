'use client';

import { Container } from '../ui/Container';
import { SectionHeader } from './SectionHeader';
import {
    motion,
    useInView,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'motion/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { UserPlus, Search, CreditCard, Wallet } from 'lucide-react';
import Link from 'next/link';

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
        description: 'Create target savings or general savings across daily, weekly, or monthly contribution schedules.',
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
    const inView = useInView(wrapRef, { once: true, amount: 0.45, margin: '0px 0px -12% 0px' });
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
    const reduceMotion = useReducedMotion();

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
        offset: ['start 0.78', 'end 0.42'],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: reduceMotion ? 400 : 70,
        damping: reduceMotion ? 40 : 26,
        mass: 0.24,
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
            className="relative scroll-mt-[7rem] overflow-x-hidden bg-brand-light py-24 lg:py-32"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,100%)] h-[300px] rounded-full bg-brand-accent/[0.04] blur-[80px]" />
            </div>

            <Container className="relative z-10">
                <SectionHeader
                    className="mb-12 lg:mb-16"
                    eyebrow="How it works"
                    serif="How AjoFlow"
                    rest="Works"
                    subhead="Create a digital Ajo plan — target savings or general savings — then contribute on a schedule, watch the passbook, and get paid out to your bank."
                />

                <div ref={trackRef} className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
                    {rail.width > 0 && (
                        <div
                            className="hidden lg:block absolute h-px pointer-events-none z-0"
                            style={{ top: rail.top, left: rail.left, width: rail.width }}
                            aria-hidden
                        >
                            <div className="absolute inset-0 rounded-full bg-[#1A35D4]/18" />
                            <motion.div
                                className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
                                style={{ backgroundColor: '#1A35D4', height: 1, scaleX: fillScale }}
                            />
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full"
                                style={{
                                    left: beadX,
                                    backgroundColor: '#1A35D4',
                                    boxShadow: '0 0 0 3px rgba(26,53,212,0.12)',
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
                        No hidden fees. No manual tracking.{' '}
                        <Link href="/#faq" className="font-semibold text-brand-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 rounded-sm">
                            Read the FAQs
                        </Link>
                        {' '}or learn more{' '}
                        <Link href="/about" className="font-semibold text-brand-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/30 rounded-sm">
                            about AjoFlow
                        </Link>
                        .
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-1.5 text-[13px] font-bold px-5 py-2.5 rounded-full bg-[#F5A623] text-[#6B3C00] hover:bg-[#FBBF24] transition-colors shadow-[0_4px_16px_rgba(245,162,35,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2"
                    >
                        Start saving
                        <span aria-hidden>→</span>
                    </Link>
                </div>
            </Container>
        </section>
    );
};
