import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  CalendarCheck,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  UserX,
  Calendar,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { attendance, employees } = usePharmacy();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>('2026-09-04');

  const filteredRecords = attendance.filter(rec => {
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    const matchesDate = !searchDate || rec.date === searchDate;
    return matchesStatus && matchesDate;
  });

  // Calculate attendance counters for current viewed date
  const dateRecords = attendance.filter(r => r.date === searchDate);
  const presentCount = dateRecords.filter(r => r.status === 'PRESENT').length;
  const lateCount = dateRecords.filter(r => r.status === 'LATE').length;
  const leaveCount = dateRecords.filter(r => r.status === 'ON_LEAVE').length;
  const absentCount = Math.max(0, employees.length - (presentCount + lateCount + leaveCount));

  const totalWorkingHours = dateRecords.reduce((acc, r) => acc + (r.workingHours || 8.0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Attendance Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor biometric clock-in logs, punctuality metrics, working shifts, and monthly attendance reports.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Daily Report
        </button>
      </div>

      {/* Overview Cards for Current Date */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span>Present Today</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{presentCount}</p>
          <span className="text-[10px] text-slate-400">On-time arrivals</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span>Late Arrivals</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">{lateCount}</p>
          <span className="text-[10px] text-slate-400">After 09:10 AM threshold</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span>On Approved Leave</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-700 mt-1">{leaveCount}</p>
          <span className="text-[10px] text-slate-400">Sanctioned leaves</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span>Absent</span>
            <UserX className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1">{absentCount}</p>
          <span className="text-[10px] text-slate-400">Unaccounted absence</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex justify-between items-center text-slate-500 text-xs">
            <span>Total Hours Logged</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-700 mt-1">{totalWorkingHours.toFixed(1)}h</p>
          <span className="text-[10px] text-slate-400">Store operational man-hours</span>
        </div>
      </div>

      {/* Date and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-600 font-medium">Select Date:</span>
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['all', 'PRESENT', 'LATE', 'ON_LEAVE', 'ABSENT'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Shift Date</th>
                <th className="p-3">Check-In Time</th>
                <th className="p-3">Check-Out Time</th>
                <th className="p-3">Working Hours</th>
                <th className="p-3">Punctuality Status</th>
                <th className="p-3">Shift Supervisor Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No attendance logs found for {searchDate}.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(rec => {
                  const emp = employees.find(e => e.employeeId === rec.employeeId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={rec.employeeName}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{rec.employeeName}</p>
                            <span className="font-mono text-[10px] text-slate-400">{rec.employeeId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700 font-mono">{rec.date}</td>
                      <td className="p-3 font-mono font-medium text-emerald-700">{rec.checkInTime}</td>
                      <td className="p-3 font-mono text-slate-600">{rec.checkOutTime || 'Active Shift'}</td>
                      <td className="p-3 font-mono font-semibold text-slate-900">
                        {rec.workingHours ? `${rec.workingHours} hrs` : 'In Progress'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                          rec.status === 'LATE' ? 'bg-amber-100 text-amber-800' :
                          rec.status === 'ON_LEAVE' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 italic max-w-xs truncate">
                        {rec.notes || 'Routine duties verified'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
