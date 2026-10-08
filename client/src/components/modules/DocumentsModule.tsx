import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Search, CheckCircle2, Edit, Trash2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ErpDocument } from '../../types/erp';

export const DocumentsModule: React.FC = () => {
  const { documents, addDocument, updateDocument, deleteDocument } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ErpDocument | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('GST & Statutory');
  const [relatedEntity, setRelatedEntity] = useState('');
  const [fileName, setFileName] = useState('');

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

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDocument({
      title,
      documentType: docType as any,
      relatedEntity,
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '1.4 MB',
      uploadedBy: 'System Admin'
    });
    setShowAddModal(false);
    setTitle('');
    setRelatedEntity('');
    setFileName('');
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    await updateDocument(editingDoc.id, editingDoc);
    setEditingDoc(null);
  };

  const handleDeleteDocumentConfirm = async () => {
    if (!deletingDocId) return;
    await deleteDocument(deletingDocId);
    setDeletingDocId(null);
  };

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

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
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
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-neutral-400 mr-1">{doc.fileSize}</span>
                <button
                  onClick={() => setEditingDoc(doc)}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer"
                  title="Edit Document"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingDocId(doc.id)}
                  className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
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

      {/* UPLOAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Upload / Register Document</h3>
            <form onSubmit={handleCreateDocument} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2"
                  placeholder="e.g. APEDA NPOP Organic Certificate 2026"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {docTypes.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Related Entity</label>
                  <input
                    type="text"
                    value={relatedEntity}
                    onChange={(e) => setRelatedEntity(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                    placeholder="e.g. Company Statutory"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 font-mono"
                  placeholder="e.g. organic_cert_2026.pdf"
                />
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
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Edit Document Details</h3>
            <form onSubmit={handleUpdateDocument} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Type</label>
                  <select
                    value={editingDoc.documentType}
                    onChange={(e) => setEditingDoc({ ...editingDoc, documentType: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {docTypes.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Related Entity</label>
                  <input
                    type="text"
                    value={editingDoc.relatedEntity}
                    onChange={(e) => setEditingDoc({ ...editingDoc, relatedEntity: e.target.value })}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
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
        isOpen={!!deletingDocId}
        title="Delete Document Record"
        message="Are you sure you want to delete this document record from the repository?"
        confirmText="Delete"
        onConfirm={handleDeleteDocumentConfirm}
        onClose={() => setDeletingDocId(null)}
      />
    </div>
  );
};
