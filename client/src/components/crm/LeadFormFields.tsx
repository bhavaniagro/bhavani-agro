import React from 'react';
import { FinishedProduct, LeadStage } from '../../types/erp';

export interface LeadFormState {
  leadName: string;
  company: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  location: string;
  productInterested: string;
  expectedQuantityMT: number | '';
  estimatedValue: number | '';
  followUpDate: string;
  followUpTime: string;
  salesperson: string;
  leadSource: string;
  status: LeadStage;
  notes: string;
  lostReason: string;
}

export const STAGES: LeadStage[] = [
  'New',
  'Contacted',
  'Follow-up',
  'Quotation',
  'Negotiation',
  'Won',
  'Lost'
];

export const LEAD_SOURCES = [
  'Direct Enquiry',
  'Website Inquiry',
  'Agro Expo / Trade Fair',
  'Dealer Referral',
  'Phone Inquiry',
  'Field Sales Representative',
  'Other'
];

export function validateLeadForm(formData: LeadFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.leadName || !formData.leadName.trim()) {
    errors.leadName = 'Name is required';
  }

  if (!formData.company || !formData.company.trim()) {
    errors.company = 'Company Name is required';
  }

  if (!formData.mobile || !formData.mobile.trim()) {
    errors.mobile = 'Mobile Number is required';
  } else if (formData.mobile.trim().length < 7) {
    errors.mobile = 'Enter a valid mobile number';
  }

  if (!formData.productInterested || !formData.productInterested.trim()) {
    errors.productInterested = 'Product Interested is required';
  }

  if (formData.status === 'Lost' && (!formData.lostReason || !formData.lostReason.trim())) {
    errors.lostReason = 'Lost Reason is required when stage is Lost';
  }

  return errors;
}

interface LeadFormFieldsProps {
  formData: LeadFormState;
  setFormData: React.Dispatch<React.SetStateAction<LeadFormState>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  products: FinishedProduct[];
  isEdit?: boolean;
}

export const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  products,
  isEdit = false
}) => {
  const handleChange = (field: keyof LeadFormState, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Keep address and location synchronized
      if (field === 'address') {
        updated.location = value;
      } else if (field === 'location') {
        updated.address = value;
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="space-y-4 text-xs">

      {/* SECTION 1: Primary Contact & Company */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-1">
          1. Company &amp; Contact Information
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Lead Contact Name <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              type="text"
              value={formData.leadName}
              onChange={(e) => handleChange('leadName', e.target.value)}
              placeholder="e.g. Anand Sharma"
              className={`w-full p-2 bg-neutral-50 border rounded text-xs outline-none transition-colors ${
                errors.leadName
                  ? 'border-rose-400 focus:border-rose-600 bg-rose-50/30'
                  : 'border-neutral-200 focus:border-neutral-900 focus:bg-white'
              }`}
            />
            {errors.leadName && (
              <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">{errors.leadName}</span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Company Name <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="e.g. Gujarat Crop Sciences Pvt Ltd"
              className={`w-full p-2 bg-neutral-50 border rounded text-xs outline-none transition-colors ${
                errors.company
                  ? 'border-rose-400 focus:border-rose-600 bg-rose-50/30'
                  : 'border-neutral-200 focus:border-neutral-900 focus:bg-white'
              }`}
            />
            {errors.company && (
              <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">{errors.company}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Mobile Number <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              type="text"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              placeholder="+91 98250 12345"
              className={`w-full p-2 bg-neutral-50 border rounded text-xs outline-none transition-colors ${
                errors.mobile
                  ? 'border-rose-400 focus:border-rose-600 bg-rose-50/30'
                  : 'border-neutral-200 focus:border-neutral-900 focus:bg-white'
              }`}
            />
            {errors.mobile && (
              <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">{errors.mobile}</span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Email <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="sales@company.com"
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Contact Person <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
            Address / Location <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="e.g. GIDC Metoda, Rajkot, Gujarat"
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
          />
        </div>
      </div>

      {/* SECTION 2: Product & Commercial Requirements */}
      <div className="space-y-2.5 pt-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-1">
          2. Product &amp; Commercials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Product Interested <span className="text-rose-600 font-bold">*</span>
            </label>
            <select
              value={formData.productInterested}
              onChange={(e) => handleChange('productInterested', e.target.value)}
              className={`w-full p-2 bg-neutral-50 border rounded text-xs outline-none transition-colors ${
                errors.productInterested
                  ? 'border-rose-400 focus:border-rose-600 bg-rose-50/30'
                  : 'border-neutral-200 focus:border-neutral-900 focus:bg-white'
              }`}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.productName}>
                  {p.productName}
                </option>
              ))}
              {formData.productInterested &&
                !products.some((p) => p.productName === formData.productInterested) && (
                  <option value={formData.productInterested}>
                    {formData.productInterested}
                  </option>
                )}
            </select>
            {errors.productInterested && (
              <span className="text-[10px] text-rose-600 font-medium mt-0.5 block">
                {errors.productInterested}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Expected Qty (MT) <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={formData.expectedQuantityMT}
              onChange={(e) =>
                handleChange('expectedQuantityMT', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="e.g. 25"
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Est. Value (₹) <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={formData.estimatedValue}
              onChange={(e) =>
                handleChange('estimatedValue', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="e.g. 150000"
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>
        </div>

      </div>

      {/* SECTION 3: Pipeline, Follow-up & Lost Reason */}
      <div className="space-y-2.5 pt-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-1">
          3. Pipeline &amp; Follow-up
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
              Lead Stage
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as LeadStage)}
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white font-medium"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Follow-up Date <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => handleChange('followUpDate', e.target.value)}
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Follow-up Time <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="time"
              value={formData.followUpTime}
              onChange={(e) => handleChange('followUpTime', e.target.value)}
              className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
            />
          </div>
        </div>

        {/* LOST REASON (Required when Stage is Lost) */}
        {formData.status === 'Lost' && (
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-rose-900">
                Lost Reason <span className="text-rose-600">*</span>
              </label>
              <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider">Required for Lost Stage</span>
            </div>
            <textarea
              rows={2}
              value={formData.lostReason}
              onChange={(e) => handleChange('lostReason', e.target.value)}
              placeholder="e.g. Price too high compared to local vendor, client delayed purchase indefinitely..."
              className={`w-full p-2 bg-white border rounded text-xs outline-none transition-colors ${
                errors.lostReason
                  ? 'border-rose-400 focus:border-rose-600'
                  : 'border-rose-300 focus:border-rose-700'
              }`}
            />
            {errors.lostReason && (
              <span className="text-[10px] text-rose-600 font-medium block">
                {errors.lostReason}
              </span>
            )}
            <p className="text-[10px] text-rose-700/80">
              Provide context on why this deal was lost to help sales optimization and commercial reviews.
            </p>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
            Notes / Requirements <span className="text-neutral-400 text-[10px] font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Special requirements, packing preference, terms discussed..."
            className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
};
