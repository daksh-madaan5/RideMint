import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { HiChevronDown } from 'react-icons/hi2';

/**
 * Styled Select dropdown component.
 */
const Select = forwardRef(
  ({ label, error, options = [], placeholder, className, containerClassName, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'w-full appearance-none bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl',
              'px-4 py-2.5 pr-10 text-sm h-11 text-surface-900 dark:text-surface-100',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'hover:border-surface-300 dark:hover:border-surface-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-danger focus:ring-danger/50',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="text-surface-500">
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value;
              const label = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={value} value={value} className="bg-white dark:bg-surface-900">
                  {label}
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <HiChevronDown className="h-4 w-4 text-surface-500" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
