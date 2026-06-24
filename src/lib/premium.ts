import { getSupabaseServer } from './supabase/server';

export interface CurrentUser {
  id: string;
  email: string | null;
  isPremium: boolean;
  stripeCustomerId: string | null;
}

/** Resolve the signed-in user and their premium status (server-only). */
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

/** Convenience boolean used to gate ads/features on the server. */
export async function getIsPremium(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isPremium ?? false;
}
