import React, { useState } from 'react';
import clsx from 'clsx';

export const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-surface-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const showInitials = !src || imageError;

  return (
    <div className={clsx('relative inline-flex flex-shrink-0 rounded-full', sizes[size], className)} {...props}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-surface-200 bg-surface-100 dark:border-surface-700 dark:bg-surface-800">
        {showInitials ? (
          <span className="font-medium text-surface-600 dark:text-surface-300">
            {getInitials(name)}
          </span>
        ) : (
          <img
            src={src}
            alt={name || 'Avatar'}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full border-2 border-white dark:border-gray-900',
            statusColors[status] || statusColors.offline,
            size === 'xs' ? 'h-2 w-2' : size === 'sm' ? 'h-2.5 w-2.5' : size === 'xl' ? 'h-4 w-4' : 'h-3 w-3'
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
