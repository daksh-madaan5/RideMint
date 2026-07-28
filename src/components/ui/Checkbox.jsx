import { forwardRef, useId } from 'react';

const Checkbox = forwardRef(function Checkbox(
  { label, description, error, id, className, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || `checkbox-${generatedId}`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : description ? descriptionId : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded-[0.375rem] border-[var(--border-strong)] accent-[var(--primary)]"
          {...props}
        />
        <div>
          <label htmlFor={inputId} className="type-label block cursor-pointer text-[var(--text-primary)]">{label}</label>
          {description && <p id={descriptionId} className="type-caption mt-1">{description}</p>}
        </div>
      </div>
      {error && <p id={errorId} className="ml-8 mt-2 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
});

export default Checkbox;
