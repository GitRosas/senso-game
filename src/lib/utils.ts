import { clsx, type ClassValue } from 'clsx';

/** Merge conditional class names. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format a 0–50 total as "xx.x". */
export function formatTotal(total: number): string {
  return total.toFixed(1);
}

/** Clamp a number into a range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Convert #rrggbb to a space-separated "r g b" string for CSS variables. */
export function hexToRgbChannels(hex: string): string {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
