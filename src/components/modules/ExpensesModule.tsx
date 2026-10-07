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
  Building 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ExpensesModule: React.FC = () => {
  const { expenses, addExpense, setIsQuickAddOpen, setQuickAddType } = useERP();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
