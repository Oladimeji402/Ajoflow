export const COOKIE_CONSENT_STORAGE_KEY = 'ajoflow-cookie-consent';
export const COOKIE_CONSENT_OPEN_EVENT = 'ajoflow:open-cookie-consent';

export const COOKIE_CONSENT_VERSION = 1;

export type CookieConsentRecord = {
  version: number;
  acceptedAt: string;
};

export function openCookieConsent() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT));
}

export function readCookieConsent(): CookieConsentRecord | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (!parsed?.acceptedAt || parsed.version !== COOKIE_CONSENT_VERSION) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveCookieConsent() {
  const record: CookieConsentRecord = {
    version: COOKIE_CONSENT_VERSION,
    acceptedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  return record;
}
