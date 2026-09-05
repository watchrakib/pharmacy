import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import {
  Clock,
  CheckCircle2,
  CalendarCheck,
  Banknote,
  CheckSquare,
  AlertCircle,
  CalendarDays,
  ShoppingBag,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  Printer
} from 'lucide-react';

interface EmployeeDashboardProps {
  setActiveView: (view: string) => void;
  onOpenSalarySlip?: (salId: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ setActiveView, onOpenSalarySlip }) => {
  const { currentUser, currentEmployee, userRole } = useAuth();
  const {
    getTodayAttendance,
    checkInEmployee,
    checkOutEmployee,
    tasks,
    salaries,
    leaves,
    orders,
    settings
  } = usePharmacy();

  const empId = currentUser?.employeeId || '';
  const todayAtt = empId ? getTodayAttendance(empId) : undefined;
  const isCheckedIn = !!todayAtt?.checkInTime && !todayAtt?.checkOutTime;

  // My Tasks
  const myTasks = tasks.filter(t => t.assignedToEmployeeId === empId || t.assignedToRole === userRole);
  const pendingTasks = myTasks.filter(t => t.status !== 'COMPLETED').length;
  const completedTasks = myTasks.filter(t => t.status === 'COMPLETED').length;

  // My latest salary record
  const myLatestSalary = salaries.find(s => s.employeeId === empId);

  // My leaves
  const myLeaves = leaves.filter(l => l.employeeId === empId);
  const approvedLeaveDays = myLeaves
    .filter(l => l.status === 'APPROVED')
    .reduce((acc, l) => acc + l.totalDays, 0);
  const leaveBalance = Math.max(0, 20 - approvedLeaveDays); // 20 days annual quota

  // Today's Orders
  const todayOrders = orders.filter(o => o.createdAt.startsWith('2026-09-04')).length;
  const myAssignedOrders = orders.filter(o => o.assignedStaffId === empId);

  // Today's Sales (for sales/pharmacist)
  const todaySales = orders
    .filter(o => o.createdAt.startsWith('2026-09-04') && o.orderStatus !== 'CANCELLED')
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Card with Biometric Punch Clock */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Employee Operational Workspace
            </span>
            <span className="text-xs text-slate-400">Dhaka Store Shift #1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Designation: <span className="font-semibold text-emerald-300">{currentUser?.position || userRole.replace('_', ' ')}</span> • Department: {currentEmployee?.department || 'Operations'}
          </p>
        </div>

        {/* Quick Check-In / Check-Out Widget */}
        <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Attendance</span>
            <p className="text-xs font-bold text-white">
              {todayAtt?.status === 'PRESENT' || todayAtt?.status === 'LATE'
                ? `Clocked In at ${todayAtt.checkInTime}`
                : 'Not Clocked In Yet'}
            </p>
          </div>
          {isCheckedIn ? (
            <button
              onClick={() => checkOutEmployee(empId)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Clock Out
            </button>
          ) : (
            <button
              onClick={() => checkInEmployee(empId)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              Clock In Now
            </button>
          )}
        </div>
      </div>

      {/* Role-Specific Statistics Cards Requested in Prompt:
          - Today's Sales (for sales staff)
          - Today's Orders
          - Pending Tasks
          - Completed Tasks
          - Attendance Status
          - Monthly Salary
          - Leave Balance
      */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          My Work Summary & Shift Dashboard
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Today's Sales (Visible to sales staff / manager / accountant) */}
          {['SALES_STAFF', 'MANAGER', 'ACCOUNTANT'].includes(userRole) && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex justify-between items-start text-xs text-slate-500">
                <span>Today's Counter Sales</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {settings.currency}{todaySales.toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">Live store revenue</span>
            </div>
          )}

          {/* Today's Orders / Assigned Orders */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-slate-500">
              <span>{userRole === 'DELIVERY_STAFF' ? 'Assigned Dropoffs' : "Today's Orders"}</span>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold font-mono text-slate-900 mt-1">
              {userRole === 'DELIVERY_STAFF' ? myAssignedOrders.length : todayOrders}
            </p>
            <span className="text-[10px] text-slate-500">Active fulfillment</span>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-slate-500">
              <span>Pending Tasks</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-lg font-bold font-mono text-amber-700 mt-1">{pendingTasks}</p>
            <span className="text-[10px] text-amber-600 font-medium">To be completed</span>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-slate-500">
              <span>Completed Tasks</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-lg font-bold font-mono text-slate-900 mt-1">{completedTasks}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Quality verified</span>
          </div>

          {/* Attendance Status */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-slate-500">
              <span>Attendance Status</span>
              <CalendarCheck className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-base font-bold text-slate-900 mt-1">
              {todayAtt ? todayAtt.status : 'NOT LOGGED'}
            </p>
            <span className="text-[10px] text-slate-500">
              {todayAtt?.workingHours ? `${todayAtt.workingHours} hrs today` : 'Shift in progress'}
            </span>
          </div>

          {/* Monthly Net Salary (Strictly restricted to current employee only!) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-slate-500">
              <span>My Net Salary (Last Month)</span>
              <Banknote className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-lg font-bold font-mono text-emerald-700 mt-1">
              {settings.currency}{(myLatestSalary?.netSalary || currentEmployee?.salary || 0).toLocaleString()}
            </p>
            <span className="text-[10px] text-slate-500">
              Status: {myLatestSalary?.paymentStatus || 'DISBURSED'}
            </span>
          </div>

          {/* Leave Balance */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-start text-xs text-slate-500">
              <span>Remaining Leave Quota</span>
              <CalendarDays className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-lg font-bold font-mono text-purple-700 mt-1">{leaveBalance} Days</p>
            <span className="text-[10px] text-slate-500">Out of 20 annual days</span>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('my_attendance')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 shadow-2xs flex items-center justify-between text-left cursor-pointer transition-colors"
        >
          <div>
            <p className="font-bold text-sm text-slate-900">Attendance Log</p>
            <p className="text-xs text-slate-500">Review monthly punch hours & shifts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </button>

        <button
          onClick={() => setActiveView('my_leaves')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 shadow-2xs flex items-center justify-between text-left cursor-pointer transition-colors"
        >
          <div>
            <p className="font-bold text-sm text-slate-900">Submit Leave Request</p>
            <p className="text-xs text-slate-500">Apply for sick, casual or annual leave</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </button>

        <button
          onClick={() => setActiveView('my_salary')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 shadow-2xs flex items-center justify-between text-left cursor-pointer transition-colors"
        >
          <div>
            <p className="font-bold text-sm text-slate-900">Download Salary Slips</p>
            <p className="text-xs text-slate-500">Print monthly compensation payslips</p>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-600" />
        </button>
      </div>

      {/* Assigned Tasks Module */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              My Assigned Pharmacy Tasks
            </h3>
            <p className="text-xs text-slate-500">Operational responsibilities delegated by Admin & Store Manager</p>
          </div>
          <button
            onClick={() => setActiveView('tasks')}
            className="text-xs text-emerald-600 hover:underline font-semibold"
          >
            Manage All Tasks ({myTasks.length}) →
          </button>
        </div>

        <div className="space-y-2.5">
          {myTasks.slice(0, 3).map(task => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                task.status === 'COMPLETED' ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    task.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                    task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {task.priority}
                  </span>
                  <p className="font-bold text-slate-900">{task.title}</p>
                </div>
                <p className="text-slate-500 mt-1 text-[11px]">{task.description}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Due: {task.dueDate}</p>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
