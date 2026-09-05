import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PharmacyProvider, usePharmacy } from './context/PharmacyContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ShieldAlert, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductsView } from './components/admin/ProductsView';
import { CategoriesView } from './components/admin/CategoriesView';
import { OrdersView } from './components/admin/OrdersView';
import { CustomersView } from './components/admin/CustomersView';
import { PrescriptionsView } from './components/admin/PrescriptionsView';
import { InventoryView } from './components/admin/InventoryView';
import { EmployeesView } from './components/admin/EmployeesView';
import { AttendanceView } from './components/admin/AttendanceView';
import { LeaveRequestsView } from './components/admin/LeaveRequestsView';
import { SalaryView } from './components/admin/SalaryView';
import { ExpensesView } from './components/admin/ExpensesView';
import { SuppliersView } from './components/admin/SuppliersView';
import { PurchasesView } from './components/admin/PurchasesView';
import { SalesReportsView } from './components/admin/SalesReportsView';
import { CouponsOffersView } from './components/admin/CouponsOffersView';
import { DeliveryManagementView } from './components/admin/DeliveryManagementView';
import { AuditLogsView } from './components/admin/AuditLogsView';
import { WebsiteSettingsView } from './components/admin/WebsiteSettingsView';
import { ReportsView } from './components/admin/ReportsView';
import { AdminProfileView } from './components/admin/AdminProfileView';

// Employee Views
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { MyProfileView } from './components/employee/MyProfileView';
import { MyAttendanceView } from './components/employee/MyAttendanceView';
import { MyLeaveRequestsView } from './components/employee/MyLeaveRequestsView';
import { MySalaryView } from './components/employee/MySalaryView';

// Shared Views
import { TasksView } from './components/common/TasksView';
import { NotificationsView } from './components/common/NotificationsView';

const MainLayout: React.FC = () => {
  const { userRole, currentUser, hasPermission } = useAuth();
  const { settings } = usePharmacy();

  // Active view default based on role
  const [activeView, setActiveView] = useState<string>(
    userRole === 'ADMIN' ? 'dashboard' : 'employee_dashboard'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Security guard for strictly admin/privileged views
  const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(userRole);
  const isAccountant = userRole === 'ACCOUNTANT';

  // Role enforcement helper
  const isAuthorizedForView = (view: string): boolean => {
    // Universal views
    if (['tasks', 'notifications', 'my_profile', 'my_attendance', 'my_leaves', 'my_salary'].includes(view)) {
      return true;
    }

    // Role-specific home dashboards
    if (view === 'dashboard') return isAdminOrManager;
    if (view === 'employee_dashboard') return true;

    // Admin & Executive Only
    if (['settings', 'audit_logs', 'admin_profile'].includes(view)) {
      return userRole === 'ADMIN';
    }

    // HR & Payroll
    if (['employees', 'attendance', 'leaves'].includes(view)) {
      return isAdminOrManager;
    }

    // Financial & Salary
    if (['salary'].includes(view)) {
      return userRole === 'ADMIN' || isAccountant;
    }

    if (['expenses', 'sales_reports', 'profit_loss', 'reports'].includes(view)) {
      return isAdminOrManager || isAccountant;
    }

    // Suppliers & Purchases
    if (['suppliers', 'purchases'].includes(view)) {
      return isAdminOrManager || ['INVENTORY_STAFF', 'PHARMACIST'].includes(userRole);
    }

    // Catalog & Prescriptions
    if (['products', 'categories', 'inventory'].includes(view)) {
      return isAdminOrManager || ['PHARMACIST', 'INVENTORY_STAFF', 'SALES_STAFF'].includes(userRole);
    }

    if (['prescriptions'].includes(view)) {
      return isAdminOrManager || userRole === 'PHARMACIST';
    }

    if (['orders', 'customers', 'coupons'].includes(view)) {
      return isAdminOrManager || ['PHARMACIST', 'SALES_STAFF'].includes(userRole);
    }

    if (['delivery'].includes(view)) {
      return isAdminOrManager || ['DELIVERY_STAFF', 'SALES_STAFF'].includes(userRole);
    }

    return true;
  };

  const renderViewContent = () => {
    // Check permission barrier
    if (!isAuthorizedForView(activeView)) {
      return (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">403 Access Denied</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Your current role (<strong className="text-rose-700 font-mono">{userRole}</strong>) does not have authorization to view this operational section.
            Employees are strictly restricted from accessing store-wide financial reports, salary ledgers of other staff, and administrative configurations.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setActiveView(userRole === 'ADMIN' ? 'dashboard' : 'employee_dashboard')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Authorized Workspace
            </button>
          </div>
        </div>
      );
    }

    switch (activeView) {
      // Primary Dashboards
      case 'dashboard':
        return <AdminDashboard setActiveView={setActiveView} />;
      case 'employee_dashboard':
        return <EmployeeDashboard setActiveView={setActiveView} />;

      // Catalog & Stock
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'inventory':
        return <InventoryView />;

      // Clinical & Patient Operations
      case 'prescriptions':
        return <PrescriptionsView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;

      // Staff & HR
      case 'employees':
        return <EmployeesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leaves':
        return <LeaveRequestsView />;
      case 'salary':
        return <SalaryView />;

      // Finance & Procurement
      case 'expenses':
        return <ExpensesView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'purchases':
        return <PurchasesView />;
      case 'sales_reports':
      case 'profit_loss':
        return <SalesReportsView />;

      // Marketing & Logistics
      case 'coupons':
      case 'offers':
        return <CouponsOffersView />;
      case 'delivery':
        return <DeliveryManagementView />;

      // Audit & Governance
      case 'audit_logs':
        return <AuditLogsView />;
      case 'settings':
        return <WebsiteSettingsView />;
      case 'reports':
        return <ReportsView />;
      case 'admin_profile':
        return <AdminProfileView />;

      // Employee Individual Self-Service Views
      case 'my_profile':
        return <MyProfileView />;
      case 'my_attendance':
        return <MyAttendanceView />;
      case 'my_leaves':
        return <MyLeaveRequestsView />;
      case 'my_salary':
        return <MySalaryView />;

      // Common Shared Views
      case 'tasks':
        return <TasksView />;
      case 'notifications':
        return <NotificationsView />;

      default:
        return userRole === 'ADMIN' ? (
          <AdminDashboard setActiveView={setActiveView} />
        ) : (
          <EmployeeDashboard setActiveView={setActiveView} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900 font-sans">
      {/* Global Top Header with Role Switcher */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar Navigation */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {renderViewContent()}
        </main>
      </div>

      {/* Regulatory & Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>
            {settings.pharmacyName} • Certified DGDA Drug License #{settings.drugLicenseNumber}
          </p>
          <p className="text-[11px] text-slate-400">
            Secure Full-Stack Pharmacy E-Commerce & ERP Operating System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PharmacyProvider>
        <MainLayout />
      </PharmacyProvider>
    </AuthProvider>
  );
}
