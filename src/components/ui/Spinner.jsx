import React from 'react';
import clsx from 'clsx';

export const Spinner = ({ 
  size = 'md', 
  label, 
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={clsx(
          'inline-block animate-spin rounded-full border-solid border-current border-t-transparent text-primary',
          sizes[size],
          className
        )}
        role="status"
        aria-label="loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
      {label && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
    </div>
  );
};

export default Spinner;
