import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ShoppingCart, 
  FileCheck, 
  Truck, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { PurchaseOrder, GRN } from '../../types/erp';
import { ModuleHeader } from '../common/ModuleHeader';
import { sortByLatest } from '../../utils/sortUtils';

export const PurchaseModule: React.FC = () => {
  const { 
    purchaseOrders, 
    grns, 
    suppliers, 
    rawMaterials, 
    addGRN,
    updatePurchaseOrder,
    deletePurchaseOrder,
    updateGRN,
    deleteGRN,
    setIsQuickAddOpen, 
    setQuickAddType,
    setActiveModule
  } = useERP();

  const [activeTab, setActiveTab] = useState<'orders' | 'grn'>('orders');
  const [searchTerm, setSearchTerm] = useState('');

  // GRN Creation State
  const [showGRNModal, setShowGRNModal] = useState(false);
  const [isManualGRN, setIsManualGRN] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [manualSupplierId, setManualSupplierId] = useState('');
  const [manualMaterialId, setManualMaterialId] = useState('');
  const [receivedQty, setReceivedQty] = useState(50);
  const [acceptedQty, setAcceptedQty] = useState(49.5);
  const [vehicleNo, setVehicleNo] = useState('GJ-12-BW-9901');
  const [supplierBatch, setSupplierBatch] = useState('MINE-2609-08');

  // PO Edit/Delete state
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [deletingPO, setDeletingPO] = useState<PurchaseOrder | null>(null);
  const [editPOSupplierName, setEditPOSupplierName] = useState('');
  const [editPOMaterialName, setEditPOMaterialName] = useState('');
  const [editPOQuantity, setEditPOQuantity] = useState(0);
  const [editPORate, setEditPORate] = useState(0);
  const [editPOUnit, setEditPOUnit] = useState('MT');
  const [editPOExpectedDelivery, setEditPOExpectedDelivery] = useState('');
  const [editPOPaymentTerms, setEditPOPaymentTerms] = useState('');
  const [editPOStatus, setEditPOStatus] = useState<PurchaseOrder['status']>('Draft');

  // GRN Edit/Delete state
  const [editingGRN, setEditingGRN] = useState<GRN | null>(null);
  const [deletingGRN, setDeletingGRN] = useState<GRN | null>(null);
  const [editGRNReceivedQty, setEditGRNReceivedQty] = useState(0);
  const [editGRNAcceptedQty, setEditGRNAcceptedQty] = useState(0);
  const [editGRNRejectedQty, setEditGRNRejectedQty] = useState(0);
  const [editGRNVehicleNo, setEditGRNVehicleNo] = useState('');
  const [editGRNSupplierBatch, setEditGRNSupplierBatch] = useState('');
  const [editGRNQCStatus, setEditGRNQCStatus] = useState<'Pending QC' | 'Approved' | 'Rejected'>('Approved');
  const [editGRNRemarks, setEditGRNRemarks] = useState('');

  const filteredPOs = sortByLatest(purchaseOrders.filter(po => 
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const filteredGRNs = sortByLatest(grns.filter(g =>
    g.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleCreateGRN = (po: any) => {
    setIsManualGRN(false);
    setSelectedPO(po);
    setReceivedQty(po.quantity);
    setAcceptedQty(po.quantity);
    setVehicleNo('GJ-12-BW-9901');
    setSupplierBatch(`MINE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10 + Math.random() * 90)}`);
    setShowGRNModal(true);
  };

  const handleOpenAddGRN = () => {
    setIsManualGRN(true);
    setSelectedPO(null);
    setManualSupplierId(suppliers[0]?.id || '');
    setManualMaterialId(rawMaterials[0]?.id || '');
    setReceivedQty(50);
    setAcceptedQty(50);
    setVehicleNo('GJ-12-BW-9901');
    setSupplierBatch(`MINE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10 + Math.random() * 90)}`);
    setShowGRNModal(true);
  };

  const submitGRN = (e: React.FormEvent) => {
    e.preventDefault();

    if (isManualGRN) {
      const sup = suppliers.find(s => s.id === manualSupplierId) || suppliers[0];
      const mat = rawMaterials.find(rm => rm.id === manualMaterialId) || rawMaterials[0];

      addGRN({
        poNumber: '-',
        poId: '',
        supplierId: sup?.id || 'manual-sup',
        supplierName: sup?.supplierName || 'Direct Supplier',
        materialId: mat?.id || 'manual-mat',
        materialName: mat?.materialName || 'Raw Material',
        orderedQuantity: Number(receivedQty),
        receivedQuantity: Number(receivedQty),
        acceptedQuantity: Number(acceptedQty),
        rejectedQuantity: Math.max(0, Number(receivedQty) - Number(acceptedQty)),
        unit: mat?.unit || 'MT',
        supplierBatchNumber: supplierBatch || 'MINE-BATCH-01',
        internalLotNumber: `LOT-${(mat?.materialName || 'RAW').substring(0, 3).toUpperCase()}-2609-${Math.floor(10 + Math.random() * 90)}`,
        manufacturingDate: new Date().toISOString().split('T')[0],
        vehicleNumber: vehicleNo || 'GJ-12-BW-1234',
        weightReceiptMT: Number(receivedQty),
        date: new Date().toISOString().split('T')[0],
        remarks: 'Manual Goods Receipt Note entered directly without PO.'
      });
    } else if (selectedPO) {
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
        unit: selectedPO.unit || 'MT',
        supplierBatchNumber: supplierBatch || 'MINE-BATCH-01',
        internalLotNumber: `LOT-${(selectedPO.materialName || 'RAW').substring(0, 3).toUpperCase()}-2609-${Math.floor(10 + Math.random() * 90)}`,
        manufacturingDate: new Date().toISOString().split('T')[0],
        vehicleNumber: vehicleNo || 'GJ-12-BW-1234',
        weightReceiptMT: Number(receivedQty),
        date: new Date().toISOString().split('T')[0],
        remarks: 'Goods received at factory weighbridge and accepted into raw stores.'
      });

      if (selectedPO.id && selectedPO.id !== 'direct') {
        updatePurchaseOrder(selectedPO.id, { status: 'GRN Completed' });
      }
    }

    setSelectedPO(null);
    setIsManualGRN(false);
    setReceivedQty(0);
    setAcceptedQty(0);
    setVehicleNo('');
    setSupplierBatch('');
    setShowGRNModal(false);
    setActiveTab('grn');
  };

  // PO Edit handlers
  const openEditPOModal = (po: PurchaseOrder) => {
    setEditingPO(po);
    setEditPOSupplierName(po.supplierName);
    setEditPOMaterialName(po.materialName);
    setEditPOQuantity(po.quantity);
    setEditPORate(po.rate);
    setEditPOUnit(po.unit || 'MT');
    setEditPOExpectedDelivery(po.expectedDelivery);
    setEditPOPaymentTerms(po.paymentTerms || '');
    setEditPOStatus(po.status);
  };

  const handleSavePOEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPO) return;
    const poToEdit = editingPO;
    setEditingPO(null);
    const totalAmount = editPOQuantity * editPORate;
    await updatePurchaseOrder(poToEdit.id, {
      supplierName: editPOSupplierName,
      materialName: editPOMaterialName,
      quantity: Number(editPOQuantity),
      rate: Number(editPORate),
      totalAmount: Number(totalAmount),
      unit: editPOUnit,
      expectedDelivery: editPOExpectedDelivery,
      paymentTerms: editPOPaymentTerms,
      status: editPOStatus
    });
  };

  const handleDeletePOConfirm = async () => {
    if (!deletingPO) return;
    const id = deletingPO.id;
    setDeletingPO(null);
    await deletePurchaseOrder(id);
  };

  // GRN Edit handlers
  const openEditGRNModal = (g: GRN) => {
    setEditingGRN(g);
    setEditGRNReceivedQty(g.receivedQuantity);
    setEditGRNAcceptedQty(g.acceptedQuantity);
    setEditGRNRejectedQty(g.rejectedQuantity);
    setEditGRNVehicleNo(g.vehicleNumber);
    setEditGRNSupplierBatch(g.supplierBatchNumber);
    setEditGRNQCStatus(g.qcStatus);
    setEditGRNRemarks(g.remarks || '');
  };

  const handleSaveGRNEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGRN) return;
    const grnToEdit = editingGRN;
    setEditingGRN(null);
    await updateGRN(grnToEdit.id, {
      receivedQuantity: Number(editGRNReceivedQty),
      acceptedQuantity: Number(editGRNAcceptedQty),
      rejectedQuantity: Number(editGRNRejectedQty),
      weightReceiptMT: Number(editGRNReceivedQty),
      vehicleNumber: editGRNVehicleNo,
      supplierBatchNumber: editGRNSupplierBatch,
      qcStatus: editGRNQCStatus,
      remarks: editGRNRemarks
    });
  };

  const handleDeleteGRNConfirm = async () => {
    if (!deletingGRN) return;
    const id = deletingGRN.id;
    setDeletingGRN(null);
    await deleteGRN(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showGRNModal) {
          setShowGRNModal(false);
          setSelectedPO(null);
          setIsManualGRN(false);
        }
        if (editingPO) setEditingPO(null);
        if (editingGRN) setEditingGRN(null);
        if (deletingPO) setDeletingPO(null);
        if (deletingGRN) setDeletingGRN(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGRNModal, editingPO, editingGRN, deletingPO, deletingGRN]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <ModuleHeader
        tabs={
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
        }
      >
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
          {activeTab === 'grn' ? (
            <>
              <button
                id="btn-add-grn"
                onClick={handleOpenAddGRN}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add GRN</span>
              </button>
              <button
                onClick={() => {
                  setQuickAddType('Purchase Order');
                  setIsQuickAddOpen(true);
                }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Purchase Order</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setQuickAddType('Purchase Order');
                setIsQuickAddOpen(true);
              }}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Purchase Order</span>
            </button>
          )}
        </div>
      </ModuleHeader>

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
                  <th className="p-3 text-center">Actions</th>
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
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditPOModal(po)}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          title="Edit Purchase Order"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingPO(po)}
                          className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Purchase Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredGRNs.map(g => (
                  <tr key={g.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">{g.grnNumber}</div>
                      <div className="text-[11px] text-neutral-400">{g.date}</div>
                    </td>
                    <td className="p-3 font-mono text-neutral-700">
                      {!g.poNumber || g.poNumber === '-' || g.poNumber === 'NA' || g.poNumber === 'PO-DIRECT' ? (
                        <span className="text-neutral-400 font-semibold">-</span>
                      ) : (
                        g.poNumber
                      )}
                    </td>
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
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditGRNModal(g)}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          title="Edit GRN"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingGRN(g)}
                          className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete GRN"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredGRNs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-neutral-500">
                      <p className="mb-2 text-xs">No Goods Receipt Notes found.</p>
                      <button
                        type="button"
                        onClick={handleOpenAddGRN}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add First GRN</span>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / ADD GRN MODAL */}
      {showGRNModal && (isManualGRN || selectedPO) && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setShowGRNModal(false); setSelectedPO(null); setIsManualGRN(false); } }}
          className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {isManualGRN ? 'Add Goods Receipt Note (GRN)' : `Create Goods Receipt Note (GRN) for ${selectedPO?.poNumber}`}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {isManualGRN ? 'Manual GRN Entry · Direct Delivery Receipt' : 'Weighbridge verification & incoming QC acceptance'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => { setShowGRNModal(false); setSelectedPO(null); setIsManualGRN(false); }}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1 rounded-md hover:bg-neutral-100 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitGRN} className="space-y-3.5">
              {isManualGRN ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Supplier
                    </label>
                    <select
                      value={manualSupplierId}
                      onChange={(e) => setManualSupplierId(e.target.value)}
                      required
                      className="w-full border border-neutral-300 rounded-lg p-2 text-xs bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.supplierName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">
                      Raw Material
                    </label>
                    <select
                      value={manualMaterialId}
                      onChange={(e) => setManualMaterialId(e.target.value)}
                      required
                      className="w-full border border-neutral-300 rounded-lg p-2 text-xs bg-white text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {rawMaterials.map(rm => (
                        <option key={rm.id} value={rm.id}>{rm.materialName} ({rm.unit})</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                selectedPO && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-[11px] grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">PO Reference</span>
                      <span className="font-mono font-bold text-neutral-900">{selectedPO.poNumber}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Supplier</span>
                      <span className="font-semibold text-neutral-900 truncate block" title={selectedPO.supplierName}>
                        {selectedPO.supplierName}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Material</span>
                      <span className="font-semibold text-neutral-900 truncate block" title={selectedPO.materialName}>
                        {selectedPO.materialName}
                      </span>
                    </div>
                  </div>
                )
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">
                    Weighbridge Received Qty ({isManualGRN ? (rawMaterials.find(rm => rm.id === manualMaterialId)?.unit || 'MT') : (selectedPO?.unit || 'MT')})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={receivedQty}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setReceivedQty(val);
                      if (acceptedQty > val) setAcceptedQty(val);
                    }}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">
                    QC Accepted Qty ({isManualGRN ? (rawMaterials.find(rm => rm.id === manualMaterialId)?.unit || 'MT') : (selectedPO?.unit || 'MT')})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max={receivedQty}
                    required
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vehicle Truck No.</label>
                  <input
                    type="text"
                    required
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="GJ-12-BW-8910"
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Supplier Mine Batch No.</label>
                  <input
                    type="text"
                    required
                    value={supplierBatch}
                    onChange={(e) => setSupplierBatch(e.target.value)}
                    placeholder="KBM-2609-B8"
                    className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {Number(receivedQty) > Number(acceptedQty) && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 flex items-center justify-between">
                  <span>Rejected Quantity:</span>
                  <strong className="font-mono">
                    {Number(receivedQty) - Number(acceptedQty)} {isManualGRN ? (rawMaterials.find(rm => rm.id === manualMaterialId)?.unit || 'MT') : (selectedPO?.unit || 'MT')}
                  </strong>
                </div>
              )}

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800">
                <strong>Automation Trigger:</strong> Accepted quantity will automatically be credited to Raw Material Stock and available for production planning upon submission.
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => { setShowGRNModal(false); setSelectedPO(null); setIsManualGRN(false); }}
                  className="px-3.5 py-1.5 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg cursor-pointer shadow-xs"
                >
                  Confirm GRN &amp; Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PO MODAL */}
      {editingPO && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setEditingPO(null); }}
          className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Edit Purchase Order ({editingPO.poNumber})
              </h3>
              <button onClick={() => setEditingPO(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePOEdit} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={editPOSupplierName}
                  onChange={(e) => setEditPOSupplierName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Material Name</label>
                <input
                  type="text"
                  value={editPOMaterialName}
                  onChange={(e) => setEditPOMaterialName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editPOQuantity}
                    onChange={(e) => setEditPOQuantity(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    value={editPORate}
                    onChange={(e) => setEditPORate(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Unit</label>
                  <input
                    type="text"
                    value={editPOUnit}
                    onChange={(e) => setEditPOUnit(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={editPOExpectedDelivery}
                    onChange={(e) => setEditPOExpectedDelivery(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Status</label>
                  <select
                    value={editPOStatus}
                    onChange={(e) => setEditPOStatus(e.target.value as PurchaseOrder['status'])}
                    className="w-full border border-neutral-300 rounded p-2 text-xs bg-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Issued">Issued</option>
                    <option value="GRN Completed">GRN Completed</option>
                    <option value="Billed">Billed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={editPOPaymentTerms}
                  onChange={(e) => setEditPOPaymentTerms(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingPO(null)}
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

      {/* EDIT GRN MODAL */}
      {editingGRN && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setEditingGRN(null); }}
          className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Edit GRN ({editingGRN.grnNumber})
              </h3>
              <button onClick={() => setEditingGRN(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGRNEdit} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Received Qty</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editGRNReceivedQty}
                    onChange={(e) => setEditGRNReceivedQty(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Accepted Qty</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editGRNAcceptedQty}
                    onChange={(e) => setEditGRNAcceptedQty(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editGRNRejectedQty}
                    onChange={(e) => setEditGRNRejectedQty(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vehicle Truck No.</label>
                  <input
                    type="text"
                    value={editGRNVehicleNo}
                    onChange={(e) => setEditGRNVehicleNo(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Supplier Batch</label>
                  <input
                    type="text"
                    value={editGRNSupplierBatch}
                    onChange={(e) => setEditGRNSupplierBatch(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">QC Status</label>
                <select
                  value={editGRNQCStatus}
                  onChange={(e) => setEditGRNQCStatus(e.target.value as any)}
                  className="w-full border border-neutral-300 rounded p-2 text-xs bg-white"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending QC">Pending QC</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Remarks</label>
                <input
                  type="text"
                  value={editGRNRemarks}
                  onChange={(e) => setEditGRNRemarks(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingGRN(null)}
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

      {/* CONFIRM DELETE PO MODAL */}
      <ConfirmModal
        isOpen={!!deletingPO}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete purchase order ${deletingPO?.poNumber} for ${deletingPO?.supplierName}?`}
        confirmText="Delete PO"
        onConfirm={handleDeletePOConfirm}
        onClose={() => setDeletingPO(null)}
      />

      {/* CONFIRM DELETE GRN MODAL */}
      <ConfirmModal
        isOpen={!!deletingGRN}
        title="Delete Goods Receipt Note"
        message={`Are you sure you want to delete GRN ${deletingGRN?.grnNumber}?`}
        confirmText="Delete GRN"
        onConfirm={handleDeleteGRNConfirm}
        onClose={() => setDeletingGRN(null)}
      />
    </div>
  );
};

