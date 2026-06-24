# Senso

A collection of free, browser-based **single-sense precision games**. Each game
isolates one perceptual dimension — **Tempo** (time), **Hue** (colour),
**Pitch** (sound), **Count** (numerosity), **Angle** (orientation), **Spot**
(spatial position) — shows a stimulus, removes it, and asks you to reproduce it
from memory. Five rounds, 0–10 each, 0–50 total, one finely-tuned difficulty.
*Your senses remember less than you think.*

Built with Next.js 14 (App Router), TypeScript (strict), Tailwind, next-intl
(EN/PT), Supabase (leaderboards/auth/premium), Stripe (premium), and a pure,
deterministic, unit-tested game engine.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local      # everything works with the file left mostly blank
pnpm dev                        # http://localhost:3000  → redirects to /en
```

Senso runs **fully offline**: with no integrations configured, the six games,
daily/challenge modes, sharing and a device-local leaderboard all work. Add
integrations to unlock the global leaderboard, accounts, ads and premium.

### Quality gates

```bash
pnpm typecheck     # tsc --noEmit (strict)
pnpm lint          # eslint (next/core-web-vitals)
pnpm test          # vitest unit tests (engine, games, scoring, anti-cheat)
pnpm build         # next build
pnpm test:e2e      # playwright smoke (boots `next start` — run `pnpm build` first)
pnpm check         # all of the above, in sequence
```

First e2e run needs the browser: `pnpm exec playwright install chromium`.

The e2e suite runs against the **production server** (`next start`), which is
stable under parallel workers. `pnpm check` builds before it automatically; to
run `pnpm test:e2e` on its own, build first, or set `E2E_DEV=1` to use the dev
server. (On OneDrive-synced paths, OneDrive can dehydrate `.next` and break the
build/server; either disable sync for `.next` or point it outside OneDrive with a
junction: `cmd /c "rmdir /s /q .next & mklink /J .next %LOCALAPPDATA%\senso-next"`.
The `build` script wipes `.next` first to avoid stale-file `readlink` errors.)

Re-tune difficulty constants with the Monte-Carlo harness:

```bash
pnpm calibrate
```

---

## Environment variables

Copy `.env.example` → `.env.local`. Each block degrades gracefully when empty.

| Variable | Purpose | Without it |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (OG, sitemap, share links) | defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_NAME` / `NEXT_PUBLIC_DEFAULT_LOCALE` | Branding | sensible defaults |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Global leaderboard, auth, premium | local-only leaderboard, no accounts |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function writes / webhook | — |
| `NEXT_PUBLIC_ADSENSE_CLIENT` / `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT` | AdSense on content surfaces | no ads |
| `NEXT_PUBLIC_KOFI_HANDLE` | Ko-fi support button | button hidden |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Premium subscriptions | upgrade UI hidden |
| `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` / `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL` | Stripe price IDs | — |

Never commit real secrets; `.env*.local` is git-ignored.

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration (Supabase SQL editor, or CLI):

   ```bash
   supabase link --project-ref <ref>
   supabase db push          # applies supabase/migrations/0001_init.sql
   ```

   It creates `profiles`, `scores`, `tournaments`, indexes, **RLS** (public read
   of `scores`; **no** client writes), and a trigger that auto-creates a profile
   on signup.
3. Deploy the anti-cheat Edge Function (recomputes scores server-side):

   ```bash
   supabase functions deploy submit-score --no-verify-jwt
   ```

   It uses the auto-injected `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
4. **Auth**: enable Email (magic link) and Google providers in Authentication →
   Providers. Add your site URL to the allowed redirect URLs.
5. Put the project URL + anon key in `.env.local` (and Vercel).

Local stack alternative: `supabase start`, then `supabase db reset` and
`supabase functions serve submit-score`.

---

## Stripe setup (premium)

1. Create two recurring Prices (monthly + annual); put their IDs in
   `NEXT_PUBLIC_STRIPE_PRICE_*`. Set `STRIPE_SECRET_KEY` (test mode).
2. Test the webhook locally with the Stripe CLI:

   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # copy the printed whsec_… into STRIPE_WEBHOOK_SECRET, then:
   stripe trigger checkout.session.completed
   ```

   The webhook flips `profiles.is_premium` on
   `checkout.session.completed` / `customer.subscription.updated|deleted`.
3. Flow: `/pricing` → `/api/stripe/checkout` (Checkout) → back to `/account`;
   `/api/stripe/portal` opens the billing portal.

---

## Deployment (Vercel)

1. Import the repo into Vercel (framework auto-detected: Next.js).
2. Add every env var above in **Project → Settings → Environment Variables**
   (set `NEXT_PUBLIC_SITE_URL` to the production URL).
3. Deploy. `app/sitemap.ts` and `app/robots.ts` are generated natively.
4. In Stripe, add a production webhook endpoint pointing at
   `https://<domain>/api/stripe/webhook`.

`pnpm build` succeeds with placeholder env values, so previews deploy cleanly.

---

## Architecture

```
app/[locale]/        home, play/[game] (SEO), play/[game]/play (fullscreen),
                     leaderboard/[game], pricing, account, t/[id], about/privacy/terms/scoring
app/api/             og (dynamic OG image), stripe/{checkout,portal,webhook}
src/games/engine/    types, rng (mulberry32+cyrb128), scoring, seed, math,
                     ciede2000, registry, submission (anti-cheat recompute)
src/games/<game>/    index.ts (pure logic) + content.ts (EN/PT long-form)
src/components/       GamePlayer, per-game stimulus/input UIs, ResultScreen,
                     ShareCard, Leaderboard, AdSlot, ConsentBanner, ui/*
src/lib/             supabase, stripe, premium, leaderboard, identity,
                     local-scores, audio, consent, analytics
supabase/            migrations/0001_init.sql, functions/submit-score
tests/               unit (vitest) + e2e (playwright)
```

### Adding a sixth game

1. Add its id to `GameId` in `src/games/engine/types.ts`.
2. Implement the `Game` interface in `src/games/<id>/index.ts`.
3. Add localized content in `src/games/<id>/content.ts`.
4. Register it in `registry.ts`, `content-registry.ts`, the play UI registry,
   and add an accent/glyph in `src/config.ts`. Home, leaderboards, sitemap and
   anti-cheat pick it up automatically.

---

## Notes & limitations

- The consent banner is intentionally lightweight; replace with a full IAB TCF
  CMP (e.g. Google Funding Choices) before scaling ad serving in the EU.
- The Edge Function vendors a Deno port of the engine (see `DECISIONS.md`).
- Leaderboard ranking counts rows with a higher total; per-player de-duplication
  is done client-side for display.
- Node 20+ is recommended (Supabase JS warns on Node 18, but builds/runs fine).
