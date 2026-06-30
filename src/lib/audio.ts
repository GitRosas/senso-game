'use client';

// Shared AudioContext, created lazily on the first user gesture.
let ctx: AudioContext | null = null;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export interface ToneHandle {
  setFrequency: (hz: number) => void;
  stop: () => void;
}

// 15ms attack/release to avoid clicks. Without durationMs the tone sustains
// until stop() is called - used for the live drag in Pitch.
export function playTone(
  freq: number,
  options: { durationMs?: number; onEnded?: () => void; gain?: number } = {},
): ToneHandle | null {
  const audio = getAudioContext();
  if (!audio) {
    options.onEnded?.();
    return null;
  }

  const { durationMs, onEnded, gain = 0.18 } = options;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audio.currentTime);

  const attack = 0.015;
  const release = 0.015;
  amp.gain.setValueAtTime(0, audio.currentTime);
  amp.gain.linearRampToValueAtTime(gain, audio.currentTime + attack);

  osc.connect(amp).connect(audio.destination);
  osc.start();

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    const now = audio.currentTime;
    amp.gain.cancelScheduledValues(now);
    amp.gain.setValueAtTime(amp.gain.value, now);
    amp.gain.linearRampToValueAtTime(0, now + release);
    osc.stop(now + release + 0.02);
    osc.onended = () => onEnded?.();
  };

  if (durationMs != null) {
    const now = audio.currentTime;
    const end = now + durationMs / 1000;
    amp.gain.setValueAtTime(gain, end - release);
    amp.gain.linearRampToValueAtTime(0, end);
    osc.stop(end + 0.02);
    osc.onended = () => onEnded?.();
  }

  return {
    setFrequency: (hz: number) => {
      osc.frequency.setTargetAtTime(hz, audio.currentTime, 0.01);
    },
    stop,
  };
}
