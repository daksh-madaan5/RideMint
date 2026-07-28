import { clsx } from 'clsx';

const variants = {
  default: 'bg-[var(--surface-subtle)] text-[var(--text-secondary)]',
  primary: 'bg-[var(--primary-subtle)] text-[var(--primary)]',
  info: 'bg-[var(--info-subtle)] text-[var(--primary)]',
  success: 'bg-[var(--success-subtle)] text-[var(--success)]',
  warning: 'bg-[var(--warning-subtle)] text-[var(--warning)]',
  danger: 'bg-[var(--danger-subtle)] text-[var(--danger)]',
  purple: 'bg-[var(--primary-subtle)] text-[var(--primary)]',
};

const dotColors = {
  default: 'bg-[var(--text-tertiary)]',
  primary: 'bg-[var(--primary)]',
  info: 'bg-[var(--primary)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  danger: 'bg-[var(--danger)]',
  purple: 'bg-[var(--primary)]',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-[var(--radius-pill)] font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {dot && <span className={clsx('mr-1.5 h-1.5 w-1.5 rounded-full', dotColors[variant] || dotColors.default)} aria-hidden="true" />}
      {children}
    </span>
  );
}

