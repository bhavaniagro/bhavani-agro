import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Edit3, Check } from 'lucide-react';
import { Lead, FinishedProduct, LeadStage } from '../../types/erp';
import {
  LeadFormFields,
  LeadFormState,
  validateLeadForm
} from './LeadFormFields';
import { useModalDismiss } from '../../hooks/useModalDismiss';

interface LeadFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialLead?: Lead | null;
  products: FinishedProduct[];
  onClose: () => void;
  onSubmit: (leadData: any) => Promise<void>;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  mode,
  initialLead,
  products,
  onClose,
  onSubmit
}) => {
  const getDefaultState = (): LeadFormState => ({
    leadName: '',
    company: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address: '',
    location: '',
    productInterested: products[0]?.productName || '',
    expectedQuantityMT: 10,
    estimatedValue: 62000,
    followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    followUpTime: '',
    salesperson: 'Sales Executive',
    leadSource: 'Direct Enquiry',
    status: 'New',
    notes: '',
    lostReason: ''
  });

  const [formData, setFormData] = useState<LeadFormState>(getDefaultState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const prevIsOpenRef = useRef(false);

  const { contentRef, handleMouseDown, handleClick } = useModalDismiss(
    isOpen && !isSubmitting,
    onClose
  );

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = isOpen;

    if (!isOpen) return;

    // Only initialize form data when modal transitions from closed to open,
    // protecting user typed input from getting wiped out during tab switches or background syncs
    if (!wasOpen) {
      setSubmitError('');
      setErrors({});

      if (mode === 'edit' && initialLead) {
        setFormData({
          leadName: initialLead.leadName || '',
          company: initialLead.company || '',
          contactPerson: initialLead.contactPerson || initialLead.leadName || '',
          mobile: initialLead.mobile || '',
          email: initialLead.email || '',
          address: initialLead.address || initialLead.location || '',
          location: initialLead.location || initialLead.address || '',
          productInterested: initialLead.productInterested || (products[0]?.productName || ''),
          expectedQuantityMT:
            initialLead.expectedQuantityMT !== undefined && initialLead.expectedQuantityMT !== null
              ? initialLead.expectedQuantityMT
              : 0,
          estimatedValue:
            initialLead.estimatedValue !== undefined && initialLead.estimatedValue !== null
              ? initialLead.estimatedValue
              : 0,
          followUpDate: initialLead.followUpDate || '',
          followUpTime: initialLead.followUpTime || '',
          salesperson: initialLead.salesperson || '',
          leadSource: initialLead.leadSource || 'Direct Enquiry',
          status: initialLead.status || 'New',
          notes: initialLead.notes || '',
          lostReason: initialLead.lostReason || ''
        });
      } else {
        setFormData(getDefaultState());
      }
    }
  }, [isOpen, mode, initialLead]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validateLeadForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to save lead. Please check the fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-modal-title"
    >
      <div
        ref={contentRef}
        className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              {mode === 'create' ? <UserPlus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </div>
            <div>
              <h2 id="lead-form-modal-title" className="text-sm font-bold text-neutral-900">
                {mode === 'create' ? 'Create New Lead' : 'Edit Lead Details'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                {mode === 'create'
                  ? 'Add a new prospective dealer or client enquiry into the CRM pipeline.'
                  : `Updating lead record: ${initialLead?.leadName || 'Lead'}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{submitError}</span>
            </div>
          )}

          <LeadFormFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            products={products}
            isEdit={mode === 'edit'}
          />

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 rounded-md border border-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{mode === 'create' ? 'Create Lead' : 'Update Lead'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
