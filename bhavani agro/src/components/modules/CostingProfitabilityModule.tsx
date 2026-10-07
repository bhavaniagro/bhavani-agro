import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Layers, 
  PieChart, 
  ArrowUpRight,
  Sparkles,
  Download
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const CostingProfitabilityModule: React.FC = () => {
  const { products, boms, customers, salesOrders } = useERP();
  const [activeTab, setActiveTab] = useState<'products' | 'costing_breakdown' | 'customers'>('products');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Manufacturing Costing &amp; Profitability Analysis
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Standard vs Actual Unit Economics
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            <strong>Manufacturing Formula:</strong> Raw Material Cost + Labour + Electricity + Packaging + Overheads = Cost / MT &amp; Cost / 50kg Bag.
          </p>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Product-Wise Margins &amp; ROI
          </button>
          <button
            onClick={() => setActiveTab('costing_breakdown')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'costing_breakdown' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Standard vs Actual Cost per MT / Bag
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'customers' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Customer-Wise Profit Contribution
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCT-WISE PROFIT MARGINS */}
      {activeTab === 'products' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Product Name</th>
                <th className="p-3 text-right">Production Cost (₹/MT)</th>
                <th className="p-3 text-right">Selling Price (₹/MT)</th>
                <th className="p-3 text-right font-bold text-neutral-900">Gross Margin (₹/MT)</th>
                <th className="p-3 text-right">Cost / 50kg Bag</th>
                <th className="p-3 text-right font-bold text-emerald-800">Margin %</th>
                <th className="p-3 text-center">Profitability Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map(p => {
                const marginPerMT = p.sellingPricePerMT - p.standardCostPerMT;
                const marginPct = ((marginPerMT / p.sellingPricePerMT) * 100).toFixed(1);
                const costPerBag = (p.standardCostPerMT / 20).toFixed(1); // 20 bags in 1 MT

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{p.productName}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{p.category} · HSN {p.hsnCode}</div>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-600">
                      ₹{p.standardCostPerMT.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-900 font-semibold">
                      ₹{p.sellingPricePerMT.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                      ₹{marginPerMT.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-neutral-600">
                      ₹{costPerBag} / Bag
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-emerald-700">
                      {marginPct}%
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        Number(marginPct) > 30 ? 'bg-emerald-100 text-emerald-800' :
                        Number(marginPct) > 20 ? 'bg-blue-100 text-blue-800' :
                        'bg-neutral-100 text-neutral-700'
                      }`}>
                        {Number(marginPct) > 30 ? 'High Margin' : 'Standard Commercial'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: DETAILED COSTING BREAKDOWN */}
      {activeTab === 'costing_breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boms.map(bom => {
            const prod = products.find(p => p.id === bom.productId) || products[0];
            const margin = prod.sellingPricePerMT - bom.totalStandardCostPerMT;

            return (
              <div key={bom.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-3">
                <div className="flex justify-between items-start border-b border-neutral-100 pb-2">
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm">{bom.productName}</h3>
                    <div className="text-[11px] text-neutral-500 font-mono">BOM: {bom.version}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-emerald-700">
                      {(((margin) / prod.sellingPricePerMT) * 100).toFixed(1)}% Margin
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">1. Raw Material Inputs (Ores + Binders):</span>
                    <span className="font-mono font-semibold text-neutral-900">₹{bom.totalRawMaterialCostPerMT}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">2. Plant Labour &amp; Line Feeding:</span>
                    <span className="font-mono font-semibold text-neutral-900">₹{bom.labourCostPerMT}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">3. HT Electricity &amp; Dryer Diesel:</span>
                    <span className="font-mono font-semibold text-neutral-900">₹{bom.powerElectricityCostPerMT}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">4. 50kg HDPE Woven Bags ({bom.packagingBagsPerMT} bags):</span>
                    <span className="font-mono font-semibold text-neutral-900">₹{bom.packagingCostPerMT}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-600">5. Factory Overheads &amp; Maintenance:</span>
                    <span className="font-mono font-semibold text-neutral-900">₹{bom.overheadCostPerMT}</span>
                  </div>

                  <div className="flex justify-between pt-2 font-bold text-neutral-900 text-xs border-t border-neutral-200">
                    <span>Total Standard Production Cost / MT:</span>
                    <span className="font-mono">₹{bom.totalStandardCostPerMT.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[10px]">
                    <span>Cost per 50kg Bag:</span>
                    <span className="font-mono font-bold text-neutral-800">₹{(bom.totalStandardCostPerMT / bom.packagingBagsPerMT).toFixed(1)} / bag</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: CUSTOMER-WISE PROFIT CONTRIBUTION */}
      {activeTab === 'customers' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Customer Firm Name</th>
                <th className="p-3">Location &amp; Type</th>
                <th className="p-3 text-right">Lifetime Sales (₹)</th>
                <th className="p-3 text-right">Est. Gross Margin (28%)</th>
                <th className="p-3 text-right font-bold text-neutral-900">Net Profit Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map(c => {
                const grossProfit = c.totalSales * 0.285;
                const netProfit = c.totalSales * 0.192;

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-900">{c.customerName}</td>
                    <td className="p-3 text-neutral-600">{c.state} · {c.customerType}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold">
                      ₹{c.totalSales.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-emerald-700">
                      ₹{Math.round(grossProfit).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      ₹{Math.round(netProfit).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
