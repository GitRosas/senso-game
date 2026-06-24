'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';

export interface PremiumState {
  isPremium: boolean;
  loading: boolean;
  email: string | null;
}

export function usePremium(): PremiumState {
  const [state, setState] = useState<PremiumState>({ isPremium: false, loading: true, email: null });

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setState({ isPremium: false, loading: false, email: null });
      return;
    }
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        if (active) setState({ isPremium: false, loading: false, email: null });
        return;
      }
      const { data } = await sb.from('profiles').select('is_premium').eq('id', user.id).maybeSingle();
      if (active) {
        setState({ isPremium: Boolean(data?.is_premium), loading: false, email: user.email ?? null });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
