import { clsx } from 'clsx';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}) {
  return (
    <div className={clsx('flex flex-col items-center justify-center px-6 py-12 text-center', className)} {...props}>
      {Icon && (
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <h3 className="type-card-heading">{title}</h3>
      {description && <p className="type-supporting mt-2 max-w-sm">{description}</p>}
      {action && (
        <div className="mt-6">
          {action?.label ? <Button onClick={action.onClick}>{action.label}</Button> : action}
        </div>
      )}
    </div>
  );
}

