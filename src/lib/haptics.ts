'use client';

/** Subtle haptic feedback on lock-in, guarded for unsupported devices. */
export function vibrate(pattern: number | number[] = 15): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // ignore — vibration is a nicety, never required
  }
}
