import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building, 
  Receipt, 
  Truck, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Customer } from '../../types/erp';

export const CustomersModule: React.FC = () => {
  const { 
    customers, 
    salesOrders, 
    invoices, 
    dispatches, 
    setIsQuickAddOpen, 
    setQuickAddType,
    setActiveModule,
    setPrintableDoc,
    updateCustomer,
    deleteCustomer
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Edit & Delete modal states
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCustomer = selectedCustomer || filteredCustomers[0];

  const isCustomerMatch = (recordCustomerId?: string, recordCustomerName?: string, customer?: Customer) => {
    if (!customer) return false;
    if (recordCustomerId && (recordCustomerId === customer.id || recordCustomerId === customer.code)) return true;
    if (customers.length === 1) return true; // Single active customer fallback
    if (!recordCustomerName) return false;

    const recName = recordCustomerName.toLowerCase().trim();
    const cName = (customer.customerName || '').toLowerCase().trim();
    const compName = (customer.companyName || '').toLowerCase().trim();

    if (cName && (recName.includes(cName) || cName.includes(recName))) return true;
    if (compName && (recName.includes(compName) || compName.includes(recName))) return true;

    const firstWordRec = recName.split(' ')[0];
    const firstWordCust = cName.split(' ')[0];
    if (firstWordRec && firstWordCust && firstWordRec.length > 2 && firstWordRec === firstWordCust) return true;

    return false;
  };

  // 360 Degree Customer Profile data
  const custOrders = activeCustomer ? salesOrders.filter(s => isCustomerMatch(s.customerId, s.customerName, activeCustomer)) : [];
  const custInvoices = activeCustomer ? invoices.filter(i => isCustomerMatch(i.customerId, i.customerName, activeCustomer)) : [];
  const custDispatches = activeCustomer ? dispatches.filter(d => isCustomerMatch(d.customerId, d.customerName, activeCustomer)) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Customer Master &amp; 360° Account Profiles
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              {customers.length} Verified Distributors &amp; Dealers
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Credit limits, billing/shipping GST addresses, sales order histories, invoices, and dispatch logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuickAddType('Customer');
              setIsQuickAddOpen(true);
            }}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Main Split: Directory on Left, Profile View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Customer List */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-neutral-100">
          <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search customer, state, GST..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-transparent outline-none w-full text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          <div className="divide-y divide-neutral-100 max-h-[650px] overflow-y-auto">
            {filteredCustomers.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className={`p-3.5 cursor-pointer transition-colors text-xs space-y-1 ${
                  activeCustomer?.id === c.id 
                    ? 'bg-emerald-50/60 border-l-4 border-l-emerald-600' 
                    : 'hover:bg-neutral-50/70'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-neutral-900">
                  <span>{c.customerName}</span>
                  <span className="font-mono text-neutral-500 font-semibold">{c.code}</span>
                </div>
                <div className="text-[11px] text-neutral-500">{c.contactPerson} · {c.state}</div>
                <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between pt-1">
                  <span>Sales: ₹{c.totalSales.toLocaleString('en-IN')}</span>
                  <span className={c.outstandingBalance > 0 ? 'text-amber-800 font-bold' : 'text-emerald-700'}>
                    Due: ₹{c.outstandingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 360 Degree Customer Profile */}
        <div className="lg:col-span-2 space-y-4">
          {activeCustomer ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-5 shadow-2xs text-xs">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider">
                      {activeCustomer.code} · {activeCustomer.customerType}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-neutral-900 mt-0.5">
                    {activeCustomer.customerName}
                  </h2>
                  <div className="text-[11px] text-neutral-500">
                    {activeCustomer.contactPerson} · {activeCustomer.mobile} · {activeCustomer.email}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  <div className="text-right">
                    <div className="text-[11px] text-neutral-500">Credit Limit:</div>
                    <div className="font-mono font-bold text-sm text-neutral-900">
                      ₹{activeCustomer.creditLimit.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">Terms: {activeCustomer.paymentTerms}</div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      onClick={() => setEditingCustomer(activeCustomer)}
                      className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-neutral-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingCustomerId(activeCustomer.id)}
                      className="px-2.5 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px]">Lifetime Sales</div>
                  <div className="font-mono font-bold text-sm text-neutral-900 mt-1">
                    ₹{(activeCustomer.totalSales || custOrders.reduce((acc, curr) => acc + curr.totalAmount, 0)).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px]">Outstanding Balance</div>
                  <div className="font-mono font-bold text-sm text-amber-800 mt-1">
                    ₹{custInvoices.reduce((acc, curr) => acc + curr.balanceAmount, 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px]">Total Orders</div>
                  <div className="font-mono font-bold text-sm text-neutral-900 mt-1">
                    {custOrders.length} Bookings
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <div className="text-neutral-500 text-[10px]">Assigned Sales Head</div>
                  <div className="font-bold text-sm text-neutral-900 mt-1">
                    {activeCustomer.assignedSalesperson.split(' ')[0]}
                  </div>
                </div>
              </div>

              {/* GST & Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50/60 p-3 rounded-lg border border-neutral-200 text-[11px]">
                <div>
                  <span className="font-bold text-neutral-900">Billing Address &amp; GSTIN:</span>
                  <div className="text-neutral-600 mt-0.5">{activeCustomer.billingAddress}</div>
                  <div className="font-mono font-bold text-neutral-900 mt-1">GSTIN: {activeCustomer.gstin}</div>
                </div>
                <div>
                  <span className="font-bold text-neutral-900">Delivery / Shipping Destination:</span>
                  <div className="text-neutral-600 mt-0.5">{activeCustomer.shippingAddress}</div>
                  <div className="text-neutral-500 mt-1">State: {activeCustomer.state}</div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                    Recent Orders &amp; Delivery Status
                  </h3>
                  <button
                    onClick={() => setActiveModule('CRM & Sales')}
                    className="text-[11px] text-emerald-700 font-semibold hover:underline"
                  >
                    + Place Order
                  </button>
                </div>

                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                        <th className="p-2">Order #</th>
                        <th className="p-2">Product</th>
                        <th className="p-2 text-right">Quantity</th>
                        <th className="p-2 text-right">Amount (₹)</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {custOrders.map(o => (
                        <tr key={o.id} className="hover:bg-neutral-50/50">
                          <td className="p-2 font-mono font-bold text-neutral-900">{o.orderNumber}</td>
                          <td className="p-2 text-neutral-800 font-medium">{o.productName}</td>
                          <td className="p-2 text-right font-mono tabular-nums">{o.quantityMT} MT</td>
                          <td className="p-2 text-right font-mono tabular-nums font-bold">
                            ₹{o.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 uppercase">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {custOrders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-neutral-400 italic">
                            No orders found for this customer.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoices & Receivables */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 mb-2">
                  Invoices &amp; Payment Ledger
                </h3>
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                        <th className="p-2">Invoice #</th>
                        <th className="p-2">Date</th>
                        <th className="p-2 text-right">Total (₹)</th>
                        <th className="p-2 text-right">Balance Due</th>
                        <th className="p-2">Payment Status</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {custInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-neutral-50/50">
                          <td className="p-2 font-mono font-bold text-neutral-900">{inv.invoiceNumber}</td>
                          <td className="p-2 text-neutral-600">{inv.invoiceDate}</td>
                          <td className="p-2 text-right font-mono tabular-nums font-bold">
                            ₹{inv.totalInvoiceAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 text-right font-mono tabular-nums text-amber-800 font-semibold">
                            ₹{inv.balanceAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                              inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              inv.paymentStatus === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.paymentStatus}
                            </span>
                          </td>
                          <td className="p-2 text-right">
                            <button
                              onClick={() => setPrintableDoc({ type: 'invoice', data: inv })}
                              className="px-2 py-0.5 bg-white border border-neutral-300 rounded text-[11px] font-medium text-neutral-700 cursor-pointer"
                            >
                              Print
                            </button>
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
              Select a customer from the left directory to view full profile.
            </div>
          )}
        </div>
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Edit Customer: {editingCustomer.code}</div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await updateCustomer(editingCustomer.id, editingCustomer);
                  setEditingCustomer(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.customerName}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, customerName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.companyName}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, companyName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.contactPerson}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, contactPerson: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.mobile}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, mobile: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={editingCustomer.gstin}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, gstin: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">State</label>
                  <input
                    type="text"
                    value={editingCustomer.state}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, state: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Customer Type</label>
                  <select
                    value={editingCustomer.customerType}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, customerType: e.target.value as any })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  >
                    <option value="Distributor">Distributor</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Fertilizer Blender">Fertilizer Blender</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="Institutional Buyer">Institutional Buyer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Billing Address</label>
                <textarea
                  rows={2}
                  value={editingCustomer.billingAddress}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, billingAddress: e.target.value })}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">Shipping Address</label>
                <textarea
                  rows={2}
                  value={editingCustomer.shippingAddress}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, shippingAddress: e.target.value })}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={editingCustomer.creditLimit}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, creditLimit: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={editingCustomer.paymentTerms}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, paymentTerms: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingCustomerId)}
        title="Delete Customer Record"
        message="Are you sure you want to delete this customer? This action will remove the record from Firestore and update your directory."
        confirmText="Delete Customer"
        isDangerous={true}
        isLoading={isSubmitting}
        onClose={() => setDeletingCustomerId(null)}
        onConfirm={async () => {
          if (!deletingCustomerId) return;
          setIsSubmitting(true);
          try {
            await deleteCustomer(deletingCustomerId);
            if (selectedCustomer?.id === deletingCustomerId) {
              setSelectedCustomer(null);
            }
            setDeletingCustomerId(null);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
};
