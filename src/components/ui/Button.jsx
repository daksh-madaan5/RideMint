import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

const variants = {
  primary:
    'bg-primary-900 text-white hover:bg-primary-800 shadow-sm dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-200',
  secondary:
    'bg-white text-surface-900 hover:bg-surface-50 border border-surface-200 shadow-sm dark:bg-surface-900 dark:text-surface-100 dark:border-surface-700 dark:hover:bg-surface-800',
  outline:
    'border border-surface-300 text-surface-700 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800',
  ghost:
    'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100',
  danger:
    'bg-danger text-white hover:bg-red-600 shadow-sm',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg h-7',
  sm: 'px-3 py-2 text-sm rounded-lg h-9',
  md: 'px-4 py-2 text-sm rounded-xl h-10',
  lg: 'px-6 py-2.5 text-base rounded-xl h-12',
  xl: 'px-8 py-3 text-lg rounded-xl h-14',
};

/**
 * Premium Button component with variants, sizes, loading state, and motion.
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon: Icon,
      iconRight: IconRight,
      fullWidth = false,
      className,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer',
          'focus-ring disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4" />}
            {children}
            {IconRight && <IconRight className="h-4 w-4" />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
