import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { UserCheck, Phone, Mail, MapPin, Calendar, KeyRound, Shield, Save } from 'lucide-react';

export const MyProfileView: React.FC = () => {
  const { currentUser, currentEmployee } = useAuth();
  const { updateEmployee } = usePharmacy();

  const [phone, setPhone] = useState(currentEmployee?.phone || '+880 1711-223344');
  const [address, setAddress] = useState(currentEmployee?.address || 'Dhaka, Bangladesh');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setNotice('New passwords do not match.');
      return;
    }

    if (currentEmployee) {
      updateEmployee(currentEmployee.id, {
        phone,
        address
      });
    }

    setNotice('Profile updated successfully.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Employee Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View your staff appointment details, contact record, and update security credentials.
        </p>
      </div>

      {notice && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${
          notice.includes('successfully') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          {notice}
        </div>
      )}

      {/* Official Identity Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={currentEmployee?.profilePhoto || currentUser?.avatar}
            alt={currentEmployee?.fullName}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-600 shadow-md"
          />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentEmployee?.fullName || currentUser?.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {currentEmployee?.role.replace('_', ' ') || currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Staff ID: {currentEmployee?.employeeId || currentUser?.employeeId}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentEmployee?.position} • {currentEmployee?.department}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Joined Pharmacy Team: {currentEmployee?.joiningDate}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdateProfile} className="pt-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Official Email (Read-Only)</label>
              <input
                type="email"
                disabled
                value={currentEmployee?.email || currentUser?.email}
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Residential Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 mb-3">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              Change Personal Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save My Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
