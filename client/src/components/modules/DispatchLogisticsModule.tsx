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
  ShieldCheck,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { DispatchChallan, VehicleMaster, DispatchStatus } from '../../types/erp';

export const DispatchLogisticsModule: React.FC = () => {
  const { 
    dispatches, 
    vehicles, 
    updateDispatchStatus,
    updateDispatch,
    deleteDispatch,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    generateInvoiceFromDispatch, 
    setPrintableDoc,
    setActiveModule 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'challans' | 'vehicles'>('challans');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit/Delete Dispatch State
  const [editingDispatch, setEditingDispatch] = useState<DispatchChallan | null>(null);
  const [deletingDispatch, setDeletingDispatch] = useState<DispatchChallan | null>(null);
  const [editTransporterName, setEditTransporterName] = useState('');
  const [editDriverName, setEditDriverName] = useState('');
  const [editDriverMobile, setEditDriverMobile] = useState('');
  const [editVehicleNumber, setEditVehicleNumber] = useState('');
  const [editDestination, setEditDestination] = useState('');
  const [editEWayBill, setEditEWayBill] = useState('');
  const [editLRNumber, setEditLRNumber] = useState('');

  // Edit/Delete/Add Vehicle State
  const [editingVehicle, setEditingVehicle] = useState<VehicleMaster | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleMaster | null>(null);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vehNumber, setVehNumber] = useState('');
  const [vehType, setVehType] = useState('');
  const [vehTransporter, setVehTransporter] = useState('');
  const [vehDriver, setVehDriver] = useState('');
  const [vehPhone, setVehPhone] = useState('');
  const [vehCapacity, setVehCapacity] = useState(30);

  const filteredDispatches = dispatches.filter(d => 
    d.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses: DispatchStatus[] = ['Ready', 'Loaded', 'Dispatched', 'In Transit', 'Delivered'];

  // Dispatch Handlers
  const openEditDispatchModal = (d: DispatchChallan) => {
    setEditingDispatch(d);
    setEditTransporterName(d.transporterName);
    setEditDriverName(d.driverName);
    setEditDriverMobile(d.driverMobile);
    setEditVehicleNumber(d.vehicleNumber);
    setEditDestination(d.destination);
    setEditEWayBill(d.eWayBillNumber);
    setEditLRNumber(d.lrNumber);
  };

  const handleSaveDispatchEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDispatch) return;
    await updateDispatch(editingDispatch.id, {
      transporterName: editTransporterName,
      driverName: editDriverName,
      driverMobile: editDriverMobile,
      vehicleNumber: editVehicleNumber,
      destination: editDestination,
      eWayBillNumber: editEWayBill,
      lrNumber: editLRNumber
    });
    setEditingDispatch(null);
  };

  const handleDeleteDispatchConfirm = async () => {
    if (!deletingDispatch) return;
    await deleteDispatch(deletingDispatch.id);
    setDeletingDispatch(null);
  };

  // Vehicle Handlers
  const openEditVehicleModal = (v: VehicleMaster) => {
    setEditingVehicle(v);
    setVehNumber(v.vehicleNumber);
    setVehType(v.vehicleType);
    setVehTransporter(v.transporterName);
    setVehDriver(v.driverName);
    setVehPhone(v.driverPhone);
    setVehCapacity(v.capacityMT);
  };

  const handleSaveVehicleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    await updateVehicle(editingVehicle.id, {
      vehicleNumber: vehNumber,
      vehicleType: vehType as any,
      transporterName: vehTransporter,
      driverName: vehDriver,
      driverPhone: vehPhone,
      capacityMT: Number(vehCapacity)
    });
    setEditingVehicle(null);
  };

  const handleDeleteVehicleConfirm = async () => {
    if (!deletingVehicle) return;
    await deleteVehicle(deletingVehicle.id);
    setDeletingVehicle(null);
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVehicle({
      vehicleNumber: vehNumber,
      vehicleType: (vehType || '10-Wheeler Truck (20 MT)') as any,
      transporterName: vehTransporter,
      driverName: vehDriver,
      driverPhone: vehPhone,
      capacityMT: Number(vehCapacity),
      freightRatePerMTPerKM: 4.5,
      pucExpiry: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      fitnessExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      insuranceExpiry: new Date(Date.now() + 200 * 86400000).toISOString().split('T')[0],
      status: 'Available'
    });
    setShowAddVehicleModal(false);
  };

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
                  <th className="p-3 text-center">Actions</th>
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
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditDispatchModal(d)}
                          className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          title="Edit Dispatch"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingDispatch(d)}
                          className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                          title="Delete Dispatch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setVehNumber('');
                setVehType('10-Wheeler Tipper');
                setVehTransporter('');
                setVehDriver('');
                setVehPhone('');
                setVehCapacity(30);
                setShowAddVehicleModal(true);
              }}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Vehicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-neutral-900">{v.vehicleNumber}</span>
                    <div className="text-[11px] text-neutral-500">{v.vehicleType}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                      v.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      v.status === 'On Trip' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                    <button
                      onClick={() => openEditVehicleModal(v)}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-neutral-900 cursor-pointer"
                      title="Edit Vehicle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingVehicle(v)}
                      className="p-1 hover:bg-rose-50 rounded text-neutral-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
        </div>
      )}

      {/* EDIT DISPATCH MODAL */}
      {editingDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                Edit Dispatch ({editingDispatch.dispatchNumber})
              </h3>
              <button onClick={() => setEditingDispatch(null)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatchEdit} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Transporter Name</label>
                <input
                  type="text"
                  value={editTransporterName}
                  onChange={(e) => setEditTransporterName(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={editDriverName}
                    onChange={(e) => setEditDriverName(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Driver Mobile</label>
                  <input
                    type="text"
                    value={editDriverMobile}
                    onChange={(e) => setEditDriverMobile(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Vehicle Truck No.</label>
                <input
                  type="text"
                  value={editVehicleNumber}
                  onChange={(e) => setEditVehicleNumber(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Destination Address</label>
                <input
                  type="text"
                  value={editDestination}
                  onChange={(e) => setEditDestination(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">E-Way Bill Number</label>
                  <input
                    type="text"
                    value={editEWayBill}
                    onChange={(e) => setEditEWayBill(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">LR Number</label>
                  <input
                    type="text"
                    value={editLRNumber}
                    onChange={(e) => setEditLRNumber(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingDispatch(null)}
                  className="px-3.5 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT VEHICLE MODAL */}
      {(showAddVehicleModal || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingVehicle ? `Edit Vehicle (${editingVehicle.vehicleNumber})` : 'Register New Transport Vehicle'}
              </h3>
              <button
                onClick={() => {
                  setShowAddVehicleModal(false);
                  setEditingVehicle(null);
                }}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingVehicle ? handleSaveVehicleEdit : handleCreateVehicle} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Vehicle Truck No.</label>
                <input
                  type="text"
                  value={vehNumber}
                  onChange={(e) => setVehNumber(e.target.value)}
                  required
                  placeholder="GJ-04-E-8819"
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={vehType}
                    onChange={(e) => setVehType(e.target.value)}
                    required
                    placeholder="10-Wheeler Tipper"
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Payload Capacity (MT)</label>
                  <input
                    type="number"
                    value={vehCapacity}
                    onChange={(e) => setVehCapacity(Number(e.target.value))}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Transporter Agency</label>
                <input
                  type="text"
                  value={vehTransporter}
                  onChange={(e) => setVehTransporter(e.target.value)}
                  required
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={vehDriver}
                    onChange={(e) => setVehDriver(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={vehPhone}
                    onChange={(e) => setVehPhone(e.target.value)}
                    required
                    className="w-full border border-neutral-300 rounded p-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddVehicleModal(false);
                    setEditingVehicle(null);
                  }}
                  className="px-3.5 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded cursor-pointer"
                >
                  {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODALS */}
      <ConfirmModal
        isOpen={!!deletingDispatch}
        title="Delete Delivery Challan"
        message={`Are you sure you want to delete challan ${deletingDispatch?.dispatchNumber}?`}
        confirmText="Delete Challan"
        onConfirm={handleDeleteDispatchConfirm}
        onClose={() => setDeletingDispatch(null)}
      />

      <ConfirmModal
        isOpen={!!deletingVehicle}
        title="Delete Vehicle"
        message={`Are you sure you want to delete vehicle ${deletingVehicle?.vehicleNumber}?`}
        confirmText="Delete Vehicle"
        onConfirm={handleDeleteVehicleConfirm}
        onClose={() => setDeletingVehicle(null)}
      />
    </div>
  );
};
