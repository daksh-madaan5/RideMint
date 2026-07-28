import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmLabel,
  confirmText,
  cancelLabel = 'Cancel',
  loading = false,
  isLoading = false,
  danger = true,
  confirmVariant,
}) {
  const busy = loading || isLoading;
  const body = message || description;
  const actionLabel = confirmLabel || confirmText || 'Confirm';
  const destructive = confirmVariant === 'danger' || confirmVariant === 'destructive' || danger;

  return (
    <Modal isOpen={isOpen} onClose={busy ? undefined : onClose} size="sm" showClose={false}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] ${
          destructive
            ? 'bg-[var(--danger-subtle)] text-[var(--danger)]'
            : 'bg-[var(--warning-subtle)] text-[var(--warning)]'
        }`}>
          <HiOutlineExclamationTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="type-card-heading">{title}</h2>
          {body && <p className="type-supporting mt-2">{body}</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose} disabled={busy}>{cancelLabel}</Button>
        <Button
          variant={destructive ? 'destructive' : 'primary'}
          onClick={onConfirm}
          loading={busy}
          loadingLabel="Working"
        >
          {actionLabel}
        </Button>
      </div>
    </Modal>
  );
}

