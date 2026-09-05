import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { ShieldAlert, Search, Filter, Clock, UserCheck, Shield } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = auditLogs.filter(log => {
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSearch =
      (log.performedBy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const uniqueActions: string[] = Array.from(new Set(auditLogs.map(l => l.action)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Security & Compliance Audit Trail</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable system event logs tracking authentication, inventory changes, prescription audits, and payroll adjustments.
          </p>
        </div>

        <span className="text-xs font-mono bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-lg font-bold">
          {auditLogs.length} Total Audit Records
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by user, details, or action..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterAction === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Actions
          </button>
          {uniqueActions.map(act => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterAction === act ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Security Action</th>
                <th className="p-3">Action Description & Payload</th>
                <th className="p-3 font-mono text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 font-sans">
                  <td className="p-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="p-3">
                    <span className="font-bold text-slate-900">{log.performedBy}</span>
                    <p className="text-[10px] text-slate-400 font-mono">{log.performedById}</p>
                  </td>

                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                      log.action.includes('LOGIN') ? 'bg-indigo-100 text-indigo-800' :
                      log.action.includes('PRODUCT') ? 'bg-emerald-100 text-emerald-800' :
                      log.action.includes('ORDER') ? 'bg-blue-100 text-blue-800' :
                      log.action.includes('SALARY') ? 'bg-teal-100 text-teal-800' :
                      log.action.includes('EMPLOYEE') ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3 text-slate-700 text-xs">
                    {log.details}
                  </td>

                  <td className="p-3 text-right font-mono text-slate-400 text-[11px]">
                    {log.ipAddress || '192.168.1.10'}
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
