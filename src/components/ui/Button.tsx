import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-fg font-semibold shadow-[0_6px_20px_-6px_rgb(var(--accent)/0.6)] hover:brightness-110 active:brightness-95',
  secondary: 'bg-surface-2 text-fg hover:bg-surface-2/80 border border-border',
  outline: 'border border-border text-fg hover:bg-surface-2/60 hover:border-accent/50',
  ghost: 'text-fg hover:bg-surface-2/60',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-md',
  md: 'h-11 px-5 text-sm rounded-md',
  lg: 'h-14 px-7 text-base rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        'min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});
