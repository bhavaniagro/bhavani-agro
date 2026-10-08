import React, { useState } from 'react';
import { UserCheck, Plus, Search, Phone, Briefcase } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const EmployeesModule: React.FC = () => {
  const { employees } = useERP();
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const departments = ['All', 'Production', 'Sales', 'Purchase', 'Accounts', 'Warehouse', 'Dispatch', 'Administration'];

  const filteredEmployees = employees.filter(e => {
    const matchesDept = deptFilter === 'All' || e.department === deptFilter;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalPayroll = employees.reduce((acc, curr) => acc + curr.monthlySalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Staff &amp; Workforce Directory
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              ₹{totalPayroll.toLocaleString('en-IN')} Monthly Payroll
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Plant management across 7 departments: Production, Sales, Purchase, Quality Lab, Accounts, and Dispatch.
          </p>
        </div>
      </div>

      {/* Dept filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-neutral-100 rounded-lg">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                deptFilter === d ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-md w-full outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
              <th className="p-3">Emp Code &amp; Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role / Designation</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Joining Date</th>
              <th className="p-3 text-right">Monthly Salary (₹)</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-neutral-50/70 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-neutral-900">{emp.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{emp.employeeCode}</div>
                </td>
                <td className="p-3 text-neutral-700">{emp.department}</td>
                <td className="p-3 font-medium text-neutral-900">{emp.role}</td>
                <td className="p-3 font-mono text-neutral-600">{emp.mobile}</td>
                <td className="p-3 text-neutral-600">{emp.joiningDate}</td>
                <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                  ₹{emp.monthlySalary.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-center">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
