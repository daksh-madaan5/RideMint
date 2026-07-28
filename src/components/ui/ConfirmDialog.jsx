import React from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import Modal from './Modal';
import Spinner from './Spinner';
import clsx from 'clsx';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  danger = true
}) => {
  return (
    <Modal isOpen={isOpen} onClose={loading ? undefined : onClose} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={clsx(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
            danger ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500"
          )}>
            <HiOutlineExclamationTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={clsx(
              "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-70",
              danger ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : "bg-primary hover:bg-primary/90 focus:ring-primary"
            )}
          >
            {loading && <Spinner size="sm" className="mr-2 border-white/20 border-t-white" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
