import React, { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Calendar, Plus } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const MaintenanceModule: React.FC = () => {
  const { machinery } = useERP();
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);

  const totalMaintenanceCost = machinery.reduce((acc, curr) => acc + curr.totalMaintenanceCostThisYear, 0);

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
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                m.currentStatus === 'Operational' ? 'bg-emerald-100 text-emerald-800' :
                m.currentStatus === 'Under Maintenance' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {m.currentStatus}
              </span>
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
    </div>
  );
};
