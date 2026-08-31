import type { ReactNode } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Bell,
    BookOpen,
    CheckCircle2,
    CreditCard,
    Eye,
    History,
    LayoutDashboard,
    LogOut,
    Plus,
    RefreshCw,
    Settings,
    ShieldCheck,
    Target,
    Wallet,
    Zap,
} from 'lucide-react';

function IPhoneFrame({ children }: { children: ReactNode }) {
    return (
        <div className="relative mx-auto w-[min(100%,236px)] sm:w-[252px] lg:w-[268px]">
            {/* Volume / Silent — left */}
            <span
                className="absolute -left-[3px] top-[18%] z-20 h-6 w-[3px] rounded-l-sm bg-[#3a3a3c]"
                aria-hidden
            />
            <span
                className="absolute -left-[3px] top-[26%] z-20 h-10 w-[3px] rounded-l-sm bg-[#3a3a3c]"
                aria-hidden
            />
            <span
                className="absolute -left-[3px] top-[36%] z-20 h-10 w-[3px] rounded-l-sm bg-[#3a3a3c]"
                aria-hidden
            />
            {/* Power — right */}
            <span
                className="absolute -right-[3px] top-[28%] z-20 h-14 w-[3px] rounded-r-sm bg-[#3a3a3c]"
                aria-hidden
            />

            <div
                className="relative overflow-hidden rounded-[2.65rem] p-[10px] shadow-[0_28px_60px_rgba(8,18,80,0.4)]"
                style={{
                    aspectRatio: '9 / 19.4',
                    background:
                        'linear-gradient(165deg, #4a4a4e 0%, #1c1c1e 18%, #111113 52%, #2a2a2e 100%)',
                    boxShadow:
                        '0 28px 60px rgba(8,18,80,0.4), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(0,0,0,0.55)',
                }}
            >
                <div className="absolute inset-[3px] rounded-[2.45rem] ring-1 ring-white/10 pointer-events-none" aria-hidden />

                <div className="relative h-full overflow-hidden rounded-[2.1rem] bg-[#EFF6FF]">
                    <div
                        className="absolute left-1/2 top-[9px] z-30 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#050505] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                        aria-hidden
                    />
                    {children}
                    <div
                        className="absolute bottom-[7px] left-1/2 z-30 h-[3px] w-[84px] -translate-x-1/2 rounded-full bg-brand-navy/25"
                        aria-hidden
                    />
                </div>
            </div>
        </div>
    );
}

function StatusBar() {
    return (
        <div className="flex items-end justify-between px-6 pb-1 pt-[26px] text-[10px] font-semibold text-brand-navy">
            <span>9:41</span>
            <span className="flex items-center gap-1" aria-hidden>
                <svg width="15" height="10" viewBox="0 0 15 10" fill="currentColor">
                    <rect x="0" y="6" width="2.2" height="4" rx="0.4" />
                    <rect x="3.2" y="4" width="2.2" height="6" rx="0.4" />
                    <rect x="6.4" y="2" width="2.2" height="8" rx="0.4" />
                    <rect x="9.6" y="0" width="2.2" height="10" rx="0.4" opacity="0.35" />
                </svg>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path
                        d="M1 5.2C2.6 3.2 4.7 2.1 7 2.1C9.3 2.1 11.4 3.2 13 5.2"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <circle cx="7" cy="7.4" r="1.15" fill="currentColor" />
                </svg>
                <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                    <rect x="0.5" y="0.5" width="18" height="9" rx="2.2" stroke="currentColor" opacity="0.4" />
                    <rect x="2" y="2" width="12" height="6" rx="1" fill="currentColor" />
                    <rect x="19.2" y="3" width="1.6" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
                </svg>
            </span>
        </div>
    );
}

function PhoneChrome({
    eyebrow,
    title,
    children,
    active = 'home',
}: {
    eyebrow: string;
    title: string;
    children: ReactNode;
    active?: 'home' | 'save';
}) {
    return (
        <div className="flex h-full flex-col bg-[#EFF6FF] text-brand-navy">
            <StatusBar />

            <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white/90 px-3 py-2">
                <div className="min-w-0">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-brand-gray">
                        {eyebrow}
                    </p>
                    <p className="truncate text-[11px] font-bold text-brand-navy">{title}</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand-gray">
                        <Bell size={12} aria-hidden />
                        <span className="absolute -right-0.5 -top-0.5 flex h-3 min-w-3 items-center justify-center rounded-full bg-red-500 px-0.5 text-[7px] font-bold text-white">
                            5
                        </span>
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-brand-gray">
                        <LogOut size={12} aria-hidden />
                    </span>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-3 py-3">{children}</div>

            <div className="px-2 pb-4 pt-1">
                <div className="grid grid-cols-5 items-end rounded-2xl border border-slate-200 bg-white px-1 py-1.5 shadow-sm">
                    <span className="relative flex flex-col items-center gap-0.5 text-[7px] font-bold uppercase tracking-wide text-brand-navy">
                        <LayoutDashboard size={13} aria-hidden />
                        Home
                        {active === 'home' ? (
                            <span className="h-1 w-1 rounded-full bg-brand-primary" />
                        ) : null}
                    </span>
                    <span className="flex flex-col items-center gap-0.5 text-[7px] font-semibold uppercase tracking-wide text-slate-400">
                        <BookOpen size={13} aria-hidden />
                        Passbook
                    </span>
                    <span
                        className={`-mt-3 flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[7px] font-bold uppercase text-white shadow-md ${
                            active === 'save'
                                ? 'bg-linear-to-b from-[#60A5FA] to-[#1A35D4]'
                                : 'bg-linear-to-b from-[#0C1A4D] to-[#1A35D4]'
                        }`}
                    >
                        <Target size={13} aria-hidden />
                        Save
                    </span>
                    <span className="flex flex-col items-center gap-0.5 text-[7px] font-semibold uppercase tracking-wide text-slate-400">
                        <History size={13} aria-hidden />
                        Activity
                    </span>
                    <span className="flex flex-col items-center gap-0.5 text-[7px] font-semibold uppercase tracking-wide text-slate-400">
                        <Settings size={13} aria-hidden />
                        Settings
                    </span>
                </div>
            </div>
        </div>
    );
}

function WalletScreen() {
    return (
        <PhoneChrome eyebrow="Wallet" title="Fund your savings">
            <div className="rounded-2xl bg-brand-primary p-3 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] font-medium text-white/85">
                        <ShieldCheck size={11} aria-hidden />
                        Available Balance
                        <Eye size={10} aria-hidden />
                    </div>
                    <span className="text-[9px] font-semibold text-white/80">History ›</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[1.35rem] font-bold leading-none tracking-tight">₦50,000</p>
                        <p className="mt-1.5 inline-flex items-center gap-1 text-[8px] text-white/65">
                            <RefreshCw size={8} aria-hidden />
                            Wallet funded
                        </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-navy px-2.5 py-1.5 text-[9px] font-bold">
                        <Plus size={10} strokeWidth={2.5} aria-hidden />
                        Add Money
                    </span>
                </div>
            </div>

            <div className="mt-2.5 rounded-2xl border border-slate-200 bg-white px-2 py-2.5">
                <div className="grid grid-cols-3">
                    {[
                        { icon: Wallet, label: 'Wallet' },
                        { icon: CreditCard, label: 'Pay Now' },
                        { icon: Target, label: 'Savings' },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex flex-col items-center gap-1">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                                <Icon size={14} aria-hidden />
                            </span>
                            <span className="text-[8px] font-semibold">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-2">
                <p className="text-[10px] font-bold text-emerald-700">+₦50,000 received</p>
                <p className="text-[8px] text-emerald-700/80">Transfer into wallet complete</p>
            </div>
        </PhoneChrome>
    );
}

function SaveScreen() {
    return (
        <PhoneChrome eyebrow="Pay" title="Contribute from wallet" active="save">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-brand-gray">
                    Paying from wallet
                </p>
                <p className="mt-1 text-[1.2rem] font-bold leading-none tracking-tight">₦50,000</p>
                <p className="mt-1.5 text-[10px] font-semibold text-brand-navy">Target savings · Weekly</p>
                <p className="mt-0.5 text-[8px] text-brand-gray">Due Mar 26</p>
            </div>

            <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2.5 py-2">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
                            <ArrowUpRight size={12} aria-hidden />
                        </span>
                        <div>
                            <p className="text-[10px] font-bold">Wallet debit</p>
                            <p className="text-[8px] text-brand-gray">Contribution</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold">-₦50,000</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-brand-primary px-2.5 py-2 text-white">
                    <CheckCircle2 size={14} aria-hidden />
                    <p className="text-[10px] font-bold">Saved to target plan</p>
                </div>
            </div>
        </PhoneChrome>
    );
}

function PayoutScreen() {
    return (
        <PhoneChrome eyebrow="Dashboard" title="Payout on the way">
            <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/15 p-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/25 text-brand-accent">
                        <Zap size={14} aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-brand-navy">Payout sent</p>
                        <p className="text-[8px] font-semibold text-brand-accent-dark">
                            +₦600,000 to Access Bank
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-2.5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-2.5 py-1.5">
                    <p className="text-[9px] font-bold">Recent</p>
                    <p className="text-[8px] font-semibold text-brand-primary">See all</p>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-100 px-2.5 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ArrowDownLeft size={12} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold">Payout</p>
                        <p className="text-[8px] text-brand-gray">31 Aug</p>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600">+600,000.00</p>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-100 px-2.5 py-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-light text-brand-primary">
                        <ArrowUpRight size={12} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold">Savings</p>
                        <p className="text-[8px] text-brand-gray">31 Aug</p>
                    </div>
                    <p className="text-[10px] font-bold">-50,000.00</p>
                </div>
            </div>
        </PhoneChrome>
    );
}

export function HeroProductVisual() {
    return (
        <div
            className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[420px] lg:px-8"
            role="img"
            aria-label="Animated AjoFlow demo: wallet is funded, a contribution is paid from the wallet, then a payout is sent to the bank"
        >
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute left-[10%] top-[18%] h-36 w-36 rounded-full bg-brand-accent/20 blur-2xl"
                aria-hidden
            />

            <aside className="hero-phone-card-1 absolute left-0 top-[20%] z-20 hidden w-[138px] rounded-2xl border border-white/70 bg-white px-3 py-2.5 shadow-[0_12px_28px_rgba(8,18,80,0.18)] lg:block">
                <p className="text-[13px] font-bold leading-none text-brand-navy">₦50,000</p>
                <p className="mt-1 text-[10px] font-medium text-brand-gray">Wallet funded</p>
            </aside>
            <aside className="hero-phone-card-2 absolute left-0 top-[20%] z-20 hidden w-[138px] rounded-2xl border border-white/70 bg-white px-3 py-2.5 shadow-[0_12px_28px_rgba(8,18,80,0.18)] lg:block">
                <p className="text-[13px] font-bold leading-none text-brand-navy">₦50,000</p>
                <p className="mt-1 text-[10px] font-medium text-brand-gray">Saved from wallet</p>
            </aside>
            <aside className="hero-phone-card-3 absolute left-0 top-[20%] z-20 hidden w-[138px] rounded-2xl border border-white/70 bg-white px-3 py-2.5 shadow-[0_12px_28px_rgba(8,18,80,0.18)] lg:block">
                <p className="text-[13px] font-bold leading-none text-emerald-600">+₦600,000</p>
                <p className="mt-1 text-[10px] font-medium text-brand-gray">Payout sent</p>
            </aside>

            <aside className="absolute right-0 top-[38%] z-20 hidden w-[128px] rounded-2xl border border-white/70 bg-white px-3 py-2.5 shadow-[0_12px_28px_rgba(8,18,80,0.18)] lg:block">
                <p className="text-[10px] font-medium text-brand-gray">Next payout</p>
                <p className="mt-1 text-[13px] font-bold leading-none text-brand-navy">Mar 26</p>
            </aside>

            <div className="relative mx-auto">
                <IPhoneFrame>
                    <div className="hero-phone-screen hero-phone-screen-1">
                        <WalletScreen />
                    </div>
                    <div className="hero-phone-screen hero-phone-screen-2">
                        <SaveScreen />
                    </div>
                    <div className="hero-phone-screen hero-phone-screen-3">
                        <PayoutScreen />
                    </div>
                </IPhoneFrame>
            </div>
        </div>
    );
}
