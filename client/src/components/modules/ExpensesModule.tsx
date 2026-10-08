import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Zap, 
  Fuel, 
  Users, 
  Wrench, 
  Truck, 
  Building,
  Edit,
  Trash2
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ExpenseRecord } from '../../types/erp';

export const ExpensesModule: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, setIsQuickAddOpen, setQuickAddType } = useERP();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit & Delete State
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const categories = [
    'All',
    'Electricity & Power',
    'Fuel & Diesel (DG/Boiler)',
    'Labour & Wages',
    'Freight & Transport',
    'Machinery Repairs & Spares',
    'Staff Salaries',
    'Lab Testing & R&D',
    'Office & Admin'
  ];

  const filteredExpenses = expenses.filter(exp => {
    const matchesCat = categoryFilter === 'All' || exp.category === categoryFilter;
    const matchesSearch = exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalExpenseAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    await updateExpense(editingExpense.id, editingExpense);
    setEditingExpense(null);
  };

  const handleDeleteExpenseConfirm = async () => {
    if (!deletingExpenseId) return;
    await deleteExpense(deletingExpenseId);
    setDeletingExpenseId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Manufacturing Overheads &amp; Expense Tracking
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalExpenseAmount.toLocaleString('en-IN')} Total Plant Expenses
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            11 cost categories: HT electricity, dryer diesel fuel, contract bagging labour, machinery spare parts, and lab testing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuickAddType('Expense');
              setIsQuickAddOpen(true);
            }}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 rounded-lg">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search vendor, voucher, bill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-md w-full outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Voucher # &amp; Date</th>
                <th className="p-3">Expense Category</th>
                <th className="p-3">Vendor / Payee</th>
                <th className="p-3">Description &amp; Purpose</th>
                <th className="p-3">Paid From Account</th>
                <th className="p-3 text-right font-bold text-neutral-900">Amount (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-mono font-bold text-neutral-900">{exp.expenseNumber}</div>
                    <div className="text-[11px] text-neutral-400">{exp.date} · Ref: {exp.invoiceOrVoucherNo}</div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-neutral-900">{exp.vendorName}</td>
                  <td className="p-3 text-neutral-600 max-w-xs">{exp.description}</td>
                  <td className="p-3 text-neutral-700 font-mono text-[11px]">{exp.paidFromAccount}</td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      {exp.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setEditingExpense(exp)}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer inline-flex items-center"
                      title="Edit Expense"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingExpenseId(exp.id)}
                      className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer inline-flex items-center"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT EXPENSE MODAL */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">
              Edit Expense Voucher {editingExpense.expenseNumber}
            </h3>

            <form onSubmit={handleUpdateExpense} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Expense Category</label>
                <select
                  value={editingExpense.category}
                  onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value as any })}
                  className="w-full border border-neutral-300 rounded p-2 bg-white"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  value={editingExpense.vendorName}
                  onChange={(e) => setEditingExpense({ ...editingExpense, vendorName: e.target.value })}
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({ ...editingExpense, description: e.target.value })}
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: Number(e.target.value) })}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Paid From</label>
                  <input
                    type="text"
                    value={editingExpense.paidFromAccount}
                    onChange={(e) => setEditingExpense({ ...editingExpense, paidFromAccount: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
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
        isOpen={!!deletingExpenseId}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense record?"
        confirmText="Delete"
        onConfirm={handleDeleteExpenseConfirm}
        onClose={() => setDeletingExpenseId(null)}
      />
    </div>
  );
};
