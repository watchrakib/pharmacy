import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { SalaryRecord } from '../../types';
import {
  Banknote,
  Printer,
  PlusCircle,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Edit2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { SalarySlipModal } from '../common/SalarySlipModal';

export const SalaryView: React.FC = () => {
  const { salaries, employees, updateSalaryRecord, createSalaryRecord, settings } = usePharmacy();
  const [selectedSlip, setSelectedSlip] = useState<SalaryRecord | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate / Edit Form State
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.employeeId || '');
  const [month, setMonth] = useState('August 2026');
  const [basicSalary, setBasicSalary] = useState<number>(45000);
  const [allowance, setAllowance] = useState<number>(6000);
  const [bonus, setBonus] = useState<number>(4000);
  const [overtime, setOvertime] = useState<number>(2000);
  const [deduction, setDeduction] = useState<number>(500);
  const [tax, setTax] = useState<number>(1500);
  const [paymentDate, setPaymentDate] = useState('2026-08-31');
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING' | 'PROCESSING'>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CHEQUE' | 'CASH'>('BANK_TRANSFER');

  // Automatic Calculation:
  // Net Salary = Basic Salary + Allowance + Bonus + Overtime - Deduction - Tax
  const calculatedNetSalary = basicSalary + allowance + bonus + overtime - deduction - tax;

  const handleOpenGenerate = () => {
    const emp = employees[0];
    if (emp) {
      setSelectedEmpId(emp.employeeId);
      setBasicSalary(emp.salary || 40000);
      setAllowance(Math.round((emp.salary || 40000) * 0.15));
      setBonus(2000);
      setOvertime(0);
      setDeduction(0);
      setTax(Math.round((emp.salary || 40000) * 0.05));
    }
    setEditingRecord(null);
    setShowGenerateModal(true);
  };

  const handleOpenEdit = (sal: SalaryRecord) => {
    setEditingRecord(sal);
    setSelectedEmpId(sal.employeeId);
    setMonth(sal.month);
    setBasicSalary(sal.basicSalary);
    setAllowance(sal.allowance);
    setBonus(sal.bonus);
    setOvertime(sal.overtime);
    setDeduction(sal.deduction);
    setTax(sal.tax);
    setPaymentDate(sal.paymentDate);
    setPaymentStatus(sal.paymentStatus);
    setPaymentMethod(sal.paymentMethod);
    setShowGenerateModal(true);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.employeeId === selectedEmpId);
    const empName = emp?.fullName || 'Staff Member';

    if (editingRecord) {
      updateSalaryRecord(editingRecord.id, {
        basicSalary,
        allowance,
        bonus,
        overtime,
        deduction,
        tax,
        paymentDate,
        paymentStatus,
        paymentMethod
      });
    } else {
      createSalaryRecord({
        employeeId: selectedEmpId,
        employeeName: empName,
        month,
        basicSalary,
        allowance,
        bonus,
        overtime,
        deduction,
        tax,
        paymentDate,
        paymentStatus,
        paymentMethod
      });
    }
    setShowGenerateModal(false);
  };

  const filteredSalaries = salaries.filter(s =>
    (s.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.employeeId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.month || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayrollOutflow = salaries
    .filter(s => s.paymentStatus === 'PAID')
    .reduce((acc, s) => acc + s.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Salary & Payroll Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated net compensation calculator: Basic + Allowance + Bonus + Overtime - Deduction - Tax.
          </p>
        </div>

        <button
          onClick={handleOpenGenerate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Generate Payroll Voucher
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Disbursed Payroll This Month</span>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {settings.currency}{(totalPayrollOutflow ?? 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Direct deposit & corporate wire</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Staff Slips Issued</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{salaries.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">100% Tax Compliant</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Withholding Tax Deducted</span>
          <p className="text-xl font-bold font-mono text-blue-700 mt-1">
            {settings.currency}{(salaries.reduce((acc, s) => acc + (s.tax || 0), 0) ?? 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Remitted to National Board of Revenue</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by staff name, employee ID or month..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Staff Member</th>
                <th className="p-3">Pay Month</th>
                <th className="p-3 text-right">Basic</th>
                <th className="p-3 text-right">Allowance</th>
                <th className="p-3 text-right">Bonus/OT</th>
                <th className="p-3 text-right">Deductions/Tax</th>
                <th className="p-3 text-right">Net Salary</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSalaries.map(sal => (
                <tr key={sal.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{sal.employeeName}</p>
                    <span className="font-mono text-[10px] text-slate-400">{sal.employeeId} • {sal.salaryId}</span>
                  </td>

                  <td className="p-3 text-slate-700 font-medium">{sal.month}</td>

                  <td className="p-3 text-right font-mono text-slate-600">
                    {settings.currency}{(sal.basicSalary ?? 0).toLocaleString()}
                  </td>

                  <td className="p-3 text-right font-mono text-slate-600">
                    +{settings.currency}{(sal.allowance ?? 0).toLocaleString()}
                  </td>

                  <td className="p-3 text-right font-mono text-emerald-700">
                    +{settings.currency}{((sal.bonus ?? 0) + (sal.overtime ?? 0)).toLocaleString()}
                  </td>

                  <td className="p-3 text-right font-mono text-rose-600">
                    -{settings.currency}{((sal.deduction ?? 0) + (sal.tax ?? 0)).toLocaleString()}
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-sm text-slate-950">
                    {settings.currency}{(sal.netSalary ?? 0).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sal.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      sal.paymentStatus === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {sal.paymentStatus}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sal.paymentDate}</p>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(sal)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        title="Edit Salary Calculation"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedSlip(sal)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold cursor-pointer shadow-xs text-xs"
                        title="Print Certified Payslip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Payslip
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate / Edit Salary Voucher Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-xl w-full p-6 my-8 relative text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingRecord ? 'Edit Employee Compensation Voucher' : 'Issue Monthly Payroll Voucher'}
              </h2>
              <button onClick={() => setShowGenerateModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Employee</label>
                  <select
                    value={selectedEmpId}
                    onChange={e => {
                      const id = e.target.value;
                      setSelectedEmpId(id);
                      const emp = employees.find(empItem => empItem.employeeId === id);
                      if (emp) {
                        setBasicSalary(emp.salary);
                        setAllowance(Math.round(emp.salary * 0.15));
                        setTax(Math.round(emp.salary * 0.05));
                      }
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {employees.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.fullName} ({emp.employeeId} - {emp.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Pay Period (Month)</label>
                  <input
                    type="text"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    placeholder="e.g. September 2026"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Automatic Calculation Grid */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Itemized Compensation Formula
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Basic Salary (+)</label>
                    <input
                      type="number"
                      value={basicSalary}
                      onChange={e => setBasicSalary(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Allowance (+)</label>
                    <input
                      type="number"
                      value={allowance}
                      onChange={e => setAllowance(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Performance Bonus (+)</label>
                    <input
                      type="number"
                      value={bonus}
                      onChange={e => setBonus(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Overtime Pay (+)</label>
                    <input
                      type="number"
                      value={overtime}
                      onChange={e => setOvertime(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Deduction (-)</label>
                    <input
                      type="number"
                      value={deduction}
                      onChange={e => setDeduction(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Withholding Tax (-)</label>
                    <input
                      type="number"
                      value={tax}
                      onChange={e => setTax(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                {/* Live Net Result Callout */}
                <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Auto-Calculated Net Salary</span>
                    <p className="text-[10px] text-slate-300">Basic + Allow + Bonus + OT - Deduct - Tax</p>
                  </div>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {settings.currency}{(calculatedNetSalary ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Disbursement Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingRecord ? 'Save Changes' : 'Confirm & Disburse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Salary Slip Modal */}
      {selectedSlip && (
        <SalarySlipModal salary={selectedSlip} onClose={() => setSelectedSlip(null)} />
      )}
    </div>
  );
};
