import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Lead } from '../../types/erp';
import { useModalDismiss } from '../../hooks/useModalDismiss';

interface LostReasonModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export const LostReasonModal: React.FC<LostReasonModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm
}) => {
  const [lostReason, setLostReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { contentRef, handleMouseDown, handleClick } = useModalDismiss(
    isOpen && !!lead && !isSubmitting,
    onClose
  );

  useEffect(() => {
    if (isOpen && lead) {
      setLostReason(lead.lostReason || '');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = lostReason.trim();
    if (!trimmed) {
      setError('Please provide a reason why this lead is being marked as Lost.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onConfirm(trimmed);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update lead stage. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150"
    >
      <div
        ref={contentRef}
        className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-w-md w-full overflow-hidden text-xs"
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Mark Lead as Lost</h3>
              <p className="text-[11px] text-neutral-500">{lead.company} ({lead.leadName})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1 rounded-md hover:bg-neutral-100 disabled:opacity-50"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="modal-lost-reason" className="block text-[11px] font-semibold text-neutral-700 mb-1.5">
              Lost Reason <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="modal-lost-reason"
              rows={3}
              value={lostReason}
              onChange={(e) => {
                setLostReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Price too high, chosen competitor (specify), project cancelled, no response to follow-ups..."
              className={`w-full p-2.5 bg-neutral-50 border rounded-lg text-xs outline-none transition-colors ${
                error
                  ? 'border-rose-400 focus:border-rose-600 bg-rose-50/30'
                  : 'border-neutral-300 focus:border-neutral-900 focus:bg-white'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span>
                <span>{error}</span>
              </p>
            )}
            <p className="text-[10px] text-neutral-400 mt-1">
              A clear reason helps improve future sales conversion and commercial planning.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-md text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Confirm Lost</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
