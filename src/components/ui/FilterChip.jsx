import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';

export const FilterChip = ({
  label,
  active = false,
  onClick,
  icon: Icon,
  className
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-white shadow-sm'
          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
        className
      )}
    >
      {Icon && <Icon className={clsx("h-4 w-4", active ? "text-white" : "text-gray-500 dark:text-gray-400")} />}
      {label}
    </motion.button>
  );
};

export default FilterChip;
