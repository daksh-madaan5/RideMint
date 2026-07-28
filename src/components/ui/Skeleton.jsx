import { clsx } from 'clsx';

export default function Skeleton({ variant = 'text', className, ...props }) {
  const base = 'animate-pulse rounded-[var(--radius-control)] bg-[var(--surface-subtle)]';

  if (variant === 'paragraph') {
    return (
      <div className={clsx('space-y-2', className)} aria-hidden="true" {...props}>
        <div className={clsx(base, 'h-4 w-full')} />
        <div className={clsx(base, 'h-4 w-5/6')} />
        <div className={clsx(base, 'h-4 w-3/5')} />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={clsx('space-y-4', className)} aria-hidden="true" {...props}>
        <div className={clsx(base, 'aspect-[16/10] w-full')} />
        <div className={clsx(base, 'h-5 w-3/4')} />
        <div className={clsx(base, 'h-4 w-1/2')} />
      </div>
    );
  }

  const variants = {
    text: 'h-4 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    image: 'aspect-[16/10] w-full',
  };

  return <div className={clsx(base, variants[variant], className)} aria-hidden="true" {...props} />;
}

