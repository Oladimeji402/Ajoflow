'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Copy, Loader2, RefreshCw, Wallet } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';
import { notifyError, notifySuccess } from '@/lib/toast';

const WALLET_CACHE_PREFIX = 'AjoFlow_wallet_account_cache_v2:';
const POLL_INTERVAL_MS = 30_000;

type WalletCache = {
  accountNumber: string | null;
  bankName: string | null;
  accountName: string | null;
  lastCheckedAt: string | null;
  balance: number | null;
};

function cacheKeyForUser(userId: string) {
  return `${WALLET_CACHE_PREFIX}${userId}`;
}

export default function WalletPage() {
  const [checking, setChecking] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [creditedNow, setCreditedNow] = useState(0);
  const [showCredited, setShowCredited] = useState(false);
  const [showPhoneUpdate, setShowPhoneUpdate] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [updatingPhone, setUpdatingPhone] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [missingVerification, setMissingVerification] = useState(false);
  const { showToast } = useToast();
  const creditedFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const writeCache = useCallback((uid: string, next: Partial<WalletCache>) => {
    try {
      const key = cacheKeyForUser(uid);
      const currentRaw = localStorage.getItem(key);
      const current: WalletCache = currentRaw
        ? (JSON.parse(currentRaw) as WalletCache)
        : { accountNumber: null, bankName: null, accountName: null, lastCheckedAt: null, balance: null };
      localStorage.setItem(
        key,
        JSON.stringify({
          accountNumber: next.accountNumber ?? current.accountNumber,
          bankName: next.bankName ?? current.bankName,
          accountName: next.accountName ?? current.accountName,
          lastCheckedAt: next.lastCheckedAt ?? current.lastCheckedAt,
          balance: next.balance ?? current.balance,
        }),
      );
    } catch {
      // ignore
    }
  }, []);

  const copyValue = async (value: string | null, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      notifySuccess(showToast, `${label} copied.`);
    } catch (error) {
      notifyError(showToast, error, `Could not copy ${label.toLowerCase()}.`);
    }
  };

  const provisionVirtualAccount = async () => {
    setProvisioning(true);
    setProvisionError(null);
    setMissingVerification(false);
    try {
      const response = await fetch('/api/user/provision-virtual-account', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) {
        if (payload.code === 'DUPLICATE_PHONE_NUMBER') {
          setProvisionError(payload.error ?? 'This phone number is already in use.');
          setShowPhoneUpdate(true);
          return false;
        }
        if (payload.code === 'RATE_LIMIT_EXCEEDED' || response.status === 429) {
          setProvisionError('Too many attempts. Please wait a moment.');
          return false;
        }
        if (payload.code === 'MISSING_VERIFICATION') {
          setMissingVerification(true);
          setProvisionError('Add your NIN or BVN in Settings first.');
          return false;
        }
        throw new Error(payload.error ?? 'Could not create account.');
      }

      setAccountNumber(payload.data.accountNumber ?? null);
      setBankName(payload.data.bankName ?? null);
      setAccountName(payload.data.accountName ?? null);
      if (userId) {
        writeCache(userId, {
          accountNumber: payload.data.accountNumber ?? null,
          bankName: payload.data.bankName ?? null,
          accountName: payload.data.accountName ?? null,
        });
      }
      notifySuccess(showToast, 'Account ready — transfer from your bank to fund.');
      return true;
    } catch (error) {
      notifyError(showToast, error, 'Could not create your account details.');
      return false;
    } finally {
      setProvisioning(false);
    }
  };

  const updatePhone = async () => {
    if (!newPhone.trim()) {
      notifyError(showToast, new Error('Enter a phone number.'), 'Phone required');
      return;
    }

    setUpdatingPhone(true);
    try {
      const response = await fetch('/api/user/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone.trim() }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Could not update phone.');

      notifySuccess(showToast, 'Phone updated.');
      setShowPhoneUpdate(false);
      setNewPhone('');
      setProvisionError(null);
      await provisionVirtualAccount();
    } catch (error) {
      notifyError(showToast, error, 'Could not update phone number.');
    } finally {
      setUpdatingPhone(false);
    }
  };

  const checkDeposits = useCallback(
    async (silent = false) => {
      if (!silent) setChecking(true);
      try {
        const response = await fetch('/api/wallet/check-deposits', { method: 'POST' });
        const payload = await response.json();

        if (response.status === 429) {
          if (!silent) notifyError(showToast, new Error('Wait a moment'), 'Please wait before checking again.');
          return Boolean(accountNumber);
        }

        if (!response.ok) throw new Error(payload.error ?? 'Could not check deposits.');

        const data = payload.data ?? {};
        const nextAccountNumber = data.accountNumber ?? null;
        const nextBankName = data.bankName ?? null;
        const nextAccountName = data.accountName ?? null;
        const nextBalance = data.balance != null ? Number(data.balance) : null;
        const credited = Number(data.credited ?? 0);

        setAccountNumber(nextAccountNumber);
        setBankName(nextBankName);
        setAccountName(nextAccountName);
        if (nextBalance != null && Number.isFinite(nextBalance)) setBalance(nextBalance);

        if (userId) {
          writeCache(userId, {
            accountNumber: nextAccountNumber,
            bankName: nextBankName,
            accountName: nextAccountName,
            lastCheckedAt: data.lastCheckedAt ?? null,
            balance: nextBalance,
          });
        }

        if (credited > 0) {
          setCreditedNow(credited);
          setShowCredited(true);
          if (creditedFlashRef.current) clearTimeout(creditedFlashRef.current);
          creditedFlashRef.current = setTimeout(() => setShowCredited(false), 10_000);
          notifySuccess(
            showToast,
            `Credited NGN ${credited.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
          );
        } else if (!silent) {
          if (data.syncWarning) {
            notifyError(showToast, new Error(String(data.syncWarning)), String(data.syncWarning));
          } else {
            notifySuccess(showToast, 'No new deposit yet. Try again in a few minutes.');
          }
        }

        return Boolean(nextAccountNumber && nextBankName && nextAccountName);
      } catch (error) {
        if (!silent) notifyError(showToast, error, 'Could not check for deposits.');
        return false;
      } finally {
        if (!silent) setChecking(false);
      }
    },
    [accountNumber, showToast, userId, writeCache],
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;

      const uid = user?.id ?? null;
      setUserId(uid);

      if (uid) {
        try {
          const cachedRaw = localStorage.getItem(cacheKeyForUser(uid));
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as WalletCache;
            if (cached.accountNumber && cached.bankName && cached.accountName) {
              setAccountNumber(cached.accountNumber);
              setBankName(cached.bankName);
              setAccountName(cached.accountName);
              if (cached.balance != null) setBalance(cached.balance);
            }
          }
        } catch {
          // ignore
        }
      }

      await checkDeposits(true);
      if (active) setInitialLoading(false);
    })();

    return () => {
      active = false;
      if (creditedFlashRef.current) clearTimeout(creditedFlashRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accountReady = Boolean(accountNumber && bankName && accountName);

  useEffect(() => {
    if (!accountReady) return;
    const interval = setInterval(() => {
      void checkDeposits(true);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [accountReady, checkDeposits]);

  if (initialLoading && !accountReady) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gray hover:text-brand-navy">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-brand-gray inline-flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (!accountReady) {
    return (
      <div className="max-w-md mx-auto space-y-5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gray hover:text-brand-navy">
          <ArrowLeft size={14} /> Back
        </Link>

        <div>
          <h1 className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <Wallet size={20} className="text-brand-primary" />
            Fund Wallet
          </h1>
          <p className="text-sm text-brand-gray mt-1">Get a permanent account number to transfer into.</p>
        </div>

        {provisionError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
            <p className="text-sm text-red-800 font-medium">{provisionError}</p>
            {missingVerification && (
              <Link
                href="/settings"
                className="w-full inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-primary-hover"
              >
                Open Settings
              </Link>
            )}
            {!missingVerification && !showPhoneUpdate && (
              <button
                onClick={provisionVirtualAccount}
                disabled={provisioning}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {provisioning ? <Loader2 size={15} className="animate-spin" /> : null}
                Try again
              </button>
            )}
          </div>
        )}

        {!provisionError && !showPhoneUpdate && (
          <button
            onClick={provisionVirtualAccount}
            disabled={provisioning}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {provisioning ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Setting up…
              </>
            ) : (
              'Generate account number'
            )}
          </button>
        )}

        {showPhoneUpdate && (
          <div className="space-y-3">
            <input
              id="phone"
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="New phone e.g. 08012345678"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
            <button
              onClick={updatePhone}
              disabled={updatingPhone}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {updatingPhone ? <Loader2 size={15} className="animate-spin" /> : null}
              Update & retry
            </button>
            <button
              onClick={() => {
                setShowPhoneUpdate(false);
                setProvisionError(null);
              }}
              className="w-full text-sm font-semibold text-brand-gray"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gray hover:text-brand-navy">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <Wallet size={20} className="text-brand-primary" />
            Fund Wallet
          </h1>
          <p className="text-sm text-brand-gray mt-1">Transfer to this account · min ₦500</p>
        </div>
        {balance != null && (
          <p className="text-sm font-bold text-brand-navy whitespace-nowrap">
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>

      {showCredited && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 inline-flex items-center gap-2 w-full">
          <CheckCircle2 size={16} className="shrink-0" />
          Credited ₦
          {creditedNow.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-brand-gray">Bank</p>
          <p className="text-sm font-semibold text-brand-navy mt-0.5">{bankName}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-brand-gray">Account number</p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-xl font-bold tracking-wide text-brand-navy">{accountNumber}</p>
            <button
              onClick={() => copyValue(accountNumber, 'Account number')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-brand-navy hover:bg-slate-50"
            >
              <Copy size={14} />
              Copy
            </button>
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-brand-gray">Account name</p>
          <p className="text-sm font-semibold text-brand-navy mt-0.5">{accountName}</p>
        </div>
      </div>

      <button
        onClick={() => void checkDeposits(false)}
        disabled={checking}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3.5 text-sm font-bold text-white hover:bg-brand-primary-hover disabled:opacity-60"
      >
        {checking ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Checking…
          </>
        ) : (
          <>
            <RefreshCw size={15} /> I&apos;ve sent money — check now
          </>
        )}
      </button>
    </div>
  );
}
