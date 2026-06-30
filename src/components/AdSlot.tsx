'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { FEATURES } from '@/config';
import { hasAdConsent, CONSENT_EVENT } from '@/lib/consent';
import { usePremium } from '@/hooks/usePremium';
import { cn } from '@/lib/utils';

// Not shown on the play screen; requires consent + non-premium + AdSense config.
export function AdSlot({ className }: { className?: string }) {
  const { isPremium, loading } = usePremium();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(hasAdConsent());
    const handler = () => setConsent(hasAdConsent());
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT;

  if (!FEATURES.adsense || !consent || isPremium || loading || !client) return null;

  return (
    <div className={cn('min-h-[100px] w-full', className)} data-testid="ad-slot">
      <Script
        id="adsbygoogle-js"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id="adsbygoogle-push" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
