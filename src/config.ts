// Branding + feature flags. Secrets always come from env (see .env.example);
// this file only holds public, non-secret config.
import type { GameId } from '@/games/engine/types';

export type Locale = 'en' | 'pt';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Senso';

export const SITE_TAGLINE = {
  en: 'Your senses remember less than you think.',
  pt: 'Os teus sentidos lembram-se de menos do que pensas.',
} as const;

// Canonical site URL, no trailing slash.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const SOCIAL = {
  kofiHandle: process.env.NEXT_PUBLIC_KOFI_HANDLE ?? '',
} as const;

// One accent per game (cards, result screens, OG images).
export const GAME_ACCENTS: Record<GameId, string> = {
  tempo: '#f59e0b',
  hue: '#ec4899',
  pitch: '#8b5cf6',
  count: '#10b981',
  angle: '#3b82f6',
  spot: '#06b6d4',
};

export const GAME_GLYPHS: Record<GameId, string> = {
  tempo: '⏱️',
  hue: '🎨',
  pitch: '🎵',
  count: '🔢',
  angle: '📐',
  spot: '📍',
};

// What's available, derived from env. Everything degrades gracefully when off.
export const FEATURES = {
  get supabase(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
  get adsense(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT !== 'ca-pub-XXXXXXXX',
    );
  },
  get stripe(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL,
    );
  },
  get kofi(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_KOFI_HANDLE);
  },
} as const;
