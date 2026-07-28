import { forwardRef, useId } from 'react';

const Radio = forwardRef(function Radio(
  { label, description, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || `radio-${generatedId}`;
  const descriptionId = `${inputId}-description`;

  return (
    <div className="flex items-start gap-3">
      <input
        ref={ref}
        id={inputId}
        type="radio"
        aria-describedby={description ? descriptionId : undefined}
        className="mt-0.5 h-5 w-5 shrink-0 border-[var(--border-strong)] accent-[var(--primary)]"
        {...props}
      />
      <div>
        <label htmlFor={inputId} className="type-label block cursor-pointer text-[var(--text-primary)]">{label}</label>
        {description && <p id={descriptionId} className="type-caption mt-1">{description}</p>}
      </div>
    </div>
  );
});

export default Radio;

