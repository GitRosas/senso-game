import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response('stripe_not_configured', { status: 503 });

  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('missing_signature', { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return new Response('invalid_signature', { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) return new Response('admin_unavailable', { status: 500 });

  const setPremiumByCustomer = async (customerId: string, isPremium: boolean) => {
    await admin.from('profiles').update({ is_premium: isPremium }).eq('stripe_customer_id', customerId);
  };

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      const customerId = typeof s.customer === 'string' ? s.customer : s.customer?.id;
      const userId = s.client_reference_id ?? s.metadata?.user_id;
      if (customerId && userId) {
        await admin
          .from('profiles')
          .update({ is_premium: true, stripe_customer_id: customerId })
          .eq('id', userId);
      } else if (customerId) {
        await setPremiumByCustomer(customerId, true);
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      const active = sub.status === 'active' || sub.status === 'trialing';
      await setPremiumByCustomer(customerId, active);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      await setPremiumByCustomer(customerId, false);
      break;
    }
    default:
      break;
  }

  return new Response('ok', { status: 200 });
}
