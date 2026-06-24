# DECISIONS

Production-grade choices made where the master prompt was underspecified.

## Project layout

- **Built at the repository root** (not a nested `senso/` folder). The opened
  workspace _is_ the project, so `app/`, `src/`, `supabase/` live at the root.
- **pnpm via Corepack→npm**: Corepack couldn't write to the global Node dir on
  this machine, so pnpm 9 was installed with `npm i -g pnpm`. All scripts use pnpm.

## Engine & math

- **CIEDE2000 is implemented in-house** (`src/games/engine/ciede2000.ts`),
  verified against the Sharma–Wu–Dalal (2005) reference set to 3+ decimals.
  Reason: culori's `differenceCiede2000` deviates from the canonical reference by
  up to ~0.19 ΔE, which would fail the §16 "reference pairs" requirement. culori
  is still used for all color-space **conversions** (OKLCh/HSV → Lab, gamut
  mapping), satisfying "use culori for color math".
- **Hue targets are gamut-mapped** (`clampChroma`) before both display and
  scoring, so a player is scored against the colour they actually saw, not an
  out-of-sRGB ideal.
- **`Game` interface gained `parseGuess`** (validate/normalise a raw guess) so the
  anti-cheat function can reject out-of-range guesses with shared, tested code.
- **Type-erased registry** (`ErasedGame` + `eraseGame`) lets the generic player
  loop and submission code iterate games without `any`, with a single contained
  cast at registration.
- **Tempo `studyMs`** is advisory (the stimulus length equals the target
  duration, owned by the stimulus component). Per-game stimulus components own
  their own timing rather than the player loop reading `studyMs`.

## Determinism / modes

- **Seeds**: practice = random base62 token (client-generated to avoid SSR
  mismatch); daily = `daily:{game}:{mode}:{YYYY-MM-DD-UTC}`; challenge = the
  played seed echoed in `?c=`. The play route accepts `c` matching
  `^[A-Za-z0-9:_-]{1,80}$` so daily strings can also be shared as challenges.

## Data / anti-cheat

- **The Edge Function vendors a Deno-compatible copy of the engine**
  (`supabase/functions/submit-score/engine.ts`). Next's bundler (extensionless TS
  imports, bare specifiers) and Deno's resolver aren't interoperable, so a
  faithful port is kept in sync; the identical algorithm is covered by the Vitest
  suite (`recomputeScore`).
- **`player_id` is a UUID** (browser `crypto.randomUUID`), matching the `uuid`
  column; the function rejects non-UUID ids.
- **Daily uniqueness** is enforced both by a partial unique index and by an
  explicit check in the function (returns the existing result instead of erroring).
- **Offline-first leaderboard**: with no Supabase env, scores are recomputed and
  stored in `localStorage` and the leaderboard renders that device-local board.
  This keeps games/leaderboard/sharing fully working with zero backend and lets
  the e2e suite run without a database.

## Tournaments (premium)

- A tournament is a named room with one shared **seed**. The private leaderboard
  is simply "all scores for this game/mode/seed", so it needs no extra write path
  (the seed column already exists). Invite link → `/{locale}/t/{id}`.

## Monetization

- **Lightweight consent banner** stores `all`/`essential` in `localStorage` + a
  cookie; AdSense and analytics never load before consent. README notes a full
  IAB TCF CMP should replace it before scaling in the EU.
- **Ads render only** on content/result/leaderboard surfaces, never on the play
  overlay, and are hidden for premium users (`usePremium`).
- **Stripe** is a functional scaffold: checkout + portal + signature-verified
  webhook flip `profiles.is_premium`. All Stripe/Supabase code **degrades
  gracefully** to 503/hidden UI when env is absent.

## UX

- **Immersive play overlay**: `GamePlayer` is `fixed inset-0 z-50`, covering nav
  during play; the result screen returns to normal flow (a content surface where
  ads/sharing belong). The game intro page (`/play/{game}`) hosts the long-form
  SEO content and a play panel that links into the overlay, rather than embedding
  the overlay inline.
- **Tap-to-start each round** doubles as the user gesture that unlocks Web Audio
  for Pitch.

## i18n / fonts

- `next-intl` v3 with `localePrefix: 'always'`; `/` → detected locale via
  middleware. Fonts via `next/font/google` (Inter + JetBrains Mono).
- Long-form content lives in per-game `content.ts` (typed by
  `content-types.ts`), not in the UI message catalogs.

## v1.1 — sixth game + single difficulty + polish

- **New game "Spot"** (id `spot`, 📍, cyan): visuospatial position memory. A dot
  flashes in a square field, vanishes, and the player marks where it was; error
  is Euclidean distance as a fraction of the field width (half-score 0.12). It is
  the "where" dimension (dorsal stream), distinct from the existing "what"/"how
  much" games, and adds a tap-to-place interaction. Wired through registry,
  content-registry, play UI registry, config, messages, OG route and the Edge
  Function engine — adding it touched only those single-source lists.
- **Difficulty modes removed.** There is now one finely-tuned difficulty. Rather
  than rip the concept out of seeds, the DB and leaderboards (a risky, breaking
  refactor), `Mode` is narrowed to the single literal `'easy'`: seeds still read
  `…:easy:…`, the `scores.mode` column and its check constraint are unchanged, and
  existing easy leaderboard entries stay valid. All UI difficulty selectors
  (play panel, leaderboard tabs, account room mode, the player's mode label) and
  the per-game `hard` branches were removed; `recomputeScore` now rejects any mode
  other than `easy`. SEO content was updated to describe the single difficulty.
- **Aesthetic polish:** ambient accent glow behind the page (`body::before`),
  gradient hero heading (`.text-gradient`), per-game accent bar + lift on the
  home cards, and a custom scrollbar. Purely additive; no a11y/contrast regressions.
