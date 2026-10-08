import React, { useState } from 'react';
import { UserCheck, Plus, Search, Phone, Briefcase, Edit, Trash2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Employee } from '../../types/erp';

export const EmployeesModule: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useERP();
  const [deptFilter, setDeptFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<string | null>(null);

  // Form State
  const [empCode, setEmpCode] = useState('');
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState('Production');
  const [empRole, setEmpRole] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [empDate, setEmpDate] = useState(new Date().toISOString().split('T')[0]);
  const [empSalary, setEmpSalary] = useState<number | ''>('');

  const departments = ['All', 'Production', 'Sales', 'Purchase', 'Accounts', 'Warehouse', 'Dispatch', 'Administration'];

  const filteredEmployees = employees.filter(e => {
    const matchesDept = deptFilter === 'All' || e.department === deptFilter;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalPayroll = employees.reduce((acc, curr) => acc + curr.monthlySalary, 0);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEmployee({
      employeeCode: empCode || `EMP-2609-0${employees.length + 1}`,
      name: empName,
      department: empDept as any,
      role: empRole,
      mobile: empMobile,
      joiningDate: empDate,
      monthlySalary: Number(empSalary),
      status: 'Active'
    });
    setShowAddModal(false);
    setEmpName('');
    setEmpRole('');
    setEmpMobile('');
    setEmpSalary('');
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    await updateEmployee(editingEmployee.id, editingEmployee);
    setEditingEmployee(null);
  };

  const handleDeleteEmployeeConfirm = async () => {
    if (!deletingEmployeeId) return;
    await deleteEmployee(deletingEmployeeId);
    setDeletingEmployeeId(null);
  };

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

        <button
          onClick={() => {
            setEmpCode(`EMP-2609-0${employees.length + 1}`);
            setShowAddModal(true);
          }}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Employee</span>
        </button>
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
              <th className="p-3 text-right">Actions</th>
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
                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                  <button
                    onClick={() => setEditingEmployee(emp)}
                    className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer inline-flex items-center"
                    title="Edit Employee"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingEmployeeId(emp.id)}
                    className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer inline-flex items-center"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Add New Employee</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Emp Code</label>
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Department</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Mobile</label>
                  <input
                    type="text"
                    value={empMobile}
                    onChange={(e) => setEmpMobile(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                    required
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
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EMPLOYEE MODAL */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Edit Employee {editingEmployee.employeeCode}</h3>
            <form onSubmit={handleUpdateEmployee} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Department</label>
                  <select
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value as any })}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Mobile</label>
                  <input
                    type="text"
                    value={editingEmployee.mobile}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, mobile: e.target.value })}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={editingEmployee.monthlySalary}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, monthlySalary: Number(e.target.value) })}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
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
        isOpen={!!deletingEmployeeId}
        title="Delete Employee Record"
        message="Are you sure you want to delete this employee record?"
        confirmText="Delete"
        onConfirm={handleDeleteEmployeeConfirm}
        onClose={() => setDeletingEmployeeId(null)}
      />
    </div>
  );
};
