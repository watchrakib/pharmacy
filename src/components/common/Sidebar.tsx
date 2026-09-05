import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Pill,
  FolderTree,
  ShoppingBag,
  Users,
  FileCheck2,
  Boxes,
  UserCog,
  CalendarCheck,
  CalendarDays,
  Banknote,
  Receipt,
  Truck,
  TrendingUp,
  Tag,
  Gift,
  Bike,
  Bell,
  Sliders,
  BarChart3,
  UserCheck,
  CheckSquare,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
  const { isAdmin, userRole, hasPermission } = useAuth();

  // Admin full navigation items
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Overview' },
    { id: 'products', label: 'Products', icon: Pill, section: 'Catalog & Stock' },
    { id: 'categories', label: 'Categories', icon: FolderTree, section: 'Catalog & Stock' },
    { id: 'inventory', label: 'Inventory', icon: Boxes, section: 'Catalog & Stock' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, section: 'Sales & Delivery' },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileCheck2, section: 'Sales & Delivery' },
    { id: 'delivery', label: 'Delivery Mgmt', icon: Bike, section: 'Sales & Delivery' },
    { id: 'customers', label: 'Customers', icon: Users, section: 'Sales & Delivery' },
    { id: 'employees', label: 'Employees', icon: UserCog, section: 'Human Resources' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, section: 'Human Resources' },
    { id: 'leaves', label: 'Leave Requests', icon: CalendarDays, section: 'Human Resources' },
    { id: 'salary', label: 'Salary Management', icon: Banknote, section: 'Human Resources' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, section: 'Finance & Supply' },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, section: 'Finance & Supply' },
    { id: 'purchases', label: 'Purchases (PO)', icon: FileText, section: 'Finance & Supply' },
    { id: 'sales_reports', label: 'Sales Reports & P&L', icon: TrendingUp, section: 'Finance & Supply' },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag, section: 'Marketing' },
    { id: 'notifications', label: 'Notifications', icon: Bell, section: 'System' },
    { id: 'audit_logs', label: 'Audit Logs', icon: ShieldAlert, section: 'System' },
    { id: 'settings', label: 'Website Settings', icon: Sliders, section: 'System' },
    { id: 'reports', label: 'Executive Reports', icon: BarChart3, section: 'System' },
    { id: 'admin_profile', label: 'Admin Profile', icon: UserCheck, section: 'System' }
  ];

  // Employee navigation items (filtered strictly based on role permission)
  const employeeBaseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'My Workspace' },
    { id: 'my_profile', label: 'My Profile', icon: UserCheck, section: 'My Workspace' },
    { id: 'my_attendance', label: 'My Attendance', icon: CalendarCheck, section: 'My Workspace' },
    { id: 'my_leaves', label: 'Leave Management', icon: CalendarDays, section: 'My Workspace' },
    { id: 'my_salary', label: 'My Salary & Slips', icon: Banknote, section: 'My Workspace' },
    { id: 'tasks', label: 'Assigned Tasks', icon: CheckSquare, section: 'My Workspace' },
    { id: 'notifications', label: 'Notifications', icon: Bell, section: 'My Workspace' }
  ];

  const employeeRoleSpecificItems = [
    // Orders
    {
      id: 'orders',
      label: userRole === 'DELIVERY_STAFF' ? 'Assigned Orders' : 'Orders',
      icon: ShoppingBag,
      section: 'Department Operations',
      visible: ['MANAGER', 'PHARMACIST', 'SALES_STAFF', 'DELIVERY_STAFF'].includes(userRole)
    },
    // Sales / POS
    {
      id: 'sales_pos',
      label: 'Sales Counter / POS',
      icon: TrendingUp,
      section: 'Department Operations',
      visible: ['MANAGER', 'SALES_STAFF', 'ACCOUNTANT'].includes(userRole)
    },
    // Prescriptions (Pharmacist & Manager)
    {
      id: 'prescriptions',
      label: 'Prescription Verification',
      icon: FileCheck2,
      section: 'Department Operations',
      visible: ['PHARMACIST', 'MANAGER'].includes(userRole)
    },
    // Products (Pharmacist, Sales, Inventory, Manager)
    {
      id: 'products',
      label: 'Products & Medicines',
      icon: Pill,
      section: 'Department Operations',
      visible: ['PHARMACIST', 'SALES_STAFF', 'INVENTORY_STAFF', 'MANAGER'].includes(userRole)
    },
    // Inventory (Inventory Staff & Manager)
    {
      id: 'inventory',
      label: 'Inventory & Cold Chain',
      icon: Boxes,
      section: 'Department Operations',
      visible: ['INVENTORY_STAFF', 'MANAGER'].includes(userRole)
    },
    // Customers (Sales, Pharmacist, Manager)
    {
      id: 'customers',
      label: 'Customer Directory',
      icon: Users,
      section: 'Department Operations',
      visible: ['SALES_STAFF', 'PHARMACIST', 'MANAGER'].includes(userRole)
    },
    // Suppliers & Purchases (Inventory & Accountant)
    {
      id: 'suppliers',
      label: 'Suppliers & Vendors',
      icon: Truck,
      section: 'Department Operations',
      visible: ['INVENTORY_STAFF', 'ACCOUNTANT'].includes(userRole)
    },
    {
      id: 'purchases',
      label: 'Purchases (PO)',
      icon: FileText,
      section: 'Department Operations',
      visible: ['INVENTORY_STAFF', 'ACCOUNTANT'].includes(userRole)
    },
    // Delivery (Delivery staff)
    {
      id: 'delivery',
      label: 'Delivery Dispatch Route',
      icon: Bike,
      section: 'Department Operations',
      visible: ['DELIVERY_STAFF'].includes(userRole)
    },
    // Financials for Accountant
    {
      id: 'expenses',
      label: 'Store Expenses',
      icon: Receipt,
      section: 'Finance & Accounts',
      visible: ['ACCOUNTANT'].includes(userRole)
    },
    {
      id: 'sales_reports',
      label: 'Profit & Loss (P&L)',
      icon: TrendingUp,
      section: 'Finance & Accounts',
      visible: ['ACCOUNTANT', 'MANAGER'].includes(userRole)
    }
  ];

  const currentNavItems = isAdmin
    ? adminNavItems
    : [
        ...employeeBaseItems,
        ...employeeRoleSpecificItems.filter(item => item.visible)
      ];

  // Group items by section
  const sections = Array.from(new Set(currentNavItems.map(item => item.section)));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isAdmin ? 'Owner / Admin Portal' : `${userRole.replace('_', ' ')} Portal`}
            </span>
            <p className="text-[11px] text-slate-400">MEDISHOP Secure Session</p>
          </div>
        </div>

        {/* Scrollable Nav List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map(sectionName => (
            <div key={sectionName} className="space-y-1">
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {sectionName}
              </p>
              {currentNavItems
                .filter(item => item.section === sectionName)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span>Version 2.4 Enterprise</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </aside>
    </>
  );
};
