import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Filter,
  Check,
  X
} from 'lucide-react';

export const LeaveRequestsView: React.FC = () => {
  const { leaves, reviewLeaveRequest } = usePharmacy();
  const [filter, setFilter] = useState<string>('all');
  const [reviewNote, setReviewNote] = useState('');
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);

  const filteredLeaves = leaves.filter(l => (filter === 'all' ? true : l.status === filter));

  const handleDecision = (id: string, status: 'APPROVED' | 'REJECTED') => {
    reviewLeaveRequest(id, status, reviewNote || undefined);
    setSelectedLeaveId(null);
    setReviewNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, approve, or reject employee leave applications with automatic attendance adjustments.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'PENDING', 'APPROVED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All Applications' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Leaves Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Staff Member</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Duration & Dates</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Applied Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Approval Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.map(leave => (
                <tr key={leave.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{leave.employeeName}</p>
                    <span className="font-mono text-[10px] text-slate-400">{leave.employeeId}</span>
                  </td>

                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-800 font-semibold text-[10px] px-2 py-0.5 rounded">
                      {leave.leaveType} LEAVE
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="font-medium text-slate-800">
                      {leave.startDate} to {leave.endDate}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      {leave.totalDays} calendar day(s)
                    </span>
                  </td>

                  <td className="p-3 text-slate-600 max-w-xs">
                    <p className="line-clamp-2">{leave.reason}</p>
                  </td>

                  <td className="p-3 text-slate-500 font-mono text-[11px]">{leave.appliedOn}</td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      leave.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {leave.status}
                    </span>
                    {leave.reviewedBy && (
                      <p className="text-[9px] text-slate-400 mt-0.5">By {leave.reviewedBy}</p>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {leave.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDecision(leave.id, 'APPROVED')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-xs"
                          title="Approve Leave"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(leave.id, 'REJECTED')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-semibold cursor-pointer shadow-xs"
                          title="Reject Leave"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Decision Finalized</span>
                    )}
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
