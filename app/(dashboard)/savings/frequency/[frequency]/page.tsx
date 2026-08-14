'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useData } from '@/lib/hooks/useData';

type Goal = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  contribution_amount: number;
  target_amount: number;
  total_saved: number;
  target_date: string;
  status: string;
};

type Scheme = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  minimum_amount: number;
  status: string;
};

type SavingsData = { goals: Goal[]; schemes: Scheme[]; gated: boolean };

async function fetchSavingsData(): Promise<SavingsData> {
  const [goalsRes, schemesRes] = await Promise.all([
    fetch('/api/savings/goals'),
    fetch('/api/savings/schemes'),
  ]);
  if (goalsRes.status === 403) return { goals: [], schemes: [], gated: true };
  const goalsJson = goalsRes.ok ? await goalsRes.json() : { data: [] };
  const schemesJson = schemesRes.ok ? await schemesRes.json() : { data: [] };
  return {
    goals: Array.isArray(goalsJson.data) ? goalsJson.data : [],
    schemes: Array.isArray(schemesJson.data) ? schemesJson.data : [],
    gated: false,
  };
}

function label(freq: string) {
  if (freq === 'daily') return 'Daily';
  if (freq === 'weekly') return 'Weekly';
  return 'Monthly';
}

export default function FrequencySavingsPage() {
  const params = useParams<{ frequency: 'daily' | 'weekly' | 'monthly' }>();
  const frequency = params.frequency;
  const { data, loading } = useData<SavingsData>('savings-data', fetchSavingsData);

  const rows = useMemo(() => {
    if (!data) return [];
    const goals = data.goals
      .filter((g) => g.frequency === frequency && g.status === 'active')
      .map((g) => ({
        key: `goal-${g.id}`,
        type: 'Target',
        name: g.name,
        href: `/savings/${g.id}`,
      }));
    const schemes = data.schemes
      .filter((s) => s.frequency === frequency && s.status === 'active')
      .map((s) => ({
        key: `scheme-${s.id}`,
        type: 'General',
        name: s.name,
        href: `/savings/schemes/${s.id}`,
      }));
    return [...goals, ...schemes];
  }, [data, frequency]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
        <div className="h-3 w-16 rounded bg-slate-100" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-9 w-20 rounded-xl bg-slate-100" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-3 py-3">
            <div className="flex gap-8">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-3 w-12 rounded bg-slate-200" />
            </div>
          </div>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-8 border-b border-slate-50 px-3 py-3 last:border-0">
              <div className="h-3.5 w-36 rounded bg-slate-100" />
              <div className="h-3 w-16 rounded bg-slate-50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Link href="/savings" className="inline-flex items-center gap-1.5 text-xs text-brand-gray hover:text-brand-navy">
        <ArrowLeft size={13} /> Back
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold text-brand-navy">{label(frequency)} Plans</h1>
        <Link href="/pay" className="rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white hover:bg-brand-primary-hover">
          Go to Pay
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-brand-gray">
              <th className="px-3 py-2 text-left font-semibold">Scheme</th>
              <th className="px-3 py-2 text-left font-semibold">Type</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="px-3 py-4 text-center text-brand-gray">No active plans in this frequency yet.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2.5 font-semibold text-brand-navy">
                  <Link href={row.href} className="underline underline-offset-2 hover:text-brand-primary">
                    {row.name}
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-brand-gray">{row.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-brand-gray">Click a scheme name to open its plan detail page.</p>
    </div>
  );
}

