'use client';

export type ConsentChoice = 'all' | 'essential';

const KEY = 'senso-consent';
export const CONSENT_EVENT = 'senso-consent-change';

export function getConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(KEY);
  return v === 'all' || v === 'essential' ? v : null;
}

export function setConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, choice);
  // Mirror to a cookie so the server could read it if needed.
  document.cookie = `${KEY}=${choice}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
}

export function hasAdConsent(): boolean {
  return getConsent() === 'all';
}
