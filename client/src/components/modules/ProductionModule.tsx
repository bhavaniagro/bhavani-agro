import React, { useState } from 'react';
import { 
  Factory, 
  Layers, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  Sparkles, 
  Boxes,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ProductionOrder, ProductionBatch, BOM } from '../../types/erp';

export const ProductionModule: React.FC = () => {
  const { 
    productionOrders, 
    productionBatches, 
    boms, 
    rawMaterials,
    products,
    updateProductionOrder,
    deleteProductionOrder,
    updateProductionBatch,
    deleteProductionBatch,
    addBOM,
    updateBOM,
    deleteBOM,
    startProductionOrder, 
    completeProductionOrder,
    setActiveModule,
    setIsDemoRunnerOpen
  } = useERP();

  const [activeTab, setActiveTab] = useState<'orders' | 'boms' | 'batches'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogEntryModal, setShowLogEntryModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [entryOutputMT, setEntryOutputMT] = useState(25);
  const [entryLossMT, setEntryLossMT] = useState(0.5);

  // Edit/Delete Production Order State
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<ProductionOrder | null>(null);
  const [editOrderSupervisor, setEditOrderSupervisor] = useState('');
  const [editOrderLine, setEditOrderLine] = useState('');
  const [editOrderPriority, setEditOrderPriority] = useState<ProductionOrder['priority']>('Normal');
  const [editOrderStatus, setEditOrderStatus] = useState<ProductionOrder['status']>('Planned');

  // Edit/Delete Production Batch State
  const [editingBatch, setEditingBatch] = useState<ProductionBatch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<ProductionBatch | null>(null);
  const [editBatchQty, setEditBatchQty] = useState(0);
  const [editBatchStorage, setEditBatchStorage] = useState('');

  // Edit/Delete/Add BOM State
  const [editingBOM, setEditingBOM] = useState<BOM | null>(null);
  const [deletingBOM, setDeletingBOM] = useState<BOM | null>(null);
  const [showAddBOMModal, setShowAddBOMModal] = useState(false);
  const [bomProductId, setBomProductId] = useState('');
  const [bomProductName, setBomProductName] = useState('');
  const [bomVersion, setBomVersion] = useState('v1.0');
  const [bomCost, setBomCost] = useState(4350);
  const [bomLabourCost, setBomLabourCost] = useState(350);
  const [bomPowerCost, setBomPowerCost] = useState(250);
  const [bomPackagingCost, setBomPackagingCost] = useState(270);
  const [bomOverheadCost, setBomOverheadCost] = useState(150);
  const [bomNotes, setBomNotes] = useState('');
  const [bomItems, setBomItems] = useState<any[]>([]);

  const filteredOrders = productionOrders.filter(po => 
    po.productionOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.productionLine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEntry = (po: any) => {
    setSelectedOrder(po);
    setEntryOutputMT(po.targetQuantityMT);
    setEntryLossMT(Number((po.targetQuantityMT * 0.02).toFixed(2)));
    setShowLogEntryModal(true);
  };

  const submitProductionEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    completeProductionOrder(selectedOrder.id, Number(entryOutputMT), `Run finished with ${entryLossMT} MT process loss.`);
    setShowLogEntryModal(false);
    setActiveTab('batches');
  };

  // Production Order handlers
  const openEditOrderModal = (po: ProductionOrder) => {
    setEditingOrder(po);
    setEditOrderSupervisor(po.supervisor);
    setEditOrderLine(po.productionLine);
    setEditOrderPriority(po.priority);
    setEditOrderStatus(po.status);
  };

  const handleSaveOrderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    await updateProductionOrder(editingOrder.id, {
      supervisor: editOrderSupervisor,
      productionLine: editOrderLine,
      priority: editOrderPriority,
      status: editOrderStatus
    });
    setEditingOrder(null);
  };

  const handleDeleteOrderConfirm = async () => {
    if (!deletingOrder) return;
    await deleteProductionOrder(deletingOrder.id);
    setDeletingOrder(null);
  };

  // Production Batch handlers
  const openEditBatchModal = (b: ProductionBatch) => {
    setEditingBatch(b);
    setEditBatchQty(b.quantityProducedMT);
    setEditBatchStorage(b.storageLocation);
  };

  const handleSaveBatchEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    await updateProductionBatch(editingBatch.id, {
      quantityProducedMT: Number(editBatchQty),
      storageLocation: editBatchStorage
    });
    setEditingBatch(null);
  };

  const handleDeleteBatchConfirm = async () => {
    if (!deletingBatch) return;
    await deleteProductionBatch(deletingBatch.id);
    setDeletingBatch(null);
  };

  // BOM Handlers
  const resetBOMForm = () => {
    setBomProductId('');
    setBomProductName('');
    setBomVersion('v1.0');
    setBomCost(4350);
    setBomLabourCost(350);
    setBomPowerCost(250);
    setBomPackagingCost(270);
    setBomOverheadCost(150);
    setBomNotes('');
    setBomItems([]);
  };

  const openEditBOMModal = (b: BOM) => {
    setEditingBOM(b);
    setBomProductId(b.productId || '');
    setBomProductName(b.productName);
    setBomVersion(b.version);
    setBomCost(b.totalStandardCostPerMT);
    setBomLabourCost(b.labourCostPerMT || 350);
    setBomPowerCost(b.powerElectricityCostPerMT || 250);
    setBomPackagingCost(b.packagingCostPerMT || 270);
    setBomOverheadCost(b.overheadCostPerMT || 150);
    setBomItems(b.items || []);
    setBomNotes(b.notes || '');
  };

  const handleSaveBOMEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBOM) return;
    const rmCost = bomItems.reduce((acc, item) => acc + ((item.quantityPerMT || 0) * (item.costPerUnit || 0)), 0);
    const totalCost = rmCost + Number(bomLabourCost) + Number(bomPowerCost) + Number(bomPackagingCost) + Number(bomOverheadCost);
    await updateBOM(editingBOM.id, {
      productId: bomProductId || editingBOM.productId,
      productName: bomProductName || editingBOM.productName,
      version: bomVersion,
      items: bomItems,
      totalRawMaterialCostPerMT: rmCost,
      labourCostPerMT: Number(bomLabourCost),
      powerElectricityCostPerMT: Number(bomPowerCost),
      packagingCostPerMT: Number(bomPackagingCost),
      overheadCostPerMT: Number(bomOverheadCost),
      totalStandardCostPerMT: totalCost || Number(bomCost),
      notes: bomNotes
    });
    setEditingBOM(null);
    resetBOMForm();
  };

  const handleDeleteBOMConfirm = async () => {
    if (!deletingBOM) return;
    await deleteBOM(deletingBOM.id);
    setDeletingBOM(null);
  };

  const handleCreateBOM = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const targetProd = products.find(p => p.id === bomProductId || p.productName === bomProductName) || products[0];
      const finalProdName = targetProd ? targetProd.productName : (bomProductName || 'Custom Product');
      const finalProdId = targetProd ? targetProd.id : `prod-${Date.now()}`;

      const rmCost = bomItems.reduce((acc, item) => acc + ((item.quantityPerMT || 0) * (item.costPerUnit || 0)), 0);
      const totalCost = rmCost + Number(bomLabourCost) + Number(bomPowerCost) + Number(bomPackagingCost) + Number(bomOverheadCost);

      const itemsToSave = bomItems.length > 0 ? bomItems : (rawMaterials[0] ? [{
        rawMaterialId: rawMaterials[0].id,
        rawMaterialName: rawMaterials[0].materialName,
        quantityPerMT: 1000,
        unit: rawMaterials[0].unit,
        costPerUnit: rawMaterials[0].averageCost,
        wastagePercent: 1.0
      }] : []);

      await addBOM({
        productId: finalProdId,
        productName: finalProdName,
        version: bomVersion,
        batchYieldMT: 1,
        processLossPercent: 2.0,
        totalStandardCostPerMT: totalCost || Number(bomCost),
        totalRawMaterialCostPerMT: rmCost,
        labourCostPerMT: Number(bomLabourCost),
        powerElectricityCostPerMT: Number(bomPowerCost),
        packagingCostPerMT: Number(bomPackagingCost),
        packagingBagsPerMT: 20,
        overheadCostPerMT: Number(bomOverheadCost),
        isActive: true,
        items: itemsToSave,
        notes: bomNotes || 'Standard mfg formulation.'
      });
      setShowAddBOMModal(false);
      resetBOMForm();
    } catch (err) {
      console.error("Failed to create BOM:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Manufacturing &amp; Production Management
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Granulation &amp; Pulverizing Lines
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Automatic BOM explosion, material shortage check, production entry logging, yield and efficiency tracking.
          </p>
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
            Production Orders ({productionOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('boms')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'boms' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Bill of Materials (BOM Recipes) ({boms.length})
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'batches' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Produced Batches &amp; Yield ({productionBatches.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search orders, line, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-60 outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* TAB 1: PRODUCTION ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                    <th className="p-3">Order # &amp; Line</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3 text-right">Target Output</th>
                    <th className="p-3">Supervisor</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Material Check</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Production Action</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map(po => (
                    <tr key={po.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-3">
                        <div className="font-mono font-bold text-neutral-900">{po.productionOrderNumber}</div>
                        <div className="text-[11px] text-neutral-500 font-mono">{po.productionLine}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-neutral-900">{po.productName}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Dates: {po.plannedStartDate} → {po.plannedEndDate}</div>
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                        {po.targetQuantityMT} MT
                      </td>
                      <td className="p-3 text-neutral-700">{po.supervisor}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          po.priority === 'Urgent' ? 'bg-rose-100 text-rose-800 font-bold' :
                          po.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {po.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        {po.hasMaterialShortage ? (
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Shortage Detected
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Materials Verified ✓
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                          po.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          po.status === 'In Production' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          po.status === 'QC' ? 'bg-blue-100 text-blue-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {po.status === 'Planned' || po.status === 'Material Ready' ? (
                          <button
                            onClick={() => startProductionOrder(po.id)}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Issue &amp; Start</span>
                          </button>
                        ) : po.status === 'In Production' ? (
                          <button
                            onClick={() => handleOpenEntry(po)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Log Entry</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-mono font-medium">
                            Batch {po.actualBatchNumber || 'Produced'}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditOrderModal(po)}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                            title="Edit Order"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingOrder(po)}
                            className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Order"
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
        </div>
      )}

      {/* TAB 2: BOM RECIPES */}
      {activeTab === 'boms' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setBomProductName('');
                setBomVersion('v1.0');
                setBomCost(4350);
                setBomNotes('');
                setShowAddBOMModal(true);
              }}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New BOM</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boms.length > 0 ? (
              boms.map(bom => (
                <div key={bom.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">{bom.productName}</h3>
                      <div className="text-[11px] text-neutral-500 font-mono">{bom.version} · Base Yield: 1 MT</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-sm font-mono text-neutral-900">
                          ₹{bom.totalStandardCostPerMT.toLocaleString('en-IN')}/MT
                        </div>
                        <div className="text-[10px] text-neutral-400">Total Standard Mfg Cost</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditBOMModal(bom)}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          title="Edit BOM"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingBOM(bom)}
                          className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete BOM"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-neutral-700 mb-1">Raw Material Recipe per 1 MT Output:</div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded p-2 space-y-1">
                      {(bom.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span className="text-neutral-800 font-medium">{item.rawMaterialName}</span>
                          <span className="font-mono text-neutral-600 font-semibold">{item.quantityPerMT} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-neutral-100 text-[11px]">
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="text-neutral-500">RM Cost:</div>
                      <div className="font-mono font-bold text-neutral-800">₹{bom.totalRawMaterialCostPerMT}</div>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="text-neutral-500">Power &amp; Labour:</div>
                      <div className="font-mono font-bold text-neutral-800">₹{(bom.labourCostPerMT || 0) + (bom.powerElectricityCostPerMT || 0)}</div>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded">
                      <div className="text-neutral-500">Packaging:</div>
                      <div className="font-mono font-bold text-neutral-800">₹{bom.packagingCostPerMT || 0}</div>
                    </div>
                  </div>

                  {bom.notes && (
                    <div className="text-[10px] text-neutral-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                      Notes: {bom.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-neutral-400 italic text-xs bg-white rounded-xl border border-neutral-200">
                No BOM recipes found. Click "Create New BOM" to define a manufacturing recipe.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BATCHES */}
      {activeTab === 'batches' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Batch Number</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Mfg Date</th>
                  <th className="p-3 text-right">Produced Qty</th>
                  <th className="p-3 text-right">Std vs Actual Cost</th>
                  <th className="p-3">Storage Bay</th>
                  <th className="p-3">QC Status</th>
                  <th className="p-3 text-right">Traceability</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {productionBatches.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-bold text-emerald-800">{b.batchNumber}</span>
                      <div className="text-[10px] text-neutral-400 font-mono">Ref: {b.productionOrderId}</div>
                    </td>
                    <td className="p-3 font-medium text-neutral-900">{b.productName}</td>
                    <td className="p-3 text-neutral-600">{b.productionDate}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                      {b.quantityProducedMT} MT
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      <div className="text-neutral-500">Std: ₹{b.standardCostPerMT}</div>
                      <div className="font-bold text-emerald-700">Act: ₹{b.actualCostPerMT}</div>
                    </td>
                    <td className="p-3 text-neutral-700">{b.storageLocation}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        b.qcStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        b.qcStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {b.qcStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setActiveModule('Quality Control');
                        }}
                        className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 cursor-pointer"
                      >
                        Inspect QC
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditBatchModal(b)}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          title="Edit Batch"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingBatch(b)}
                          className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Batch"
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

      {/* PRODUCTION ENTRY MODAL */}
      {showLogEntryModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-1">
              Log Production Entry for {selectedOrder.productionOrderNumber}
            </h3>
            <p className="text-[11px] text-neutral-500 mb-4">
              Product: {selectedOrder.productName} · Target: {selectedOrder.targetQuantityMT} MT
            </p>

            <form onSubmit={submitProductionEntry} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Finished Goods Output (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={entryOutputMT}
                    onChange={(e) => setEntryOutputMT(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Process Loss / Dust (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={entryLossMT}
                    onChange={(e) => setEntryLossMT(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Calculated Yield %:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {((entryOutputMT / (entryOutputMT + entryLossMT)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Production Efficiency:</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {((entryOutputMT / selectedOrder.targetQuantityMT) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                <strong>Automation Note:</strong> Submitting will generate a new Production Batch and automatically create a <strong>Quality Control inspection record</strong>.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowLogEntryModal(false)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded cursor-pointer"
                >
                  Generate Batch &amp; Send to QC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCTION ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Edit Production Order ({editingOrder.productionOrderNumber})
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Supervisor</label>
                <input
                  type="text"
                  value={editOrderSupervisor}
                  onChange={(e) => setEditOrderSupervisor(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Production Line</label>
                <input
                  type="text"
                  value={editOrderLine}
                  onChange={(e) => setEditOrderLine(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Priority</label>
                  <select
                    value={editOrderPriority}
                    onChange={(e) => setEditOrderPriority(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded p-2 text-xs bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Status</label>
                  <select
                    value={editOrderStatus}
                    onChange={(e) => setEditOrderStatus(e.target.value as any)}
                    className="w-full border border-neutral-300 rounded p-2 text-xs bg-white"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Material Ready">Material Ready</option>
                    <option value="In Production">In Production</option>
                    <option value="QC">QC</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
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

      {/* EDIT PRODUCTION BATCH MODAL */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Edit Production Batch ({editingBatch.batchNumber})
              </h3>
              <button onClick={() => setEditingBatch(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBatchEdit} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Quantity Produced (MT)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editBatchQty}
                  onChange={(e) => setEditBatchQty(Number(e.target.value))}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Storage Location Bay</label>
                <input
                  type="text"
                  value={editBatchStorage}
                  onChange={(e) => setEditBatchStorage(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
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

      {/* CREATE / EDIT BOM MODAL */}
      {(showAddBOMModal || editingBOM) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingBOM ? `Edit BOM Recipe (${editingBOM.productName})` : 'Create New BOM Recipe'}
              </h3>
              <button
                onClick={() => {
                  setShowAddBOMModal(false);
                  setEditingBOM(null);
                  resetBOMForm();
                }}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingBOM ? handleSaveBOMEdit : handleCreateBOM} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Output Product</label>
                {products.length > 0 ? (
                  <select
                    value={bomProductId}
                    onChange={(e) => {
                      setBomProductId(e.target.value);
                      const prod = products.find(p => p.id === e.target.value);
                      if (prod) setBomProductName(prod.productName);
                    }}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs bg-white"
                  >
                    <option value="">Select Product Output</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.productName} ({p.category})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={bomProductName}
                    onChange={(e) => setBomProductName(e.target.value)}
                    required
                    placeholder="e.g. Granulated Bentonite 16-30 Mesh"
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Recipe Version</label>
                  <input
                    type="text"
                    value={bomVersion}
                    onChange={(e) => setBomVersion(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Labour Cost / MT (₹)</label>
                  <input
                    type="number"
                    value={bomLabourCost}
                    onChange={(e) => setBomLabourCost(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Power (₹/MT)</label>
                  <input
                    type="number"
                    value={bomPowerCost}
                    onChange={(e) => setBomPowerCost(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Packaging (₹)</label>
                  <input
                    type="number"
                    value={bomPackagingCost}
                    onChange={(e) => setBomPackagingCost(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Overhead (₹)</label>
                  <input
                    type="number"
                    value={bomOverheadCost}
                    onChange={(e) => setBomOverheadCost(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              {/* Raw Material Component Row */}
              <div className="border border-neutral-200 rounded p-2 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between font-semibold text-neutral-700 text-[11px]">
                  <span>Raw Material Inputs:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const firstRM = rawMaterials[0];
                      setBomItems(prev => [...prev, {
                        rawMaterialId: firstRM?.id || 'rm-1',
                        rawMaterialName: firstRM?.materialName || 'Bentonite Ore',
                        quantityPerMT: 1000,
                        unit: firstRM?.unit || 'KG',
                        costPerUnit: firstRM?.averageCost || 3.5,
                        wastagePercent: 1.0
                      }]);
                    }}
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    + Add Component
                  </button>
                </div>
                {bomItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={item.rawMaterialId}
                      onChange={(e) => {
                        const rm = rawMaterials.find(r => r.id === e.target.value);
                        const updated = [...bomItems];
                        updated[idx] = {
                          ...updated[idx],
                          rawMaterialId: e.target.value,
                          rawMaterialName: rm?.materialName || updated[idx].rawMaterialName,
                          unit: rm?.unit || updated[idx].unit,
                          costPerUnit: rm?.averageCost || updated[idx].costPerUnit
                        };
                        setBomItems(updated);
                      }}
                      className="flex-1 border border-neutral-300 rounded p-1 bg-white"
                    >
                      {rawMaterials.map(r => (
                        <option key={r.id} value={r.id}>{r.materialName}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Qty/MT"
                      value={item.quantityPerMT}
                      onChange={(e) => {
                        const updated = [...bomItems];
                        updated[idx].quantityPerMT = Number(e.target.value);
                        setBomItems(updated);
                      }}
                      className="w-20 border border-neutral-300 rounded p-1 font-mono"
                    />
                    <span className="font-mono text-neutral-500">{item.unit || 'KG'}</span>
                    <button
                      type="button"
                      onClick={() => setBomItems(prev => prev.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:text-rose-800 font-bold p-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Formulation Notes</label>
                <textarea
                  rows={2}
                  value={bomNotes}
                  onChange={(e) => setBomNotes(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBOMModal(false);
                    setEditingBOM(null);
                    resetBOMForm();
                  }}
                  className="px-3.5 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded cursor-pointer"
                >
                  {editingBOM ? 'Save Changes' : 'Create BOM Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODALS */}
      <ConfirmModal
        isOpen={!!deletingOrder}
        title="Delete Production Order"
        message={`Are you sure you want to delete order ${deletingOrder?.productionOrderNumber}?`}
        confirmText="Delete Order"
        onConfirm={handleDeleteOrderConfirm}
        onClose={() => setDeletingOrder(null)}
      />

      <ConfirmModal
        isOpen={!!deletingBatch}
        title="Delete Production Batch"
        message={`Are you sure you want to delete batch ${deletingBatch?.batchNumber}?`}
        confirmText="Delete Batch"
        onConfirm={handleDeleteBatchConfirm}
        onClose={() => setDeletingBatch(null)}
      />

      <ConfirmModal
        isOpen={!!deletingBOM}
        title="Delete BOM Recipe"
        message={`Are you sure you want to delete BOM for ${deletingBOM?.productName}?`}
        confirmText="Delete BOM"
        onConfirm={handleDeleteBOMConfirm}
        onClose={() => setDeletingBOM(null)}
      />
    </div>
  );
};

