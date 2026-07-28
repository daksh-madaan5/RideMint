import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Styled Input component with label, error state, and icon support.
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      iconRight: IconRight,
      className,
      containerClassName,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-surface-500" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-2.5 text-sm h-11',
              'text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'hover:border-surface-300 dark:hover:border-surface-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              Icon && 'pl-10',
              IconRight && 'pr-10',
              error && 'border-danger focus:ring-danger/50 focus:border-danger',
              className
            )}
            {...props}
          />
          {IconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <IconRight className="h-4 w-4 text-surface-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-danger flex items-center gap-1">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
