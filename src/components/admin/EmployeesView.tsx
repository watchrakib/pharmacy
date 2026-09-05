import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Employee, UserRole } from '../../types';
import {
  UserPlus,
  Search,
  KeyRound,
  Eye,
  Edit2,
  Power,
  Shield,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Banknote,
  X
} from 'lucide-react';

interface EmployeesViewProps {
  onOpenSalarySlip?: (empId: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({ onOpenSalarySlip }) => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    resetEmployeePassword,
    attendance,
    salaries,
    settings
  } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [tempPasswordNotice, setTempPasswordNotice] = useState<{ name: string; pass: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
    position: '',
    department: 'Pharmacy & Dispensing',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 40000,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'PHARMACIST' as UserRole,
    permissions: ['orders', 'medicines'],
    performanceNotes: 'Punctual, meticulous adherence to drug dispensing guidelines.'
  });

  const availableRoles: { role: UserRole; label: string }[] = [
    { role: 'PHARMACIST', label: 'Pharmacist' },
    { role: 'SALES_STAFF', label: 'Sales Staff' },
    { role: 'INVENTORY_STAFF', label: 'Inventory Staff' },
    { role: 'DELIVERY_STAFF', label: 'Delivery Staff' },
    { role: 'MANAGER', label: 'Manager' },
    { role: 'ACCOUNTANT', label: 'Accountant' }
  ];

  const allAvailablePermissions = [
    { key: 'orders', label: 'Manage Orders' },
    { key: 'prescriptions', label: 'Review Prescriptions' },
    { key: 'medicines', label: 'View/Edit Medicines' },
    { key: 'inventory', label: 'Inventory & Stock Count' },
    { key: 'sales', label: 'POS Billing & Sales Counter' },
    { key: 'customers', label: 'Customer Directory' },
    { key: 'purchases', label: 'Purchase Orders & Suppliers' },
    { key: 'salary', label: 'Salary & Payroll Records' },
    { key: 'reports', label: 'Department Reports' },
    { key: 'delivery', label: 'Delivery Dispatch' }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      (emp.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.position || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    const nextId = `EMP-${100 + employees.length + 1}`;
    setFormData({
      employeeId: nextId,
      fullName: '',
      phone: '+880 1711-',
      email: '',
      address: 'Dhaka, Bangladesh',
      position: 'Staff Pharmacist',
      department: 'Pharmacy & Dispensing',
      joiningDate: new Date().toISOString().split('T')[0],
      salary: 45000,
      status: 'ACTIVE',
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      role: 'PHARMACIST',
      permissions: ['prescriptions', 'medicines', 'orders'],
      performanceNotes: 'Newly registered employee onboarded.'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFormData({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      phone: emp.phone,
      email: emp.email,
      address: emp.address,
      position: emp.position,
      department: emp.department,
      joiningDate: emp.joiningDate,
      salary: emp.salary,
      status: emp.status,
      profilePhoto: emp.profilePhoto,
      role: emp.role,
      permissions: emp.permissions || [],
      performanceNotes: emp.performance.performanceNotes
    });
    setShowEditModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      employeeId: formData.employeeId,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      position: formData.position,
      department: formData.department,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      status: formData.status,
      profilePhoto: formData.profilePhoto,
      role: formData.role,
      permissions: formData.permissions,
      performance: {
        salesCompleted: 0,
        ordersProcessed: 0,
        tasksCompleted: 0,
        attendanceRate: 100,
        customerRating: 5.0,
        performanceNotes: formData.performanceNotes
      }
    });
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    updateEmployee(selectedEmployee.id, {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      position: formData.position,
      department: formData.department,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      status: formData.status,
      profilePhoto: formData.profilePhoto,
      role: formData.role,
      permissions: formData.permissions,
      performance: {
        ...selectedEmployee.performance,
        performanceNotes: formData.performanceNotes
      }
    });
    setShowEditModal(false);
  };

  const handleResetPassword = (emp: Employee) => {
    const temp = resetEmployeePassword(emp.id);
    setTempPasswordNotice({ name: emp.fullName, pass: temp });
  };

  const togglePermission = (permKey: string) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists ? prev.permissions.filter(p => p !== permKey) : [...prev.permissions, permKey]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Employee Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, assign roles, calibrate permissions, review attendance, and monitor performance.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Password Reset Modal / Notice Banner */}
      {tempPasswordNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900">
          <div>
            <span className="font-bold">Password Reset Generated for {tempPasswordNotice.name}:</span>
            <span className="ml-2 font-mono bg-white px-2 py-0.5 border border-emerald-200 rounded font-bold text-emerald-700">
              {tempPasswordNotice.pass}
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Please convey this temporary credential securely to the employee for their first portal login.
            </p>
          </div>
          <button
            onClick={() => setTempPasswordNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, position, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Roles ({employees.length})
          </button>
          {availableRoles.map(r => (
            <button
              key={r.role}
              onClick={() => setRoleFilter(r.role)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                roleFilter === r.role
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Role & Department</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Performance</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.profilePhoto}
                        alt={emp.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{emp.fullName}</p>
                        <span className="font-mono text-[10px] text-slate-400">{emp.employeeId}</span>
                        <p className="text-[11px] text-slate-500">{emp.position}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      emp.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' :
                      emp.role === 'PHARMACIST' ? 'bg-emerald-100 text-emerald-800' :
                      emp.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                      emp.role === 'ACCOUNTANT' ? 'bg-blue-100 text-blue-800' :
                      emp.role === 'DELIVERY_STAFF' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {emp.role.replace('_', ' ')}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">{emp.department}</p>
                  </td>

                  <td className="p-3 space-y-0.5">
                    <p className="flex items-center gap-1 text-slate-700">
                      <Phone className="w-3 h-3 text-slate-400" /> {emp.phone}
                    </p>
                    <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" /> {emp.email}
                    </p>
                  </td>

                  <td className="p-3 font-mono font-semibold text-slate-900">
                    {settings.currency}{(emp.salary ?? 0).toLocaleString()}/mo
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{emp.performance.customerRating} / 5.0</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {emp.performance.ordersProcessed} orders • {emp.performance.attendanceRate}% on-time
                    </p>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => toggleEmployeeStatus(emp.id)}
                      disabled={emp.role === 'ADMIN'}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer disabled:cursor-default ${
                        emp.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      }`}
                      title="Click to toggle status"
                    >
                      <Power className="w-3 h-3" />
                      {emp.status}
                    </button>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setShowDetailsModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View Complete Profile & Performance"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(emp)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit Employee & Roles"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleResetPassword(emp)}
                        className="p-1.5 text-slate-400 hover:text-amber-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Reset Portal Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {showAddModal ? 'Register New Staff Member' : `Edit Employee (${formData.employeeId})`}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleSaveAdd : handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Position / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {availableRoles.map(r => (
                      <option key={r.role} value={r.role}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Monthly Salary ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Explicit Permissions Checkbox Grid */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block font-semibold text-slate-800 mb-2">Granular Role Permissions:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allAvailablePermissions.map(p => (
                    <label key={p.key} className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(p.key)}
                        onChange={() => togglePermission(p.key)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Performance & Operational Notes</label>
                <textarea
                  rows={2}
                  value={formData.performanceNotes}
                  onChange={e => setFormData({ ...formData, performanceNotes: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                >
                  {showAddModal ? 'Register Employee' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Details & Performance Modal */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-xl w-full p-6 my-8 relative text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Personnel Dossier & Performance Audit</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <img
                src={selectedEmployee.profilePhoto}
                alt={selectedEmployee.fullName}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-600"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedEmployee.fullName}</h3>
                <p className="text-slate-500">{selectedEmployee.position} • {selectedEmployee.employeeId}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {selectedEmployee.role}
                  </span>
                  <span className="text-slate-400 text-[10px]">Joined: {selectedEmployee.joiningDate}</span>
                </div>
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <p className="text-[10px] text-emerald-800 font-semibold uppercase">Customer Rating</p>
                <p className="text-lg font-bold text-emerald-900 font-mono mt-0.5">
                  {selectedEmployee.performance.customerRating} / 5.0
                </p>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-800 font-semibold uppercase">Orders Handled</p>
                <p className="text-lg font-bold text-blue-900 font-mono mt-0.5">
                  {selectedEmployee.performance.ordersProcessed}
                </p>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                <p className="text-[10px] text-purple-800 font-semibold uppercase">Attendance Rate</p>
                <p className="text-lg font-bold text-purple-900 font-mono mt-0.5">
                  {selectedEmployee.performance.attendanceRate}%
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3 text-slate-700">
              <p><strong>Contact Phone:</strong> {selectedEmployee.phone}</p>
              <p><strong>Corporate Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Registered Address:</strong> {selectedEmployee.address}</p>
              <p><strong>Standard Monthly Base:</strong> {settings.currency}{(selectedEmployee.salary ?? 0).toLocaleString()}</p>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-2">
                <p className="font-semibold text-amber-900">Performance Evaluator Notes:</p>
                <p className="text-amber-800 mt-0.5 italic">{selectedEmployee.performance.performanceNotes}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
