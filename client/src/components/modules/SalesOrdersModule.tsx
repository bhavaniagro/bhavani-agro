import React, { useState } from 'react';
import { 
  Plus, 
  Factory, 
  Truck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  Sparkles,
  Download,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { SalesOrder } from '../../types/erp';

export const SalesOrdersModule: React.FC = () => {
  const { 
    salesOrders, 
    products,
    customers,
    updateSalesOrder,
    deleteSalesOrder,
    createProductionOrderFromSO, 
    createDispatchChallan, 
    generateInvoiceFromDispatch, 
    setIsQuickAddOpen, 
    setQuickAddType,
    setActiveModule,
    setPrintableDoc
  } = useERP();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<SalesOrder | null>(null);

  // Edit form state
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editQuantityMT, setEditQuantityMT] = useState(0);
  const [editRatePerMT, setEditRatePerMT] = useState(0);
  const [editTaxPercent, setEditTaxPercent] = useState(18);
  const [editDeliveryDate, setEditDeliveryDate] = useState('');
  const [editStatus, setEditStatus] = useState<SalesOrder['status']>('Pending');
  const [editShippingAddress, setEditShippingAddress] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  const openEditModal = (so: SalesOrder) => {
    setEditingOrder(so);
    setEditCustomerName(so.customerName);
    setEditProductName(so.productName);
    setEditQuantityMT(so.quantityMT);
    setEditRatePerMT(so.ratePerMT);
    setEditTaxPercent(so.taxPercent);
    setEditDeliveryDate(so.deliveryDate);
    setEditStatus(so.status);
    setEditShippingAddress(so.shippingAddress);
    setEditRemarks(so.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const subtotal = editQuantityMT * editRatePerMT;
    const taxAmount = (subtotal * editTaxPercent) / 100;
    const totalAmount = subtotal + taxAmount;

    await updateSalesOrder(editingOrder.id, {
      customerName: editCustomerName,
      productName: editProductName,
      quantityMT: Number(editQuantityMT),
      ratePerMT: Number(editRatePerMT),
      taxPercent: Number(editTaxPercent),
      totalAmount: Number(totalAmount),
      deliveryDate: editDeliveryDate,
      status: editStatus,
      shippingAddress: editShippingAddress,
      notes: editRemarks,
    });
    setEditingOrder(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    await deleteSalesOrder(deletingOrder.id);
    setDeletingOrder(null);
  };

  const filteredOrders = salesOrders.filter(so => {
    const matchesStatus = statusFilter === 'All' || so.status === statusFilter;
    const matchesSearch = so.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      so.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      so.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalOrderValue = salesOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Sales Orders &amp; Fulfillment
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalOrderValue.toLocaleString('en-IN')} Total Bookings
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Automated stock verification: Orders trigger <strong>Production Required</strong> if finished goods stock is insufficient.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuickAddType('Sales Order');
              setIsQuickAddOpen(true);
            }}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sales Order</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 rounded-lg">
          {['All', 'Pending', 'Production Required', 'Ready', 'Dispatched', 'Completed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search order #, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-md w-full outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* Sales Orders Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Order # &amp; Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product Ordered</th>
                <th className="p-3 text-right">Quantity</th>
                <th className="p-3 text-right">Rate &amp; Amount</th>
                <th className="p-3 text-center">Stock Check</th>
                <th className="p-3">Fulfillment Status</th>
                <th className="p-3 text-right">Automated Action</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(so => {
                  const prod = products.find(p => p.id === so.productId || p.productName === so.productName);
                  const freeStock = prod ? prod.currentStockMT - prod.reservedStockMT : 0;

                  return (
                    <tr key={so.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">{so.orderNumber}</div>
                      <div className="text-[11px] text-neutral-400">{so.orderDate} · Due {so.deliveryDate}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-neutral-900">{so.customerName}</div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[200px]">{so.shippingAddress}</div>
                    </td>
                    <td className="p-3 font-medium text-neutral-900">
                      <div>{so.productName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">Tax: {so.taxPercent}% GST</div>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold">
                      {so.quantityMT} MT
                    </td>
                    <td className="p-3 text-right">
                      <div className="font-mono tabular-nums font-bold text-neutral-900">
                        ₹{so.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        ₹{so.ratePerMT.toLocaleString('en-IN')}/MT
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {so.stockAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Stock ({freeStock.toFixed(1)} MT)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Shortage ({so.quantityMT} MT needed)</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        so.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        so.status === 'Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        so.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                        so.status === 'Production Required' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-neutral-100 text-neutral-800'
                      }`}>
                        {so.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {so.status === 'Production Required' && (
                        <button
                          onClick={() => {
                            createProductionOrderFromSO(so.id);
                            setActiveModule('Production');
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                          title="Generate Production Order with BOM calculation"
                        >
                          <Factory className="w-3 h-3" />
                          <span>Create Prod Order</span>
                        </button>
                      )}

                      {so.status === 'Ready' && (
                        <button
                          onClick={() => {
                            createDispatchChallan({
                              salesOrderId: so.id,
                              orderNumber: so.orderNumber,
                              customerId: so.customerId,
                              customerName: so.customerName,
                              productName: so.productName,
                              batchNumber: 'BNT-2609-088',
                              quantityMT: so.quantityMT,
                              bagsCount: so.quantityMT * 20,
                              vehicleNumber: 'GJ-04-E-8419',
                              driverName: 'Ramsinh Gohil',
                              driverMobile: '+91 98259 88120',
                              transporterName: 'Saurashtra Highway Logistics',
                              dispatchDate: new Date().toISOString().split('T')[0],
                              destination: so.shippingAddress,
                              eWayBillNumber: '241088910482',
                              lrNumber: 'SHL-2609-8812',
                              freightAmountRs: 12500,
                              freightPaidBy: 'Customer',
                              remarks: 'Dispatched under delivery challan.'
                            });
                            setActiveModule('Dispatch & Logistics');
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch Order</span>
                        </button>
                      )}

                      {so.status === 'Dispatched' && (
                        <button
                          onClick={() => {
                            setActiveModule('Finance & Accounts');
                          }}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Invoice</span>
                        </button>
                      )}

                      {so.status === 'Completed' && (
                        <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                          Completed ✓
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(so)}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          title="Edit Order"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingOrder(so)}
                          className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-neutral-400 text-xs italic">
                  No sales orders found in database.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT SALES ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Edit Sales Order ({editingOrder.orderNumber})
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editQuantityMT}
                    onChange={(e) => setEditQuantityMT(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Rate (₹/MT)</label>
                  <input
                    type="number"
                    value={editRatePerMT}
                    onChange={(e) => setEditRatePerMT(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Tax (% GST)</label>
                  <input
                    type="number"
                    value={editTaxPercent}
                    onChange={(e) => setEditTaxPercent(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={editDeliveryDate}
                    onChange={(e) => setEditDeliveryDate(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as SalesOrder['status'])}
                    className="w-full border border-neutral-300 rounded p-2 text-xs bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Production Required">Production Required</option>
                    <option value="Ready">Ready</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Shipping Address</label>
                <textarea
                  rows={2}
                  value={editShippingAddress}
                  onChange={(e) => setEditShippingAddress(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Remarks</label>
                <input
                  type="text"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-3.5 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deletingOrder}
        title="Delete Sales Order"
        message={`Are you sure you want to delete sales order ${deletingOrder?.orderNumber} for ${deletingOrder?.customerName}?`}
        confirmText="Delete Order"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingOrder(null)}
      />
    </div>
  );
};

