import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  ShoppingCart, 
  Star, 
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Supplier } from '../../types/erp';
import { ConfirmModal } from '../modals/ConfirmModal';

export const SuppliersModule: React.FC = () => {
  const { suppliers, rawMaterials, purchaseOrders, setActiveModule, setIsQuickAddOpen, setQuickAddType, addSupplier, updateSupplier, deleteSupplier } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplierId, setDeletingSupplierId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Supplier form state
  const [newSupp, setNewSupp] = useState({
    supplierName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address: '',
    gstin: '',
    materialSupplied: '',
    paymentTerms: 'Net 30 Days',
    creditPeriodDays: 30,
    bankName: '',
    accountNo: '',
    ifscCode: ''
  });

  const filteredSuppliers = suppliers.filter(s => 
    s.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.materialSupplied.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeSupplier = selectedSupplier || filteredSuppliers[0];
  const suppPOs = activeSupplier ? purchaseOrders.filter(p => p.supplierId === activeSupplier.id) : [];

  const totalPayables = suppliers.reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Supplier &amp; Vendor Management
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalPayables.toLocaleString('en-IN')} Total Mine &amp; Vendor Payables
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Bentonite mine operators, dolomite quarries, lignite suppliers, microbial labs, and bag packaging manufacturers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier</span>
          </button>
          <button
            onClick={() => {
              setQuickAddType('Purchase Order');
              setIsQuickAddOpen(true);
            }}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Supplier Directory */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-neutral-100">
          <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search supplier, mineral, GST..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-transparent outline-none w-full text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSupplier(s)}
                  className={`p-3.5 cursor-pointer transition-colors text-xs space-y-1 ${
                    activeSupplier?.id === s.id 
                      ? 'bg-emerald-50/60 border-l-4 border-l-emerald-600' 
                      : 'hover:bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>{s.supplierName}</span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-mono">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{s.rating}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-500">{s.contactPerson} · {s.mobile}</div>
                  <div className="text-[10px] text-neutral-600 truncate">
                    Supplies: {Array.isArray(s.materialSupplied) ? s.materialSupplied.join(', ') : s.materialSupplied}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between pt-1">
                    <span>Total PO: ₹{s.totalPurchases.toLocaleString('en-IN')}</span>
                    <span className="text-amber-800 font-bold">
                      Payable: ₹{s.outstandingBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-neutral-400 text-xs italic">
                No suppliers found. Click "Add Supplier" to create a record.
              </div>
            )}
          </div>
        </div>

        {/* Right: Supplier 360 profile */}
        <div className="lg:col-span-2 space-y-4">
          {activeSupplier ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-5 shadow-2xs text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 gap-2">
                <div>
                  <div className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                    {activeSupplier.code} · Primary Mine / Manufacturer
                  </div>
                  <h2 className="text-base font-bold text-neutral-900 mt-0.5">
                    {activeSupplier.supplierName}
                  </h2>
                  <div className="text-[11px] text-neutral-500">
                    {activeSupplier.contactPerson} · {activeSupplier.mobile} · {activeSupplier.email}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  <div className="text-right">
                    <div className="text-[11px] text-neutral-500">Outstanding Payable:</div>
                    <div className="font-mono font-bold text-base text-amber-800">
                      ₹{activeSupplier.outstandingBalance.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-neutral-400">Credit: {activeSupplier.creditPeriodDays} Days</div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      onClick={() => setEditingSupplier(activeSupplier)}
                      className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-neutral-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingSupplierId(activeSupplier.id)}
                      className="px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Material Supplied Badges */}
              <div>
                <div className="font-bold text-neutral-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Approved Materials &amp; Feedstock Supplied:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeSupplier.materialSupplied.map((mat: string, idx: number) => (
                    <span key={idx} className="bg-neutral-100 border border-neutral-200 text-neutral-800 px-2 py-0.5 rounded text-[11px] font-medium">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bank & GST Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[11px]">
                <div>
                  <div className="font-bold text-neutral-900 mb-1">Mine / Factory Address &amp; GST:</div>
                  <div className="text-neutral-600">{activeSupplier.address}</div>
                  <div className="font-mono font-bold text-neutral-900 mt-1">GSTIN: {activeSupplier.gstin}</div>
                </div>
                <div>
                  <div className="font-bold text-neutral-900 mb-1">Beneficiary Bank Details:</div>
                  <div>Bank: <span className="font-medium">{activeSupplier.bankName}</span></div>
                  <div>A/c No: <span className="font-mono font-bold">{activeSupplier.accountNo}</span></div>
                  <div>IFSC: <span className="font-mono font-bold">{activeSupplier.ifscCode}</span></div>
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                    Purchase Order History
                  </h3>
                  <button
                    onClick={() => setActiveModule('Purchase')}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline"
                  >
                    View All POs →
                  </button>
                </div>

                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                        <th className="p-2">PO #</th>
                        <th className="p-2">Material</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Amount (₹)</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {suppPOs.map(p => (
                        <tr key={p.id} className="hover:bg-neutral-50/50">
                          <td className="p-2 font-mono font-bold text-neutral-900">{p.poNumber}</td>
                          <td className="p-2 text-neutral-800 font-medium">{p.materialName}</td>
                          <td className="p-2 text-right font-mono tabular-nums">{p.quantity} {p.unit}</td>
                          <td className="p-2 text-right font-mono tabular-nums font-bold">
                            ₹{p.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 uppercase">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-400 text-xs bg-white rounded-xl border border-neutral-200">
              Select a supplier from the list to view profile details.
            </div>
          )}
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Add New Supplier</div>
              <button onClick={() => setIsAddOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await addSupplier({
                    supplierName: newSupp.supplierName,
                    contactPerson: newSupp.contactPerson,
                    mobile: newSupp.mobile,
                    email: newSupp.email,
                    address: newSupp.address,
                    gstin: newSupp.gstin,
                    materialSupplied: [newSupp.materialSupplied],
                    paymentTerms: newSupp.paymentTerms,
                    creditPeriodDays: Number(newSupp.creditPeriodDays),
                    bankName: newSupp.bankName,
                    accountNo: newSupp.accountNo,
                    ifscCode: newSupp.ifscCode,
                    rating: 5
                  });
                  setIsAddOpen(false);
                  setNewSupp({
                    supplierName: '',
                    contactPerson: '',
                    mobile: '',
                    email: '',
                    address: '',
                    gstin: '',
                    materialSupplied: '',
                    paymentTerms: 'Net 30 Days',
                    creditPeriodDays: 30,
                    bankName: '',
                    accountNo: '',
                    ifscCode: ''
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    required
                    value={newSupp.supplierName}
                    onChange={(e) => setNewSupp({ ...newSupp, supplierName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={newSupp.contactPerson}
                    onChange={(e) => setNewSupp({ ...newSupp, contactPerson: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={newSupp.mobile}
                    onChange={(e) => setNewSupp({ ...newSupp, mobile: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSupp.email}
                    onChange={(e) => setNewSupp({ ...newSupp, email: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={newSupp.gstin}
                    onChange={(e) => setNewSupp({ ...newSupp, gstin: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Material Supplied</label>
                  {rawMaterials.length > 0 ? (
                    <select
                      value={newSupp.materialSupplied}
                      onChange={(e) => setNewSupp({ ...newSupp, materialSupplied: e.target.value })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                    >
                      <option value="">Select Raw Material</option>
                      {rawMaterials.map((rm) => (
                        <option key={rm.id} value={rm.materialName}>
                          {rm.materialName} ({rm.category})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Bentonite Ore"
                      value={newSupp.materialSupplied}
                      onChange={(e) => setNewSupp({ ...newSupp, materialSupplied: e.target.value })}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={newSupp.bankName}
                    onChange={(e) => setNewSupp({ ...newSupp, bankName: e.target.value })}
                    placeholder="e.g. State Bank of India"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={newSupp.accountNo}
                    onChange={(e) => setNewSupp({ ...newSupp, accountNo: e.target.value })}
                    placeholder="e.g. 38291048571"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={newSupp.ifscCode}
                    onChange={(e) => setNewSupp({ ...newSupp, ifscCode: e.target.value })}
                    placeholder="e.g. SBIN0001234"
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Address / Mine Location</label>
                <textarea
                  rows={2}
                  value={newSupp.address}
                  onChange={(e) => setNewSupp({ ...newSupp, address: e.target.value })}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Edit Supplier: {editingSupplier.code}</div>
              <button onClick={() => setEditingSupplier(null)} className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await updateSupplier(editingSupplier.id, editingSupplier);
                  setEditingSupplier(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.supplierName}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, supplierName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.contactPerson}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, contactPerson: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.mobile}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, mobile: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingSupplier.email}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={editingSupplier.gstin}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, gstin: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Credit Days</label>
                  <input
                    type="number"
                    value={editingSupplier.creditPeriodDays}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, creditPeriodDays: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={editingSupplier.bankName || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, bankName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={editingSupplier.accountNo || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, accountNo: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={editingSupplier.ifscCode || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, ifscCode: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Address / Mine Location</label>
                <textarea
                  rows={2}
                  value={editingSupplier.address}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button type="button" onClick={() => setEditingSupplier(null)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingSupplierId)}
        title="Delete Supplier Record"
        message="Are you sure you want to delete this supplier from Firestore?"
        confirmText="Delete Supplier"
        isDangerous={true}
        isLoading={isSubmitting}
        onClose={() => setDeletingSupplierId(null)}
        onConfirm={async () => {
          if (!deletingSupplierId) return;
          setIsSubmitting(true);
          try {
            await deleteSupplier(deletingSupplierId);
            if (selectedSupplier?.id === deletingSupplierId) setSelectedSupplier(null);
            setDeletingSupplierId(null);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
};
