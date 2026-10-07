import React, { useState } from 'react';
import { 
  Plus, 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShoppingCart,
  Layers
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const RawMaterialModule: React.FC = () => {
  const { 
    rawMaterials, 
    addRawMaterial, 
    setIsQuickAddOpen, 
    setQuickAddType,
    setActiveModule 
  } = useERP();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Mineral Ore',
    'Organic Input',
    'Microbial',
    'Chemical & Additive',
    'Packaging',
    'Consumable'
  ];

  const filteredMaterials = rawMaterials.filter(rm => {
    const matchesCat = categoryFilter === 'All' || rm.category === categoryFilter;
    const matchesSearch = rm.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rm.primarySupplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalRawStockValue = rawMaterials.reduce((acc, curr) => {
    const qty = curr.unit === 'MT' ? curr.currentStock : curr.currentStock;
    return acc + (qty * curr.averageCost);
  }, 0);

  const lowStockCount = rawMaterials.filter(r => r.currentStock <= r.reorderLevel).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Raw Material Inventory &amp; Stock Ledger
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalRawStockValue.toLocaleString('en-IN')} Inventory Valuation
            </span>
            {lowStockCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                {lowStockCount} Items Below Reorder Level
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            <strong>Stock Formula:</strong> Opening Stock + Purchases + Production Returns − Consumption − Issues = Current Stock
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
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Reorder Raw Material</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search material SKU, name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-md w-full outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* Raw Materials Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Material &amp; SKU</th>
                <th className="p-3">Category &amp; Location</th>
                <th className="p-3 text-right">Opening Stock</th>
                <th className="p-3 text-right">+ Purchases</th>
                <th className="p-3 text-right">− Consumed</th>
                <th className="p-3 text-right font-bold text-neutral-900">= Current Stock</th>
                <th className="p-3 text-right">Reserved</th>
                <th className="p-3 text-right">Avail. to Use</th>
                <th className="p-3">Reorder Alert</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredMaterials.map(rm => {
                const isBelowReorder = rm.currentStock <= rm.reorderLevel;
                const freeToUse = Math.max(0, rm.currentStock - rm.reservedStock);

                return (
                  <tr key={rm.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{rm.materialName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{rm.sku} · Supplier: {rm.primarySupplier.split(' ')[0]}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-neutral-700">{rm.category}</div>
                      <div className="text-[10px] text-neutral-400">{rm.storageLocation}</div>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-500">
                      {rm.openingStock} {rm.unit}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-emerald-700">
                      +{rm.totalPurchases} {rm.unit}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-600">
                      −{rm.totalConsumption} {rm.unit}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                      {rm.currentStock} {rm.unit}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-500">
                      {rm.reservedStock} {rm.unit}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold text-emerald-800">
                      {freeToUse.toFixed(1)} {rm.unit}
                    </td>
                    <td className="p-3">
                      {isBelowReorder ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Reorder (Min {rm.minimumStock})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Adequate</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setQuickAddType('Purchase Order');
                          setIsQuickAddOpen(true);
                        }}
                        className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 cursor-pointer whitespace-nowrap"
                      >
                        + PO
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
