import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(function Input(
  {
    label,
    supportingText,
    error,
    icon: Icon,
    iconRight: IconRight,
    className,
    containerClassName,
    id,
    required,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || `field-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="type-label mb-2 block text-[var(--text-primary)]">
          {label}
          {required && <span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : supportingText ? helperId : undefined}
          className={clsx(
            'h-11 w-full rounded-[var(--radius-control)] border bg-[var(--surface)] px-3 text-base text-[var(--text-primary)] sm:text-sm',
            'border-[var(--border)] placeholder:text-[var(--text-tertiary)]',
            'transition-[border-color,box-shadow,background-color] duration-[var(--duration-normal)]',
            'hover:border-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none focus:ring-3 focus:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]',
            'disabled:cursor-not-allowed disabled:bg-[var(--surface-subtle)] disabled:text-[var(--text-tertiary)]',
            Icon && 'pl-10',
            IconRight && 'pr-10',
            error && 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[color-mix(in_srgb,var(--danger)_18%,transparent)]',
            className
          )}
          {...props}
        />
        {IconRight && (
          <IconRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
        )}
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[var(--danger)]">{error}</p>
      ) : supportingText ? (
        <p id={helperId} className="type-caption mt-2">{supportingText}</p>
      ) : null}
    </div>
  );
});

export default Input;

