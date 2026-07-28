import { clsx } from 'clsx';
import { motion } from 'motion/react';

/**
 * Glassmorphic Card component with optional hover lift animation.
 */
export default function Card({
  children,
  className,
  hover = true,
  padding = true,
  glass = true,
  onClick,
  as = 'div',
}) {
  const Component = onClick ? motion.div : as === 'article' ? motion.article : motion.div;

  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={clsx(
        'rounded-2xl overflow-hidden',
        'bg-white dark:bg-surface-900',
        glass && 'border border-surface-200 dark:border-surface-800 shadow-sm',
        hover && 'hover:shadow-card-hover cursor-pointer',
        padding && 'p-6',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Card Header sub-component.
 */
Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
};

/**
 * Card Body sub-component.
 */
Card.Body = function CardBody({ children, className }) {
  return <div className={clsx(className)}>{children}</div>;
};

/**
 * Card Footer sub-component.
 */
Card.Footer = function CardFooter({ children, className }) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-surface-700/50', className)}>
      {children}
    </div>
  );
};
