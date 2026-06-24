// Anti-cheat score submission. Recomputes the score server-side from the seed
// and guesses (never trusting any client-sent total), enforces one daily attempt
// per player, and inserts using the service role (bypassing RLS — direct client
// inserts are forbidden by policy).
import { createClient } from 'npm:@supabase/supabase-js@2';
import { recomputeScore } from './engine.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const gameId = String(payload.gameId ?? '');
  const mode = String(payload.mode ?? '');
  const seed = String(payload.seed ?? '');
  const isDaily = payload.isDaily === true;
  const dailyDate = typeof payload.dailyDate === 'string' ? payload.dailyDate : null;
  const guesses = Array.isArray(payload.guesses) ? payload.guesses : [];
  const playerId = String(payload.playerId ?? '');
  const displayName = String(payload.displayName ?? 'Anonymous').slice(0, 24);

  if (!UUID.test(playerId)) return json({ error: 'invalid_player' }, 400);

  const result = recomputeScore({ gameId, mode, seed, guesses });
  if (!result.ok) return json({ error: result.reason }, 400);

  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return json({ error: 'server_misconfigured' }, 500);
  const supabase = createClient(url, serviceKey);

  const country = req.headers.get('cf-ipcountry') ?? req.headers.get('x-country');

  // Enforce one counted daily attempt per player/game/mode/day.
  if (isDaily && dailyDate) {
    const { data: existing } = await supabase
      .from('scores')
      .select('id,total')
      .eq('player_id', playerId)
      .eq('game_id', gameId)
      .eq('mode', mode)
      .eq('is_daily', true)
      .eq('daily_date', dailyDate)
      .maybeSingle();
    if (existing) {
      const rank = await computeRank(supabase, gameId, mode, Number(existing.total), {
        isDaily,
        dailyDate,
      });
      return json({ total: result.total, rounds: result.rounds, rank, alreadyCounted: true });
    }
  }

  const { error: insertError } = await supabase.from('scores').insert({
    game_id: gameId,
    mode,
    total: result.total,
    rounds: result.rounds,
    seed,
    is_daily: isDaily,
    daily_date: isDaily ? dailyDate : null,
    player_id: playerId,
    display_name: displayName,
    country,
  });
  if (insertError) return json({ error: 'insert_failed', detail: insertError.message }, 500);

  const rank = await computeRank(supabase, gameId, mode, result.total, { isDaily, dailyDate });
  return json({ total: result.total, rounds: result.rounds, rank });
});

async function computeRank(
  supabase: ReturnType<typeof createClient>,
  gameId: string,
  mode: string,
  total: number,
  opts: { isDaily: boolean; dailyDate: string | null },
): Promise<number> {
  let q = supabase
    .from('scores')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId)
    .eq('mode', mode)
    .gt('total', total);
  if (opts.isDaily && opts.dailyDate) {
    q = q.eq('is_daily', true).eq('daily_date', opts.dailyDate);
  }
  const { count } = await q;
  return (count ?? 0) + 1;
}
