import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { Banknote, Download, Printer, ShieldCheck, CheckCircle, FileText, X } from 'lucide-react';
import { SalaryRecord } from '../../types';

interface MySalaryViewProps {
  onOpenSalarySlip?: (salId: string) => void;
}

export const MySalaryView: React.FC<MySalaryViewProps> = () => {
  const { currentUser, currentEmployee } = useAuth();
  const { salaries, settings } = usePharmacy();
  const [selectedSlip, setSelectedSlip] = useState<SalaryRecord | null>(null);

  const empId = currentUser?.employeeId || '';

  // SECURITY ENFORCEMENT:
  // Strictly filter only salary records belonging to this logged in employee.
  // Other employees' salary records are never rendered or leaked.
  const mySalaries = salaries
    .filter(s => s.employeeId === empId)
    .sort((a, b) => b.month.localeCompare(a.month));

  const latestSlip = mySalaries[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Compensation & Salary Slips</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confidential employee payroll ledger, allowance itemization, tax deductions, and certified monthly payslips.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          End-to-End Encrypted Financial Record
        </span>
      </div>

      {/* Latest Month Breakdown Card */}
      {latestSlip ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Latest Pay Statement</span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">{latestSlip.month} Pay Period</h2>
            </div>

            <button
              onClick={() => setSelectedSlip(latestSlip)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              Download Official Pay Slip
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[11px] text-slate-500 font-medium">Basic Pay</span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                {settings.currency}{(latestSlip.basicSalary ?? 0).toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl">
              <span className="text-[11px] text-emerald-700 font-medium">Allowances & Overtime</span>
              <p className="text-lg font-bold font-mono text-emerald-800 mt-0.5">
                +{settings.currency}{((latestSlip.allowance ?? 0) + (latestSlip.overtime ?? 0) + (latestSlip.bonus ?? 0)).toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl">
              <span className="text-[11px] text-rose-700 font-medium">Deductions & Tax</span>
              <p className="text-lg font-bold font-mono text-rose-700 mt-0.5">
                -{settings.currency}{((latestSlip.deduction ?? 0) + (latestSlip.tax ?? 0)).toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <span className="text-[11px] text-slate-300 font-medium">Net Disbursed Pay</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {settings.currency}{(latestSlip.netSalary ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          Your current monthly salary: {settings.currency}{(currentEmployee?.salary || 0).toLocaleString()} (Standard Monthly Disbursal)
        </div>
      )}

      {/* Salary History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Historical Disbursed Payslips</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Pay Period</th>
                <th className="p-3 text-right">Basic Salary</th>
                <th className="p-3 text-right">Allowances</th>
                <th className="p-3 text-right">Bonus/OT</th>
                <th className="p-3 text-right">Deductions</th>
                <th className="p-3 text-right">Net Remitted</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {mySalaries.map(sal => (
                <tr key={sal.id} className="hover:bg-slate-50/60 font-sans">
                  <td className="p-3 font-mono font-bold text-slate-900">{sal.month}</td>
                  <td className="p-3 text-right font-mono text-slate-700">
                    {settings.currency}{(sal.basicSalary ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-700">
                    +{settings.currency}{(sal.allowance ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-700">
                    +{settings.currency}{((sal.bonus ?? 0) + (sal.overtime ?? 0)).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono text-rose-600">
                    -{settings.currency}{((sal.deduction ?? 0) + (sal.tax ?? 0)).toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700 text-sm">
                    {settings.currency}{(sal.netSalary ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {sal.paymentStatus}
                    </span>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{sal.paymentDate}</p>
                  </td>
                  <td className="p-3 text-right font-sans">
                    <button
                      onClick={() => setSelectedSlip(sal)}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="View & Download Payslip"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 relative border text-xs">
            {/* Action Bar */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Pharmacy Remittance Slip
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedSlip(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Pay Slip Content */}
            <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center border-b pb-3">
                <h2 className="text-lg font-black text-slate-900">{settings.pharmacyName}</h2>
                <p className="text-[11px] text-slate-500">{settings.address} • License: {settings.drugLicenseNumber}</p>
                <p className="text-xs font-bold text-emerald-800 mt-1 uppercase tracking-wider">
                  CONFIDENTIAL EMPLOYEE SALARY SLIP - {selectedSlip.month}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <p><strong>Employee Name:</strong> {selectedSlip.employeeName}</p>
                  <p><strong>Employee ID:</strong> {selectedSlip.employeeId}</p>
                  <p><strong>Designation:</strong> {currentEmployee?.position || 'Staff'}</p>
                </div>
                <div>
                  <p><strong>Department:</strong> {currentEmployee?.department || 'Operations'}</p>
                  <p><strong>Payment Mode:</strong> {selectedSlip.paymentMethod}</p>
                  <p><strong>Disbursed On:</strong> {selectedSlip.paymentDate}</p>
                </div>
              </div>

              {/* Earnings & Deductions Table */}
              <div className="grid grid-cols-2 gap-4">
                {/* Earnings */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-emerald-800 border-b pb-1 mb-2">Earnings (+)</h4>
                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Basic Pay:</span>
                      <span>{settings.currency}{(selectedSlip.basicSalary ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Allowances:</span>
                      <span>{settings.currency}{(selectedSlip.allowance ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Performance Bonus:</span>
                      <span>{settings.currency}{(selectedSlip.bonus ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Overtime:</span>
                      <span>{settings.currency}{(selectedSlip.overtime ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <h4 className="font-bold text-rose-800 border-b pb-1 mb-2">Deductions (-)</h4>
                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-sans">Income Tax & Prov:</span>
                      <span>{settings.currency}{((selectedSlip.deduction ?? 0) + (selectedSlip.tax ?? 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Net Salary */}
              <div className="p-3 bg-emerald-900 text-white rounded-lg flex justify-between items-center font-bold">
                <span className="text-sm">NET DISBURSED AMOUNT:</span>
                <span className="text-xl font-mono text-emerald-300">
                  {settings.currency}{(selectedSlip.netSalary ?? 0).toLocaleString()}
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center text-[10px] text-slate-400 border-t">
                <span>Computer-generated official payslip. No manual signature required.</span>
                <span>Audit Ref: PAY-{selectedSlip.id.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
