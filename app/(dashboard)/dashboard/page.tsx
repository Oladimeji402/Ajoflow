'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
    ArrowDownLeft,
    ArrowUpRight,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    Eye,
    EyeOff,
    Landmark,
    Plus,
    RefreshCw,
    ShieldCheck,
    Target,
    Wallet,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useData } from '@/lib/hooks/useData';

type Profile = {
    name: string;
    phone: string | null;
    bank_account: string | null;
    wallet_balance: number;
    total_contributed: number;
    total_received: number;
};

type Transaction = {
    id: string;
    type: 'contribution' | 'payout' | 'individual_savings' | 'bulk_contribution' | 'passbook_activation' | 'wallet_funding';
    amount: number;
    status: string;
    created_at: string;
    groups?: { id: string; name: string } | null;
    metadata?: {
        goalName?: string | null;
        goalNames?: string[] | null;
        [key: string]: unknown;
    } | null;
};

type DashboardData = {
    profile: Profile | null;
    transactions: Transaction[];
    individualSavingsTotal: number;
    hasSavingsSchemes: boolean;
};

async function fetchDashboard(): Promise<DashboardData> {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Please log in to view your dashboard.');

    const [profileRes, transactionsRes, savingsRes] = await Promise.all([
        supabase
            .from('profiles')
            .select('name, phone, bank_account, wallet_balance, total_contributed, total_received')
            .eq('id', user.id)
            .maybeSingle(),
        fetch('/api/transactions?page=1&pageSize=8'),
        fetch('/api/savings/goals'),
    ]);

    if (profileRes.error) throw new Error(profileRes.error.message);

    const txJson = await transactionsRes.json();
    if (!transactionsRes.ok) throw new Error(txJson.error || 'Failed to load transactions.');

    let individualSavingsTotal = 0;
    if (savingsRes.ok) {
        const savingsJson = await savingsRes.json();
        individualSavingsTotal = (Array.isArray(savingsJson.data) ? savingsJson.data : [])
            .reduce((sum: number, g: { total_saved: number }) => sum + Number(g.total_saved ?? 0), 0);
    }

    const schemesRes = await fetch('/api/savings/schemes');
    let hasSavingsSchemes = false;
    if (schemesRes.ok) {
        const schemesJson = await schemesRes.json();
        hasSavingsSchemes = Array.isArray(schemesJson.data) && schemesJson.data.length > 0;
    }

    return {
        profile: (profileRes.data as Profile) ?? null,
        transactions: Array.isArray(txJson.data) ? txJson.data : [],
        individualSavingsTotal,
        hasSavingsSchemes,
    };
}

function txLabel(tx: Transaction) {
    if (tx.type === 'contribution') return tx.groups?.name ?? 'Contribution';
    if (tx.type === 'payout') return tx.groups?.name ? `${tx.groups.name} payout` : 'Payout';
    if (tx.type === 'individual_savings') {
        return tx.metadata?.goalName ? `Saved to ${tx.metadata.goalName}` : 'Savings';
    }
    if (tx.type === 'bulk_contribution') {
        if (Array.isArray(tx.metadata?.goalNames) && tx.metadata.goalNames.length) {
            const names = tx.metadata.goalNames;
            return `Saved to ${names[0]}${names.length > 1 ? ` +${names.length - 1}` : ''}`;
        }
        return 'Bulk savings';
    }
    if (tx.type === 'wallet_funding') return 'Wallet funding';
    return 'Passbook activation';
}

export default function DashboardPage() {
    const [balanceVisible, setBalanceVisible] = useState(true);
    const [refreshingBalance, setRefreshingBalance] = useState(false);
    const [localWalletBalance, setLocalWalletBalance] = useState<number | null>(null);

    const { data, loading, error, mutate } = useData<DashboardData>('dashboard', fetchDashboard, { ttl: 30_000 });

    const profile = data?.profile ?? null;
    const transactions = data?.transactions ?? [];
    const individualSavingsTotal = data?.individualSavingsTotal ?? 0;
    const hasSavingsSchemes = data?.hasSavingsSchemes ?? false;
    const walletBalance = localWalletBalance ?? profile?.wallet_balance ?? 0;

    const recentTx = useMemo(() => transactions.slice(0, 4), [transactions]);

    const formatCurrency = (value: number) =>
        Number(value).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const refreshWalletBalance = async () => {
        setRefreshingBalance(true);
        try {
            const syncRes = await fetch('/api/wallet/check-deposits', { method: 'POST' });
            if (syncRes.ok) {
                const syncJson = await syncRes.json();
                if (typeof syncJson.data?.balance === 'number') {
                    setLocalWalletBalance(syncJson.data.balance);
                } else {
                    const supabase = createSupabaseBrowserClient();
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const { data: profileData } = await supabase
                            .from('profiles')
                            .select('wallet_balance')
                            .eq('id', user.id)
                            .maybeSingle();
                        if (profileData && typeof profileData.wallet_balance === 'number') {
                            setLocalWalletBalance(profileData.wallet_balance);
                        }
                    }
                }
                mutate();
            }
        } catch {
            mutate();
        } finally {
            setRefreshingBalance(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-md mx-auto space-y-4 animate-pulse">
                <div className="rounded-3xl bg-slate-200 h-40" />
                <div className="rounded-3xl bg-white border border-slate-100 h-28" />
                <div className="rounded-2xl bg-white border border-slate-100 h-48" />
            </div>
        );
    }

    if (error && !data) {
        return <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">{error}</div>;
    }

    const setupItems = [
        {
            done: walletBalance > 0,
            icon: Wallet,
            label: 'Add money to your wallet',
            href: '/wallet',
        },
        {
            done: !!profile?.bank_account,
            icon: Landmark,
            label: 'Link a bank account',
            href: '/settings?tab=bank',
        },
        {
            done: individualSavingsTotal > 0 || hasSavingsSchemes,
            icon: Target,
            label: 'Start a savings plan',
            href: '/savings',
        },
    ];
    const setupIncomplete = setupItems.some((item) => !item.done);
    const setupDone = setupItems.filter((item) => item.done).length;

    const quickActions = [
        { href: '/pay', icon: CreditCard, label: 'Pay Now' },
        { href: '/savings', icon: Target, label: 'Savings' },
        { href: '/passbook', icon: BookOpen, label: 'Passbook' },
    ];

    return (
        <div className="max-w-md mx-auto space-y-4">
            {/* Balance card — Add Money lives here */}
            <section className="rounded-3xl bg-brand-primary p-5 text-white shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <ShieldCheck size={16} className="shrink-0 text-white/80" />
                        <span className="text-sm font-medium text-white/90">Available Balance</span>
                        <button
                            type="button"
                            onClick={() => setBalanceVisible((v) => !v)}
                            className="text-white/70 hover:text-white"
                            aria-label={balanceVisible ? 'Hide balance' : 'Show balance'}
                        >
                            {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                    </div>
                    <Link
                        href="/activity"
                        className="inline-flex items-center gap-0.5 text-xs font-semibold text-white/85 hover:text-white shrink-0"
                    >
                        History
                        <ChevronRight size={14} />
                    </Link>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                    <button
                        type="button"
                        onClick={refreshWalletBalance}
                        disabled={refreshingBalance}
                        className="text-left group"
                        aria-label="Refresh balance"
                    >
                        <p className="text-3xl font-bold tracking-tight leading-none">
                            {balanceVisible ? (
                                <>
                                    <span className="text-2xl font-semibold">₦</span>
                                    {formatCurrency(walletBalance)}
                                </>
                            ) : (
                                '****'
                            )}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/60 group-hover:text-white/80">
                            <RefreshCw size={11} className={refreshingBalance ? 'animate-spin' : ''} />
                            {refreshingBalance ? 'Updating…' : 'Tap to refresh'}
                        </span>
                    </button>

                    <Link
                        href="/wallet"
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0a1458] transition-colors shrink-0"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add Money
                    </Link>
                </div>
            </section>

            {/* Three quick actions */}
            <section className="rounded-3xl border border-slate-200 bg-white px-3 py-4">
                <div className="grid grid-cols-3 gap-1">
                    {quickActions.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={label}
                            href={href}
                            className="group flex flex-col items-center gap-2 px-2 py-1"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand-primary transition-transform group-active:scale-90">
                                <Icon size={22} />
                            </div>
                            <span className="text-center text-xs font-semibold text-brand-navy">{label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Setup — only while incomplete */}
            {setupIncomplete && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-bold text-brand-navy">Get started</p>
                        <p className="text-[11px] font-semibold text-brand-gray">{setupDone}/3</p>
                    </div>
                    <div className="space-y-1.5">
                        {setupItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-2.5 py-2.5 ${
                                        item.done
                                            ? 'opacity-50 pointer-events-none'
                                            : 'hover:bg-brand-light/60'
                                    }`}
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                            item.done ? 'bg-emerald-50' : 'bg-brand-light'
                                        }`}
                                    >
                                        {item.done ? (
                                            <CheckCircle2 size={15} className="text-emerald-600" />
                                        ) : (
                                            <Icon size={15} className="text-brand-primary" />
                                        )}
                                    </div>
                                    <p
                                        className={`flex-1 text-sm font-semibold ${
                                            item.done ? 'text-slate-400 line-through' : 'text-brand-navy'
                                        }`}
                                    >
                                        {item.label}
                                    </p>
                                    {!item.done && <ChevronRight size={14} className="text-slate-300" />}
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Recent activity — simple list */}
            {recentTx.length > 0 && (
                <section>
                    <div className="mb-2.5 flex items-center justify-between px-0.5">
                        <h2 className="text-sm font-bold text-brand-navy">Recent</h2>
                        <Link href="/activity" className="text-xs font-semibold text-brand-primary">
                            See all
                        </Link>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
                        {recentTx.map((tx) => {
                            const isOut =
                                tx.type === 'contribution' ||
                                tx.type === 'individual_savings' ||
                                tx.type === 'bulk_contribution' ||
                                tx.type === 'passbook_activation';
                            return (
                                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                            isOut ? 'bg-brand-light' : 'bg-emerald-50'
                                        }`}
                                    >
                                        {isOut ? (
                                            <ArrowUpRight size={16} className="text-brand-primary" />
                                        ) : (
                                            <ArrowDownLeft size={16} className="text-emerald-600" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-brand-navy">{txLabel(tx)}</p>
                                        <p className="text-[10px] text-brand-gray">
                                            {new Date(tx.created_at).toLocaleDateString('en-NG', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </p>
                                    </div>
                                    <p
                                        className={`text-sm font-bold ${
                                            isOut && tx.type !== 'wallet_funding'
                                                ? 'text-brand-navy'
                                                : 'text-emerald-600'
                                        }`}
                                    >
                                        {isOut && tx.type !== 'wallet_funding' ? '-' : '+'}
                                        {formatCurrency(tx.amount)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
