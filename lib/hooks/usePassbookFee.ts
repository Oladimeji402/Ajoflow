'use client';

import { useData } from '@/lib/hooks/useData';

const DEFAULT_PASSBOOK_FEE = 500;

async function fetchPassbookFee(): Promise<number> {
  const res = await fetch('/api/payments/passbook-activation', { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to load passbook fee.');
  const amount = Number(json.data?.amount);
  return Number.isFinite(amount) && amount > 0 ? amount : DEFAULT_PASSBOOK_FEE;
}

/** Live passbook activation fee (NGN). Cached briefly so banners share one fetch. */
export function usePassbookFee() {
  const { data, loading } = useData<number>('passbook-activation-fee', fetchPassbookFee, {
    ttl: 5 * 60 * 1000,
  });

  return {
    fee: data ?? DEFAULT_PASSBOOK_FEE,
    loading,
    feeLabel: `NGN ${(data ?? DEFAULT_PASSBOOK_FEE).toLocaleString('en-NG')}`,
  };
}
