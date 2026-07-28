import { useCallback, useEffect, useId, useRef } from 'react';
import { clsx } from 'clsx';
import { HiXMark } from 'react-icons/hi2';
import IconButton from './IconButton';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  className,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape' && onClose) {
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)];
    if (!focusable.length) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const frame = requestAnimationFrame(() => {
      const firstFocusable = dialogRef.current?.querySelector(focusableSelector);
      (firstFocusable || dialogRef.current)?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--navigation)_55%,transparent)] transition-opacity duration-[var(--duration-normal)]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={clsx(
          'relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-[var(--radius-modal)] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-dialog)]',
          'animate-[dialog-enter_var(--duration-normal)_var(--ease-enter)]',
          sizes[size] || sizes.md,
          className
        )}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-4 sm:px-6">
            <div>
              {title && <h2 id={titleId} className="type-card-heading">{title}</h2>}
              {description && <p id={descriptionId} className="type-supporting mt-1">{description}</p>}
            </div>
            {showClose && onClose && (
              <IconButton label="Close dialog" size="sm" onClick={onClose}>
                <HiXMark className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            )}
          </div>
        )}
        <div className="scrollbar-custom flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
