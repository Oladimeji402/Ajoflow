'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  COOKIE_CONSENT_OPEN_EVENT,
  readCookieConsent,
  saveCookieConsent,
} from '@/lib/cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!readCookieConsent());

    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, reopen);
  }, []);

  const accept = useCallback(() => {
    saveCookieConsent();
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-4 z-[60] w-[min(calc(100vw-2rem),16.5rem)] md:bottom-4"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-copy"
    >
      <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-lg">
        <p id="cookie-banner-title" className="sr-only">
          Cookies
        </p>
        <p id="cookie-banner-copy" className="text-[12px] leading-5 text-slate-600">
          We use essential cookies.{' '}
          <Link href="/privacy" className="font-medium text-brand-primary hover:underline">
            Privacy
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="mt-2.5 inline-flex h-8 items-center rounded-lg bg-brand-primary px-3 text-[12px] font-semibold text-white hover:bg-brand-primary-hover"
        >
          OK
        </button>
      </div>
    </div>
  );
}
