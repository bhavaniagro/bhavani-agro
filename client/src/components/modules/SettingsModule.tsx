import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Building, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Save
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const SettingsModule: React.FC = () => {
  const { company, setCompany, updateCompanyProfile, resetAllData, activeRole, setActiveRole } = useERP();
  const [formData, setFormData] = useState(company);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompany(formData);
    await updateCompanyProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              System Settings &amp; Company Master
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Sole Proprietorship · Est. 1985
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure legal entity details, registered factory address, GSTIN, bank accounts, and role permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean factory default state?')) {
                resetAllData();
              }
            }}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 text-xs shadow-2xs">
        <div className="border-b border-neutral-200 pb-3 font-bold text-sm text-neutral-900">
          Factory Profile &amp; Legal Establishment
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Company Operating Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Legal Formation</label>
            <input
              type="text"
              value={formData.formation}
              onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Date Established</label>
            <input
              type="text"
              value={formData.established}
              onChange={(e) => setFormData({ ...formData, established: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2 font-mono"
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">GSTIN Number</label>
            <input
              type="text"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2 font-mono"
            />
          </div>
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">PAN Card</label>
            <input
              type="text"
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2 font-mono"
            />
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 font-bold text-sm text-neutral-900">
          Registered Plant Address &amp; Contact
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Plot / GIDC Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">City &amp; State</label>
              <input
                type="text"
                value={`${formData.city}, ${formData.state}`}
                readOnly
                className="w-full border border-neutral-200 rounded p-2 bg-neutral-50 text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full border border-neutral-300 rounded p-2 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 font-bold text-sm text-neutral-900">
          Bank Current Account Details for Invoices &amp; RTGS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Bank Name &amp; Branch</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="w-full border border-neutral-300 rounded p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Account No.</label>
              <input
                type="text"
                value={formData.accountNo}
                onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}
                className="w-full border border-neutral-300 rounded p-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full border border-neutral-300 rounded p-2 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
          {saveSuccess ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Company configuration updated successfully</span>
            </span>
          ) : <span />}

          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
