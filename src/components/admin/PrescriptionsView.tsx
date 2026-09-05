import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Prescription } from '../../types';
import {
  FileCheck2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PrescriptionModal } from '../common/PrescriptionModal';

export const PrescriptionsView: React.FC = () => {
  const { prescriptions } = usePharmacy();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const filtered = prescriptions.filter(rx => {
    const matchesFilter = filter === 'all' || rx.status === filter;
    const matchesSearch =
      (rx.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rx.customerPhone || '').includes(searchQuery) ||
      ((rx.doctorName || '').toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Prescription Verification</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered Pharmacist review queue for Schedule H & Rx restricted drug dispensing.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All Prescriptions' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(rx => (
          <div
            key={rx.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              {/* Prescription Image Preview */}
              <div className="relative h-44 bg-slate-100 overflow-hidden group">
                <img
                  src={rx.imageUrl}
                  alt={`Prescription from ${rx.customerName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                    rx.status === 'APPROVED' ? 'bg-emerald-600 text-white' :
                    rx.status === 'REJECTED' ? 'bg-rose-600 text-white' :
                    'bg-amber-500 text-slate-950 font-extrabold animate-pulse'
                  }`}>
                    {rx.status.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRx(rx)}
                  className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Review & Dispense
                </button>
              </div>

              {/* Info Details */}
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{rx.customerName}</h3>
                    <p className="text-slate-500 flex items-center gap-1 text-[11px] mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {rx.customerPhone}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rx.uploadedAt}</span>
                </div>

                {rx.doctorName && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                    <span className="text-slate-500">Prescribing Clinician:</span>
                    <p className="font-bold text-slate-800">{rx.doctorName}</p>
                    {rx.hospitalName && <p className="text-slate-400 text-[10px]">{rx.hospitalName}</p>}
                  </div>
                )}

                {rx.pharmacistNotes && (
                  <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 text-[11px] text-emerald-900">
                    <span className="font-semibold text-emerald-800">Pharmacist Notes:</span>
                    <p className="italic mt-0.5">{rx.pharmacistNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => setSelectedRx(rx)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                Clinical Audit & Verification
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Review & Verification Modal */}
      {selectedRx && (
        <PrescriptionModal prescription={selectedRx} onClose={() => setSelectedRx(null)} />
      )}
    </div>
  );
};
