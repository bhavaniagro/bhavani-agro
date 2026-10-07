import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  Filter, 
  Calendar,
  Layers,
  TrendingUp,
  Boxes,
  Factory,
  Truck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ReportsAnalyticsModule: React.FC = () => {
  const { 
    salesOrders, 
    invoices, 
    productionBatches, 
    rawMaterials, 
    products, 
    dispatches, 
    expenses 
  } = useERP();

  const [activeReport, setActiveReport] = useState<'sales' | 'production' | 'inventory' | 'finance' | 'dispatch'>('sales');

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let cell = row[header] ?? '';
          if (typeof cell === 'string' && cell.includes(',')) cell = `"${cell}"`;
          return cell;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadActiveReport = () => {
    if (activeReport === 'sales') {
      const exportData = invoices.map(i => ({
        InvoiceNumber: i.invoiceNumber,
        Customer: i.customerName,
        Date: i.invoiceDate,
        Product: i.productName,
        QuantityMT: i.quantityMT,
        TaxableValue: i.taxableValue,
        TotalTax: i.totalTax,
        TotalAmount: i.totalInvoiceAmount,
        PaymentStatus: i.paymentStatus
      }));
      exportToCSV(exportData, 'Bhavani_Sales_Register');
    } else if (activeReport === 'production') {
      const exportData = productionBatches.map(b => ({
        BatchNumber: b.batchNumber,
        Product: b.productName,
        Date: b.productionDate,
        QuantityProducedMT: b.quantityProducedMT,
        QCStatus: b.qcStatus,
        StandardCostPerMT: b.standardCostPerMT,
        ActualCostPerMT: b.actualCostPerMT,
        StorageLocation: b.storageLocation
      }));
      exportToCSV(exportData, 'Bhavani_Production_Batches');
    } else if (activeReport === 'inventory') {
      const exportData = products.map(p => ({
        Product: p.productName,
        SKU: p.sku,
        CurrentStockMT: p.currentStockMT,
        ReservedStockMT: p.reservedStockMT,
        AvailableToSellMT: p.currentStockMT - p.reservedStockMT,
        CostPerMT: p.standardCostPerMT,
        TotalValuation: p.currentStockMT * p.standardCostPerMT
      }));
      exportToCSV(exportData, 'Bhavani_Inventory_Valuation');
    } else if (activeReport === 'finance') {
      const exportData = expenses.map(e => ({
        VoucherNumber: e.expenseNumber,
        Category: e.category,
        Date: e.date,
        Amount: e.amount,
        PaidFrom: e.paidFromAccount,
        Vendor: e.vendorName,
        Description: e.description
      }));
      exportToCSV(exportData, 'Bhavani_Expense_Register');
    } else if (activeReport === 'dispatch') {
      const exportData = dispatches.map(d => ({
        ChallanNumber: d.dispatchNumber,
        Customer: d.customerName,
        Product: d.productName,
        BatchNumber: d.batchNumber,
        QuantityMT: d.quantityMT,
        VehicleNumber: d.vehicleNumber,
        EWayBill: d.eWayBillNumber,
        Transporter: d.transporterName,
        Date: d.dispatchDate,
        Status: d.status
      }));
      exportToCSV(exportData, 'Bhavani_Dispatch_Logistics');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Executive Reports &amp; Data Analytics
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Excel / CSV Export Engine
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit-ready sales registers, batch yield reports, stock ledgers, manufacturing costing sheets, and logistics reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadActiveReport}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Active Table to CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveReport('sales')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeReport === 'sales' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Sales Register
          </button>
          <button
            onClick={() => setActiveReport('production')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeReport === 'production' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Production &amp; Yield Report
          </button>
          <button
            onClick={() => setActiveReport('inventory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeReport === 'inventory' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Stock Valuation Report
          </button>
          <button
            onClick={() => setActiveReport('finance')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeReport === 'finance' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Expense Audit Report
          </button>
          <button
            onClick={() => setActiveReport('dispatch')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeReport === 'dispatch' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Dispatch &amp; Freight Report
          </button>
        </div>
      </div>

      {/* Report Data Preview Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          {activeReport === 'sales' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-right">Qty (MT)</th>
                  <th className="p-3 text-right">Taxable</th>
                  <th className="p-3 text-right font-bold text-neutral-900">Total Invoice (₹)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {invoices.map(i => (
                  <tr key={i.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-neutral-900">{i.invoiceNumber}</td>
                    <td className="p-3 font-semibold text-neutral-900">{i.customerName}</td>
                    <td className="p-3 text-neutral-600">{i.invoiceDate}</td>
                    <td className="p-3 text-neutral-800">{i.productName}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{i.quantityMT} MT</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{i.taxableValue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">₹{i.totalInvoiceAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        i.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {i.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'production' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Batch #</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Mfg Date</th>
                  <th className="p-3 text-right">Qty (MT)</th>
                  <th className="p-3 text-right">Std Cost</th>
                  <th className="p-3 text-right">Actual Cost</th>
                  <th className="p-3">QC Status</th>
                  <th className="p-3">Warehouse Bay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {productionBatches.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-emerald-800">{b.batchNumber}</td>
                    <td className="p-3 font-semibold text-neutral-900">{b.productName}</td>
                    <td className="p-3 text-neutral-600">{b.productionDate}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold">{b.quantityProducedMT} MT</td>
                    <td className="p-3 text-right font-mono tabular-nums">₹{b.standardCostPerMT}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-emerald-700 font-bold">₹{b.actualCostPerMT}</td>
                    <td className="p-3 font-medium text-emerald-700">{b.qcStatus}</td>
                    <td className="p-3 text-neutral-600">{b.storageLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'inventory' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Physical Stock</th>
                  <th className="p-3 text-right">Reserved</th>
                  <th className="p-3 text-right font-bold text-emerald-800">Available to Sell</th>
                  <th className="p-3 text-right font-bold">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-semibold text-neutral-900">{p.productName}</td>
                    <td className="p-3 font-mono text-neutral-600">{p.sku}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{p.currentStockMT} MT</td>
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
          )}

          {activeReport === 'finance' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Voucher #</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Vendor / Payee</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right font-bold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-neutral-900">{e.expenseNumber}</td>
                    <td className="p-3 font-medium text-neutral-800">{e.category}</td>
                    <td className="p-3 text-neutral-600">{e.date}</td>
                    <td className="p-3 text-neutral-900">{e.vendorName}</td>
                    <td className="p-3 text-neutral-600 max-w-xs">{e.description}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      ₹{e.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'dispatch' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Challan #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Product &amp; Batch</th>
                  <th className="p-3 text-right">Quantity (MT)</th>
                  <th className="p-3">Vehicle #</th>
                  <th className="p-3">E-Way Bill</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {dispatches.map(d => (
                  <tr key={d.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-neutral-900">{d.dispatchNumber}</td>
                    <td className="p-3 font-semibold text-neutral-900">{d.customerName}</td>
                    <td className="p-3 text-neutral-800">{d.productName} ({d.batchNumber})</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold">{d.quantityMT} MT</td>
                    <td className="p-3 font-mono text-emerald-800 font-bold">{d.vehicleNumber}</td>
                    <td className="p-3 font-mono text-neutral-600">{d.eWayBillNumber}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
