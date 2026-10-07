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
  MapPin
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const SuppliersModule: React.FC = () => {
  const { suppliers, purchaseOrders, setActiveModule, setIsQuickAddOpen, setQuickAddType } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);

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
            {filteredSuppliers.map(s => (
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
                  Supplies: {s.materialSupplied.join(', ')}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between pt-1">
                  <span>Total PO: ₹{s.totalPurchases.toLocaleString('en-IN')}</span>
                  <span className="text-amber-800 font-bold">
                    Payable: ₹{s.outstandingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
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

                <div className="text-right">
                  <div className="text-[11px] text-neutral-500">Outstanding Payable:</div>
                  <div className="font-mono font-bold text-base text-amber-800">
                    ₹{activeSupplier.outstandingBalance.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-neutral-400">Credit: {activeSupplier.creditPeriodDays} Days</div>
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
    </div>
  );
};
