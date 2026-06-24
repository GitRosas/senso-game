import type { ComponentType } from 'react';
import type { Mode } from '@/games/engine/types';

export interface StimulusProps {
  target: unknown;
  mode: Mode;
  onDone: () => void;
}

export interface InputProps {
  target: unknown;
  mode: Mode;
  onSubmit: (guess: unknown) => void;
}

export interface ReviewProps {
  target: unknown;
  guess: unknown;
  mode: Mode;
  compact?: boolean;
}

export interface GameUI {
  Stimulus: ComponentType<StimulusProps>;
  Input: ComponentType<InputProps>;
  Review: ComponentType<ReviewProps>;
}

export interface RoundOutcome {
  roundIndex: number;
  target: unknown;
  guess: unknown;
  error: number;
  score: number;
}
