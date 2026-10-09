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
  Layers,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RawMaterial } from '../../types/erp';
import { ConfirmModal } from '../modals/ConfirmModal';

export const RawMaterialModule: React.FC = () => {
  const { 
    rawMaterials, 
    addRawMaterial, 
    updateRawMaterial,
    deleteRawMaterial,
    setIsQuickAddOpen, 
    setQuickAddType,
    setActiveModule 
  } = useERP();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRM, setEditingRM] = useState<RawMaterial | null>(null);
  const [deletingRMId, setDeletingRMId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add form state
  const [newRM, setNewRM] = useState({
    sku: `RM-${Date.now().toString().slice(-4)}`,
    materialName: '',
    category: 'Mineral Ore' as RawMaterial['category'],
    unit: 'MT' as RawMaterial['unit'],
    minimumStock: 0,
    maximumStock: 0,
    openingStock: 0,
    averageCost: 0,
    storageLocation: '',
    primarySupplier: '',
    reorderLevel: 0
  });

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
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Raw Material</span>
          </button>
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
                <th className="p-3 text-right">Actions</th>
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
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingRM(rm)}
                          title="Edit"
                          className="p-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-neutral-700 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeletingRMId(rm.id)}
                          title="Delete"
                          className="p-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Raw Material Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Add Raw Material</div>
              <button onClick={() => setIsAddOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await addRawMaterial({
                    sku: newRM.sku,
                    materialName: newRM.materialName,
                    category: newRM.category,
                    unit: newRM.unit,
                    minimumStock: Number(newRM.minimumStock),
                    maximumStock: Number(newRM.maximumStock),
                    openingStock: Number(newRM.openingStock),
                    averageCost: Number(newRM.averageCost),
                    storageLocation: newRM.storageLocation,
                    primarySupplier: newRM.primarySupplier,
                    reorderLevel: Number(newRM.reorderLevel)
                  });
                  setIsAddOpen(false);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={newRM.sku}
                    onChange={(e) => setNewRM({ ...newRM, sku: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Material Name</label>
                  <input
                    type="text"
                    required
                    value={newRM.materialName}
                    onChange={(e) => setNewRM({ ...newRM, materialName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Category</label>
                  <select
                    value={newRM.category}
                    onChange={(e) => setNewRM({ ...newRM, category: e.target.value as any })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  >
                    <option value="Mineral Ore">Mineral Ore</option>
                    <option value="Organic Input">Organic Input</option>
                    <option value="Microbial">Microbial</option>
                    <option value="Chemical & Additive">Chemical & Additive</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Unit</label>
                  <select
                    value={newRM.unit}
                    onChange={(e) => setNewRM({ ...newRM, unit: e.target.value as any })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  >
                    <option value="MT">MT</option>
                    <option value="KG">KG</option>
                    <option value="Bags">Bags</option>
                    <option value="Liters">Liters</option>
                    <option value="Units">Units</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={newRM.openingStock}
                    onChange={(e) => setNewRM({ ...newRM, openingStock: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Min Stock</label>
                  <input
                    type="number"
                    value={newRM.minimumStock}
                    onChange={(e) => setNewRM({ ...newRM, minimumStock: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Avg Cost (₹)</label>
                  <input
                    type="number"
                    value={newRM.averageCost}
                    onChange={(e) => setNewRM({ ...newRM, averageCost: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Add Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Raw Material Modal */}
      {editingRM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Edit Material: {editingRM.sku}</div>
              <button onClick={() => setEditingRM(null)} className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await updateRawMaterial(editingRM.id, editingRM);
                  setEditingRM(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Material Name</label>
                  <input
                    type="text"
                    required
                    value={editingRM.materialName}
                    onChange={(e) => setEditingRM({ ...editingRM, materialName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={editingRM.storageLocation}
                    onChange={(e) => setEditingRM({ ...editingRM, storageLocation: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Avg Cost (₹)</label>
                  <input
                    type="number"
                    value={editingRM.averageCost}
                    onChange={(e) => setEditingRM({ ...editingRM, averageCost: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    value={editingRM.reorderLevel}
                    onChange={(e) => setEditingRM({ ...editingRM, reorderLevel: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button type="button" onClick={() => setEditingRM(null)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Raw Material Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingRMId)}
        title="Delete Raw Material"
        message="Are you sure you want to delete this raw material record from Firestore?"
        confirmText="Delete Material"
        isDangerous={true}
        isLoading={isSubmitting}
        onClose={() => setDeletingRMId(null)}
        onConfirm={async () => {
          if (!deletingRMId) return;
          setIsSubmitting(true);
          try {
            await deleteRawMaterial(deletingRMId);
            setDeletingRMId(null);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
};
