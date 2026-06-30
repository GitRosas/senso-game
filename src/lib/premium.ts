import { getSupabaseServer } from './supabase/server';

export interface CurrentUser {
  id: string;
  email: string | null;
  isPremium: boolean;
  stripeCustomerId: string | null;
}

// Server-only - reads auth session and the profiles table.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const sb = getSupabaseServer();
  if (!sb) return null;
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb
    .from('profiles')
    .select('is_premium, stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();
  return {
    id: user.id,
    email: user.email ?? null,
    isPremium: Boolean(data?.is_premium),
    stripeCustomerId: (data?.stripe_customer_id as string | null) ?? null,
  };
}

// Quick helper for gating ads/features server-side.
export async function getIsPremium(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isPremium ?? false;
}
