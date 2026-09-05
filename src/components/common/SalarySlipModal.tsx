import React from 'react';
import { SalaryRecord } from '../../types';
import { usePharmacy } from '../../context/PharmacyContext';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface SalarySlipModalProps {
  salary: SalaryRecord | null;
  onClose: () => void;
}

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({ salary, onClose }) => {
  const { settings, employees } = usePharmacy();

  if (!salary) return null;

  const emp = employees.find(e => e.employeeId === salary.employeeId || e.fullName === salary.employeeName);

  const handlePrint = () => {
    window.print();
  };

  const totalEarnings = (salary.basicSalary || 0) + (salary.allowance || 0) + (salary.bonus || 0) + (salary.overtime || 0);
  const totalDeductions = (salary.deduction || 0) + (salary.tax || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative print:m-0 print:p-6 print:shadow-none print:max-w-none print:w-full">
        {/* Action Header (hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Official Salary Certificate
            </span>
            <span className="text-slate-500 text-sm">{salary.salaryId}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Payslip
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Payslip Body */}
        <div id="printable-salary-slip" className="space-y-6">
          {/* Pharmacy Letterhead */}
          <div className="text-center border-b-2 border-slate-900/80 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">{settings.pharmacyName}</h1>
            <p className="text-xs text-slate-600">{settings.tagline}</p>
            <p className="text-xs text-slate-500 mt-1">{settings.address}</p>
            <p className="text-xs text-slate-500">Phone: {settings.phone} | Email: {settings.email}</p>
            <div className="mt-3 inline-block bg-slate-100 text-slate-800 font-semibold px-4 py-1 text-sm rounded uppercase tracking-wider">
              Pay Slip for the month of {salary.month}
            </div>
          </div>

          {/* Employee & Payroll Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="space-y-1.5">
              <p><strong className="text-slate-600">Employee Name:</strong> <span className="font-semibold text-slate-900">{salary.employeeName}</span></p>
              <p><strong className="text-slate-600">Employee ID:</strong> <span className="font-medium text-slate-800">{salary.employeeId}</span></p>
              <p><strong className="text-slate-600">Designation:</strong> <span className="text-slate-800">{emp?.position || 'Staff'}</span></p>
              <p><strong className="text-slate-600">Department:</strong> <span className="text-slate-800">{emp?.department || 'Operations'}</span></p>
            </div>
            <div className="space-y-1.5 text-right">
              <p><strong className="text-slate-600">Slip No:</strong> <span className="font-mono font-medium text-slate-900">{salary.salaryId}</span></p>
              <p><strong className="text-slate-600">Disbursement Date:</strong> <span className="text-slate-800">{salary.paymentDate}</span></p>
              <p><strong className="text-slate-600">Disbursement Mode:</strong> <span className="text-slate-800">{salary.paymentMethod.replace('_', ' ')}</span></p>
              <p className="flex items-center justify-end gap-1 text-emerald-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Status: {salary.paymentStatus}
              </p>
            </div>
          </div>

          {/* Itemized Calculation Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-emerald-50 text-emerald-900 font-bold px-3 py-2 text-xs uppercase border-b border-emerald-100 flex justify-between">
                <span>Earnings (Additions)</span>
                <span>Amount ({settings.currency})</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Basic Salary</span>
                  <span className="font-mono font-medium">{settings.currency}{(salary.basicSalary ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Medical & House Allowance</span>
                  <span className="font-mono font-medium">{settings.currency}{(salary.allowance ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Performance Incentive / Bonus</span>
                  <span className="font-mono font-medium">{settings.currency}{(salary.bonus ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Overtime & Shift Differential</span>
                  <span className="font-mono font-medium">{settings.currency}{(salary.overtime ?? 0).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Total Gross Earnings</span>
                  <span className="font-mono text-emerald-700">{settings.currency}{(totalEarnings ?? 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-rose-50 text-rose-900 font-bold px-3 py-2 text-xs uppercase border-b border-rose-100 flex justify-between">
                <span>Deductions</span>
                <span>Amount ({settings.currency})</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Withholding Income Tax</span>
                  <span className="font-mono font-medium">{settings.currency}{(salary.tax ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Provident / Leave Deduction</span>
                  <span className="font-mono font-medium">{settings.currency}{(salary.deduction ?? 0).toLocaleString()}</span>
                </div>
                <div className="h-10"></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-700">{settings.currency}{(totalDeductions ?? 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Box */}
          <div className="bg-slate-900 text-white rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Net Disbursed Take-Home Salary</p>
              <p className="text-xs text-slate-300 italic">Basic + Allowance + Bonus + Overtime - Deduction - Tax</p>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {settings.currency}{(salary.netSalary ?? 0).toLocaleString()}
            </div>
          </div>

          {/* Signature & Verification Footnotes */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
            <div className="space-y-1">
              <div className="border-b border-slate-300 w-36 mx-auto mb-1"></div>
              <p className="font-medium text-slate-700">{salary.employeeName}</p>
              <p className="text-[10px]">Employee Signature</p>
            </div>
            <div className="space-y-1">
              <div className="border-b border-slate-300 w-36 mx-auto mb-1"></div>
              <p className="font-medium text-slate-700">{settings.ownerName}</p>
              <p className="text-[10px]">Authorized Signatory, {settings.pharmacyName}</p>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Computer-generated salary voucher verified through MEDISHOP Pharmacy Management ERP.
          </div>
        </div>
      </div>
    </div>
  );
};
