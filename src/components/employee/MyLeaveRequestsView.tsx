import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { CalendarDays, PlusCircle, CheckCircle, Clock, XCircle, X } from 'lucide-react';

export const MyLeaveRequestsView: React.FC = () => {
  const { currentUser, currentEmployee } = useAuth();
  const { leaves, submitLeaveRequest } = usePharmacy();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState<'CASUAL' | 'SICK' | 'ANNUAL' | 'MATERNITY' | 'UNPAID'>('CASUAL');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const empId = currentUser?.employeeId || '';
  const myLeaves = leaves.filter(l => l.employeeId === empId);

  const calculateDays = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diff);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitLeaveRequest({
      employeeId: empId,
      employeeName: currentEmployee?.fullName || currentUser?.name || 'Employee',
      leaveType,
      startDate,
      endDate,
      totalDays: calculateDays(),
      reason: reason.trim()
    });

    setReason('');
    setShowApplyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Leave Applications & Quota</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit leave requests for Store Manager and Admin approval.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Quota Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Annual Paid Leave Quota</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">20 Days</p>
          <span className="text-[10px] text-slate-400">Standard statutory allocation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Leaves Availed & Approved</span>
          <p className="text-2xl font-bold font-mono text-blue-700 mt-1">
            {myLeaves.filter(l => l.status === 'APPROVED').reduce((acc, l) => acc + l.totalDays, 0)} Days
          </p>
          <span className="text-[10px] text-slate-400">Current calendar year</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Pending Under Review</span>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">
            {myLeaves.filter(l => l.status === 'PENDING').length} Request(s)
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Awaiting Manager sign-off</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">My Leave Application History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Duration & Dates</th>
                <th className="p-3">Reason Provided</th>
                <th className="p-3">Date Applied</th>
                <th className="p-3">Status</th>
                <th className="p-3">Manager Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No leave requests found. Click "Apply for Leave" above.
                  </td>
                </tr>
              ) : (
                myLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50/60">
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-900">
                      {leave.startDate} to {leave.endDate}
                      <span className="block text-[10px] text-emerald-700 font-semibold">
                        ({leave.totalDays} day{leave.totalDays > 1 ? 's' : ''})
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs">{leave.reason}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{leave.appliedOn}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 italic">
                      {leave.reviewedBy ? `Reviewed by ${leave.reviewedBy}` : 'Pending supervisor response'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Submit Leave Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Classification</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Medical / Sick Leave</option>
                  <option value="ANNUAL">Annual Earned Leave</option>
                  <option value="MATERNITY">Maternity / Paternity</option>
                  <option value="UNPAID">Leave Without Pay</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 flex justify-between items-center">
                <span>Calculated Duration:</span>
                <span className="font-bold text-emerald-800 font-mono text-sm">{calculateDays()} Calendar Day(s)</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Reason & Handover Plan</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Attending family medical emergency; duty coverage arranged with Pharmacist..."
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
