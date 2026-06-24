-- Senso initial schema: profiles, scores (with server-side anti-cheat), tournaments.
-- Writes to `scores` are forbidden to anon/auth roles; only the submit-score Edge
-- Function (service role) may insert, after recomputing the score from the seed.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  is_premium boolean not null default false,
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- tournaments (private rooms — premium)
-- ---------------------------------------------------------------------------
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  game_id text not null,
  mode text not null check (mode in ('easy','hard')),
  seed text not null,
  owner_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.tournaments enable row level security;

-- Anyone with the link can read the room (so invited players can join).
drop policy if exists "tournaments_select_all" on public.tournaments;
create policy "tournaments_select_all" on public.tournaments
  for select using (true);

-- Only the authenticated owner may create a room.
drop policy if exists "tournaments_insert_owner" on public.tournaments;
create policy "tournaments_insert_owner" on public.tournaments
  for insert with check (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- scores
-- ---------------------------------------------------------------------------
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  mode text not null check (mode in ('easy','hard')),
  total numeric(5,2) not null,
  rounds jsonb not null,
  seed text not null,
  is_daily boolean not null default false,
  daily_date date,
  tournament_id uuid references public.tournaments (id) on delete cascade,
  player_id uuid not null,
  display_name text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists scores_alltime_idx on public.scores (game_id, mode, total desc);
create index if not exists scores_daily_idx on public.scores (game_id, mode, daily_date, total desc);
create index if not exists scores_tournament_idx on public.scores (tournament_id, total desc);
-- Enforce one daily attempt per player/game/mode/day.
create unique index if not exists scores_daily_unique
  on public.scores (player_id, game_id, mode, daily_date)
  where is_daily = true;

alter table public.scores enable row level security;

-- Public read for leaderboards.
drop policy if exists "scores_select_all" on public.scores;
create policy "scores_select_all" on public.scores
  for select using (true);

-- No client writes: inserts/updates/deletes happen only via the service role
-- (Edge Function), which bypasses RLS. Intentionally NO insert/update policy.
