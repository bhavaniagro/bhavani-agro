import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Search, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const DocumentsModule: React.FC = () => {
  const { documents } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const docTypes = [
    'All',
    'GST & Statutory',
    'Quality Lab Report',
    'E-Way Bill',
    'Supplier Invoice',
    'Delivery Challan'
  ];

  const filteredDocs = documents.filter(d => {
    const matchesType = typeFilter === 'All' || d.documentType === typeFilter;
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.relatedEntity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Electronic Document Management (EDM)
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Statutory &amp; Quality Repositories
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Centralized document vault for GST registration, APEDA NPOP organic certificates, ISO 9001 compliance, and lab test reports.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 rounded-lg">
          {docTypes.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === t ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-md w-full outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white border border-neutral-200 rounded-xl p-4 text-xs space-y-2 shadow-2xs hover:border-neutral-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400">{doc.fileSize}</span>
            </div>

            <div className="font-bold text-neutral-900 text-sm">{doc.title}</div>
            <div className="text-[11px] text-neutral-500">Related: {doc.relatedEntity}</div>
            <div className="text-[10px] text-neutral-400 font-mono">
              File: {doc.fileName} · Uploaded {doc.uploadDate}
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-emerald-800 bg-neutral-100 px-2 py-0.5 rounded">
                {doc.documentType}
              </span>
              <button
                onClick={() => alert(`Downloading verified copy of ${doc.fileName}`)}
                className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
