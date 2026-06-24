import Stripe from 'stripe';

/** Server-side Stripe client, or null when no secret key is configured. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-06-20', typescript: true });
}

export const STRIPE_PRICES = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? '',
  annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? '',
};
