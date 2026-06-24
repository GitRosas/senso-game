'use client';

import { cn } from '@/lib/utils';

export function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  valueLabel,
  ariaValueText,
  trackStyle,
  className,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  valueLabel?: string;
  ariaValueText?: string;
  trackStyle?: React.CSSProperties;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-fg">{label}</span>
        {valueLabel != null && <span className="tabular text-muted">{valueLabel}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuetext={ariaValueText}
        onChange={(e) => onChange(Number(e.target.value))}
        style={trackStyle}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent
          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent"
      />
    </label>
  );
}
