import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-rose-50 text-[#DC5265] shrink-0 border border-rose-200 shadow-subtle">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-[#68758B] leading-relaxed font-medium">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-[#E5EAF2]">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
