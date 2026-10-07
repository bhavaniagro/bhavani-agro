import React, { useState } from 'react';
import { 
  Warehouse, 
  Boxes, 
  PackageCheck, 
  Layers, 
  Search, 
  AlertTriangle,
  ArrowDownUp,
  Download
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const InventoryModule: React.FC = () => {
  const { 
    rawMaterials, 
    products, 
    productionBatches,
    setActiveModule 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'all' | 'raw' | 'finished' | 'packaging' | 'damaged'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const packagingItems = rawMaterials.filter(r => r.category === 'Packaging');
  const rawMineralItems = rawMaterials.filter(r => r.category !== 'Packaging');

  const rawValuation = rawMaterials.reduce((acc, curr) => acc + (curr.currentStock * curr.averageCost), 0);
  const finishedValuation = products.reduce((acc, curr) => acc + (curr.currentStockMT * curr.standardCostPerMT), 0);
  const grandValuation = rawValuation + finishedValuation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Unified Inventory &amp; Warehouse Valuation
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{grandValuation.toLocaleString('en-IN')} Total Plant Stock
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Single-pane control across Raw Materials, Finished Goods, Packaging, Consumables, and Damaged/Rejected stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('Reports & Analytics')}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Stock Ledger</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Valuation Overview
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'raw' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Raw Materials ({rawMineralItems.length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'finished' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Finished Goods ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'packaging' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Packaging Materials ({packagingItems.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search stock..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-48 outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* OVERVIEW STATS */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-2">
              <div className="text-neutral-500 font-medium">Raw Material Inventory Valuation</div>
              <div className="text-xl font-bold font-mono text-neutral-900">
                ₹{rawValuation.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-neutral-600">
                Ores, lignite, microbial inoculants, binders &amp; chemical additives.
              </div>
              <button
                onClick={() => setActiveTab('raw')}
                className="text-emerald-700 font-semibold text-[11px] hover:underline pt-1 block"
              >
                View Raw Material Ledger →
              </button>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-2">
              <div className="text-neutral-500 font-medium">Finished Goods Valuation (At Cost)</div>
              <div className="text-xl font-bold font-mono text-neutral-900">
                ₹{finishedValuation.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-neutral-600">
                Bentonite granules, dolomite, organic manure &amp; bio-NPK bags.
              </div>
              <button
                onClick={() => setActiveTab('finished')}
                className="text-emerald-700 font-semibold text-[11px] hover:underline pt-1 block"
              >
                View Finished Goods Ledger →
              </button>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-2">
              <div className="text-neutral-500 font-medium">Packaging Stock (Bags &amp; Jumbo)</div>
              <div className="text-xl font-bold font-mono text-neutral-900">
                {packagingItems.reduce((acc, curr) => acc + curr.currentStock, 0).toLocaleString('en-IN')} Units
              </div>
              <div className="text-[11px] text-neutral-600">
                50kg HDPE printed bags, 25kg paper bags, liners &amp; thread cones.
              </div>
              <button
                onClick={() => setActiveTab('packaging')}
                className="text-emerald-700 font-semibold text-[11px] hover:underline pt-1 block"
              >
                View Packaging Store →
              </button>
            </div>
          </div>

          {/* Quick Valuation Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-3 bg-neutral-50 border-b border-neutral-200 font-semibold text-xs text-neutral-700">
              High-Valuation Inventory Breakdown
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Item / Product Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Physical Quantity</th>
                  <th className="p-3 text-right">Unit Cost</th>
                  <th className="p-3 text-right">Total Valuation (₹)</th>
                  <th className="p-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-900">{p.productName}</td>
                    <td className="p-3 text-neutral-600">Finished Goods</td>
                    <td className="p-3 text-right font-mono tabular-nums">{p.currentStockMT} MT</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{p.standardCostPerMT}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      ₹{(p.currentStockMT * p.standardCostPerMT).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-neutral-600">{p.storageLocation}</td>
                  </tr>
                ))}
                {rawMineralItems.slice(0, 4).map(r => (
                  <tr key={r.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-900">{r.materialName}</td>
                    <td className="p-3 text-neutral-600">Raw Material</td>
                    <td className="p-3 text-right font-mono tabular-nums">{r.currentStock} {r.unit}</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{r.averageCost}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      ₹{(r.currentStock * r.averageCost).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-neutral-600">{r.storageLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RAW MATERIALS TAB */}
      {activeTab === 'raw' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Material Name &amp; SKU</th>
                <th className="p-3">Storage Location</th>
                <th className="p-3 text-right">Current Stock</th>
                <th className="p-3 text-right">Average Cost</th>
                <th className="p-3 text-right font-bold text-neutral-900">Valuation</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rawMineralItems.map(r => (
                <tr key={r.id} className="hover:bg-neutral-50/50">
                  <td className="p-3">
                    <div className="font-semibold text-neutral-900">{r.materialName}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{r.sku}</div>
                  </td>
                  <td className="p-3 text-neutral-700">{r.storageLocation}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                    {r.currentStock} {r.unit}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums">₹{r.averageCost}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold">
                    ₹{(r.currentStock * r.averageCost).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    {r.currentStock <= r.reorderLevel ? (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Below Reorder
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FINISHED GOODS TAB */}
      {activeTab === 'finished' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Finished Product</th>
                <th className="p-3">Warehouse Bay</th>
                <th className="p-3 text-right">Physical Stock</th>
                <th className="p-3 text-right">Reserved</th>
                <th className="p-3 text-right font-bold text-emerald-800">Available to Sell</th>
                <th className="p-3 text-right font-bold text-neutral-900">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="p-3 font-semibold text-neutral-900">{p.productName}</td>
                  <td className="p-3 text-neutral-700">{p.storageLocation}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">{p.currentStockMT} MT</td>
                  <td className="p-3 text-right font-mono tabular-nums text-neutral-500">{p.reservedStockMT} MT</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-700">
                    {(p.currentStockMT - p.reservedStockMT).toFixed(1)} MT
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold">
                    ₹{(p.currentStockMT * p.standardCostPerMT).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PACKAGING TAB */}
      {activeTab === 'packaging' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Packaging Material</th>
                <th className="p-3">Storage Section</th>
                <th className="p-3 text-right">Current Stock</th>
                <th className="p-3 text-right">Unit Cost</th>
                <th className="p-3 text-right font-bold">Total Valuation</th>
                <th className="p-3">Reorder Threshold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {packagingItems.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="p-3 font-semibold text-neutral-900">{p.materialName}</td>
                  <td className="p-3 text-neutral-700">{p.storageLocation}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                    {p.currentStock} {p.unit}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums">₹{p.averageCost}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold">
                    ₹{(p.currentStock * p.averageCost).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 font-mono text-neutral-600">Min {p.minimumStock} {p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
