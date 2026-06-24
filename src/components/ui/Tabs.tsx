'use client';

import { cn } from '@/lib/utils';

export interface TabItem {
  value: string;
  label: string;
}

export function Tabs({
  items,
  value,
  onValueChange,
  ariaLabel,
  className,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex gap-1 rounded-md border border-border bg-surface p-1', className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onValueChange(item.value)}
            className={cn(
              'min-h-[40px] rounded px-4 text-sm font-medium transition',
              active ? 'bg-accent text-accent-fg' : 'text-muted hover:text-fg',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
