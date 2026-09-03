import type { ReactNode } from 'react';
import {
    ArrowDownLeft,
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Bell,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Eye,
    History,
    LayoutDashboard,
    LogOut,
    Plus,
    RefreshCw,
    Search,
    Settings,
    ShieldCheck,
    Target,
    Trash2,
} from 'lucide-react';

/* The mock renders the real dashboard markup at true iPhone logical size
   (390 × 844) and scales the whole viewport down, so every type size,
   icon, radius and spacing value is the one the app actually ships. */
const SCREEN_W = 390;
const SCREEN_H = 844;
const SCALE = 0.64;
const BEZEL = 11;

const VIEW_W = Math.round(SCREEN_W * SCALE);
const VIEW_H = Math.round(SCREEN_H * SCALE);
const SCREEN_RADIUS = Math.round(55 * SCALE);

function StatusBar() {
    return (
        <div className="flex h-[54px] shrink-0 items-center justify-between px-8 pt-2 text-brand-navy">
            <span className="text-[15px] font-semibold tracking-tight">9:41</span>
            <span className="flex items-center gap-1.5" aria-hidden>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
                    <rect x="0" y="8" width="3" height="4" rx="0.8" />
                    <rect x="4.4" y="5.5" width="3" height="6.5" rx="0.8" />
                    <rect x="8.8" y="3" width="3" height="9" rx="0.8" />
                    <rect x="13.2" y="0" width="3" height="12" rx="0.8" />
                </svg>
                <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                    <path d="M8.5 11.6 6.1 8.7a3.8 3.8 0 0 1 4.8 0l-2.4 2.9Z" />
                    <path
                        d="M3.5 5.9a7.6 7.6 0 0 1 10 0"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <path
                        d="M.9 2.9a11.5 11.5 0 0 1 15.2 0"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
                <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                    <rect x="0.6" y="0.6" width="23" height="11.8" rx="3.6" stroke="currentColor" opacity="0.35" />
                    <rect x="2.2" y="2.2" width="17" height="8.6" rx="2.2" fill="currentColor" />
                    <path
                        d="M25.2 4.4c1 .3 1.4 1 1.4 2.1s-.4 1.8-1.4 2.1V4.4Z"
                        fill="currentColor"
                        opacity="0.35"
                    />
                </svg>
            </span>
        </div>
    );
}

/* Mirrors DashboardLayout's mobile header + bottom tab bar exactly. */
function AppChrome({
    section,
    heading,
    active,
    children,
}: {
    section: string;
    heading: string;
    active: 'Dashboard' | 'Passbook' | 'Savings' | 'Activity' | 'Settings' | null;
    children: ReactNode;
}) {
    const tabs = [
        { name: 'Dashboard', label: 'Home', icon: <LayoutDashboard size={18} /> },
        { name: 'Passbook', label: 'Passbook', icon: <BookOpen size={18} /> },
        { name: 'Savings', label: 'Save', icon: <Target size={18} /> },
        { name: 'Activity', label: 'Activity', icon: <History size={18} /> },
        { name: 'Settings', label: 'Settings', icon: <Settings size={18} /> },
    ] as const;

    return (
        <div className="flex h-full flex-col bg-linear-to-b from-[#EFF6FF] via-[#F0F5FF] to-white">
            <StatusBar />

            <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gray">
                            {section}
                        </p>
                        <p className="truncate text-sm font-semibold text-brand-navy">{heading}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand-gray">
                            <Bell size={16} />
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                                3
                            </span>
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand-gray">
                            <LogOut size={16} />
                        </span>
                    </div>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden p-4 pb-24">{children}</div>

            <div className="absolute inset-x-0 bottom-0 z-50 p-3 pb-6">
                <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/95 px-2 py-2 shadow-xl shadow-slate-300/30 backdrop-blur-xl">
                    <div className="grid grid-cols-5 items-end gap-1">
                        {tabs.map((tab) => {
                            const isActive = active === tab.name;

                            if (tab.name === 'Savings') {
                                return (
                                    <span
                                        key={tab.name}
                                        className={`-mt-5 flex flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 text-[9px] font-bold ${
                                            isActive
                                                ? 'bg-linear-to-b from-[#60A5FA] to-[#1D4ED8] text-white shadow-lg shadow-blue-500/40'
                                                : 'bg-linear-to-b from-[#0C1A4D] to-[#1D4ED8] text-white shadow-md shadow-blue-900/30'
                                        }`}
                                    >
                                        <Target size={16} />
                                        <span className="whitespace-nowrap uppercase leading-none tracking-[0.05em]">
                                            {tab.label}
                                        </span>
                                    </span>
                                );
                            }

                            return (
                                <span
                                    key={tab.name}
                                    className={`relative flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[9px] font-semibold ${
                                        isActive ? 'text-brand-navy' : 'text-slate-400'
                                    }`}
                                >
                                    {tab.icon}
                                    <span className="whitespace-nowrap uppercase leading-none tracking-[0.04em]">
                                        {tab.label}
                                    </span>
                                    {isActive && <span className="h-1 w-1 rounded-full bg-brand-primary" />}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

const RECENT = [
    { label: 'Wallet funding', date: '26 Mar', amount: '50,000.00', out: false },
    { label: 'Saved to Rent Fund', date: '26 Mar', amount: '50,000.00', out: true },
    { label: 'Lagos Circle payout', date: '24 Mar', amount: '600,000.00', out: false },
    { label: 'Lagos Circle', date: '19 Mar', amount: '25,000.00', out: true },
] as const;

function DashboardScreen() {
    const quickActions = [
        { icon: CreditCard, label: 'Pay Now' },
        { icon: Target, label: 'Savings' },
        { icon: BookOpen, label: 'Passbook' },
    ];

    return (
        <AppChrome section="Dashboard" heading="Good morning, Ada" active="Dashboard">
            <div className="mx-auto max-w-md space-y-4">
                <section className="rounded-3xl bg-brand-primary p-5 text-white shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <ShieldCheck size={16} className="shrink-0 text-white/80" />
                            <span className="text-sm font-medium text-white/90">Available Balance</span>
                            <Eye size={15} className="text-white/70" />
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-white/85">
                            History
                            <ChevronRight size={14} />
                        </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                        <div className="text-left">
                            <p className="text-3xl font-bold leading-none tracking-tight">
                                <span className="text-2xl font-semibold">₦</span>95,000.00
                            </p>
                            <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/60">
                                <RefreshCw size={11} />
                                Tap to refresh
                            </span>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-bold text-white">
                            <Plus size={16} strokeWidth={2.5} />
                            Add Money
                        </span>
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white px-3 py-4">
                    <div className="grid grid-cols-3 gap-1">
                        {quickActions.map(({ icon: Icon, label }) => (
                            <div key={label} className="flex flex-col items-center gap-2 px-2 py-1">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-primary">
                                    <Icon size={22} />
                                </div>
                                <span className="text-center text-xs font-semibold text-brand-navy">{label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="mb-2.5 flex items-center justify-between px-0.5">
                        <h2 className="text-sm font-bold text-brand-navy">Recent</h2>
                        <span className="text-xs font-semibold text-brand-primary">See all</span>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {RECENT.map((tx) => (
                            <div key={tx.label + tx.date} className="flex items-center gap-3 px-4 py-3">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                        tx.out ? 'bg-brand-light' : 'bg-emerald-50'
                                    }`}
                                >
                                    {tx.out ? (
                                        <ArrowUpRight size={16} className="text-brand-primary" />
                                    ) : (
                                        <ArrowDownLeft size={16} className="text-emerald-600" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-brand-navy">{tx.label}</p>
                                    <p className="text-[10px] text-brand-gray">{tx.date}</p>
                                </div>
                                <p
                                    className={`text-sm font-bold ${
                                        tx.out ? 'text-brand-navy' : 'text-emerald-600'
                                    }`}
                                >
                                    {tx.out ? '-' : '+'}
                                    {tx.amount}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AppChrome>
    );
}

function PayScreen() {
    return (
        <AppChrome section="Pay" heading="Pay" active={null}>
            <div className="mx-auto max-w-lg space-y-5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gray">
                    <ArrowLeft size={14} /> Back
                </span>

                <div>
                    <h1 className="flex items-center gap-2 text-xl font-bold text-brand-navy">
                        <CreditCard size={20} className="text-brand-primary" />
                        Make Payment
                    </h1>
                    <p className="mt-0.5 text-xs text-brand-gray">
                        Select savings, enter amount, and pay from wallet.
                    </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-bold text-brand-navy">Step 1 — Select &amp; add</h2>
                    <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-brand-navy">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-primary/15">
                            <Target size={13} className="text-brand-primary" />
                        </span>
                        <span className="min-w-0 flex-1 truncate font-medium">Rent Fund · Weekly</span>
                        <ChevronRight size={15} className="shrink-0 rotate-90 text-slate-400" />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-brand-navy">
                            50000
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white">
                            <Plus size={13} /> Add
                        </span>
                    </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-bold text-brand-navy">Step 2 — Review &amp; pay</h2>

                    <div className="divide-y divide-slate-50 overflow-hidden rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3 bg-white px-3 py-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED820]">
                                <Target size={14} className="text-[#1D4ED8]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-brand-navy">Rent Fund</p>
                                <p className="text-[10px] capitalize text-brand-gray">Target · weekly</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <p className="text-sm font-bold text-brand-navy">NGN 50,000</p>
                                <Trash2 size={13} className="text-slate-300" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-3 py-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#10B98120]">
                                <Calendar size={14} className="text-emerald-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-brand-navy">Detty December</p>
                                <p className="text-[10px] capitalize text-brand-gray">General · monthly</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <p className="text-sm font-bold text-brand-navy">NGN 20,000</p>
                                <Trash2 size={13} className="text-slate-300" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <span className="text-sm font-bold text-brand-navy">Total</span>
                        <span className="text-lg font-bold text-brand-navy">NGN 70,000</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] text-blue-700">
                        <ShieldCheck size={12} className="shrink-0" />
                        Debited from wallet instantly. General savings are paid out on fixed platform dates.
                    </div>

                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white">
                        Pay NGN 70,000 <ArrowRight size={15} />
                    </span>
                </div>
            </div>
        </AppChrome>
    );
}

const ACTIVITY = [
    {
        label: 'Payout — Lagos Circle',
        meta: '24 Mar 2026 · Ref: 7F42A9C1',
        amount: 'NGN 600,000',
        sign: '+',
        Icon: ArrowDownLeft,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        amountColor: 'text-emerald-600',
    },
    {
        label: 'Saved to Rent Fund',
        meta: '26 Mar 2026 · Ref: 22B0D5E8',
        amount: 'NGN 50,000',
        sign: '-',
        Icon: Target,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
        amountColor: 'text-brand-navy',
    },
    {
        label: 'Wallet Funding',
        meta: '26 Mar 2026 · Ref: A19C6B3D',
        amount: 'NGN 50,000',
        sign: '+',
        Icon: ArrowDownLeft,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        amountColor: 'text-emerald-600',
    },
    {
        label: 'Lagos Circle',
        meta: '19 Mar 2026 · Ref: 5C81FE07',
        amount: 'NGN 25,000',
        sign: '-',
        Icon: ArrowUpRight,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        amountColor: 'text-brand-navy',
    },
    {
        label: 'Passbook Activation Fee',
        meta: '02 Mar 2026 · Ref: 9E44A2B6',
        amount: 'NGN 1,000',
        sign: '-',
        Icon: BookOpen,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        amountColor: 'text-brand-navy',
    },
] as const;

function ActivityScreen() {
    return (
        <AppChrome section="Activity" heading="Payments" active="Activity">
            <div className="mx-auto max-w-2xl space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-brand-gray">18 payments total</p>
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-0.5">
                        {['All', 'Sent', 'Received'].map((item, i) => (
                            <span
                                key={item}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                                    i === 0 ? 'bg-white text-brand-navy shadow-xs' : 'text-brand-gray'
                                }`}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <div className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-400">
                            Search by group name or ref
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {ACTIVITY.map((tx) => (
                            <div key={tx.meta} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tx.iconBg}`}
                                >
                                    <tx.Icon size={16} className={tx.iconColor} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-brand-navy">{tx.label}</p>
                                    <p className="text-[10px] text-brand-gray">{tx.meta}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className={`text-sm font-bold ${tx.amountColor}`}>
                                        {tx.sign}
                                        {tx.amount}
                                    </p>
                                    <p className="text-[10px] font-medium text-emerald-600">Successful</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                        <p className="text-xs text-brand-gray">Page 1 of 2 · 18 payments</p>
                        <div className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-navy opacity-40">
                                <ChevronLeft size={13} /> Prev
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-navy">
                                Next <ChevronRight size={13} />
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </AppChrome>
    );
}

function PhoneFrame({ children }: { children: ReactNode }) {
    return (
        <div className="relative" style={{ width: VIEW_W + BEZEL * 2 }}>
            {/* Side buttons */}
            <span
                className="absolute -left-[2px] top-[96px] z-20 h-[26px] w-[3px] rounded-l-sm bg-[#3a3a3c]"
                aria-hidden
            />
            <span
                className="absolute -left-[2px] top-[140px] z-20 h-[44px] w-[3px] rounded-l-sm bg-[#3a3a3c]"
                aria-hidden
            />
            <span
                className="absolute -left-[2px] top-[196px] z-20 h-[44px] w-[3px] rounded-l-sm bg-[#3a3a3c]"
                aria-hidden
            />
            <span
                className="absolute -right-[2px] top-[168px] z-20 h-[72px] w-[3px] rounded-r-sm bg-[#3a3a3c]"
                aria-hidden
            />

            <div
                className="relative"
                style={{
                    padding: BEZEL,
                    borderRadius: SCREEN_RADIUS + BEZEL,
                    background:
                        'linear-gradient(165deg, #55555a 0%, #1c1c1e 16%, #101012 52%, #2f2f34 84%, #4a4a50 100%)',
                    boxShadow:
                        '0 30px 64px rgba(8,18,80,0.42), inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(0,0,0,0.6)',
                }}
            >
                <div
                    className="relative overflow-hidden bg-[#EFF6FF]"
                    style={{ width: VIEW_W, height: VIEW_H, borderRadius: SCREEN_RADIUS }}
                >
                    {/* Real 390 × 844 viewport, scaled as a whole so every value is the app's own. */}
                    <div
                        className="relative origin-top-left"
                        style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${SCALE})` }}
                    >
                        {children}

                        <div
                            className="absolute left-1/2 top-[11px] z-40 h-[36px] w-[124px] -translate-x-1/2 rounded-full bg-[#050505]"
                            aria-hidden
                        />
                        <div
                            className="absolute bottom-[9px] left-1/2 z-40 h-[5px] w-[140px] -translate-x-1/2 rounded-full bg-brand-navy/30"
                            aria-hidden
                        />
                    </div>
                </div>

                <div
                    className="pointer-events-none absolute inset-[3px] ring-1 ring-white/12"
                    style={{ borderRadius: SCREEN_RADIUS + BEZEL - 3 }}
                    aria-hidden
                />
            </div>
        </div>
    );
}

const FLOATING_CARDS = [
    { layer: '', amount: '+₦50,000', tone: 'text-emerald-600', caption: 'Wallet funded' },
    { layer: 'hero-phone-layer-2', amount: '₦70,000', tone: 'text-brand-navy', caption: 'Paid from wallet' },
    { layer: 'hero-phone-layer-3', amount: '+₦600,000', tone: 'text-emerald-600', caption: 'Payout received' },
] as const;

export function HeroProductVisual() {
    return (
        <div
            className="relative w-[420px] max-w-full"
            role="img"
            aria-label="AjoFlow app demo: the dashboard shows an available wallet balance, a payment is made from the wallet to a savings target, and the payments screen shows a group payout received"
        >
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute left-[6%] top-[16%] h-40 w-40 rounded-full bg-brand-accent/20 blur-2xl"
                aria-hidden
            />

            {/* Floating cards live in the left gutter and only graze the bezel,
                so they never sit on top of readable screen content. */}
            {FLOATING_CARDS.map((card) => (
                <aside
                    key={card.caption}
                    className={`${card.layer} absolute left-0 top-[15%] z-20 w-[164px] rounded-2xl border border-white/70 bg-white px-3.5 py-3 shadow-[0_14px_32px_rgba(8,18,80,0.2)]`}
                >
                    <p className={`text-[15px] font-bold leading-none ${card.tone}`}>{card.amount}</p>
                    <p className="mt-1.5 text-[11px] font-medium text-brand-gray">{card.caption}</p>
                </aside>
            ))}

            <aside className="absolute bottom-[14%] left-[4%] z-20 w-[152px] rounded-2xl border border-white/70 bg-white px-3.5 py-3 shadow-[0_14px_32px_rgba(8,18,80,0.2)]">
                <p className="text-[11px] font-medium text-brand-gray">Next payout</p>
                <p className="mt-1.5 text-[15px] font-bold leading-none text-brand-navy">Mar 26</p>
            </aside>

            <div className="ml-auto w-fit">
                <PhoneFrame>
                    <div className="hero-phone-screen absolute inset-0">
                        <DashboardScreen />
                    </div>
                    <div className="hero-phone-screen hero-phone-layer-2 absolute inset-0">
                        <PayScreen />
                    </div>
                    <div className="hero-phone-screen hero-phone-layer-3 absolute inset-0">
                        <ActivityScreen />
                    </div>
                </PhoneFrame>
            </div>
        </div>
    );
}
