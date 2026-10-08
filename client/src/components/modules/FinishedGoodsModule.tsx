import React, { useState } from 'react';
import { 
  PackageCheck, 
  Boxes, 
  Search, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const FinishedGoodsModule: React.FC = () => {
  const { 
    products, 
    productionBatches, 
    setActiveModule,
    setIsDemoRunnerOpen
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');

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
                <th className="p-3 text-right">Action</th>
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
                      <button
                        onClick={() => setActiveModule('Production')}
                        className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 cursor-pointer"
                      >
                        Plan Production
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
