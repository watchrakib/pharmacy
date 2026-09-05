import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { Task, TaskPriority, TaskStatus, Role } from '../../types';
import {
  CheckSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Filter,
  X
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { currentUser, userRole, hasPermission } = useAuth();
  const { tasks, employees, addTask, updateTaskStatus } = usePharmacy();

  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToEmployeeId, setAssignedToEmployeeId] = useState(employees[0]?.employeeId || '');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('2026-09-08');

  const canAssignTasks = hasPermission('ASSIGN_TASKS') || ['ADMIN', 'MANAGER'].includes(userRole);
  const currentEmpId = currentUser?.employeeId || '';

  // Filter tasks: if employee (not admin/manager), show only tasks assigned to them or their role
  const visibleTasks = tasks.filter(task => {
    if (!canAssignTasks) {
      const isForMe = task.assignedToEmployeeId === currentEmpId || task.assignedToRole === userRole;
      if (!isForMe) return false;
    }
    if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedEmp = employees.find(emp => emp.employeeId === assignedToEmployeeId);

    addTask({
      title: title.trim(),
      description: description.trim(),
      assignedToEmployeeId,
      assignedToEmployeeName: assignedEmp?.fullName || 'Assigned Staff',
      assignedToRole: assignedEmp?.role || 'SALES_STAFF',
      priority,
      status: 'PENDING',
      dueDate
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {canAssignTasks ? 'Task Allocation & Operations Board' : 'My Assigned Operational Tasks'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {canAssignTasks
              ? 'Delegate pharmacy maintenance, temperature logs, inventory audits, and prescription reviews.'
              : 'Keep track of daily pharmacy duties assigned to you by administrators and supervisors.'}
          </p>
        </div>

        {canAssignTasks && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Assign New Task
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-semibold text-slate-700 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
          </span>
          {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-2 py-1 bg-white focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTasks.map(task => {
          const isDone = task.status === 'COMPLETED';
          const isInProgress = task.status === 'IN_PROGRESS';

          return (
            <div
              key={task.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs flex flex-col justify-between transition-colors ${
                isDone ? 'border-emerald-200 bg-emerald-50/20' : isInProgress ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    task.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' :
                    task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority} PRIORITY
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isDone ? 'bg-emerald-100 text-emerald-800' :
                    isInProgress ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className={`font-bold text-sm text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {task.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-600">
                      <User className="w-3 h-3 text-slate-400" />
                      {task.assignedToEmployeeName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      Due: {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Action Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => updateTaskStatus(task.id, 'PENDING')}
                  className={`flex-1 py-1 rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                    task.status === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                  className={`flex-1 py-1 rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                    task.status === 'IN_PROGRESS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateTaskStatus(task.id, 'COMPLETED')}
                  className={`flex-1 py-1 rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                    task.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Assign Operational Pharmacy Task</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Calibrate Cold Chain Vaccines Fridge"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Specific compliance protocols or instructions..."
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Assign to Employee</label>
                <select
                  value={assignedToEmployeeId}
                  onChange={e => setAssignedToEmployeeId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  {employees.map(emp => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName} ({emp.position} - {emp.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
