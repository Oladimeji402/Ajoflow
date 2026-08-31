import Link from 'next/link';
import { Container } from '../ui/Container';
import { BrandLogo } from '../ui/BrandLogo';
import { MonicreditLogo } from '../ui/MonicreditLogo';
import { SITE_NAME, SITE_SUPPORT_EMAIL } from '@/lib/site';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Product',
            links: [
                { name: 'How it Works', href: '/#how-it-works' },
                { name: 'Savings features', href: '/#features' },
                { name: 'Target savings', href: '/#features' },
                { name: 'Security', href: '/#security' },
                { name: 'FAQ', href: '/#faq' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Log in', href: '/login' },
                { name: 'Sign up', href: '/signup' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
            ],
        },
    ];

    return (
        <footer className="relative overflow-hidden border-t border-white/[0.08] bg-brand-navy">
            <Container className="py-14">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16">
                    <div className="col-span-2">
                        <BrandLogo size="sm" className="mb-5" />
                        <p className="text-[13px] text-slate-400 max-w-xs mb-6 leading-relaxed">
                            Digital Ajo savings for Nigeria. Run savings groups, automate contributions, track every naira, and receive scheduled payouts.
                        </p>
                        <a
                            href={`mailto:${SITE_SUPPORT_EMAIL}`}
                            className="text-[13px] font-semibold text-white/80 hover:text-white transition-colors"
                        >
                            {SITE_SUPPORT_EMAIL}
                        </a>
                    </div>

                    {footerLinks.map((group) => (
                        <div key={group.title}>
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.12em] mb-4">{group.title}</p>
                            <ul className="space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </Container>

            <div className="border-t border-white/[0.06]">
                <Container className="py-5 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-[11px] text-slate-600">
                        © {currentYear} {SITE_NAME}. All rights reserved.
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-md px-2.5 py-1.5">
                            <MonicreditLogo size={16} />
                            <span className="text-[11px] font-medium text-slate-400">Payments by Monicredit</span>
                        </div>
                        <span className="text-[11px] text-slate-600">· 256-bit SSL secured</span>
                    </div>
                </Container>
            </div>
        </footer>
    );
};
