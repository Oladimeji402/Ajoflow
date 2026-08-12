'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { useData } from '@/lib/hooks/useData';
import { usePassbookFee } from '@/lib/hooks/usePassbookFee';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// ── Types ─────────────────────────────────────────────────────────────────────

type Payout = {
    amount: number;
    paid_at: string;
    period_label: string;
};

type SchemeRow = {
    id: string;
    name: string;
    source_type: 'general' | 'target';
    frequency: 'daily' | 'weekly' | 'monthly';
    minimum_amount: number;
    status: string;
    bf: number;
    buckets: Record<number, number>;
    total: number;
    totalWithdrawals: number;
    payouts: Payout[];
};

type PassbookData = {
    daily: SchemeRow[];
    weekly: SchemeRow[];
    monthly: SchemeRow[];
};

// ── Column definitions ────────────────────────────────────────────────────────

const DAILY_COLS: { key: number; label: string }[] = [
    { key: 1, label: 'Mon' },
    { key: 2, label: 'Tue' },
    { key: 3, label: 'Wed' },
    { key: 4, label: 'Thu' },
    { key: 5, label: 'Fri' },
    { key: 6, label: 'Sat' },
    { key: 7, label: 'Sun' },
];

const WEEKLY_COLS: { key: number; label: string }[] = [
    { key: 1, label: 'W1' },
    { key: 2, label: 'W2' },
    { key: 3, label: 'W3' },
    { key: 4, label: 'W4' },
    { key: 5, label: 'W5' },
    { key: 6, label: 'W6' },
    { key: 7, label: 'W7' },
    { key: 8, label: 'W8' },
    { key: 9, label: 'W9' },
    { key: 10, label: 'W10' },
    { key: 11, label: 'W11' },
    { key: 12, label: 'W12' },
    { key: 13, label: 'W13' },
    { key: 14, label: 'W14' },
];

const MONTHLY_COLS: { key: number; label: string }[] = [
    { key: 1, label: 'Jan' }, { key: 2, label: 'Feb' }, { key: 3, label: 'Mar' },
    { key: 4, label: 'Apr' }, { key: 5, label: 'May' }, { key: 6, label: 'Jun' },
    { key: 7, label: 'Jul' }, { key: 8, label: 'Aug' }, { key: 9, label: 'Sep' },
    { key: 10, label: 'Oct' }, { key: 11, label: 'Nov' }, { key: 12, label: 'Dec' },
];

function getColumns(freq: 'daily' | 'weekly' | 'monthly') {
    if (freq === 'daily')   return DAILY_COLS;
    if (freq === 'weekly')  return WEEKLY_COLS;
    return MONTHLY_COLS;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(v: number) {
    return `₦${Number(v).toLocaleString('en-NG')}`;
}

function LedgerTable({ schemes, freq }: { schemes: SchemeRow[]; freq: Tab }) {
    const cols = getColumns(freq);
    const totals = useMemo(() => {
        let balance = 0;

        for (const scheme of schemes) {
            balance += Number((scheme.total ?? 0) - (scheme.totalWithdrawals ?? 0));
        }

        return { balance };
    }, [schemes]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
            <table className="min-w-full text-xs">
                <thead>
                    <tr className="bg-slate-50 text-brand-gray">
                        <th className="px-3 py-2 text-left font-semibold">Scheme</th>
                        <th className="px-3 py-2 text-right font-semibold">B/F</th>
                        {cols.map((c) => <th key={c.key} className="px-3 py-2 text-right font-semibold">{c.label}</th>)}
                        <th className="px-3 py-2 text-right font-semibold">Total</th>
                        <th className="px-3 py-2 text-right font-semibold">Withdrawals</th>
                        <th className="px-3 py-2 text-right font-semibold">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {schemes.length === 0 && (
                        <tr><td colSpan={cols.length + 5} className="px-3 py-4 text-center text-brand-gray">No entries on this plan yet.</td></tr>
                    )}
                    {schemes.map((scheme) => {
                        const balance = scheme.total - scheme.totalWithdrawals;
                        return (
                            <tr key={scheme.id} className="border-t border-slate-100">
                                <td className="px-3 py-2.5">
                                    <p className="font-semibold text-brand-navy">{scheme.name}</p>
                                </td>
                                <td className="px-3 py-2.5 text-right text-brand-navy">{scheme.bf ? fmt(scheme.bf) : '-'}</td>
                                {cols.map((c) => (
                                    <td key={c.key} className="px-3 py-2.5 text-right text-brand-navy">
                                        {scheme.buckets[c.key] ? fmt(scheme.buckets[c.key]!) : '-'}
                                    </td>
                                ))}
                                <td className="px-3 py-2.5 text-right font-bold text-brand-navy">{fmt(scheme.total)}</td>
                                <td className="px-3 py-2.5 text-right text-rose-600">{scheme.totalWithdrawals ? fmt(scheme.totalWithdrawals) : '-'}</td>
                                <td className="px-3 py-2.5 text-right font-bold text-emerald-700">{fmt(balance)}</td>
                            </tr>
                        );
                    })}
                </tbody>
                {schemes.length > 0 && (
                    <tfoot>
                        <tr className="border-t-2 border-slate-200 bg-slate-50/70">
                            <td colSpan={cols.length + 5} className="px-3 py-2.5 text-right font-bold text-brand-navy">Total Balance</td>
                            <td className="px-3 py-2.5 text-right font-extrabold text-emerald-700">{fmt(totals.balance)}</td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}

// ── Tab ───────────────────────────────────────────────────────────────────────

type Tab = 'daily' | 'weekly' | 'monthly';

const TABS: { id: Tab; label: string; sub: string }[] = [
    { id: 'daily',   label: 'Daily',   sub: 'Paid out monthly' },
    { id: 'weekly',  label: 'Weekly',  sub: 'Paid out quarterly' },
    { id: 'monthly', label: 'Monthly', sub: 'Paid out yearly' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

async function fetchPassbook(): Promise<PassbookData> {
    const res = await fetch('/api/passbook');
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to load passbook.');
    return json.data as PassbookData;
}

export default function PassbookPage() {
    const [activeTab, setActiveTab] = useState<Tab>('daily');
    const [passbookActivated, setPassbookActivated] = useState<boolean | null>(null);
    const { data, loading } = useData<PassbookData>('passbook', fetchPassbook);
    const { feeLabel } = usePassbookFee();

    useEffect(() => {
        const loadStatus = async () => {
            const supabase = createSupabaseBrowserClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                setPassbookActivated(false);
                return;
            }
            const { data: profile } = await supabase
                .from('profiles')
                .select('passbook_activated')
                .eq('id', user.id)
                .maybeSingle();
            setPassbookActivated(profile?.passbook_activated ?? false);
        };
        void loadStatus();
    }, []);

    const schemes = useMemo(() => data?.[activeTab] ?? [], [data, activeTab]);

    if (loading || passbookActivated === null) {
        return (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-brand-gray">
                <Loader2 size={16} className="animate-spin" /> Loading passbook...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-5">
            <div>
                <h1 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                    <Calendar size={20} className="text-emerald-600" />
                    Passbook
                </h1>
                <p className="text-xs text-brand-gray mt-0.5">
                    Your general savings ledger. Payouts are made on fixed platform dates.
                </p>
            </div>

            {!passbookActivated && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                            <BookOpen size={16} className="text-amber-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-amber-900">Activate your Passbook</p>
                            <p className="text-[11px] text-amber-700">
                                One-time {feeLabel} fee to unlock festive savings &amp; your personal ledger.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/onboarding/activate-passbook"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors shrink-0"
                    >
                        Activate <ArrowRight size={12} />
                    </Link>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-bold transition-colors ${
                            activeTab === t.id
                                ? 'bg-white shadow-sm text-brand-navy'
                                : 'text-brand-gray hover:text-brand-navy'
                        }`}
                    >
                        <span>{t.label}</span>
                        <span className={`text-[9px] font-normal mt-0.5 ${activeTab === t.id ? 'text-brand-gray' : 'text-slate-300'}`}>{t.sub}</span>
                    </button>
                ))}
            </div>

            <LedgerTable schemes={schemes as SchemeRow[]} freq={activeTab} />
            <p className="text-[11px] text-brand-gray">
                Add or manage plans in <Link href="/savings" className="font-semibold text-brand-primary underline">Savings</Link>.
            </p>
        </div>
    );
}
