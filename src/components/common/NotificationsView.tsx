import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { Bell, CheckCircle2, Clock, AlertTriangle, Info, Check } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { userRole, currentUser } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePharmacy();

  const userNotifications = notifications.filter(
    n => !n.recipientRole || n.recipientRole === userRole
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">System Notifications & Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational dispatches, clinical safety warnings, attendance notifications, and inventory restock alerts.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {userNotifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No unread notifications at this time.
          </div>
        ) : (
          userNotifications.map(notif => {
            const isWarning = notif.type === 'WARNING';
            const isSuccess = notif.type === 'SUCCESS';
            const isAlert = notif.type === 'ALERT';

            return (
              <div
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  notif.isRead ? 'bg-white opacity-80' : 'bg-emerald-50/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isAlert ? 'bg-rose-100 text-rose-700' :
                    isWarning ? 'bg-amber-100 text-amber-700' :
                    isSuccess ? 'bg-emerald-100 text-emerald-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {isAlert || isWarning ? <AlertTriangle className="w-4 h-4" /> :
                     isSuccess ? <CheckCircle2 className="w-4 h-4" /> :
                     <Info className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1.5 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 shrink-0 cursor-pointer"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
