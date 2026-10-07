import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Boxes,
  Factory,
  PackageCheck,
  Truck,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const DashboardModule: React.FC = () => {
  const {
    salesOrders,
    invoices,
    suppliers,
    rawMaterials,
    products,
    productionOrders,
    productionBatches,
    dispatches,
    expenses,
    alerts,
    setActiveModule,
    setIsDemoRunnerOpen,
    setIsQuickAddOpen,
    setQuickAddType
  } = useERP();

  // Calculations for Top 12 KPIs
  const todaySales = invoices
    .filter(i => i.invoiceDate >= '2026-09-24')
    .reduce((acc, curr) => acc + curr.totalInvoiceAmount, 0);

  const monthlySales = invoices
    .reduce((acc, curr) => acc + curr.totalInvoiceAmount, 0);

  const pendingReceivables = invoices
    .reduce((acc, curr) => acc + curr.balanceAmount, 0);

  const pendingPayables = suppliers
    .reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  const totalRawMaterialMT = rawMaterials
    .filter(r => r.unit === 'MT')
    .reduce((acc, curr) => acc + curr.currentStock, 0);

  const totalFinishedGoodsMT = products
    .reduce((acc, curr) => acc + curr.currentStockMT, 0);

  const productionTodayMT = productionBatches
    .filter(b => b.productionDate >= '2026-09-26')
    .reduce((acc, curr) => acc + curr.quantityProducedMT, 0);

  const productionThisMonthMT = productionBatches
    .reduce((acc, curr) => acc + curr.quantityProducedMT, 0);

  const pendingProductionOrders = productionOrders
    .filter(p => p.status === 'Planned' || p.status === 'In Production' || p.status === 'Material Ready')
    .length;

  const pendingDispatches = dispatches
    .filter(d => d.status === 'Ready' || d.status === 'Loaded' || d.status === 'In Transit')
    .length;

  const lowStockItems = rawMaterials
    .filter(r => r.currentStock <= r.reorderLevel)
    .concat(products.filter(p => p.currentStockMT <= p.minimumStockMT) as any)
    .length;

  const monthlyExpenses = expenses
    .reduce((acc, curr) => acc + curr.amount, 0);

  const kpis = [
    { title: "Today's Sales", value: `₹${todaySales.toLocaleString('en-IN')}`, sub: '2 dispatches billed', icon: TrendingUp, color: 'text-emerald-700' },
    { title: "Monthly Sales", value: `₹${monthlySales.toLocaleString('en-IN')}`, sub: '15 orders billed', icon: DollarSign, color: 'text-neutral-900' },
    { title: 'Pending Receivables', value: `₹${pendingReceivables.toLocaleString('en-IN')}`, sub: '4 customer invoices', icon: Receipt, color: 'text-amber-800' },
    { title: 'Pending Payables', value: `₹${pendingPayables.toLocaleString('en-IN')}`, sub: '8 mine suppliers', icon: Clock, color: 'text-neutral-700' },
    { title: 'Raw Material Stock', value: `${totalRawMaterialMT.toFixed(1)} MT`, sub: 'Bentonite, Dolomite, Ore', icon: Boxes, color: 'text-neutral-900' },
    { title: 'Finished Goods Stock', value: `${totalFinishedGoodsMT.toFixed(1)} MT`, sub: 'Ready in warehouse', icon: PackageCheck, color: 'text-emerald-700' },
    { title: 'Production Today', value: `${productionTodayMT.toFixed(1)} MT`, sub: 'Granulation Line 1', icon: Factory, color: 'text-neutral-900' },
    { title: 'Production Month', value: `${productionThisMonthMT.toFixed(1)} MT`, sub: 'Avg efficiency 98.1%', icon: Factory, color: 'text-neutral-900' },
    { title: 'Pending Prod. Orders', value: `${pendingProductionOrders}`, sub: 'In pipeline & material check', icon: AlertTriangle, color: 'text-amber-700' },
    { title: 'Pending Dispatches', value: `${pendingDispatches}`, sub: 'Awaiting truck loading', icon: Truck, color: 'text-neutral-900' },
    { title: 'Low Stock Alert Items', value: `${lowStockItems}`, sub: 'Requires PO / batch run', icon: AlertTriangle, color: 'text-rose-700' },
    { title: 'Monthly Expenses', value: `₹${monthlyExpenses.toLocaleString('en-IN')}`, sub: 'Power, diesel, wages', icon: Receipt, color: 'text-neutral-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Plant Operations &amp; Executive Dashboard
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              FY 2026-27
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Bhavani Agro &amp; Minerals · Live production, inventory, dispatches, receivables and cash flow summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoRunnerOpen(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 21-Step Demo</span>
          </button>
          <button
            onClick={() => {
              setQuickAddType('Sales Order');
              setIsQuickAddOpen(true);
            }}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            + New Sales Order
          </button>
        </div>
      </div>

      {/* 12 Top KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white border border-neutral-200 rounded-lg p-3 hover:border-neutral-300 transition-colors">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[11px] font-medium text-neutral-500 truncate">{kpi.title}</span>
                <Icon className="w-3.5 h-3.5 shrink-0" />
              </div>
              <div className={`text-base font-bold font-mono tabular-nums mt-1.5 ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-neutral-400 truncate mt-0.5">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sales & Production Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales by Product & Orders Progress */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Product Sales &amp; Stock Availability
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Manufacturing buffer vs active demand</p>
              </div>
              <button
                onClick={() => setActiveModule('CRM & Sales')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>All Orders</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100 mt-2">
              {products.map(prod => {
                const isLow = prod.currentStockMT <= prod.minimumStockMT;
                return (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex-1 truncate">
                      <div className="font-semibold text-neutral-900 truncate">{prod.productName}</div>
                      <div className="text-[11px] text-neutral-500">
                        Price: ₹{prod.sellingPricePerMT.toLocaleString('en-IN')}/MT · Cost: ₹{prod.standardCostPerMT.toLocaleString('en-IN')}/MT
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono tabular-nums font-semibold text-neutral-900">
                        {prod.currentStockMT.toFixed(1)} MT
                      </div>
                      <div className={`text-[10px] font-medium ${isLow ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {isLow ? `Low stock (Min: ${prod.minimumStockMT} MT)` : 'Buffer optimal'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Production Lines Status & Batches */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Active Production Orders &amp; Line Allocation
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Granulation, Pulverizing &amp; Bio-Fermentation</p>
              </div>
              <button
                onClick={() => setActiveModule('Production')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Production Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100 mt-2">
              {productionOrders.slice(0, 4).map(po => (
                <div key={po.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-neutral-900">{po.productionOrderNumber}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 font-mono text-neutral-600">
                        {po.productionLine}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">
                      {po.productName} · Target: <span className="font-mono font-medium">{po.targetQuantityMT} MT</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                      po.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      po.status === 'In Production' ? 'bg-amber-100 text-amber-800' :
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {po.status}
                    </span>
                    <div className="text-[10px] text-neutral-400 mt-1">Sup: {po.supervisor.split(' ')[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Receivables, Dispatch & Live Alerts */}
        <div className="space-y-6">
          {/* Actionable Plant Alerts */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Action Required Today</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">{alerts.length} alerts</span>
            </div>

            <div className="space-y-2.5 mt-3">
              {alerts.slice(0, 4).map(al => (
                <div 
                  key={al.id} 
                  className={`p-2.5 rounded-lg border text-xs ${
                    al.type === 'critical' ? 'bg-rose-50/50 border-rose-200' :
                    al.type === 'warning' ? 'bg-amber-50/50 border-amber-200' :
                    'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`font-semibold text-[11px] ${
                      al.type === 'critical' ? 'text-rose-900' :
                      al.type === 'warning' ? 'text-amber-900' :
                      'text-neutral-900'
                    }`}>
                      {al.title}
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0">{al.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{al.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Receivables Aging Snapshot */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Customer Receivables
              </h3>
              <button
                onClick={() => setActiveModule('Finance & Accounts')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Ledger
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="text-neutral-600">Current (0–30 Days):</span>
                <span className="font-mono font-semibold text-neutral-900">₹4,89,846</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="text-neutral-600">31–60 Days:</span>
                <span className="font-mono font-semibold text-neutral-900">₹3,81,938</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-100">
                <span className="text-rose-700 font-medium">Overdue (60+ Days):</span>
                <span className="font-mono font-bold text-rose-700">₹2,33,500</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-neutral-900 text-xs">
                <span>Total Outstanding:</span>
                <span className="font-mono">₹{pendingReceivables.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Dispatch Today */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Recent Dispatches &amp; Transit
              </h3>
              <button
                onClick={() => setActiveModule('Dispatch & Logistics')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Track All
              </button>
            </div>

            <div className="divide-y divide-neutral-100 mt-2">
              {dispatches.slice(0, 3).map(d => (
                <div key={d.id} className="py-2 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="font-mono text-neutral-900">{d.dispatchNumber}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                      d.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      d.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-neutral-100 text-neutral-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">{d.customerName}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5 flex justify-between">
                    <span>{d.quantityMT} MT · {d.vehicleNumber}</span>
                    <span className="font-mono">E-Way: {d.eWayBillNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
