import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-md w-full overflow-hidden text-xs">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            {isDangerous && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 text-neutral-600 leading-relaxed">
          {message}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 bg-neutral-50 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-md font-medium cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-3 py-1.5 text-white rounded-md font-semibold cursor-pointer flex items-center gap-1.5 ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-neutral-900 hover:bg-neutral-800'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
