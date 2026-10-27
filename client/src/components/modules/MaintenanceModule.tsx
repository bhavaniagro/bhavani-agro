import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Calendar, Plus, Edit, Trash2, History, Cpu } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Machinery } from '../../types/erp';
import { ModuleHeader } from '../common/ModuleHeader';
import { sortByLatest } from '../../utils/sortUtils';

type ActiveTab = 'machines' | 'history';

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; icon: React.ReactNode }> = {
  'Operational': {
    bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  'Under Maintenance': {
    bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500',
    icon: <Wrench className="w-3.5 h-3.5" />,
  },
  'Breakdown': {
    bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  'Standby': {
    bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-400',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-400', icon: null };
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    return iso;
  }
}

export const MaintenanceModule: React.FC = () => {
  const { machinery, machineHistory, addMachinery, updateMachinery, deleteMachinery } = useERP();

  const [activeTab, setActiveTab] = useState<ActiveTab>('machines');

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

  const resetMachineForm = () => {
    setCode(`MCH-2609-0${machinery.length + 1}`);
    setName('');
    setDept('Granulation & Drying');
    setCapacity('15 MT/hr');
    setInstallDate(new Date().toISOString().split('T')[0]);
    setFreqDays(30);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAddModal) {
          setShowAddModal(false);
          resetMachineForm();
        }
        if (editingMachine) setEditingMachine(null);
        if (deletingMachineId) setDeletingMachineId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, editingMachine, deletingMachineId]);

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
    resetMachineForm();
  };

  const handleUpdateMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMachine) return;
    const targetMach = editingMachine;
    setEditingMachine(null);
    await updateMachinery(targetMach.id, targetMach);
  };

  const handleDeleteMachineryConfirm = async () => {
    if (!deletingMachineId) return;
    const id = deletingMachineId;
    setDeletingMachineId(null);
    await deleteMachinery(id);
  };

  // Sort history newest first
  const sortedHistory = [...machineHistory].sort((a, b) =>
    new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <ModuleHeader>
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

        {activeTab === 'machines' && (
          <button
            onClick={() => {
              resetMachineForm();
              setShowAddModal(true);
            }}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Machine</span>
          </button>
        )}
      </ModuleHeader>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg w-fit border border-neutral-200 shadow-xs">
        <button
          onClick={() => setActiveTab('machines')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'machines'
              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Machine
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          History
          {sortedHistory.length > 0 && (
            <span className="ml-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold px-1">
              {sortedHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* MACHINES TAB */}
      {activeTab === 'machines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortByLatest(machinery).map(m => {
            const cfg = getStatusConfig(m.currentStatus);
            return (
              <div key={m.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-3 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between border-b border-neutral-100 pb-2">
                  <div>
                    <span className="font-mono text-emerald-800 font-bold">{m.machineCode}</span>
                    <h3 className="font-bold text-neutral-900 text-sm mt-0.5">{m.machineName}</h3>
                    <div className="text-[11px] text-neutral-500">{m.department} Section · Rating: {m.capacityRating}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${cfg.bg} ${cfg.text}`}>
                      {cfg.icon}
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
            );
          })}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {sortedHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <History className="w-5 h-5 text-neutral-400" />
              </div>
              <p className="text-sm font-semibold text-neutral-600">No status history yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                When a machine's status is changed, it will be recorded here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_1.2fr_1fr_1fr_1.4fr] gap-3 px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                <div>Machine</div>
                <div>Machine Name</div>
                <div>From Status</div>
                <div>To Status</div>
                <div>Changed At</div>
              </div>

              {/* Timeline rows */}
              <div className="divide-y divide-neutral-100">
                {sortedHistory.map((h, idx) => {
                  const fromCfg = getStatusConfig(h.previousStatus);
                  const toCfg = getStatusConfig(h.newStatus);
                  return (
                    <div
                      key={h.id}
                      className="grid grid-cols-[1fr_1.2fr_1fr_1fr_1.4fr] gap-3 px-4 py-3 text-xs items-center hover:bg-neutral-50 transition-colors"
                    >
                      {/* Machine Code */}
                      <div className="font-mono font-bold text-emerald-800">{h.machineCode}</div>

                      {/* Machine Name */}
                      <div className="font-medium text-neutral-800 truncate">{h.machineName}</div>

                      {/* From Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${fromCfg.bg} ${fromCfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${fromCfg.dot}`} />
                          {h.previousStatus}
                        </span>
                      </div>

                      {/* To Status */}
                      <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${toCfg.bg} ${toCfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${toCfg.dot}`} />
                          {h.newStatus}
                        </span>
                      </div>

                      {/* Changed At */}
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {formatDateTime(h.changedAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD MACHINE MODAL */}
      {showAddModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
              resetMachineForm();
            }
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs my-auto"
          >
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
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setEditingMachine(null); }}
          className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs my-auto"
          >
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
                    <option value="Standby">Standby</option>
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
