import React, { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Machinery } from '../../types/erp';

export const MaintenanceModule: React.FC = () => {
  const { machinery, addMachinery, updateMachinery, deleteMachinery } = useERP();
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machinery | null>(null);
  const [deletingMachineId, setDeletingMachineId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('Granulation & Drying');
  const [capacity, setCapacity] = useState('15 MT/hr');
  const [installDate, setInstallDate] = useState('2021-04-15');
  const [freqDays, setFreqDays] = useState(30);

  const totalMaintenanceCost = machinery.reduce((acc, curr) => acc + curr.totalMaintenanceCostThisYear, 0);

  const handleCreateMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    const nextDue = new Date(Date.now() + freqDays * 86400000).toISOString().split('T')[0];
    await addMachinery({
      machineCode: code || `MCH-2609-0${machinery.length + 1}`,
      machineName: name,
      department: (dept || 'Granulation') as any,
      capacityRating: capacity,
      currentStatus: 'Operational',
      lastMaintenanceDate: now,
      nextMaintenanceDate: nextDue,
      installationDate: installDate,
      maintenanceFrequencyDays: Number(freqDays),
      breakdownCountThisYear: 0,
      totalMaintenanceCostThisYear: 0
    });
    setShowAddModal(false);
    setName('');
    setCode('');
  };

  const handleUpdateMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMachine) return;
    await updateMachinery(editingMachine.id, editingMachine);
    setEditingMachine(null);
  };

  const handleDeleteMachineryConfirm = async () => {
    if (!deletingMachineId) return;
    await deleteMachinery(deletingMachineId);
    setDeletingMachineId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Machinery &amp; Preventive Maintenance
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalMaintenanceCost.toLocaleString('en-IN')} YTD Maintenance
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pelletizer granulators, Raymond roller mills, bio-reactors, bagging lines, preventive inspection schedules &amp; downtime prevention.
          </p>
        </div>

        <button
          onClick={() => {
            setCode(`MCH-2609-0${machinery.length + 1}`);
            setShowAddModal(true);
          }}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Machine</span>
        </button>
      </div>

      {/* Machinery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machinery.map(m => (
          <div key={m.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-3 shadow-2xs">
            <div className="flex items-start justify-between border-b border-neutral-100 pb-2">
              <div>
                <span className="font-mono text-emerald-800 font-bold">{m.machineCode}</span>
                <h3 className="font-bold text-neutral-900 text-sm mt-0.5">{m.machineName}</h3>
                <div className="text-[11px] text-neutral-500">{m.department} Section · Rating: {m.capacityRating}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                  m.currentStatus === 'Operational' ? 'bg-emerald-100 text-emerald-800' :
                  m.currentStatus === 'Under Maintenance' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {m.currentStatus}
                </span>
                <button
                  onClick={() => setEditingMachine(m)}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer"
                  title="Edit Machine"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingMachineId(m.id)}
                  className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                  title="Delete Machine"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-neutral-500">Installation Date:</span>
                <div className="font-medium text-neutral-900">{m.installationDate}</div>
              </div>
              <div>
                <span className="text-neutral-500">Service Frequency:</span>
                <div className="font-medium text-neutral-900">Every {m.maintenanceFrequencyDays} Days</div>
              </div>
              <div>
                <span className="text-neutral-500">Last Serviced:</span>
                <div className="font-mono font-medium text-neutral-800">{m.lastMaintenanceDate}</div>
              </div>
              <div>
                <span className="text-neutral-500">Next Due Date:</span>
                <div className="font-mono font-bold text-amber-800">{m.nextMaintenanceDate}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
              <div className="text-neutral-500">
                Breakdowns this year: <span className="font-mono font-bold text-neutral-900">{m.breakdownCountThisYear}</span>
              </div>
              <div className="text-neutral-700 font-mono">
                Maintenance Cost: <span className="font-bold text-neutral-900">₹{m.totalMaintenanceCostThisYear.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MACHINE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Add New Machine / Equipment</h3>
            <form onSubmit={handleCreateMachinery} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Machine Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Machine Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Capacity Rating</label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Installation Date</label>
                  <input
                    type="date"
                    value={installDate}
                    onChange={(e) => setInstallDate(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Service Interval (Days)</label>
                  <input
                    type="number"
                    value={freqDays}
                    onChange={(e) => setFreqDays(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Add Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MACHINE MODAL */}
      {editingMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Edit Machine {editingMachine.machineCode}</h3>
            <form onSubmit={handleUpdateMachinery} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Machine Name</label>
                <input
                  type="text"
                  value={editingMachine.machineName}
                  onChange={(e) => setEditingMachine({ ...editingMachine, machineName: e.target.value })}
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Status</label>
                  <select
                    value={editingMachine.currentStatus}
                    onChange={(e) => setEditingMachine({ ...editingMachine, currentStatus: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Breakdown">Breakdown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Capacity Rating</label>
                  <input
                    type="text"
                    value={editingMachine.capacityRating}
                    onChange={(e) => setEditingMachine({ ...editingMachine, capacityRating: e.target.value })}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Breakdown Count</label>
                  <input
                    type="number"
                    value={editingMachine.breakdownCountThisYear}
                    onChange={(e) => setEditingMachine({ ...editingMachine, breakdownCountThisYear: Number(e.target.value) })}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Maintenance Cost (₹)</label>
                  <input
                    type="number"
                    value={editingMachine.totalMaintenanceCostThisYear}
                    onChange={(e) => setEditingMachine({ ...editingMachine, totalMaintenanceCostThisYear: Number(e.target.value) })}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingMachine(null)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!deletingMachineId}
        title="Delete Machine Record"
        message="Are you sure you want to delete this machine equipment record?"
        confirmText="Delete"
        onConfirm={handleDeleteMachineryConfirm}
        onClose={() => setDeletingMachineId(null)}
      />
    </div>
  );
};
