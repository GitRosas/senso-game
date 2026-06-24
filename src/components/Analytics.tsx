'use client';

/**
 * Placeholder analytics mount point. Intentionally renders nothing until a
 * provider is configured; consent is enforced in `lib/analytics.ts`. Kept as a
 * component so wiring a real provider later is a one-file change.
 */
export function Analytics() {
  return null;
}
