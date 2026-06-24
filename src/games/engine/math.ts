/** Small pure numeric helpers shared across game modules. */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Uniform sample in [min, max). */
export function uniform(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

/** Uniform sample in log space — denser toward `min`, matching perceptual scales. */
export function logUniform(rng: () => number, min: number, max: number): number {
  const lmin = Math.log(min);
  const lmax = Math.log(max);
  return Math.exp(lmin + rng() * (lmax - lmin));
}

/** Inclusive integer in [min, max]. */
export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Positive modulo (handles negative dividends). */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
