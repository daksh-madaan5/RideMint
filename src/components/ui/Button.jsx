import { forwardRef } from 'react';
import { clsx } from 'clsx';

const variants = {
  primary:
    'border-transparent bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)]',
  secondary:
    'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]',
  outline:
    'border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]',
  ghost:
    'border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]',
  destructive:
    'border-transparent bg-[var(--danger)] text-white hover:brightness-90',
  danger:
    'border-transparent bg-[var(--danger)] text-white hover:brightness-90',
};

const sizes = {
  xs: 'h-8 px-3 text-xs',
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  xl: 'h-12 px-6 text-base',
};

const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    isLoading = false,
    loadingLabel = 'Loading',
    disabled = false,
    icon: Icon,
    iconRight: IconRight,
    fullWidth = false,
    className,
    type = 'button',
    ...props
  },
  ref
) {
  const busy = loading || isLoading;
  const isDisabled = disabled || busy;

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-disabled={Component !== 'button' && isDisabled ? true : undefined}
      aria-busy={busy || undefined}
      className={clsx(
        'focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] border font-medium',
        'transition-[background-color,border-color,color,transform,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-standard)]',
        'hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {busy ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          {children}
          {IconRight && <IconRight className="h-4 w-4" aria-hidden="true" />}
        </>
      )}
    </Component>
  );
});

export default Button;
