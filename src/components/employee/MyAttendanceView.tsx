import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { CalendarCheck, Clock, CheckCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

export const MyAttendanceView: React.FC = () => {
  const { currentUser } = useAuth();
  const { attendance, getTodayAttendance, checkInEmployee, checkOutEmployee } = usePharmacy();
  const [selectedMonth, setSelectedMonth] = useState('2026-09');

  const empId = currentUser?.employeeId || '';
  const todayAtt = empId ? getTodayAttendance(empId) : undefined;
  const isCheckedIn = !!todayAtt?.checkInTime && !todayAtt?.checkOutTime;

  // Filter attendance records for current employee
  const myRecords = attendance
    .filter(r => r.employeeId === empId && r.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  const presentDays = myRecords.filter(r => r.status === 'PRESENT').length;
  const lateDays = myRecords.filter(r => r.status === 'LATE').length;
  const totalLoggedHours = myRecords.reduce((acc, r) => acc + (r.workingHours || 8), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Shift & Attendance Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Biometric check-in station, shift hours tracking, and monthly punctuality overview.
          </p>
        </div>

        {/* Live Punch Controls */}
        <div className="flex items-center gap-3">
          {isCheckedIn ? (
            <button
              onClick={() => checkOutEmployee(empId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              Check Out Now
            </button>
          ) : (
            <button
              onClick={() => checkInEmployee(empId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              Check In Today
            </button>
          )}
        </div>
      </div>

      {/* Today's Punch Card & Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Today's Status</span>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {todayAtt ? todayAtt.status : 'NOT CHECKED IN'}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">
            {todayAtt?.checkInTime ? `In: ${todayAtt.checkInTime}` : 'Punch in when shift starts'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Days Present (This Month)</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{presentDays} days</p>
          <span className="text-[10px] text-slate-400">On-time clock ins</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Late Arrivals</span>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{lateDays} days</p>
          <span className="text-[10px] text-slate-400">Grace period: 10 mins</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Cumulative Shift Hours</span>
          <p className="text-2xl font-bold font-mono text-purple-700 mt-1">{totalLoggedHours.toFixed(1)} hrs</p>
          <span className="text-[10px] text-slate-400">Standard 8 hr shifts</span>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <span className="font-semibold text-slate-800">Monthly Attendance History:</span>
        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1 bg-white focus:outline-none"
        />
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Shift Date</th>
                <th className="p-3 font-mono">Clock In</th>
                <th className="p-3 font-mono">Clock Out</th>
                <th className="p-3 font-mono">Hours Rendered</th>
                <th className="p-3">Status</th>
                <th className="p-3">Supervisor Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {myRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                    No attendance logs recorded for {selectedMonth}.
                  </td>
                </tr>
              ) : (
                myRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 font-sans">
                    <td className="p-3 font-mono font-medium text-slate-900">{rec.date}</td>
                    <td className="p-3 font-mono text-emerald-700">{rec.checkInTime}</td>
                    <td className="p-3 font-mono text-slate-600">{rec.checkOutTime || 'Active Shift'}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
