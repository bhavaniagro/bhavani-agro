import React, { useState, useRef, useEffect } from 'react';
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
  X,
  AlertCircle
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LeadStage, Lead } from '../../types/erp';
import { ConfirmModal } from '../modals/ConfirmModal';
import { LostReasonModal } from '../modals/LostReasonModal';
import { LeadFormModal } from '../crm/LeadFormModal';

export const CRMSalesModule: React.FC = () => {
  const {
    leads,
    convertLeadToCustomer,
    setIsQuickAddOpen,
    setQuickAddType,
    salesOrders,
    invoices,
    customers,
    setActiveModule,
    products,
    addLead,
    updateLead,
    deleteLead
  } = useERP();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads' | 'analytics'>('pipeline');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Click outside to close filter popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Edit, Create, Delete & Lost Reason modal states
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [leadForLostReason, setLeadForLostReason] = useState<Lead | null>(null);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  const handleStageChangeRequest = async (lead: Lead, targetStage: LeadStage) => {
    if (lead.status === targetStage) return;

    if (targetStage === 'Lost') {
      // Must prompt for Lost Reason dialog before completing transition
      setLeadForLostReason(lead);
      return;
    }

    try {
      await updateLead(lead.id, { status: targetStage });
    } catch (err) {
      console.error('Failed to change lead stage:', err);
    }
  };

  const handleConfirmLost = async (reason: string) => {
    if (!leadForLostReason) return;
    await updateLead(leadForLostReason.id, {
      status: 'Lost',
      lostReason: reason
    });
    setLeadForLostReason(null);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    setDraggedLeadId(null);
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    handleStageChangeRequest(lead, targetStage);
  };

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
    const searchLower = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchLower ||
      (l.leadName && l.leadName.toLowerCase().includes(searchLower)) ||
      (l.company && l.company.toLowerCase().includes(searchLower)) ||
      (l.productInterested && l.productInterested.toLowerCase().includes(searchLower)) ||
      (l.contactPerson && l.contactPerson.toLowerCase().includes(searchLower));

    const matchesProduct = selectedProduct === 'All' || (() => {
      const selectedProd = products.find(p => p.id === selectedProduct || p.productName.toLowerCase() === selectedProduct.toLowerCase());
      const targetName = selectedProd ? selectedProd.productName.toLowerCase().trim() : selectedProduct.toLowerCase().trim();
      const leadProd = (l.productInterested || '').toLowerCase().trim();
      return leadProd === targetName || l.productInterested === selectedProduct;
    })();

    return matchesStage && matchesSearch && matchesProduct;
  });

  const isFilterActive = selectedProduct !== 'All' || stageFilter !== 'All';
  const selectedProductObj = products.find(p => p.id === selectedProduct || p.productName === selectedProduct);
  const selectedProductName = selectedProductObj ? selectedProductObj.productName : selectedProduct;

  const totalPipelineValue = leads
    .filter(l => l.status !== 'Lost')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  // Sales Analytics Calculations (from actual persisted data)
  const totalSalesOrdersVal = salesOrders.reduce((sum, so) => sum + (so.totalAmount || 0), 0);
  const totalInvoicedVal = invoices.reduce((sum, inv) => sum + (inv.totalInvoiceAmount || 0), 0);
  const totalPaymentsVal = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalOutstandingVal = invoices.reduce((sum, inv) => sum + (inv.balanceAmount || 0), 0);
  const wonLeadsCount = leads.filter(l => l.status === 'Won').length;
  const leadConversionRate = leads.length > 0 ? ((wonLeadsCount / leads.length) * 100).toFixed(1) : '0';

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
            onClick={() => setIsCreateLeadOpen(true)}
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

      {/* Segmented Tab Controls & Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'pipeline' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Pipeline Stages ({filteredLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'leads' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Lead Directory ({filteredLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Sales Analytics
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-7 py-1 bg-white border border-neutral-200 rounded-md w-44 sm:w-52 outline-none text-neutral-800 focus:border-neutral-400 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Compact Filter Button & Dropdown Popover */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              id="product-lead-filter-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 border transition-all cursor-pointer ${
                isFilterActive
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-semibold'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
              }`}
              title="Filter leads by product"
            >
              <Filter className={`w-3.5 h-3.5 ${isFilterActive ? 'text-emerald-700' : 'text-neutral-500'}`} />
              <span>Filter</span>
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200" title="Active filters applied" />
              )}
            </button>

            {/* Dropdown Popover */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 z-40 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <Filter className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Filter Leads</span>
                  </div>
                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct('All');
                        setStageFilter('All');
                      }}
                      className="text-[11px] text-neutral-500 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Product Filter Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="lead-product-filter" className="block text-[11px] font-medium text-neutral-700">
                    Product Interested
                  </label>
                  <select
                    id="lead-product-filter"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-md text-xs text-neutral-800 outline-none focus:border-neutral-900 transition-colors"
                  >
                    <option value="All">All Products (Show All Leads)</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.productName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead Stage Filter */}
                <div className="space-y-1.5">
                  <label htmlFor="lead-stage-filter" className="block text-[11px] font-medium text-neutral-700">
                    Lead Stage
                  </label>
                  <select
                    id="lead-stage-filter"
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-md text-xs text-neutral-800 outline-none focus:border-neutral-900 transition-colors"
                  >
                    <option value="All">All Stages</option>
                    {stages.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Popover footer */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">
                    Showing {filteredLeads.length} of {leads.length} leads
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {isFilterActive && (
        <div className="flex items-center gap-2 flex-wrap text-xs -mt-3">
          <span className="text-[11px] text-neutral-500 font-medium">Active filters:</span>
          {selectedProduct !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
              <span>Product: <strong>{selectedProductName}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedProduct('All')}
                className="hover:bg-emerald-100 rounded-full p-0.5 text-emerald-700 cursor-pointer"
                title="Clear product filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {stageFilter !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium">
              <span>Stage: <strong>{stageFilter}</strong></span>
              <button
                type="button"
                onClick={() => setStageFilter('All')}
                className="hover:bg-blue-100 rounded-full p-0.5 text-blue-700 cursor-pointer"
                title="Clear stage filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedProduct('All');
              setStageFilter('All');
            }}
            className="text-[11px] text-neutral-500 hover:text-neutral-800 underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* PIPELINE KANBAN VIEW (RESPONSIVE FLEX ROW TO PREVENT OVERLAP) */}
      {activeTab === 'pipeline' && (
        <div className="flex overflow-x-auto gap-4 pb-4 items-start w-full">
          {stages.map(st => {
            const stageLeads = filteredLeads.filter(l => l.status === st);
            const stageTotal = stageLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

            return (
              <div
                key={st}
                onDragOver={(e) => handleDragOver(e, st)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, st)}
                className={`border rounded-xl p-3 flex flex-col w-64 min-w-[250px] shrink-0 transition-all ${
                  dragOverStage === st
                    ? 'bg-neutral-200/90 border-neutral-400 ring-2 ring-neutral-400/40 shadow-xs'
                    : 'bg-neutral-100/70 border-neutral-200'
                }`}
              >
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
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      className="bg-white border border-neutral-200 rounded-lg p-3 hover:border-neutral-300 shadow-2xs text-xs space-y-1.5 relative group cursor-grab active:cursor-grabbing transition-all hover:shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-neutral-900 truncate pr-2" title={lead.company}>
                          {lead.company}
                        </div>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
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
                      <div className="text-[11px] text-neutral-600 truncate" title={`${lead.contactPerson || lead.leadName} · ${lead.address || lead.location}`}>
                        {lead.contactPerson || lead.leadName} · {lead.address || lead.location || 'Location not set'}
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-neutral-400 truncate" title={lead.email}>
                          {lead.email}
                        </div>
                      )}
                      <div className="text-[11px] text-emerald-800 font-medium truncate" title={lead.productInterested}>
                        {lead.productInterested}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-100">
                        <span>{lead.expectedQuantityMT} MT</span>
                        <span className="font-bold text-neutral-900">
                          ₹{(lead.estimatedValue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {lead.status === 'Won' ? (
                        <button
                          onClick={() => convertLeadToCustomer(lead.id)}
                          className="w-full mt-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Convert to Customer</span>
                        </button>
                      ) : lead.status === 'Lost' ? (
                        <div className="mt-1.5 p-1.5 bg-rose-50 border border-rose-200 rounded text-[10px] text-rose-800 space-y-0.5">
                          <div className="font-semibold flex items-center justify-between">
                            <span>Lost Reason:</span>
                            <button
                              type="button"
                              onClick={() => setLeadForLostReason(lead)}
                              className="text-[9px] underline hover:text-rose-950 cursor-pointer"
                            >
                              Update
                            </button>
                          </div>
                          <div className="truncate text-rose-900 font-normal" title={lead.lostReason}>
                            {lead.lostReason || <span className="italic text-rose-400">No reason recorded</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1 pt-1 border-t border-neutral-50">
                          <span className="truncate">
                            Rep: {(lead.salesperson || 'Unassigned').split(' ')[0]}
                          </span>
                          <span className="truncate text-neutral-500 font-mono text-[9.5px]">
                            {lead.followUpDate
                              ? `Next: ${lead.followUpDate}${lead.followUpTime ? ` @ ${lead.followUpTime}` : ''}`
                              : 'No date'}
                          </span>
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
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                    <th className="p-3">Company &amp; Contact</th>
                    <th className="p-3">Address / Location</th>
                    <th className="p-3">Product Required</th>
                    <th className="p-3 text-right">Qty (MT)</th>
                    <th className="p-3 text-right">Est. Value (₹)</th>
                    <th className="p-3">Follow-up</th>
                    <th className="p-3">Stage</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-neutral-900">{l.company}</div>
                        <div className="text-[11px] text-neutral-500">
                          {l.contactPerson || l.leadName} · {l.mobile}
                        </div>
                        {l.email && (
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {l.email}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-neutral-700 max-w-[160px] truncate" title={l.address || l.location}>
                        {l.address || l.location || '-'}
                      </td>
                      <td className="p-3 font-medium text-neutral-900">{l.productInterested}</td>
                      <td className="p-3 text-right font-mono tabular-nums">{l.expectedQuantityMT} MT</td>
                      <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                        ₹{l.estimatedValue.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-neutral-600 text-[11px]">
                        {l.followUpDate ? (
                          <div className="font-mono">
                            <div>{l.followUpDate}</div>
                            {l.followUpTime && (
                              <div className="text-[10px] text-neutral-400">@ {l.followUpTime}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1 items-start">
                          <select
                            value={l.status}
                            onChange={(e) => handleStageChangeRequest(l, e.target.value as LeadStage)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border cursor-pointer outline-none transition-colors ${
                              l.status === 'Won'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : l.status === 'Negotiation'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : l.status === 'Lost'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {stages.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          {l.status === 'Lost' && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span
                                className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 max-w-[140px] truncate"
                                title={l.lostReason || 'No reason recorded'}
                              >
                                {l.lostReason || 'Reason not recorded'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setLeadForLostReason(l)}
                                className="text-[9px] text-rose-600 hover:text-rose-800 underline cursor-pointer"
                                title="Edit lost reason"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingLead(l)}
                            className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 flex items-center gap-1 cursor-pointer"
                            title="Edit Lead Details"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          {l.status !== 'Won' && (
                            <button
                              onClick={() => convertLeadToCustomer(l.id)}
                              className="px-2 py-1 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded text-[11px] font-medium text-emerald-800 cursor-pointer"
                              title="Convert to Customer Master"
                            >
                              Convert
                            </button>
                          )}
                          {l.status !== 'Lost' && (
                            <button
                              onClick={() => setLeadForLostReason(l)}
                              className="px-2 py-1 bg-neutral-50 border border-neutral-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 rounded text-[11px] font-medium text-neutral-600 cursor-pointer transition-colors"
                              title="Move to Lost"
                            >
                              Mark Lost
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingLeadId(l.id)}
                            className="px-2 py-1 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded text-[11px] font-medium text-rose-700 cursor-pointer"
                            title="Delete Lead"
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
          ) : (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                <Filter className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-neutral-900 text-sm">No leads found</h3>
                <p className="text-neutral-500 text-xs max-w-sm mx-auto">
                  {selectedProduct !== 'All'
                    ? `There are no leads interested in "${selectedProductName}".`
                    : searchTerm
                    ? `No leads matched your search query "${searchTerm}".`
                    : 'No leads found matching the selected filter criteria.'}
                </p>
              </div>
              {(isFilterActive || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct('All');
                    setStageFilter('All');
                    setSearchTerm('');
                  }}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Filter / View All Leads</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* SALES ANALYTICS VIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Active Pipeline Value</div>
              <div className="text-xl font-bold font-mono text-emerald-800 mt-1">₹{totalPipelineValue.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-neutral-400 mt-1">{leads.filter(l => l.status !== 'Lost').length} Active Leads in Pipeline</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Booked Sales Orders</div>
              <div className="text-xl font-bold font-mono text-neutral-900 mt-1">₹{totalSalesOrdersVal.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-neutral-400 mt-1">{salesOrders.length} Confirmed Sales Orders</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Invoiced Sales Revenue</div>
              <div className="text-xl font-bold font-mono text-blue-800 mt-1">₹{totalInvoicedVal.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-neutral-400 mt-1">{invoices.length} Sales Invoices Generated</div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Lead Win Conversion Rate</div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{leadConversionRate}%</div>
              <div className="text-[10px] text-neutral-400 mt-1">{wonLeadsCount} Won / {leads.length} Total Leads</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                  Sales Orders Summary
                </h3>
                <span className="text-[11px] font-mono text-neutral-500">
                  {salesOrders.length} Total Orders
                </span>
              </div>

              {/* Order status metrics grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-neutral-50 rounded border border-neutral-200">
                  <div className="text-[10px] text-neutral-500 font-medium">Recent (30 Days)</div>
                  <div className="font-bold font-mono text-neutral-900 mt-0.5">
                    {salesOrders.filter(so => {
                      if (!so.orderDate) return true;
                      const orderTime = new Date(so.orderDate).getTime();
                      const thirtyDaysAgo = Date.now() - 30 * 86400000;
                      return orderTime >= thirtyDaysAgo;
                    }).length}
                  </div>
                </div>
                <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900">
                  <div className="text-[10px] text-amber-700 font-medium">Pending / Unfulfilled</div>
                  <div className="font-bold font-mono text-amber-900 mt-0.5">
                    {salesOrders.filter(so => ['Pending', 'Confirmed', 'Production Required', 'Ready'].includes(so.status)).length}
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                  <div className="text-[10px] text-emerald-700 font-medium">Completed</div>
                  <div className="font-bold font-mono text-emerald-900 mt-0.5">
                    {salesOrders.filter(so => ['Dispatched', 'Completed'].includes(so.status)).length}
                  </div>
                </div>
              </div>

              {/* Sales orders list table */}
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                {salesOrders.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                          <th className="p-2">Order #</th>
                          <th className="p-2">Customer</th>
                          <th className="p-2">Date</th>
                          <th className="p-2 text-right">Total (₹)</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {salesOrders.slice(0, 10).map(so => (
                          <tr key={so.id} className="hover:bg-neutral-50/50">
                            <td className="p-2 font-mono font-bold text-neutral-900">{so.orderNumber}</td>
                            <td className="p-2 text-neutral-800 truncate max-w-[120px]">{so.customerName}</td>
                            <td className="p-2 text-neutral-500 font-mono text-[11px]">{so.orderDate}</td>
                            <td className="p-2 text-right font-mono font-semibold">₹{(so.totalAmount || 0).toLocaleString('en-IN')}</td>
                            <td className="p-2">
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                                so.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                so.status === 'Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                so.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                                so.status === 'Production Required' ? 'bg-amber-100 text-amber-900' :
                                'bg-neutral-100 text-neutral-700'
                              }`}>
                                {so.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-neutral-400 italic text-xs">
                    No sales orders available. Persisted orders will appear here.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2">
                Financial Summary &amp; Receivables Status
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                  <span className="text-neutral-600">Total Billed Revenue</span>
                  <span className="font-bold font-mono text-neutral-900">₹{totalInvoicedVal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                  <span>Collected Payments</span>
                  <span className="font-bold font-mono">₹{totalPaymentsVal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900">
                  <span>Outstanding Receivables Balance</span>
                  <span className="font-bold font-mono">₹{totalOutstandingVal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      <LeadFormModal
        isOpen={isCreateLeadOpen}
        mode="create"
        products={products}
        onClose={() => setIsCreateLeadOpen(false)}
        onSubmit={async (leadData) => {
          await addLead(leadData);
        }}
      />

      {/* Edit Lead Modal */}
      <LeadFormModal
        isOpen={Boolean(editingLead)}
        mode="edit"
        initialLead={editingLead}
        products={products}
        onClose={() => setEditingLead(null)}
        onSubmit={async (leadData) => {
          if (!editingLead) return;
          await updateLead(editingLead.id, leadData);
        }}
      />

      {/* Lost Reason Transition Modal */}
      <LostReasonModal
        isOpen={Boolean(leadForLostReason)}
        lead={leadForLostReason}
        onClose={() => setLeadForLostReason(null)}
        onConfirm={handleConfirmLost}
      />

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
