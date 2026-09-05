import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { KeyRound, Shield, CheckCircle, Lock, Save, Eye, EyeOff } from 'lucide-react';

export const AdminProfileView: React.FC = () => {
  const { currentUser, adminPassword, updateAdminPassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassword !== adminPassword) {
      setMessage('Current password is incorrect.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    if (newPassword.length < 4) {
      setMessage('Password must be at least 4 characters.');
      return;
    }
    updateAdminPassword(newPassword);
    setMessage(`Master Admin password updated successfully to "${newPassword}".`);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Owner & Administrator Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System root access credentials, multi-factor authentication, and executive audit settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-600 shadow-md"
          />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser?.name}</h2>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Owner / Root Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser?.email} • +880 1711-000001</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Enterprise License: MEDISHOP-HQ-DHAKA-2026
            </p>
          </div>
        </div>

        {/* Security & 2FA Status */}
        <div className="pt-6 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            Security & Authentication Shield
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-emerald-700">Hardware FIDO & Google Authenticator Active</p>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Session IP Guard</p>
                <p className="text-[11px] text-slate-500">Restricted to Authorized Pharmacy Static IP</p>
              </div>
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            Update Master Administrative Password
          </h3>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Admin Pass:</span>
            <span className="font-mono text-xs font-bold text-emerald-700">
              {showCurrentPass ? adminPassword : '••••••••'}
            </span>
            <button
              type="button"
              onClick={() => setShowCurrentPass(!showCurrentPass)}
              className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
              title={showCurrentPass ? 'Hide password' : 'Show password'}
            >
              {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-xs font-semibold mb-4 ${
            message.includes('successfully') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
