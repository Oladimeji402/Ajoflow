'use client';

import { openCookieConsent } from '@/lib/cookie-consent';

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openCookieConsent}>
      Cookie notice
    </button>
  );
}
