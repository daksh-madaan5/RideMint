import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({ variant = 'text', className, ...props }) => {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700/50 rounded';
  
  if (variant === 'text') {
    return <div className={clsx(baseClass, 'h-4 w-3/4', className)} {...props} />;
  }

  if (variant === 'paragraph') {
    return (
      <div className={clsx('space-y-2', className)} {...props}>
        <div className={clsx(baseClass, 'h-4 w-full')} />
        <div className={clsx(baseClass, 'h-4 w-5/6')} />
        <div className={clsx(baseClass, 'h-4 w-4/6')} />
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={clsx(baseClass, 'h-10 w-10 rounded-full', className)} {...props} />;
  }

  if (variant === 'image') {
    return <div className={clsx(baseClass, 'h-48 w-full', className)} {...props} />;
  }

  if (variant === 'card') {
    return (
      <div className={clsx('flex flex-col gap-3', className)} {...props}>
        <div className={clsx(baseClass, 'h-40 w-full')} />
        <div className="space-y-2">
          <div className={clsx(baseClass, 'h-4 w-3/4')} />
          <div className={clsx(baseClass, 'h-4 w-1/2')} />
        </div>
      </div>
    );
  }

  return <div className={clsx(baseClass, className)} {...props} />;
};

export default Skeleton;
