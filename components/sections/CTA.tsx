'use client';

import { Container } from '../ui/Container';
import { motion } from 'motion/react';
import { ArrowRight, Wallet, Zap } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const GlassIcon = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => (
    <div
        className={`hidden md:flex items-center justify-center w-14 h-14 rounded-2xl ${className ?? ''}`}
        style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.22)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
        aria-hidden
    >
        {children}
    </div>
);

export const CTA = () => {
    return (
        <section className="relative overflow-x-hidden bg-white pb-16 lg:pb-24">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center"
                    style={{
                        background: 'linear-gradient(135deg, #1A35D4 0%, #1529A8 48%, #0D1A6E 100%)',
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.07]"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,1) 0.7px, transparent 0.7px)',
                            backgroundSize: '26px 26px',
                        }}
                    />
                    <div
                        className="absolute -top-24 -left-10 w-72 h-72 rounded-full pointer-events-none"
                        style={{ backgroundColor: 'rgba(255,255,255,0.12)', filter: 'blur(70px)' }}
                    />
                    <div
                        className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full pointer-events-none"
                        style={{ backgroundColor: 'rgba(245,166,35,0.16)', filter: 'blur(80px)' }}
                    />

                    <GlassIcon className="absolute left-8 lg:left-14 top-1/2 -translate-y-1/2 -rotate-[14deg]">
                        <Wallet size={22} color="#FFFFFF" strokeWidth={1.7} />
                    </GlassIcon>
                    <GlassIcon className="absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 rotate-[12deg]">
                        <Zap size={22} color="#FFFFFF" strokeWidth={1.7} />
                    </GlassIcon>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2
                            className="leading-[1.08] mb-4"
                            style={{
                                fontSize: 'clamp(1.85rem, 4.2vw, 3.15rem)',
                                color: '#FFFFFF',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                            }}
                        >
                            Start your first savings win today
                        </h2>
                        <p
                            className="text-[15px] sm:text-[16px] leading-relaxed mb-8 max-w-lg mx-auto"
                            style={{ color: 'rgba(255,255,255,0.72)' }}
                        >
                            Create a free account, set a target or general plan, and track every contribution in your passbook.
                        </p>
                        <Link href="/signup">
                            <button
                                className="inline-flex items-center justify-center gap-2 text-[15px] font-bold px-8 py-3.5 rounded-full group transition-transform hover:scale-[1.02]"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#0D1A6E',
                                    boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                                }}
                            >
                                Get Started
                                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};
