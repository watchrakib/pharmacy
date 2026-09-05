export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'PHARMACIST'
  | 'SALES_STAFF'
  | 'INVENTORY_STAFF'
  | 'DELIVERY_STAFF'
  | 'ACCOUNTANT'
  | 'CUSTOMER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
  employeeId?: string;
  department?: string;
  position?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. EMP-101
  fullName: string;
  phone: string;
  email: string;
  address: string;
  position: string;
  department: string;
  joiningDate: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
  profilePhoto: string;
  role: UserRole;
  permissions: string[]; // list of permitted module keys
  performance: {
    salesCompleted: number;
    ordersProcessed: number;
    tasksCompleted: number;
    attendanceRate: number; // percentage
    customerRating: number; // 1-5
    performanceNotes: string;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  genericName: string;
  category: string;
  categoryId: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  unit: string; // e.g. "Strip of 10", "100ml Bottle", "Box"
  dosage: string; // e.g. "500mg", "10ml"
  strength?: string;
  dosageForm?: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  prescriptionRequired: boolean;
  requiresPrescription?: boolean;
  storageTemperature?: string;
  description: string;
  sideEffects?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  imageUrl: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY_FOR_DELIVERY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  dosage?: string;
  prescriptionRequired?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-2026-089
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'CARD' | 'BKASH' | 'ONLINE';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'READY_FOR_DELIVERY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  prescriptionId?: string;
  assignedDeliveryStaffId?: string;
  assignedDeliveryStaffName?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
  totalOrders?: number;
  totalSpent: number;
  registeredDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  prescriptionsCount: number;
  allergies?: string | string[];
}

export interface Prescription {
  id: string;
  prescriptionCode: string; // e.g. RX-4091
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  doctorName: string;
  hospitalClinic: string;
  datePrescribed: string;
  submittedAt: string;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'DISPENSED' | 'REJECTED';
  imageUrl: string;
  medicinesPrescribed: string[];
  pharmacistNotes?: string;
  reviewedBy?: string; // Pharmacist name
  reviewedAt?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'RESTOCK' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'EXPIRED_DISPOSAL';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceNo: string;
  timestamp: string;
  performedBy: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  medicinesSupplied: string[];
  totalOrders: number;
  totalPurchased: number;
  outstandingBalance: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PurchaseOrder {
  id: string;
  purchaseNumber: string; // e.g. PO-771
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitCost: number;
    total: number;
    batchNumber: string;
    expiryDate: string;
  }[];
  totalAmount: number;
  status: 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PARTIAL' | 'PENDING';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE';
  workingHours: number; // decimal hours
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'CASUAL' | 'SICK' | 'ANNUAL' | 'MATERNITY' | 'EMERGENCY';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedOn: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
}

export interface SalaryRecord {
  id: string;
  salaryId: string; // e.g. PAY-2026-08
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "August 2026"
  basicSalary: number;
  allowance: number;
  allowances?: number;
  bonus: number;
  overtime: number;
  overtimePay?: number;
  deduction: number;
  deductions?: number;
  tax: number;
  netSalary: number; // Basic + Allowance + Bonus + Overtime - Deduction - Tax
  paymentDate: string;
  paymentStatus: 'PAID' | 'PENDING' | 'PROCESSING';
  paymentMethod: 'BANK_TRANSFER' | 'CHEQUE' | 'CASH';
}

export interface PharmacyExpense {
  id: string;
  title: string;
  category: 'RENT' | 'UTILITIES' | 'SALARIES' | 'LOGISTICS' | 'EQUIPMENT' | 'PACKAGING' | 'MARKETING' | 'OTHER';
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: string;
  receiptNumber?: string;
  recordedBy: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  timesUsed: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
  description: string;
}

export interface PromotionalOffer {
  id: string;
  title: string;
  subtitle: string;
  discountTag: string;
  categorySlug?: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  bannerBg: string;
}

export interface StaffTask {
  id: string;
  title: string;
  description: string;
  assignedToEmployeeId: string;
  assignedToName: string;
  assignedBy: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category: 'PRESCRIPTION' | 'INVENTORY' | 'DELIVERY' | 'CUSTOMER_SERVICE' | 'CLEANING_STERILIZATION' | 'AUDIT';
  completedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PRESCRIPTION' | 'STOCK_LOW' | 'STOCK_OUT' | 'LEAVE' | 'ATTENDANCE' | 'SALARY' | 'TASK' | 'ANNOUNCEMENT';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole | 'ALL';
  targetEmployeeId?: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  device: string;
}

export interface WebsiteSettings {
  pharmacyName: string;
  ownerName: string;
  tagline: string;
  email: string;
  phone: string;
  emergencyHotline: string;
  address: string;
  currency: string;
  taxRate: number; // percentage e.g. 5%
  freeDeliveryThreshold: number;
  deliveryCharge: number;
  openingHours: string;
  requirePrescriptionForControlledMeds: boolean;
  announcementBanner: string;
  showAnnouncement: boolean;
}

export type Task = StaffTask;
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Role = UserRole;

