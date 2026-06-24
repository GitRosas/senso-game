import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/premium';
import { SITE_URL } from '@/config';

export const runtime = 'nodejs';

export async function POST() {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!user.stripeCustomerId) return NextResponse.json({ error: 'no_customer' }, { status: 400 });

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${SITE_URL}/account`,
  });

  return NextResponse.json({ url: session.url });
}
