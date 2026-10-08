import React, { useState } from 'react';
import { 
  PackageCheck, 
  Boxes, 
  Search, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { FinishedProduct } from '../../types/erp';
import { ConfirmModal } from '../modals/ConfirmModal';

export const FinishedGoodsModule: React.FC = () => {
  const { 
    products, 
    productionBatches, 
    setActiveModule,
    setIsDemoRunnerOpen,
    addProduct,
    updateProduct,
    deleteProduct
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FinishedProduct | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New product state
  const [newProd, setNewProd] = useState({
    sku: `FG-${Date.now().toString().slice(-4)}`,
    productName: '',
    category: 'Granules' as FinishedProduct['category'],
    unit: 'MT' as FinishedProduct['unit'],
    sellingPricePerMT: 6500,
    standardCostPerMT: 4200,
    minimumStockMT: 20,
    maximumStockMT: 200,
    packagingType: '50kg HDPE Woven Bag' as FinishedProduct['packagingType'],
    storageLocation: 'Warehouse Bay 1',
    taxRate: 5,
    hsnCode: '3105',
    description: 'High-grade agro granule product'
  });

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFinishedValuation = products.reduce((acc, curr) => 
    acc + (curr.currentStockMT * curr.standardCostPerMT), 0
  );

  const totalFreeStockMT = products.reduce((acc, curr) => 
    acc + Math.max(0, curr.currentStockMT - curr.reservedStockMT), 0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Finished Goods Inventory &amp; Available Stock
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalFinishedValuation.toLocaleString('en-IN')} Stock Value
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Only <strong>QC Approved</strong> batches become Available for Sale. Manage warehouse bays, packaging bags, and dispatch reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setActiveModule('CRM & Sales')}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Sales Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3 rounded-lg border border-neutral-200">
          <div className="text-neutral-500 text-[11px]">Total Physical Stock</div>
          <div className="font-bold text-base font-mono text-neutral-900 mt-1">
            {products.reduce((acc, curr) => acc + curr.currentStockMT, 0).toFixed(1)} MT
          </div>
          <div className="text-[10px] text-neutral-400">Warehouse Bays 1-5</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-neutral-200">
          <div className="text-neutral-500 text-[11px]">Free / Available for Sale</div>
          <div className="font-bold text-base font-mono text-emerald-700 mt-1">
            {totalFreeStockMT.toFixed(1)} MT
          </div>
          <div className="text-[10px] text-emerald-600">Ready for immediate booking</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-neutral-200">
          <div className="text-neutral-500 text-[11px]">Committed / Reserved</div>
          <div className="font-bold text-base font-mono text-amber-800 mt-1">
            {products.reduce((acc, curr) => acc + curr.reservedStockMT, 0).toFixed(1)} MT
          </div>
          <div className="text-[10px] text-neutral-400">Allocated to confirmed orders</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-neutral-200">
          <div className="text-neutral-500 text-[11px]">Certified Batches in Stock</div>
          <div className="font-bold text-base font-mono text-neutral-900 mt-1">
            {productionBatches.filter(b => b.qcStatus === 'Approved').length} Batches
          </div>
          <div className="text-[10px] text-neutral-400">Complete lot traceability</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex justify-between items-center">
          <span className="font-semibold text-xs text-neutral-700">Finished Goods Master &amp; Warehouse Bays</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-56 outline-none text-neutral-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Product Name &amp; SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Storage Bay</th>
                <th className="p-3 text-right">Physical Stock</th>
                <th className="p-3 text-right">Reserved</th>
                <th className="p-3 text-right font-bold text-emerald-800">Available to Sell</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map(p => {
                const freeStock = Math.max(0, p.currentStockMT - p.reservedStockMT);
                const isLow = p.currentStockMT <= p.minimumStockMT;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{p.productName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{p.sku} · HSN: {p.hsnCode}</div>
                    </td>
                    <td className="p-3 text-neutral-700">{p.category}</td>
                    <td className="p-3 text-neutral-700 font-medium">{p.storageLocation}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      {p.currentStockMT.toFixed(1)} MT
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-500">
                      {p.reservedStockMT.toFixed(1)} MT
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-emerald-700">
                      {freeStock.toFixed(1)} MT
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      ₹{p.sellingPricePerMT.toLocaleString('en-IN')}/MT
                    </td>
                    <td className="p-3">
                      {isLow ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Buffer Ready
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingProduct(p)}
                          title="Edit"
                          className="p-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-neutral-700 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(p.id)}
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

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Add Finished Product</div>
              <button onClick={() => setIsAddOpen(false)} className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await addProduct({
                    sku: newProd.sku,
                    productName: newProd.productName,
                    category: newProd.category,
                    unit: newProd.unit,
                    sellingPricePerMT: Number(newProd.sellingPricePerMT),
                    standardCostPerMT: Number(newProd.standardCostPerMT),
                    minimumStockMT: Number(newProd.minimumStockMT),
                    maximumStockMT: Number(newProd.maximumStockMT),
                    packagingType: newProd.packagingType,
                    storageLocation: newProd.storageLocation,
                    taxRate: Number(newProd.taxRate),
                    hsnCode: newProd.hsnCode,
                    description: newProd.description
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
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.productName}
                    onChange={(e) => setNewProd({ ...newProd, productName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  >
                    <option value="Granules">Granules</option>
                    <option value="Bio-Fertilizer">Bio-Fertilizer</option>
                    <option value="Organic">Organic</option>
                    <option value="Powder">Powder</option>
                    <option value="Mineral">Mineral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Selling Price / MT (₹)</label>
                  <input
                    type="number"
                    value={newProd.sellingPricePerMT}
                    onChange={(e) => setNewProd({ ...newProd, sellingPricePerMT: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={newProd.hsnCode}
                    onChange={(e) => setNewProd({ ...newProd, hsnCode: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={newProd.storageLocation}
                    onChange={(e) => setNewProd({ ...newProd, storageLocation: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Edit Product: {editingProduct.sku}</div>
              <button onClick={() => setEditingProduct(null)} className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await updateProduct(editingProduct.id, editingProduct);
                  setEditingProduct(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.productName}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Selling Price / MT (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.sellingPricePerMT}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellingPricePerMT: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Standard Cost / MT (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.standardCostPerMT}
                    onChange={(e) => setEditingProduct({ ...editingProduct, standardCostPerMT: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Storage Location</label>
                  <input
                    type="text"
                    value={editingProduct.storageLocation}
                    onChange={(e) => setEditingProduct({ ...editingProduct, storageLocation: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-medium cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold cursor-pointer">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingProductId)}
        title="Delete Finished Product"
        message="Are you sure you want to delete this finished product record from Firestore?"
        confirmText="Delete Product"
        isDangerous={true}
        isLoading={isSubmitting}
        onClose={() => setDeletingProductId(null)}
        onConfirm={async () => {
          if (!deletingProductId) return;
          setIsSubmitting(true);
          try {
            await deleteProduct(deletingProductId);
            setDeletingProductId(null);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
};
