'use client';

import { Container } from '../ui/Container';
import { SectionHeader } from './SectionHeader';
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
        <section className="relative overflow-x-hidden bg-white py-24 lg:py-32">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:rounded-[2.5rem] sm:px-12 sm:py-20 lg:rounded-[3rem] lg:px-20 lg:py-24 bg-brand-primary"
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
                        <SectionHeader
                            tone="dark"
                            align="center"
                            className="mb-8"
                            eyebrow="Get started"
                            serif="Start your first"
                            rest="savings win today."
                            subhead="Create a free account, set a target or general plan, and track every contribution in your passbook."
                        />
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
