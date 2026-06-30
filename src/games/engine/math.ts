// Small numeric helpers shared across games.

export function uniform(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

// Uniform in log space - denser toward `min`, matches perceptual scales.
export function logUniform(rng: () => number, min: number, max: number): number {
  const lmin = Math.log(min);
  const lmax = Math.log(max);
  return Math.exp(lmin + rng() * (lmax - lmin));
}

// Inclusive integer in [min, max].
export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// Positive modulo (handles negative dividends).
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
