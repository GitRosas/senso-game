'use client';

// Haptic feedback on lock-in; silently skipped on unsupported devices.
export function vibrate(pattern: number | number[] = 15): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // vibration is a nicety, never required
  }
}
