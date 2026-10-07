import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Printer, 
  Search, 
  CheckCircle2, 
  MapPin, 
  FileText, 
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { DispatchStatus } from '../../types/erp';

export const DispatchLogisticsModule: React.FC = () => {
  const { 
    dispatches, 
    vehicles, 
    updateDispatchStatus, 
    generateInvoiceFromDispatch, 
    setPrintableDoc,
    setActiveModule 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'challans' | 'vehicles'>('challans');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDispatches = dispatches.filter(d => 
    d.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses: DispatchStatus[] = ['Ready', 'Loaded', 'Dispatched', 'In Transit', 'Delivered'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Dispatch, Logistics &amp; Transport Fleet
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Delivery Challans &amp; E-Way Bills
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Issue delivery challans, allocate transport trucks, track transit statuses, and automatically generate GST Tax Invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModule('CRM & Sales')}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap"
          >
            + Dispatch from Sales Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => setActiveTab('challans')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'challans' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Delivery Challans ({dispatches.length})
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'vehicles' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Vehicle &amp; Transporter Fleet ({vehicles.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search challan, vehicle, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-60 outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* TAB 1: DELIVERY CHALLANS */}
      {activeTab === 'challans' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Challan # &amp; Date</th>
                  <th className="p-3">Customer &amp; Destination</th>
                  <th className="p-3">Product &amp; Batch</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3">Vehicle &amp; Transporter</th>
                  <th className="p-3">E-Way Bill &amp; LR</th>
                  <th className="p-3">Dispatch Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredDispatches.map(d => (
                  <tr key={d.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">{d.dispatchNumber}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{d.dispatchDate} · {d.orderNumber}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-neutral-900">{d.customerName}</div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-[180px]">{d.destination}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-neutral-900">{d.productName}</div>
                      <div className="text-[10px] text-emerald-800 font-mono">Batch: {d.batchNumber}</div>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      <div className="font-bold text-neutral-900">{d.quantityMT} MT</div>
                      <div className="text-[10px] text-neutral-500">{d.bagsCount} Bags</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-emerald-800">{d.vehicleNumber}</div>
                      <div className="text-[11px] text-neutral-500">{d.transporterName}</div>
                      <div className="text-[10px] text-neutral-400">Driver: {d.driverName}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      <div className="text-neutral-900 font-medium">E-Way: {d.eWayBillNumber}</div>
                      <div className="text-neutral-500">LR: {d.lrNumber}</div>
                    </td>
                    <td className="p-3">
                      <select
                        value={d.status}
                        onChange={(e) => updateDispatchStatus(d.id, e.target.value as DispatchStatus)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded uppercase tracking-wider border cursor-pointer ${
                          d.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          d.status === 'In Transit' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          d.status === 'Dispatched' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          'bg-neutral-50 text-neutral-700 border-neutral-300'
                        }`}
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setPrintableDoc({ type: 'challan', data: d })}
                        className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] text-neutral-700 font-medium cursor-pointer"
                        title="Print Delivery Challan"
                      >
                        Print Challan
                      </button>

                      {!d.invoiceNumber ? (
                        <button
                          onClick={() => generateInvoiceFromDispatch(d.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer shadow-2xs"
                        >
                          + Generate GST Invoice
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                          {d.invoiceNumber}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VEHICLE FLEET MASTER */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div>
                  <span className="font-mono font-bold text-sm text-neutral-900">{v.vehicleNumber}</span>
                  <div className="text-[11px] text-neutral-500">{v.vehicleType}</div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                  v.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                  v.status === 'On Trip' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {v.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-neutral-500">Transporter:</span>
                  <div className="font-semibold text-neutral-900">{v.transporterName}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Driver &amp; Mobile:</span>
                  <div className="text-neutral-900 font-medium">{v.driverName} ({v.driverPhone})</div>
                </div>
                <div>
                  <span className="text-neutral-500">Payload Capacity:</span>
                  <div className="font-mono font-bold text-neutral-800">{v.capacityMT} MT</div>
                </div>
                <div>
                  <span className="text-neutral-500">Contract Rate:</span>
                  <div className="font-mono text-neutral-800">₹{v.freightRatePerMTPerKM} / MT / KM</div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-100 flex justify-between">
                <span>PUC Expiry: {v.pucExpiry}</span>
                <span>Fitness Expiry: {v.fitnessExpiry}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
