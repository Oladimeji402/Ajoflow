'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeader } from './SectionHeader';
import { FAQS } from '@/lib/faq';

type Node = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    glow: boolean;
};

const FaqMesh = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mobile = window.matchMedia('(max-width: 1023px)').matches;
        const count = mobile ? 12 : 18;
        const speed = mobile ? 0.0016 : 0.0024;
        const nodes: Node[] = Array.from({ length: count }, () => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
            r: Math.random() > 0.78 ? 3.2 : 1.4 + Math.random(),
            glow: !mobile && Math.random() > 0.7,
        }));

        let raf = 0;
        let visible = true;
        let w = 1;
        let h = 1;
        let last = 0;
        const frameMs = mobile ? 33 : 16;

        const resize = () => {
            const rect = wrap.getBoundingClientRect();
            w = Math.max(1, rect.width);
            h = Math.max(1, rect.height);
            const dpr = mobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const draw = (t: number) => {
            if (!visible) return;
            if (t - last < frameMs) {
                raf = requestAnimationFrame(draw);
                return;
            }
            last = t;
            ctx.clearRect(0, 0, w, h);

            if (!reduce) {
                for (const n of nodes) {
                    n.x += n.vx;
                    n.y += n.vy;
                    if (n.x < 0 || n.x > 1) n.vx *= -1;
                    if (n.y < 0 || n.y > 1) n.vy *= -1;
                }
            }

            const maxDist = Math.min(w, h) * (mobile ? 0.34 : 0.3);
            const maxDistSq = maxDist * maxDist;

            for (let i = 0; i < nodes.length; i++) {
                const ax = nodes[i].x * w;
                const ay = nodes[i].y * h;
                for (let j = i + 1; j < nodes.length; j++) {
                    const bx = nodes[j].x * w;
                    const by = nodes[j].y * h;
                    const dx = ax - bx;
                    const dy = ay - by;
                    const distSq = dx * dx + dy * dy;
                    if (distSq > maxDistSq) continue;
                    const dist = Math.sqrt(distSq);
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.strokeStyle = `rgba(26,53,212,${(1 - dist / maxDist) * (mobile ? 0.14 : 0.22)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            for (const n of nodes) {
                const px = n.x * w;
                const py = n.y * h;
                if (n.glow) {
                    const g = ctx.createRadialGradient(px, py, 0, px, py, 12);
                    g.addColorStop(0, 'rgba(26,53,212,0.2)');
                    g.addColorStop(1, 'rgba(26,53,212,0)');
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.arc(px, py, 12, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(px, py, n.r, 0, Math.PI * 2);
                ctx.fillStyle = n.glow ? 'rgba(26,53,212,0.45)' : 'rgba(26,53,212,0.26)';
                ctx.fill();
            }

            if (!reduce) raf = requestAnimationFrame(draw);
        };

        resize();
        raf = requestAnimationFrame(draw);

        const ro = new ResizeObserver(resize);
        ro.observe(wrap);

        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                if (visible && !reduce) {
                    cancelAnimationFrame(raf);
                    last = 0;
                    raf = requestAnimationFrame(draw);
                } else {
                    cancelAnimationFrame(raf);
                }
            },
            { threshold: 0.05 },
        );
        io.observe(wrap);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
        };
    }, []);

    return (
        <div ref={wrapRef} className="absolute inset-0" aria-hidden>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export const FAQ = () => {
    const [open, setOpen] = useState(0);
    const [isLg, setIsLg] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const sync = () => setIsLg(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    return (
        <section
            id="faq"
            className="py-24 lg:py-32 relative overflow-hidden scroll-mt-[7rem]"
            style={{ backgroundColor: '#FFFFFF' }}
        >
            {!isLg && (
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 overflow-hidden opacity-[0.28]"
                    aria-hidden
                >
                    <FaqMesh />
                </div>
            )}
            <Container className="relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
                    >
                        {isLg && (
                            <div
                                className="pointer-events-none absolute z-0 -left-12 -right-4 -top-20 -bottom-24"
                                style={{
                                    maskImage: 'linear-gradient(90deg, black 0%, black 58%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 58%, transparent 100%)',
                                }}
                                aria-hidden
                            >
                                <FaqMesh />
                            </div>
                        )}
                        <div className="relative z-10">
                            <SectionHeader
                                eyebrow="FAQ"
                                serif="Questions,"
                                rest="answered."
                                subhead="The things people ask before they start their first plan."
                            />
                        </div>
                    </motion.div>

                    <div className="lg:col-span-7">
                        <div className="border-t border-brand-navy/[0.08]">
                            {FAQS.map((item, i) => {
                                const isOpen = open === i;
                                return (
                                    <div key={item.q} className="border-b border-brand-navy/[0.08]">
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            onClick={() => setOpen(isOpen ? -1 : i)}
                                            className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                                        >
                                            <span
                                                className="text-[15px] sm:text-[16px] font-bold leading-snug pt-0.5"
                                                style={{
                                                    fontFamily: 'var(--font-display)',
                                                    color: '#0D1A6E',
                                                }}
                                            >
                                                {item.q}
                                            </span>
                                            <span
                                                className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                                                style={{
                                                    backgroundColor: isOpen ? '#1A35D4' : 'rgba(13,26,110,0.06)',
                                                    color: isOpen ? '#FFFFFF' : '#0D1A6E',
                                                }}
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                />
                                            </span>
                                        </button>
                                        <div
                                            className="grid transition-[grid-template-rows] duration-300 ease-out"
                                            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="pb-5 pr-12 text-[14px] leading-relaxed text-brand-gray">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};
