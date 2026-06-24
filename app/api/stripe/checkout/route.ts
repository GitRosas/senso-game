import { NextResponse } from 'next/server';
import { getStripe, STRIPE_PRICES } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/premium';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { SITE_URL } from '@/config';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { plan?: string };
  const price = body.plan === 'annual' ? STRIPE_PRICES.annual : STRIPE_PRICES.monthly;
  if (!price) return NextResponse.json({ error: 'price_not_configured' }, { status: 503 });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await getSupabaseAdmin()
      ?.from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${SITE_URL}/account?checkout=success`,
    cancel_url: `${SITE_URL}/pricing?checkout=cancel`,
    client_reference_id: user.id,
    metadata: { user_id: user.id },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
