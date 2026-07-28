import { forwardRef } from 'react';
import { clsx } from 'clsx';

const IconButton = forwardRef(function IconButton(
  { label, children, size = 'md', variant = 'ghost', className, type = 'button', ...props },
  ref
) {
  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-12 w-12',
  };

  const variants = {
    ghost: 'border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]',
    outline: 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)]',
    destructive: 'border-transparent bg-[var(--danger-subtle)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white',
  };

  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={clsx(
        'focus-ring inline-flex shrink-0 items-center justify-center rounded-[var(--radius-control)] border',
        'transition-[background-color,border-color,color,transform] duration-[var(--duration-normal)] hover:-translate-y-px active:translate-y-0',
        'disabled:pointer-events-none disabled:opacity-50',
        sizes[size] || sizes.md,
        variants[variant] || variants.ghost,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default IconButton;

