import React, { useState } from 'react';
import { 
  Plus, 
  UserPlus, 
  ArrowRight, 
  Check, 
  FileText, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LeadStage, Lead } from '../../types/erp';
import { ConfirmModal } from '../modals/ConfirmModal';

export const CRMSalesModule: React.FC = () => {
  const { 
    leads, 
    convertLeadToCustomer, 
    setIsQuickAddOpen, 
    setQuickAddType,
    salesOrders,
    setActiveModule,
    products,
    updateLead,
    deleteLead
  } = useERP();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads' | 'quotations'>('pipeline');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit & Delete state
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages: LeadStage[] = [
    'New',
    'Contacted',
    'Follow-up',
    'Quotation',
    'Negotiation',
    'Won',
    'Lost'
  ];

  const filteredLeads = leads.filter(l => {
    const matchesStage = stageFilter === 'All' || l.status === stageFilter;
    const matchesSearch = l.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.productInterested.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalPipelineValue = leads
    .filter(l => l.status !== 'Lost')
    .reduce((acc, curr) => acc + curr.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              CRM, Sales Enquiries &amp; Pipeline
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalPipelineValue.toLocaleString('en-IN')} Pipeline
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage incoming dealer enquiries, track negotiation stages, and convert qualified leads into Customer Master records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuickAddType('Lead');
              setIsQuickAddOpen(true);
            }}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>
          <button
            onClick={() => setActiveModule('Customers')}
            className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-md text-xs font-medium cursor-pointer"
          >
            Customer Master
          </button>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'pipeline' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pipeline Stages ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'leads' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Lead Directory
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-48 outline-none text-neutral-800"
            />
          </div>
        </div>
      </div>

      {/* PIPELINE KANBAN VIEW */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
          {stages.map(st => {
            const stageLeads = leads.filter(l => l.status === st);
            const stageTotal = stageLeads.reduce((acc, curr) => acc + curr.estimatedValue, 0);

            return (
              <div key={st} className="bg-neutral-100/70 border border-neutral-200 rounded-xl p-3 flex flex-col min-w-[210px]">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <div className="font-semibold text-xs text-neutral-900">{st}</div>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 rounded border border-neutral-200 font-bold">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-1">
                  ₹{stageTotal.toLocaleString('en-IN')}
                </div>

                <div className="space-y-2 mt-3 flex-1 overflow-y-auto max-h-[500px]">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="bg-white border border-neutral-200 rounded-lg p-3 hover:border-neutral-300 shadow-2xs text-xs space-y-1.5 relative group">
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-neutral-900">{lead.company}</div>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => setEditingLead(lead)}
                            title="Edit Lead"
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeletingLeadId(lead.id)}
                            title="Delete Lead"
                            className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-neutral-600">{lead.contactPerson} · {lead.location}</div>
                      <div className="text-[11px] text-emerald-800 font-medium">{lead.productInterested}</div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-100">
                        <span>{lead.expectedQuantityMT} MT</span>
                        <span className="font-bold text-neutral-900">₹{lead.estimatedValue.toLocaleString('en-IN')}</span>
                      </div>
                      {lead.status === 'Won' ? (
                        <button
                          onClick={() => convertLeadToCustomer(lead.id)}
                          className="w-full mt-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Convert to Customer</span>
                        </button>
                      ) : (
                        <div className="text-[10px] text-neutral-400 mt-1">
                          Rep: {lead.salesperson.split(' ')[0]} · Next: {lead.followUpDate}
                        </div>
                      )}
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-neutral-400 italic">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LEADS TABLE VIEW */}
      {activeTab === 'leads' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Company &amp; Contact</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Product Required</th>
                  <th className="p-3 text-right">Qty (MT)</th>
                  <th className="p-3 text-right">Est. Value (₹)</th>
                  <th className="p-3">Salesperson</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLeads.map(l => (
                  <tr key={l.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-neutral-900">{l.company}</div>
                      <div className="text-[11px] text-neutral-500">{l.contactPerson} · {l.mobile}</div>
                    </td>
                    <td className="p-3 text-neutral-700">{l.location}</td>
                    <td className="p-3 font-medium text-neutral-900">{l.productInterested}</td>
                    <td className="p-3 text-right font-mono tabular-nums">{l.expectedQuantityMT} MT</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      ₹{l.estimatedValue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-neutral-700">{l.salesperson}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        l.status === 'Won' ? 'bg-emerald-100 text-emerald-800' :
                        l.status === 'Negotiation' ? 'bg-blue-100 text-blue-800' :
                        l.status === 'Lost' ? 'bg-neutral-200 text-neutral-600' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingLead(l)}
                          className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {l.status !== 'Won' && (
                          <button
                            onClick={() => convertLeadToCustomer(l.id)}
                            className="px-2 py-1 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded text-[11px] font-medium text-emerald-800 cursor-pointer"
                          >
                            Convert
                          </button>
                        )}
                        <button
                          onClick={() => setDeletingLeadId(l.id)}
                          className="px-2 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded text-[11px] font-medium text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="font-bold text-neutral-900">Edit Lead: {editingLead.company}</div>
              <button
                onClick={() => setEditingLead(null)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  await updateLead(editingLead.id, editingLead);
                  setEditingLead(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="p-4 space-y-3 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Lead Name</label>
                  <input
                    type="text"
                    required
                    value={editingLead.leadName}
                    onChange={(e) => setEditingLead({ ...editingLead, leadName: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editingLead.contactPerson}
                    onChange={(e) => setEditingLead({ ...editingLead, contactPerson: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editingLead.mobile}
                    onChange={(e) => setEditingLead({ ...editingLead, mobile: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingLead.location}
                    onChange={(e) => setEditingLead({ ...editingLead, location: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Product Interested</label>
                  <input
                    type="text"
                    value={editingLead.productInterested}
                    onChange={(e) => setEditingLead({ ...editingLead, productInterested: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Qty Expected (MT)</label>
                  <input
                    type="number"
                    value={editingLead.expectedQuantityMT}
                    onChange={(e) => setEditingLead({ ...editingLead, expectedQuantityMT: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Est. Value (₹)</label>
                  <input
                    type="number"
                    value={editingLead.estimatedValue}
                    onChange={(e) => setEditingLead({ ...editingLead, estimatedValue: Number(e.target.value) })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Stage</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as LeadStage })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 mb-1">Salesperson</label>
                  <input
                    type="text"
                    value={editingLead.salesperson}
                    onChange={(e) => setEditingLead({ ...editingLead, salesperson: e.target.value })}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded text-xs outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Lead Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingLeadId)}
        title="Delete Lead Record"
        message="Are you sure you want to delete this lead from the pipeline? This will remove the lead record from Firestore."
        confirmText="Delete Lead"
        isDangerous={true}
        isLoading={isSubmitting}
        onClose={() => setDeletingLeadId(null)}
        onConfirm={async () => {
          if (!deletingLeadId) return;
          setIsSubmitting(true);
          try {
            await deleteLead(deletingLeadId);
            setDeletingLeadId(null);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
};
