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
  Plus
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ProductionModule: React.FC = () => {
  const { 
    productionOrders, 
    productionBatches, 
    boms, 
    rawMaterials, 
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoRunnerOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo 100 MT Granulation Run</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boms.map(bom => (
            <div key={bom.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{bom.productName}</h3>
                  <div className="text-[11px] text-neutral-500 font-mono">{bom.version} · Base Yield: 1 MT</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm font-mono text-neutral-900">
                    ₹{bom.totalStandardCostPerMT.toLocaleString('en-IN')}/MT
                  </div>
                  <div className="text-[10px] text-neutral-400">Total Standard Mfg Cost</div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-neutral-700 mb-1">Raw Material Recipe per 1 MT Output:</div>
                <div className="bg-neutral-50 border border-neutral-200 rounded p-2 space-y-1">
                  {bom.items.map((item, idx) => (
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
                  <div className="font-mono font-bold text-neutral-800">₹{bom.labourCostPerMT + bom.powerElectricityCostPerMT}</div>
                </div>
                <div className="bg-neutral-50 p-2 rounded">
                  <div className="text-neutral-500">Packaging (50kg):</div>
                  <div className="font-mono font-bold text-neutral-800">₹{bom.packagingCostPerMT} ({bom.packagingBagsPerMT} bags)</div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                Notes: {bom.notes}
              </div>
            </div>
          ))}
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
    </div>
  );
};
