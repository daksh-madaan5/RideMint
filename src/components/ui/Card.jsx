import { clsx } from 'clsx';

export default function Card({
  children,
  className,
  hover = false,
  padding = true,
  glass: _glass,
  onClick,
  as: Component = 'div',
  ...props
}) {
  const interactiveProps = onClick
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick(event);
          }
        },
      }
    : {};

  return (
    <Component
      className={clsx(
        'overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)]',
        hover && 'hover-lift',
        onClick && 'cursor-pointer',
        padding && 'p-5 sm:p-6',
        className
      )}
      {...interactiveProps}
      {...props}
    >
      {children}
    </Component>
  );
}

Card.Header = function CardHeader({ children, className }) {
  return <div className={clsx('mb-4', className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className }) {
  return <div className={className}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div className={clsx('mt-5 border-t border-[var(--border)] pt-4', className)}>
      {children}
    </div>
  );
};
