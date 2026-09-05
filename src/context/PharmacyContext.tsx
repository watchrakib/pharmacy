import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  Order,
  Customer,
  Prescription,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  SalaryRecord,
  PharmacyExpense,
  Supplier,
  PurchaseOrder,
  Coupon,
  PromotionalOffer,
  StaffTask,
  NotificationItem,
  AuditLog,
  WebsiteSettings,
  UserRole
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_EMPLOYEES,
  INITIAL_CUSTOMERS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_SALARIES,
  INITIAL_EXPENSES,
  INITIAL_COUPONS,
  INITIAL_OFFERS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface PharmacyContextType {
  products: Product[];
  categories: ProductCategory[];
  orders: Order[];
  customers: Customer[];
  prescriptions: Prescription[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  salaries: SalaryRecord[];
  expenses: PharmacyExpense[];
  suppliers: Supplier[];
  purchases: PurchaseOrder[];
  coupons: Coupon[];
  offers: PromotionalOffer[];
  tasks: StaffTask[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  settings: WebsiteSettings;

  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, changeQty: number, reason: string) => void;

  addCategory: (category: Omit<ProductCategory, 'id' | 'itemCount'>) => void;

  updateOrderStatus: (orderId: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) => void;
  assignDeliveryStaff: (orderId: string, staffId: string, staffName: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;

  reviewPrescription: (id: string, status: Prescription['status'], pharmacistNotes?: string) => void;

  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  toggleEmployeeStatus: (id: string) => void;
  resetEmployeePassword: (id: string) => string;

  checkInEmployee: (employeeId: string, notes?: string) => void;
  checkOutEmployee: (employeeId: string) => void;
  getTodayAttendance: (employeeId: string) => AttendanceRecord | undefined;

  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  reviewLeaveRequest: (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) => void;

  updateSalaryRecord: (id: string, data: Partial<SalaryRecord>) => void;
  createSalaryRecord: (record: Omit<SalaryRecord, 'id' | 'salaryId' | 'netSalary'>) => void;

  addExpense: (expense: Omit<PharmacyExpense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalOrders' | 'totalPurchased' | 'outstandingBalance'>) => void;
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'purchaseNumber'>) => void;
  receivePurchaseOrder: (id: string) => void;

  createTask: (task: Omit<StaffTask, 'id'>) => void;
  updateTaskStatus: (id: string, status: StaffTask['status']) => void;

  sendAnnouncement: (title: string, message: string, targetRole?: UserRole | 'ALL') => void;
  markNotificationRead: (id: string) => void;

  updateSettings: (settings: Partial<WebsiteSettings>) => void;
  resetAllDataToDefaults: () => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // Helper to load or fallback
  const loadInitial = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(`medishop_${key}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  const [products, setProducts] = useState<Product[]>(() => loadInitial('products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<ProductCategory[]>(() => loadInitial('categories', INITIAL_CATEGORIES));
  const [orders, setOrders] = useState<Order[]>(() => loadInitial('orders', INITIAL_ORDERS));
  const [customers, setCustomers] = useState<Customer[]>(() => loadInitial('customers', INITIAL_CUSTOMERS));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => loadInitial('prescriptions', INITIAL_PRESCRIPTIONS));
  const [employees, setEmployees] = useState<Employee[]>(() => loadInitial('employees', INITIAL_EMPLOYEES));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadInitial('attendance', INITIAL_ATTENDANCE));
  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => loadInitial('leaves', INITIAL_LEAVES));
  const [salaries, setSalaries] = useState<SalaryRecord[]>(() => loadInitial('salaries', INITIAL_SALARIES));
  const [expenses, setExpenses] = useState<PharmacyExpense[]>(() => loadInitial('expenses', INITIAL_EXPENSES));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadInitial('suppliers', INITIAL_SUPPLIERS));
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => loadInitial('purchases', INITIAL_PURCHASES));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadInitial('coupons', INITIAL_COUPONS));
  const [offers] = useState<PromotionalOffer[]>(() => loadInitial('offers', INITIAL_OFFERS));
  const [tasks, setTasks] = useState<StaffTask[]>(() => loadInitial('tasks', INITIAL_TASKS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadInitial('audit_logs', INITIAL_AUDIT_LOGS));
  const [settings, setSettings] = useState<WebsiteSettings>(() => loadInitial('settings', INITIAL_SETTINGS));

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('medishop_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('medishop_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('medishop_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('medishop_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('medishop_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('medishop_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('medishop_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('medishop_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem('medishop_salaries', JSON.stringify(salaries)); }, [salaries]);
  useEffect(() => { localStorage.setItem('medishop_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('medishop_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('medishop_purchases', JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { localStorage.setItem('medishop_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('medishop_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('medishop_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('medishop_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('medishop_settings', JSON.stringify(settings)); }, [settings]);

  // Log audit action
  const addAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'System Admin',
      userRole: currentUser?.role || 'ADMIN',
      action,
      module,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '103.14.88.22',
      device: 'MEDISHOP Central Terminal'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add in-app notification
  const notify = (title: string, message: string, type: NotificationItem['type'], targetRole: UserRole | 'ALL' = 'ALL') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
      targetRole
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Products
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    addAudit('PRODUCT_ADDED', 'Products', `Added new product: ${p.name} (${p.dosage})`);
    notify('Product Added', `${p.name} has been cataloged into ${p.category}.`, 'STOCK_LOW');
  };

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...patch };
        // recalculate status
        if (updated.stock <= 0) updated.status = 'OUT_OF_STOCK';
        else if (updated.stock <= updated.lowStockThreshold) updated.status = 'LOW_STOCK';
        else updated.status = 'IN_STOCK';
        return updated;
      }
      return p;
    }));
    addAudit('PRODUCT_UPDATED', 'Products', `Updated product details for ID ${id}`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addAudit('PRODUCT_DELETED', 'Products', `Removed product: ${target?.name || id}`);
  };

  const updateStock = (id: string, changeQty: number, reason: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + changeQty);
        let status: Product['status'] = 'IN_STOCK';
        if (newStock <= 0) status = 'OUT_OF_STOCK';
        else if (newStock <= p.lowStockThreshold) status = 'LOW_STOCK';
        return { ...p, stock: newStock, status };
      }
      return p;
    }));
    const target = products.find(p => p.id === id);
    addAudit('STOCK_CHANGED', 'Inventory', `Adjusted stock for ${target?.name || id} by ${changeQty} (${reason})`);
  };

  // Categories
  const addCategory = (cat: Omit<ProductCategory, 'id' | 'itemCount'>) => {
    const newCat: ProductCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    addAudit('CATEGORY_CREATED', 'Categories', `Created category: ${cat.name}`);
  };

  // Orders
  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: status,
          ...(paymentStatus ? { paymentStatus } : {}),
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return ord;
    }));
    addAudit('ORDER_UPDATED', 'Orders', `Order ${orderId} updated to status ${status}`);
    notify('Order Status Changed', `Order ${orderId} changed to ${status}`, 'ORDER');
  };

  const assignDeliveryStaff = (orderId: string, staffId: string, staffName: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          assignedDeliveryStaffId: staffId,
          assignedDeliveryStaffName: staffName,
          orderStatus: ord.orderStatus === 'PENDING' ? 'READY_FOR_DELIVERY' : ord.orderStatus
        };
      }
      return ord;
    }));
    addAudit('DELIVERY_ASSIGNED', 'Delivery Management', `Order ${orderId} assigned to rider ${staffName}`);
    notify('Delivery Assigned', `You have been assigned order ${orderId}`, 'TASK', 'DELIVERY_STAFF');
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const orderNum = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrd: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: nowStr,
      updatedAt: nowStr
    };
    setOrders(prev => [newOrd, ...prev]);

    // Deduct stock
    orderData.items.forEach(item => {
      updateStock(item.productId, -item.quantity, `Customer Order ${orderNum}`);
    });

    addAudit('ORDER_CREATED', 'Orders', `Created customer order ${orderNum} for ${orderData.customerName} ($${orderData.total})`);
    notify('New Order Received', `Order ${orderNum} received from ${orderData.customerName} ($${orderData.total}).`, 'ORDER');
    return newOrd;
  };

  // Prescriptions
  const reviewPrescription = (id: string, status: Prescription['status'], pharmacistNotes?: string) => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === id) {
        return {
          ...rx,
          status,
          pharmacistNotes: pharmacistNotes || rx.pharmacistNotes,
          reviewedBy: currentUser?.name || 'Chief Pharmacist',
          reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return rx;
    }));
    addAudit('PRESCRIPTION_REVIEWED', 'Prescriptions', `Prescription ${id} marked as ${status}`);
    notify('Prescription Status Updated', `Prescription ${id} is now ${status}.`, 'PRESCRIPTION');
  };

  // Employees
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [...prev, newEmp]);
    addAudit('EMPLOYEE_CREATED', 'Employees', `Added employee ${emp.fullName} (${emp.position})`);
    notify('New Staff Member Added', `${emp.fullName} joined as ${emp.position}.`, 'ANNOUNCEMENT');
  };

  const updateEmployee = (id: string, patch: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
    addAudit('EMPLOYEE_UPDATED', 'Employees', `Updated records for employee ID ${id}`);
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        addAudit('EMPLOYEE_STATUS_TOGGLED', 'Security', `Employee ${e.fullName} status set to ${nextStatus}`);
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  const resetEmployeePassword = (id: string) => {
    const emp = employees.find(e => e.id === id);
    const tempPass = `Medi@${Math.floor(1000 + Math.random() * 9000)}`;
    addAudit('PASSWORD_RESET', 'Security', `Reset password for employee ${emp?.fullName || id}`);
    notify('Password Reset Notice', `Temporary security pass issued for ${emp?.fullName}: ${tempPass}`, 'ANNOUNCEMENT');
    return tempPass;
  };

  // Attendance
  const checkInEmployee = (employeeId: string, notes?: string) => {
    const emp = employees.find(e => e.id === employeeId);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLate = new Date().getHours() >= 9 && new Date().getMinutes() > 10;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName: emp?.fullName || 'Staff Member',
      date: today,
      checkInTime: nowTime,
      status: isLate ? 'LATE' : 'PRESENT',
      workingHours: 0,
      notes: notes || (isLate ? 'Late arrival recorded' : 'On-time morning check-in')
    };

    setAttendance(prev => [newRecord, ...prev.filter(a => !(a.employeeId === employeeId && a.date === today))]);
    addAudit('ATTENDANCE_CHECKIN', 'Attendance', `${emp?.fullName} checked in at ${nowTime}`);
    notify('Attendance Logged', `${emp?.fullName} checked in at ${nowTime}`, 'ATTENDANCE');
  };

  const checkOutEmployee = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const emp = employees.find(e => e.id === employeeId);

    setAttendance(prev => prev.map(a => {
      if (a.employeeId === employeeId && a.date === today) {
        return {
          ...a,
          checkOutTime: nowTime,
          workingHours: 8.5
        };
      }
      return a;
    }));
    addAudit('ATTENDANCE_CHECKOUT', 'Attendance', `${emp?.fullName} checked out at ${nowTime}`);
  };

  const getTodayAttendance = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find(a => a.employeeId === employeeId && a.date === today);
  };

  // Leaves
  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    const newLeave: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0]
    };
    setLeaves(prev => [newLeave, ...prev]);
    addAudit('LEAVE_REQUESTED', 'Leaves', `${req.employeeName} requested ${req.totalDays} day(s) ${req.leaveType} leave`);
    notify('New Leave Request', `${req.employeeName} submitted a ${req.leaveType} leave application.`, 'LEAVE', 'ADMIN');
  };

  const reviewLeaveRequest = (id: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          status,
          reviewNotes: notes,
          reviewedBy: currentUser?.name || 'Administrator',
          reviewDate: new Date().toISOString().split('T')[0]
        };
      }
      return l;
    }));
    addAudit('LEAVE_REVIEWED', 'Leaves', `Leave request ${id} was ${status}`);
    notify('Leave Request Decision', `Your leave request has been ${status}.`, 'LEAVE');
  };

  // Salaries
  const updateSalaryRecord = (id: string, data: Partial<SalaryRecord>) => {
    setSalaries(prev => prev.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...data };
        // Net Salary = Basic Salary + Allowance + Bonus + Overtime - Deduction - Tax
        const calculatedNet = merged.basicSalary + merged.allowance + merged.bonus + merged.overtime - merged.deduction - merged.tax;
        return { ...merged, netSalary: calculatedNet };
      }
      return s;
    }));
    addAudit('SALARY_UPDATED', 'Payroll', `Salary record updated for ${id}`);
  };

  const createSalaryRecord = (record: Omit<SalaryRecord, 'id' | 'salaryId' | 'netSalary'>) => {
    const net = record.basicSalary + record.allowance + record.bonus + record.overtime - record.deduction - record.tax;
    const newRec: SalaryRecord = {
      ...record,
      id: `sal-${Date.now()}`,
      salaryId: `PAY-${Date.now().toString().slice(-6)}`,
      netSalary: net
    };
    setSalaries(prev => [newRec, ...prev]);
    addAudit('SALARY_GENERATED', 'Payroll', `Generated payroll slip for ${record.employeeName} ($${net})`);
  };

  // Expenses
  const addExpense = (exp: Omit<PharmacyExpense, 'id'>) => {
    const newExp: PharmacyExpense = {
      ...exp,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    addAudit('EXPENSE_RECORDED', 'Expenses', `Logged expense: ${exp.title} ($${exp.amount})`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addAudit('EXPENSE_DELETED', 'Expenses', `Deleted expense entry ${id}`);
  };

  // Suppliers & Purchases
  const addSupplier = (sup: Omit<Supplier, 'id' | 'totalOrders' | 'totalPurchased' | 'outstandingBalance'>) => {
    const newSup: Supplier = {
      ...sup,
      id: `sup-${Date.now()}`,
      totalOrders: 0,
      totalPurchased: 0,
      outstandingBalance: 0
    };
    setSuppliers(prev => [...prev, newSup]);
    addAudit('SUPPLIER_ADDED', 'Suppliers', `Enlisted new supplier: ${sup.name}`);
  };

  const createPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'purchaseNumber'>) => {
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      purchaseNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    setPurchases(prev => [newPO, ...prev]);
    addAudit('PURCHASE_ORDER_CREATED', 'Purchases', `Issued PO ${newPO.purchaseNumber} to ${po.supplierName} ($${po.totalAmount})`);
  };

  const receivePurchaseOrder = (id: string) => {
    const po = purchases.find(p => p.id === id);
    if (!po) return;

    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status: 'RECEIVED', paymentStatus: 'PAID' } : p));
    // Increase stock of items
    po.items.forEach(item => {
      updateStock(item.productId, item.quantity, `Purchase Order ${po.purchaseNumber} Receiving`);
    });
    addAudit('PURCHASE_RECEIVED', 'Purchases', `Received inventory shipment for PO ${po.purchaseNumber}`);
    notify('Shipment Stock Received', `PO ${po.purchaseNumber} medicines checked into inventory.`, 'STOCK_LOW', 'INVENTORY_STAFF');
  };

  // Tasks
  const createTask = (t: Omit<StaffTask, 'id'>) => {
    const newTask: StaffTask = {
      ...t,
      id: `tsk-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    addAudit('TASK_ASSIGNED', 'Tasks', `Task "${t.title}" assigned to ${t.assignedToName}`);
    notify('New Task Assigned', `You have been assigned: ${t.title}`, 'TASK');
  };

  const updateTaskStatus = (id: string, status: StaffTask['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          ...(status === 'COMPLETED' ? { completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : {})
        };
      }
      return t;
    }));
    addAudit('TASK_STATUS_CHANGED', 'Tasks', `Task ${id} marked as ${status}`);
  };

  // Announcements & Notifications
  const sendAnnouncement = (title: string, message: string, targetRole: UserRole | 'ALL' = 'ALL') => {
    notify(title, message, 'ANNOUNCEMENT', targetRole);
    addAudit('ANNOUNCEMENT_DISPATCHED', 'Communications', `Broadcasted: "${title}" to ${targetRole}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Settings
  const updateSettings = (patch: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    addAudit('SETTINGS_CHANGED', 'Settings', 'Updated pharmacy website configuration parameters');
  };

  const resetAllDataToDefaults = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setSalaries(INITIAL_SALARIES);
    setExpenses(INITIAL_EXPENSES);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchases(INITIAL_PURCHASES);
    setCoupons(INITIAL_COUPONS);
    setTasks(INITIAL_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <PharmacyContext.Provider
      value={{
        products,
        categories,
        orders,
        customers,
        prescriptions,
        employees,
        attendance,
        leaves,
        salaries,
        expenses,
        suppliers,
        purchases,
        coupons,
        offers,
        tasks,
        notifications,
        auditLogs,
        settings,

        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addCategory,
        updateOrderStatus,
        assignDeliveryStaff,
        createOrder,
        reviewPrescription,
        addEmployee,
        updateEmployee,
        toggleEmployeeStatus,
        resetEmployeePassword,
        checkInEmployee,
        checkOutEmployee,
        getTodayAttendance,
        submitLeaveRequest,
        reviewLeaveRequest,
        updateSalaryRecord,
        createSalaryRecord,
        addExpense,
        deleteExpense,
        addSupplier,
        createPurchaseOrder,
        receivePurchaseOrder,
        createTask,
        updateTaskStatus,
        sendAnnouncement,
        markNotificationRead,
        updateSettings,
        resetAllDataToDefaults
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
