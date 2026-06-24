'use client';

import { hasAdConsent } from './consent';

/**
 * Minimal, privacy-respecting analytics shim. No third-party script is loaded
 * unless both (a) an analytics endpoint is configured and (b) the user consented.
 * Replace `send` with your provider of choice (Plausible, GA4, etc.).
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!hasAdConsent()) return;
  // No analytics provider wired in this build — log in dev for visibility.
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, props ?? {});
  }
}
