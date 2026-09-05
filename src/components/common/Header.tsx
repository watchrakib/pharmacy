import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { UserRole } from '../../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  LogOut,
  ShoppingBag,
  Shield,
  User,
  ChevronDown,
  Sparkles,
  Menu,
  Lock,
  KeyRound,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface HeaderProps {
  onOpenStorefront: () => void;
  onToggleSidebar?: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenStorefront, onToggleSidebar, activeView, setActiveView }) => {
  const { currentUser, currentEmployee, userRole, loginAs, logout, isAdmin, adminPassword } = useAuth();
  const { notifications, markNotificationRead, getTodayAttendance, checkInEmployee, checkOutEmployee, settings } = usePharmacy();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [showPassText, setShowPassText] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const todayAtt = currentUser?.employeeId ? getTodayAttendance(currentUser.employeeId) : undefined;
  const isCheckedIn = !!todayAtt?.checkInTime && !todayAtt?.checkOutTime;

  const unreadNotifs = notifications.filter(n => !n.read && (n.targetRole === 'ALL' || n.targetRole === userRole));

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'ADMIN', label: 'Admin (Taufiq)', desc: 'Password-Protected Master Access' },
    { role: 'MANAGER', label: 'Operations Manager', desc: 'Orders, Inventory, Staff & Reports' },
    { role: 'PHARMACIST', label: 'Clinical Pharmacist', desc: 'Prescriptions, Meds, Clinical Review' },
    { role: 'SALES_STAFF', label: 'Sales Staff', desc: 'POS Counter, Orders & Products' },
    { role: 'INVENTORY_STAFF', label: 'Inventory Staff', desc: 'Stock, Cold Chain, POs & Suppliers' },
    { role: 'DELIVERY_STAFF', label: 'Delivery Staff', desc: 'Assigned Drops & Delivery Status' },
    { role: 'ACCOUNTANT', label: 'Chief Accountant', desc: 'Salaries, Expenses & Profit & Loss' }
  ];

  const handleRoleSwitch = (r: UserRole) => {
    if (r === 'ADMIN' && userRole !== 'ADMIN') {
      setShowRoleMenu(false);
      setAdminPassInput('');
      setAuthError(null);
      setShowAdminAuthModal(true);
      return;
    }
    loginAs(r);
    setShowRoleMenu(false);
    setActiveView('dashboard');
  };

  const handleVerifyAdminPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === adminPassword) {
      loginAs('ADMIN');
      setShowAdminAuthModal(false);
      setAdminPassInput('');
      setAuthError(null);
      setActiveView('dashboard');
    } else {
      setAuthError('Incorrect admin password. Please enter the valid admin pass.');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Mobile sidebar toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white font-black shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base">
                  MEDISHOP
                </span>
                <span className="text-xs text-emerald-700 font-semibold hidden sm:inline">by Taufiq</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-1 ${
                  isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isAdmin ? 'Admin Panel' : 'Employee Panel'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Healthcare ERP & Online Pharmacy Automation
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Switcher Bar for Reviewing Roles */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline text-slate-500">Active Role:</span>
            <span className="font-bold text-slate-900">{roles.find(r => r.role === userRole)?.label || userRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Persona to Test RBAC
              </div>
              <div className="space-y-1">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSwitch(r.role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                      userRole === r.role ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.label}</span>
                      {userRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2">
          {/* E-Commerce Preview Button */}
          <button
            onClick={onOpenStorefront}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Preview Customer Online Storefront"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Online Store</span>
          </button>

          {/* Employee Attendance Button (for staff) */}
          {currentUser?.employeeId && (
            <div className="hidden sm:block">
              {isCheckedIn ? (
                <button
                  onClick={() => checkOutEmployee(currentUser.employeeId!)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  title="Recorded check-in. Click to Check Out."
                >
                  <Clock className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span>Clock Out</span>
                </button>
              ) : (
                <button
                  onClick={() => checkInEmployee(currentUser.employeeId!)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  title="Click to Clock In for Today"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clock In</span>
                </button>
              )}
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-bold text-xs text-slate-800">Notifications ({unreadNotifs.length})</span>
                  <button
                    onClick={() => setActiveView('notifications')}
                    className="text-[11px] text-emerald-600 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        n.read ? 'bg-slate-50 text-slate-600' : 'bg-emerald-50/70 border border-emerald-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-slate-900 leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser?.position || currentUser?.role?.toLowerCase() || ''}</p>
            </div>
            <button
              onClick={() => {
                setAdminPassInput('');
                setAuthError(null);
                setShowAdminAuthModal(true);
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Admin Password Authentication"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Password Authentication Modal */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 border border-slate-200">
            <button
              onClick={() => setShowAdminAuthModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Admin Panel Authentication</h3>
                <p className="text-xs text-slate-500">Enter master password to access Administrator Portal</p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 mb-4 text-xs text-indigo-900">
              <div className="flex items-center justify-between">
                <span className="font-medium">Administrator Account:</span>
                <span className="font-bold">taufiq.admin@medishop.com</span>
              </div>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-indigo-100/60">
                <span className="font-medium">Configured Admin Pass:</span>
                <span className="font-mono font-bold text-emerald-700">taufiq2468</span>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg">
                {authError}
              </div>
            )}

            <form onSubmit={handleVerifyAdminPass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Enter Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassText ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter admin password (taufiq2468)"
                    value={adminPassInput}
                    onChange={e => {
                      setAdminPassInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2.5 pr-10 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassText(!showPassText)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminAuthModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Authenticate & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
