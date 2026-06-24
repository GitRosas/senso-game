/**
 * Central branding & feature configuration — the single source to re-skin Senso.
 * All runtime secrets come from environment variables (see `.env.example`);
 * this file only holds public, non-secret product configuration.
 */
import type { GameId } from '@/games/engine/types';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Senso';

export const SITE_TAGLINE = {
  en: 'Your senses remember less than you think.',
  pt: 'Os teus sentidos lembram-se de menos do que pensas.',
} as const;

/** Canonical site URL (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export const DEFAULT_LOCALE = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'en') as 'en' | 'pt';

export const LOCALES = ['en', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

export const SOCIAL = {
  kofiHandle: process.env.NEXT_PUBLIC_KOFI_HANDLE ?? '',
  twitter: '@sensogame',
  github: 'https://github.com/senso-game/senso',
} as const;

/** Per-game accent colors (used on cards, result screens, OG images). */
export const GAME_ACCENTS: Record<GameId, string> = {
  tempo: '#f59e0b', // amber
  hue: '#ec4899', // pink
  pitch: '#8b5cf6', // violet
  count: '#10b981', // emerald
  angle: '#3b82f6', // blue
  spot: '#06b6d4', // cyan
};

/** Emoji glyph per game (used in share copy, cards, lightweight icons). */
export const GAME_GLYPHS: Record<GameId, string> = {
  tempo: '⏱️',
  hue: '🎨',
  pitch: '🎵',
  count: '🔢',
  angle: '📐',
  spot: '📍',
};

/** Feature availability derived from env (server + client safe for NEXT_PUBLIC_*). */
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
