import { useEffect, useId, useRef } from 'react';
import { clsx } from 'clsx';
import { HiXMark } from 'react-icons/hi2';
import IconButton from './IconButton';

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  className,
}) {
  const titleId = useId();
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => event.key === 'Escape' && onClose?.();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => drawerRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close drawer" className="absolute inset-0 bg-[color-mix(in_srgb,var(--navigation)_45%,transparent)]" onClick={onClose} />
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(
          'absolute inset-y-0 flex w-full max-w-sm flex-col bg-[var(--surface)] shadow-[var(--shadow-dialog)]',
          side === 'left' ? 'left-0 border-r border-[var(--border)]' : 'right-0 border-l border-[var(--border)]',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 id={titleId} className="type-card-heading">{title}</h2>
          <IconButton label="Close drawer" size="sm" onClick={onClose}>
            <HiXMark className="h-5 w-5" aria-hidden="true" />
          </IconButton>
        </div>
        <div className="scrollbar-custom flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
