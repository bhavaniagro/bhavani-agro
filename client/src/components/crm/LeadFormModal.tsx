import React, { useState, useEffect } from 'react';
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
  const { contentRef, handleMouseDown, handleClick } = useModalDismiss(
    isOpen && !isSubmitting,
    onClose
  );
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

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, mode, initialLead, products]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validateLeadForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        expectedQuantityMT: Number(formData.expectedQuantityMT || 0),
        estimatedValue: Number(formData.estimatedValue || 0),
        location: formData.address || formData.location,
        address: formData.address || formData.location,
        contactPerson: formData.contactPerson.trim() || formData.leadName.trim()
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to save lead. Please check the fields and try again.');
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
        className="bg-white border border-neutral-200 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-xs flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              mode === 'create' ? 'bg-neutral-900 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {mode === 'create' ? <UserPlus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">
                {mode === 'create' ? 'Create New Lead' : `Edit Lead: ${initialLead?.company || formData.company}`}
              </h3>
              <p className="text-[11px] text-neutral-500">
                {mode === 'create'
                  ? 'Add a new prospective dealer or client enquiry into the CRM pipeline.'
                  : 'Update enquiry details, follow-up timeline, or commercial expectations.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1 rounded-md hover:bg-neutral-100"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
              {submitError}
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

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-6 shrink-0">
            <span className="text-[11px] text-neutral-400">
              {mode === 'create' ? 'Will be created in New stage by default' : `Current Stage: ${formData.status}`}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-md text-xs font-medium cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{mode === 'create' ? 'Create Lead' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
