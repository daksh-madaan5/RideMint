import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';

const Textarea = forwardRef(function Textarea(
  { label, supportingText, error, className, id, required, rows = 4, ...props },
  ref
) {
  const generatedId = useId();
  const textareaId = id || `textarea-${generatedId}`;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="type-label mb-2 block text-[var(--text-primary)]">
          {label}
          {required && <span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : supportingText ? helperId : undefined}
        className={clsx(
          'w-full resize-y rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-base text-[var(--text-primary)] sm:text-sm',
          'placeholder:text-[var(--text-tertiary)] hover:border-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none focus:ring-3 focus:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]',
          'disabled:cursor-not-allowed disabled:bg-[var(--surface-subtle)] disabled:text-[var(--text-tertiary)]',
          error && 'border-[var(--danger)] focus:border-[var(--danger)]',
          className
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[var(--danger)]">{error}</p>
      ) : supportingText ? (
        <p id={helperId} className="type-caption mt-2">{supportingText}</p>
      ) : null}
    </div>
  );
});

export default Textarea;

