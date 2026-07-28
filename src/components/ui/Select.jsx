import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown } from 'react-icons/hi2';

const Select = forwardRef(function Select(
  { label, supportingText, error, options = [], placeholder, children, className, containerClassName, id, required, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="type-label mb-2 block text-[var(--text-primary)]">
          {label}
          {required && <span className="ml-1 text-[var(--danger)]" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : supportingText ? helperId : undefined}
          className={clsx(
            'h-11 w-full appearance-none rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 pr-10 text-base text-[var(--text-primary)] sm:text-sm',
            'transition-[border-color,box-shadow,background-color] duration-[var(--duration-normal)]',
            'hover:border-[var(--border-strong)] focus:border-[var(--primary)] focus:outline-none focus:ring-3 focus:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]',
            'disabled:cursor-not-allowed disabled:bg-[var(--surface-subtle)] disabled:text-[var(--text-tertiary)]',
            error && 'border-[var(--danger)] focus:border-[var(--danger)]',
            className
          )}
          {...props}
        >
          {children || (
            <>
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((option) => {
                const value = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return <option key={value} value={value}>{optionLabel}</option>;
              })}
            </>
          )}
        </select>
        <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[var(--danger)]">{error}</p>
      ) : supportingText ? (
        <p id={helperId} className="type-caption mt-2">{supportingText}</p>
      ) : null}
    </div>
  );
});

export default Select;
