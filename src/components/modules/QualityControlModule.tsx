import React, { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Search, 
  Printer,
  Sparkles
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const QualityControlModule: React.FC = () => {
  const { 
    qcInspections, 
    approveQC, 
    rejectQC, 
    setPrintableDoc,
    setActiveModule 
  } = useERP();

  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQC, setSelectedQC] = useState<any | null>(null);

  const filteredQC = qcInspections.filter(q => {
    const matchesType = typeFilter === 'All' || q.type === typeFilter;
    const matchesSearch = q.qcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.batchLotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const activeInspection = selectedQC || filteredQC[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Quality Control Laboratory &amp; Batch Inspection
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              FCO 1985 &amp; ISO 9001 Compliant
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Incoming Raw Material testing, In-Process checks, and Finished Goods lot analysis. Only <strong>Approved</strong> finished goods are released for sale.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeInspection && (
            <button
              onClick={() => setPrintableDoc({ type: 'qc_cert', data: activeInspection })}
              className="px-3.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print QC Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          {['All', 'Incoming Raw Material', 'In-Process Production', 'Finished Goods'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                typeFilter === t ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search QC #, lot #, item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-60 outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* Split View: List on Left, Active Inspector Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: QC Queue */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-neutral-100">
          <div className="p-3 bg-neutral-50 border-b border-neutral-200 font-semibold text-xs text-neutral-700 flex justify-between">
            <span>Inspection Queue ({filteredQC.length})</span>
            <span className="text-[11px] text-neutral-500">Click to evaluate</span>
          </div>

          <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto">
            {filteredQC.map(q => (
              <div
                key={q.id}
                onClick={() => setSelectedQC(q)}
                className={`p-3.5 cursor-pointer transition-colors text-xs space-y-1 ${
                  activeInspection?.id === q.id 
                    ? 'bg-emerald-50/60 border-l-4 border-l-emerald-600' 
                    : 'hover:bg-neutral-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-neutral-900">{q.qcNumber}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    q.overallStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    q.overallStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {q.overallStatus}
                  </span>
                </div>
                <div className="font-semibold text-neutral-900">{q.itemName}</div>
                <div className="text-[11px] text-neutral-500 font-mono">Lot: {q.batchLotNumber} · {q.quantity} {q.unit}</div>
                <div className="text-[10px] text-neutral-400 flex justify-between pt-1">
                  <span>{q.type}</span>
                  <span>{q.inspectionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detailed Inspection Sheet & Parameters */}
        <div className="lg:col-span-2 space-y-4">
          {activeInspection ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4 shadow-2xs">
              <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {activeInspection.type}
                  </div>
                  <h2 className="text-base font-bold text-neutral-900 mt-0.5">
                    {activeInspection.itemName}
                  </h2>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">
                    Inspection: {activeInspection.qcNumber} · Batch: {activeInspection.batchLotNumber}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-1 rounded uppercase tracking-wider ${
                    activeInspection.overallStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    activeInspection.overallStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    Status: {activeInspection.overallStatus}
                  </span>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Chemist: {activeInspection.inspector}
                  </div>
                </div>
              </div>

              {/* Lab Parameters Table */}
              <div>
                <h3 className="text-xs font-bold text-neutral-900 mb-2 uppercase tracking-wider">
                  Laboratory Test Parameters &amp; Specifications
                </h3>
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                        <th className="p-2.5">Parameter Tested</th>
                        <th className="p-2.5">Standard Specification</th>
                        <th className="p-2.5">Observed Value</th>
                        <th className="p-2.5 text-center">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {activeInspection.parameters.map((param: any, idx: number) => (
                        <tr key={idx} className="hover:bg-neutral-50/50">
                          <td className="p-2.5 font-medium text-neutral-900">{param.parameter}</td>
                          <td className="p-2.5 text-neutral-600">{param.specification}</td>
                          <td className="p-2.5 font-mono text-neutral-900 font-semibold">{param.observedValue}</td>
                          <td className="p-2.5 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              param.status === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {param.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-xs">
                <div className="font-semibold text-neutral-700">Chemist Remarks:</div>
                <div className="text-neutral-600 mt-0.5">{activeInspection.remarks}</div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-200">
                <div className="text-[11px] text-neutral-500">
                  Approving releases goods to "Available for Sale" inventory.
                </div>

                <div className="flex items-center gap-2">
                  {activeInspection.overallStatus !== 'Approved' && (
                    <>
                      <button
                        onClick={() => rejectQC(activeInspection.id, 'Fails minimum swelling threshold and grit standards.')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded text-xs cursor-pointer border border-rose-200"
                      >
                        Reject Batch
                      </button>
                      <button
                        onClick={() => approveQC(activeInspection.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve &amp; Release Stock</span>
                      </button>
                    </>
                  )}

                  {activeInspection.overallStatus === 'Approved' && (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Certified &amp; Released</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-400 text-xs bg-white rounded-xl border border-neutral-200">
              Select an inspection record from the list to view laboratory test parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
