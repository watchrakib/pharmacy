import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentEmployee: Employee | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  userRole: UserRole;
  adminPassword: string;
  updateAdminPassword: (newPass: string) => void;
  loginAs: (role: UserRole) => void;
  loginWithCredentials: (email: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  hasPermission: (moduleKey: string) => boolean;
  resetPassword: (email: string) => { success: boolean; message: string };
  updateProfile: (data: Partial<User>) => void;
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['all'],
  MANAGER: ['dashboard', 'orders', 'sales', 'employees', 'inventory', 'reports', 'leaves', 'attendance', 'tasks', 'notifications', 'my_profile', 'my_attendance', 'my_salary'],
  PHARMACIST: ['dashboard', 'prescriptions', 'medicines', 'orders', 'customers', 'product_info', 'tasks', 'notifications', 'my_profile', 'my_attendance', 'my_salary'],
  SALES_STAFF: ['dashboard', 'sales', 'orders', 'customers', 'products', 'tasks', 'notifications', 'my_profile', 'my_attendance', 'my_salary'],
  INVENTORY_STAFF: ['dashboard', 'products', 'inventory', 'purchases', 'suppliers', 'inventory_reports', 'tasks', 'notifications', 'my_profile', 'my_attendance', 'my_salary'],
  DELIVERY_STAFF: ['dashboard', 'orders', 'delivery', 'tasks', 'notifications', 'my_profile', 'my_attendance', 'my_salary'],
  ACCOUNTANT: ['dashboard', 'sales', 'expenses', 'purchases', 'salary', 'profit_loss', 'financial_reports', 'tasks', 'notifications', 'my_profile', 'my_attendance', 'my_salary'],
  CUSTOMER: ['store', 'my_orders', 'my_prescriptions']
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Admin on start so user immediately experiences the full Admin Panel, but can switch to Employee with 1 click!
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('medishop_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const adminEmp = INITIAL_EMPLOYEES[0];
    return {
      id: adminEmp.id,
      name: adminEmp.fullName,
      email: adminEmp.email,
      role: 'ADMIN',
      phone: adminEmp.phone,
      status: 'ACTIVE',
      employeeId: adminEmp.employeeId,
      department: adminEmp.department,
      position: adminEmp.position,
      avatar: adminEmp.profilePhoto
    };
  });

  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(() => {
    return INITIAL_EMPLOYEES.find(e => e.id === currentUser?.id) || INITIAL_EMPLOYEES[0];
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('medishop_admin_pass') || 'taufiq2468';
  });

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('medishop_admin_pass', newPass);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('medishop_current_user', JSON.stringify(currentUser));
      const emp = INITIAL_EMPLOYEES.find(e => e.id === currentUser.id || e.email === currentUser.email) || null;
      setCurrentEmployee(emp);
    } else {
      localStorage.removeItem('medishop_current_user');
      setCurrentEmployee(null);
    }
  }, [currentUser]);

  const loginAs = (role: UserRole) => {
    const matched = INITIAL_EMPLOYEES.find(e => e.role === role) || INITIAL_EMPLOYEES[0];
    const newUser: User = {
      id: matched.id,
      name: matched.fullName,
      email: matched.email,
      role: matched.role,
      phone: matched.phone,
      status: matched.status,
      employeeId: matched.employeeId,
      department: matched.department,
      position: matched.position,
      avatar: matched.profilePhoto
    };
    setCurrentUser(newUser);
    setCurrentEmployee(matched);
  };

  const loginWithCredentials = (email: string, pass: string): { success: boolean; message: string } => {
    if (!email || !pass) {
      return { success: false, message: 'Please provide both email/username and password.' };
    }
    const cleanQuery = (email || '').trim().toLowerCase();

    // Check for root Admin login
    const isAdminAccount =
      cleanQuery === 'taufiq.admin@medishop.com' ||
      cleanQuery === 'admin' ||
      cleanQuery === 'taufiq' ||
      cleanQuery === 'emp-101';

    if (isAdminAccount) {
      if (pass !== adminPassword) {
        return { success: false, message: 'Incorrect administrative password. Please enter the valid admin pass.' };
      }
      loginAs('ADMIN');
      return { success: true, message: 'Welcome back, Administrator Taufiq Al-Hassan!' };
    }

    const emp = INITIAL_EMPLOYEES.find(e =>
      (e.email || '').toLowerCase() === cleanQuery ||
      (e.employeeId || '').toLowerCase() === cleanQuery
    );

    if (emp) {
      if (emp.status === 'INACTIVE') {
        return { success: false, message: 'This account has been deactivated by the administrator.' };
      }
      if (emp.role === 'ADMIN') {
        if (pass !== adminPassword) {
          return { success: false, message: 'Incorrect administrative password. Please enter the valid admin pass.' };
        }
      }
      loginAs(emp.role);
      return { success: true, message: `Welcome back, ${emp.fullName}!` };
    }
    return { success: false, message: 'Invalid credentials. Please verify your email or employee ID.' };
  };

  const logout = () => {
    // Keep user logged in or reset to customer / login modal
    setCurrentUser(null as unknown as User);
    setCurrentEmployee(null);
  };

  const hasPermission = (moduleKey: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;

    // Strict security protections:
    const forbiddenForEmployees = ['website_settings', 'admin_profile', 'admin_audit_full', 'all_salaries'];
    if (forbiddenForEmployees.includes(moduleKey) && currentUser.role !== 'ADMIN') {
      return false;
    }

    const permitted = ROLE_PERMISSIONS[currentUser.role] || [];
    return permitted.includes('all') || permitted.includes(moduleKey);
  };

  const resetPassword = (email: string) => {
    const emp = INITIAL_EMPLOYEES.find(e => (e.email || '').toLowerCase() === (email || '').toLowerCase());
    if (emp) {
      return { success: true, message: `Password reset link has been dispatched to ${email}` };
    }
    return { success: false, message: 'Email address not found in pharmacy personnel registry.' };
  };

  const updateProfile = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isEmployee = currentUser !== null && currentUser?.role !== 'ADMIN';
  const userRole = currentUser?.role || 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentEmployee,
        isAuthenticated: !!currentUser,
        isAdmin,
        isEmployee,
        userRole,
        adminPassword,
        updateAdminPassword,
        loginAs,
        loginWithCredentials,
        logout,
        hasPermission,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
