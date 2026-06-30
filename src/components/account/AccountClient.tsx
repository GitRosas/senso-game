'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { FEATURES, GAME_ACCENTS } from '@/config';
import { GAME_ORDER } from '@/games/engine/registry';
import { randomSeed } from '@/games/engine/seed';
import { getHistory, type LocalScore } from '@/lib/local-scores';
import { Button } from '@/components/ui/Button';
import { PremiumActions } from '@/components/PremiumActions';
import { useToast } from '@/components/ui/Toast';
import type { GameId, Mode } from '@/games/engine/types';

interface Room {
  id: string;
  name: string;
  game_id: string;
  mode: string;
  seed: string;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const w = 160;
  const h = 40;
  const max = 50;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / max) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function AccountClient() {
  const t = useTranslations('Account');
  const locale = useLocale();
  const { toast } = useToast();
  const sb = getSupabaseBrowser();

  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [history, setHistory] = useState<LocalScore[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState('');
  const [roomGame, setRoomGame] = useState<GameId>('tempo');
  const roomMode: Mode = 'easy';

  const loadRooms = useCallback(
    async (uid: string) => {
      if (!sb) return;
      const { data } = await sb
        .from('tournaments')
        .select('id,name,game_id,mode,seed')
        .eq('owner_id', uid)
        .order('created_at', { ascending: false });
      setRooms((data as Room[]) ?? []);
    },
    [sb],
  );

  useEffect(() => {
    setHistory(getHistory());
    if (!sb) {
      setReady(true);
      return;
    }
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!active) return;
      if (user) {
        setUserId(user.id);
        setEmail(user.email ?? null);
        const { data } = await sb.from('profiles').select('is_premium').eq('id', user.id).maybeSingle();
        setIsPremium(Boolean(data?.is_premium));
        await loadRooms(user.id);
      }
      setReady(true);
    })();
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [sb, loadRooms]);

  if (!sb) {
    return <p className="text-muted">{t('notAvailable')}</p>;
  }
  if (!ready) {
    return <p className="text-muted">…</p>;
  }

  if (!userId) {
    const signInEmail = async () => {
      const { error } = await sb.auth.signInWithOtp({
        email: emailInput,
        options: { emailRedirectTo: window.location.href },
      });
      toast(error ? error.message : t('linkSent'), error ? 'error' : 'success');
    };
    const signInGoogle = async () => {
      await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href },
      });
    };
    return (
      <div className="max-w-sm">
        <h2 className="text-lg font-semibold">{t('signInTitle')}</h2>
        <p className="mt-1 text-sm text-muted">{t('signInBody')}</p>
        <div className="mt-4 space-y-3">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="h-11 w-full rounded-md border border-border bg-bg px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <Button className="w-full" onClick={signInEmail} disabled={!emailInput}>
            {t('sendLink')}
          </Button>
          <Button variant="outline" className="w-full" onClick={signInGoogle}>
            {t('orGoogle')}
          </Button>
        </div>
      </div>
    );
  }

  const signOut = async () => {
    await sb.auth.signOut();
    setUserId(null);
    setEmail(null);
    setIsPremium(false);
  };

  const createRoom = async () => {
    if (!roomName) return;
    const seed = randomSeed();
    const { data, error } = await sb
      .from('tournaments')
      .insert({ name: roomName, game_id: roomGame, mode: roomMode, seed, owner_id: userId })
      .select('id,name,game_id,mode,seed')
      .single();
    if (error) {
      toast(error.message, 'error');
      return;
    }
    setRooms((prev) => [data as Room, ...prev]);
    setRoomName('');
    toast(t('roomCreated'), 'success');
  };

  const gamesWithHistory = GAME_ORDER.map((g) => ({
    game: g,
    totals: history.filter((h) => h.gameId === g).map((h) => h.total),
  })).filter((x) => x.totals.length > 0);

  return (
    <div className="space-y-10">
      {/* Account header */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4">
        <div>
          <p className="text-sm text-muted">{t('signedInAs', { email: email ?? '' })}</p>
          <p className="font-semibold">{isPremium ? t('premiumActive') : t('freePlan')}</p>
        </div>
        <div className="flex gap-2">
          <PremiumActions configured={FEATURES.stripe} signedIn isPremium={isPremium} />
          <Button variant="ghost" onClick={signOut}>
            {t('signOut')}
          </Button>
        </div>
      </section>

      {/* Training */}
      <section>
        <h2 className="text-lg font-semibold">{t('trainingTitle')}</h2>
        <p className="text-sm text-muted">{t('trainingBody')}</p>
        {!isPremium ? (
          <p className="mt-3 rounded-md border border-border bg-surface p-4 text-sm text-muted">
            {t('trainingPremiumOnly')}
          </p>
        ) : gamesWithHistory.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t('trainingEmpty')}</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {gamesWithHistory.map(({ game, totals }) => (
              <div key={game} className="rounded-lg border border-border bg-surface p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{game}</span>
                  <span className="tabular text-muted">
                    {Math.max(...totals).toFixed(1)} / 50
                  </span>
                </div>
                <Sparkline values={totals} color={GAME_ACCENTS[game]} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tournaments */}
      <section>
        <h2 className="text-lg font-semibold">{t('tournamentsTitle')}</h2>
        <p className="text-sm text-muted">{t('tournamentsBody')}</p>
        {!isPremium ? (
          <p className="mt-3 rounded-md border border-border bg-surface p-4 text-sm text-muted">
            {t('tournamentsPremiumOnly')}
          </p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-4">
              <label className="text-sm">
                <span className="mb-1 block text-muted">{t('roomName')}</span>
                <input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="h-10 rounded-md border border-border bg-bg px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-muted">{t('roomGame')}</span>
                <select
                  value={roomGame}
                  onChange={(e) => setRoomGame(e.target.value as GameId)}
                  className="h-10 rounded-md border border-border bg-bg px-3 capitalize outline-none"
                >
                  {GAME_ORDER.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <Button onClick={createRoom} disabled={!roomName}>
                {t('createRoom')}
              </Button>
            </div>

            {rooms.length > 0 && (
              <ul className="mt-3 space-y-2">
                {rooms.map((room) => (
                  <li
                    key={room.id}
                    className="flex items-center justify-between rounded-md border border-border bg-surface p-3 text-sm"
                  >
                    <span className="font-medium">
                      {room.name}{' '}
                      <span className="text-muted capitalize">
                        ({room.game_id} · {room.mode})
                      </span>
                    </span>
                    <Link
                      href={`/t/${room.id}`}
                      className="font-semibold text-accent underline underline-offset-2"
                    >
                      {locale === 'pt' ? 'Abrir' : 'Open'}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}
