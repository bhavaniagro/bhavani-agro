import React, { useState } from 'react';
import { 
  Plus, 
  ShoppingCart, 
  FileCheck, 
  Truck, 
  Search, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const PurchaseModule: React.FC = () => {
  const { 
    purchaseOrders, 
    grns, 
    suppliers, 
    rawMaterials, 
    addGRN, 
    setIsQuickAddOpen, 
    setQuickAddType,
    setActiveModule
  } = useERP();

  const [activeTab, setActiveTab] = useState<'orders' | 'grn'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  const [showGRNModal, setShowGRNModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [receivedQty, setReceivedQty] = useState(50);
  const [acceptedQty, setAcceptedQty] = useState(49.5);
  const [vehicleNo, setVehicleNo] = useState('GJ-12-BW-9901');
  const [supplierBatch, setSupplierBatch] = useState('MINE-2609-08');

  const filteredPOs = purchaseOrders.filter(po => 
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGRN = (po: any) => {
    setSelectedPO(po);
    setReceivedQty(po.quantity);
    setAcceptedQty(po.quantity);
    setShowGRNModal(true);
  };

  const submitGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    addGRN({
      poNumber: selectedPO.poNumber,
      poId: selectedPO.id,
      supplierId: selectedPO.supplierId,
      supplierName: selectedPO.supplierName,
      materialId: selectedPO.materialId,
      materialName: selectedPO.materialName,
      orderedQuantity: selectedPO.quantity,
      receivedQuantity: Number(receivedQty),
      acceptedQuantity: Number(acceptedQty),
      rejectedQuantity: Math.max(0, Number(receivedQty) - Number(acceptedQty)),
      unit: selectedPO.unit,
      supplierBatchNumber: supplierBatch || 'MINE-BATCH-01',
      internalLotNumber: `LOT-${selectedPO.materialName.substring(0, 3).toUpperCase()}-2609-${Math.floor(10 + Math.random() * 90)}`,
      manufacturingDate: new Date().toISOString().split('T')[0],
      vehicleNumber: vehicleNo || 'GJ-12-BW-1234',
      weightReceiptMT: Number(receivedQty),
      date: new Date().toISOString().split('T')[0],
      remarks: 'Goods received at factory weighbridge and accepted into raw stores.'
    });

    setShowGRNModal(false);
    setActiveTab('grn');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Purchase Management &amp; Goods Receipt (GRN)
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Raw Mineral &amp; Packaging Procurement
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create Purchase Orders, record weighbridge delivery via GRN, and automatically credit Raw Material Inventory after QC.
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

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('grn')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'grn' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Goods Receipt Notes (GRN) ({grns.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search PO #, supplier, material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-60 outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* TAB 1: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">PO Number &amp; Date</th>
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Material Required</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Rate &amp; Total (₹)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredPOs.map(po => (
                  <tr key={po.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">{po.poNumber}</div>
                      <div className="text-[11px] text-neutral-400">{po.orderDate} · ETA {po.expectedDelivery}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-neutral-900">{po.supplierName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">Terms: {po.paymentTerms}</div>
                    </td>
                    <td className="p-3 font-medium text-neutral-900">{po.materialName}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold">
                      {po.quantity} {po.unit}
                    </td>
                    <td className="p-3 text-right">
                      <div className="font-mono tabular-nums font-bold text-neutral-900">
                        ₹{po.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        ₹{po.rate}/{po.unit}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        po.status === 'GRN Completed' || po.status === 'Billed' ? 'bg-emerald-100 text-emerald-800' :
                        po.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                        'bg-neutral-100 text-neutral-700'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {po.status !== 'GRN Completed' && po.status !== 'Billed' ? (
                        <button
                          onClick={() => handleCreateGRN(po)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <FileCheck className="w-3 h-3" />
                          <span>Create GRN</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium font-mono">
                          Received ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GRN LIST */}
      {activeTab === 'grn' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">GRN # &amp; Date</th>
                  <th className="p-3">PO Reference</th>
                  <th className="p-3">Supplier &amp; Vehicle</th>
                  <th className="p-3">Material &amp; Batch</th>
                  <th className="p-3 text-right">Received vs Accepted</th>
                  <th className="p-3">QC Status</th>
                  <th className="p-3 text-right">Inventory Entry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {grns.map(g => (
                  <tr key={g.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">{g.grnNumber}</div>
                      <div className="text-[11px] text-neutral-400">{g.date}</div>
                    </td>
                    <td className="p-3 font-mono text-neutral-700">{g.poNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-neutral-900">{g.supplierName}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">Truck: {g.vehicleNumber}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-neutral-900">{g.materialName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">Lot: {g.internalLotNumber}</div>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      <div>Rec: {g.receivedQuantity} {g.unit}</div>
                      <div className="font-bold text-emerald-700">Acc: {g.acceptedQuantity} {g.unit}</div>
                      {g.rejectedQuantity > 0 && (
                        <div className="text-rose-600 text-[10px]">Rej: {g.rejectedQuantity} {g.unit}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {g.qcStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {g.enteredInventory ? (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Stock Credited</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-700 font-medium">Pending QC</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE GRN MODAL */}
      {showGRNModal && selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-1">
              Create Goods Receipt Note (GRN) for {selectedPO.poNumber}
            </h3>
            <p className="text-[11px] text-neutral-500 mb-4">
              Material: {selectedPO.materialName} · Supplier: {selectedPO.supplierName}
            </p>

            <form onSubmit={submitGRN} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Weighbridge Received Qty</label>
                  <input
                    type="number"
                    step="0.1"
                    value={receivedQty}
                    onChange={(e) => setReceivedQty(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">QC Accepted Qty ({selectedPO.unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vehicle Truck No.</label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="GJ-12-BW-8910"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Supplier Mine Batch No.</label>
                  <input
                    type="text"
                    value={supplierBatch}
                    onChange={(e) => setSupplierBatch(e.target.value)}
                    placeholder="KBM-2609-B8"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                <strong>Automation Trigger:</strong> Accepted quantity will automatically be credited to Raw Material Stock and available for production planning upon submission.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowGRNModal(false)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer"
                >
                  Confirm GRN &amp; Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
