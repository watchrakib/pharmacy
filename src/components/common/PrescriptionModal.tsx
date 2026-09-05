import React, { useState } from 'react';
import { Prescription } from '../../types';
import { usePharmacy } from '../../context/PharmacyContext';
import { useAuth } from '../../context/AuthContext';
import { X, CheckCircle, XCircle, FileText, UserCheck } from 'lucide-react';

interface PrescriptionModalProps {
  prescription: Prescription | null;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, onClose }) => {
  const { reviewPrescription } = usePharmacy();
  const { userRole } = useAuth();
  const [notes, setNotes] = useState(prescription?.pharmacistNotes || '');
  const [doctorVerified, setDoctorVerified] = useState(true);
  const [dosageVerified, setDosageVerified] = useState(true);
  const [interactionChecked, setInteractionChecked] = useState(true);

  if (!prescription) return null;

  const canReview = userRole === 'ADMIN' || userRole === 'PHARMACIST' || userRole === 'MANAGER';

  const handleApprove = () => {
    reviewPrescription(prescription.id, 'VERIFIED', notes || 'Prescription clinically verified & approved for dispensing.');
    onClose();
  };

  const handleDispense = () => {
    reviewPrescription(prescription.id, 'DISPENSED', notes || 'All medicines verified and dispensed to patient.');
    onClose();
  };

  const handleReject = () => {
    reviewPrescription(prescription.id, 'REJECTED', notes || 'Prescription invalid or contraindication detected.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8 relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Prescription Document Review ({prescription.prescriptionCode})
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              prescription.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
              prescription.status === 'DISPENSED' ? 'bg-blue-100 text-blue-800' :
              prescription.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {prescription.status.replace('_', ' ')}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prescription Document / Image Preview */}
          <div className="space-y-3">
            <div className="bg-slate-100 border border-slate-200 rounded-lg overflow-hidden h-72 relative group">
              <img
                src={prescription.imageUrl}
                alt="Prescription scan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                Uploaded Patient Document
              </div>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
              <p><strong>Date Prescribed:</strong> {prescription.datePrescribed}</p>
              <p><strong>Submitted To Portal:</strong> {prescription.submittedAt}</p>
              {prescription.reviewedBy && (
                <p><strong>Reviewed By:</strong> {prescription.reviewedBy} ({prescription.reviewedAt})</p>
              )}
            </div>
          </div>

          {/* Details and Actions */}
          <div className="space-y-4 text-xs">
            <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-lg space-y-1.5">
              <p className="text-slate-500 uppercase text-[10px] font-bold tracking-wider">Patient & Doctor Metadata</p>
              <p className="text-sm font-bold text-slate-900">{prescription.customerName}</p>
              <p className="text-slate-600">Contact: {prescription.customerPhone}</p>
              <p className="text-slate-700 font-medium mt-1">Prescribing Doctor: {prescription.doctorName}</p>
              <p className="text-slate-500 italic">{prescription.hospitalClinic}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-800 mb-1.5">Prescribed Medicines & Instructions:</p>
              <ul className="space-y-1.5 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                {prescription.medicinesPrescribed.map((med, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span className="font-medium">{med}</span>
                  </li>
                ))}
              </ul>
            </div>

            {canReview && (
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <p className="font-semibold text-slate-800">Pharmacist Safety Verification Checklist:</p>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={doctorVerified}
                      onChange={e => setDoctorVerified(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Registered Doctor license verified</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={dosageVerified}
                      onChange={e => setDosageVerified(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Dosage, frequency & duration match pharmacopoeia</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={interactionChecked}
                      onChange={e => setInteractionChecked(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>No severe drug-drug contraindications detected</span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="block font-medium text-slate-700 mb-1">Pharmacist Clinical Notes:</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Enter verification notes or reason for rejection..."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>

          {canReview && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleReject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Prescription
              </button>
              <button
                onClick={handleApprove}
                disabled={!doctorVerified || !dosageVerified}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve & Verify
              </button>
              <button
                onClick={handleDispense}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Dispense Medicines
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
