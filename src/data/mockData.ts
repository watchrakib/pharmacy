import {
  Employee,
  ProductCategory,
  Product,
  Order,
  Customer,
  Prescription,
  Supplier,
  PurchaseOrder,
  AttendanceRecord,
  LeaveRequest,
  SalaryRecord,
  PharmacyExpense,
  Coupon,
  PromotionalOffer,
  StaffTask,
  NotificationItem,
  AuditLog,
  WebsiteSettings
} from '../types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'Antibiotics & Anti-infectives', slug: 'antibiotics', description: 'Broad spectrum, anti-bacterial and antiviral medications', iconName: 'Pill', itemCount: 28 },
  { id: 'cat-2', name: 'Pain, Fever & Anti-inflammatory', slug: 'pain-fever', description: 'Analgesics, antipyretics and NSAIDs', iconName: 'Flame', itemCount: 34 },
  { id: 'cat-3', name: 'Cardiovascular & Blood Pressure', slug: 'cardiovascular', description: 'Hypertension, cholesterol and cardiac health', iconName: 'HeartPulse', itemCount: 19 },
  { id: 'cat-4', name: 'Diabetes & Insulin Care', slug: 'diabetes', description: 'Oral hypoglycemics, insulins and test kits', iconName: 'Activity', itemCount: 22 },
  { id: 'cat-5', name: 'Gastric & Acid Reflux', slug: 'gastric', description: 'Proton pump inhibitors, antacids and digestive aids', iconName: 'ShieldAlert', itemCount: 16 },
  { id: 'cat-6', name: 'Vitamins & Dietary Supplements', slug: 'vitamins', description: 'Multivitamins, zinc, calcium and vitality', iconName: 'Sparkles', itemCount: 41 },
  { id: 'cat-7', name: 'Respiratory & Allergy Care', slug: 'respiratory', description: 'Antihistamines, inhalers, cough syrups and decongestants', iconName: 'Wind', itemCount: 25 },
  { id: 'cat-8', name: 'Surgical & First Aid', slug: 'first-aid', description: 'Bandages, antiseptics, thermometers and diagnostics', iconName: 'Cross', itemCount: 30 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Napa Extra 500mg/65mg',
    genericName: 'Paracetamol + Caffeine',
    category: 'Pain, Fever & Anti-inflammatory',
    categoryId: 'cat-2',
    price: 3.50,
    costPrice: 2.20,
    stock: 450,
    lowStockThreshold: 100,
    unit: 'Box of 100 Tablets',
    dosage: '500mg Paracetamol + 65mg Caffeine',
    manufacturer: 'Beximco Pharmaceuticals Ltd',
    batchNumber: 'BX-2026-901',
    expiryDate: '2027-11-30',
    prescriptionRequired: false,
    description: 'Fast acting relief for severe fever, migraine, toothache and body aches.',
    sideEffects: 'Mild restlessness if taken before sleep due to caffeine.',
    status: 'IN_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-2',
    name: 'Seclo 20mg Capsule',
    genericName: 'Omeprazole',
    category: 'Gastric & Acid Reflux',
    categoryId: 'cat-5',
    price: 7.00,
    costPrice: 4.80,
    stock: 280,
    lowStockThreshold: 80,
    unit: 'Strip of 10 Capsules',
    dosage: '20mg',
    manufacturer: 'Square Pharmaceuticals Ltd',
    batchNumber: 'SQ-4491-A',
    expiryDate: '2028-03-15',
    prescriptionRequired: false,
    description: 'Effective proton pump inhibitor for hyperacidity, peptic ulcer and GERD symptoms.',
    status: 'IN_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-3',
    name: 'Moxaclav 625mg',
    genericName: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotics & Anti-infectives',
    categoryId: 'cat-1',
    price: 24.50,
    costPrice: 18.00,
    stock: 45,
    lowStockThreshold: 60,
    unit: 'Strip of 6 Tablets',
    dosage: '500mg/125mg',
    manufacturer: 'Incepta Pharmaceuticals Ltd',
    batchNumber: 'INC-2026-78',
    expiryDate: '2027-06-20',
    prescriptionRequired: true,
    description: 'Broad spectrum antibacterial therapy for respiratory, ENT and urinary tract infections.',
    status: 'LOW_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-4',
    name: 'Lantus SoloStar 100 IU/ml',
    genericName: 'Insulin Glargine',
    category: 'Diabetes & Insulin Care',
    categoryId: 'cat-4',
    price: 42.00,
    costPrice: 34.50,
    stock: 14,
    lowStockThreshold: 20,
    unit: 'Pre-filled Pen (3ml)',
    dosage: '100 units/ml',
    manufacturer: 'Sanofi Healthcare',
    batchNumber: 'SNF-GL-110',
    expiryDate: '2027-04-10',
    prescriptionRequired: true,
    description: 'Long acting basal insulin analog for diabetes mellitus management. Maintain 2-8°C cold chain.',
    status: 'LOW_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-5',
    name: 'Atova 10mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular & Blood Pressure',
    categoryId: 'cat-3',
    price: 12.00,
    costPrice: 8.50,
    stock: 190,
    lowStockThreshold: 50,
    unit: 'Box of 30 Tablets',
    dosage: '10mg',
    manufacturer: 'Beximco Pharmaceuticals Ltd',
    batchNumber: 'BX-ATV-88',
    expiryDate: '2027-09-30',
    prescriptionRequired: true,
    description: 'HMG-CoA reductase inhibitor for dyslipidemia and cardiovascular risk reduction.',
    status: 'IN_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-6',
    name: 'Alatrol 10mg Tablet',
    genericName: 'Cetirizine Dihydrochloride',
    category: 'Respiratory & Allergy Care',
    categoryId: 'cat-7',
    price: 4.00,
    costPrice: 2.60,
    stock: 310,
    lowStockThreshold: 75,
    unit: 'Strip of 10 Tablets',
    dosage: '10mg',
    manufacturer: 'Square Pharmaceuticals Ltd',
    batchNumber: 'SQ-ALT-021',
    expiryDate: '2028-01-25',
    prescriptionRequired: false,
    description: 'Potent 2nd gen antihistamine for allergic rhinitis, urticaria and sneezing.',
    status: 'IN_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-7',
    name: 'Zithrin 500mg',
    genericName: 'Azithromycin Monohydrate',
    category: 'Antibiotics & Anti-infectives',
    categoryId: 'cat-1',
    price: 18.00,
    costPrice: 13.20,
    stock: 0,
    lowStockThreshold: 40,
    unit: 'Strip of 3 Tablets',
    dosage: '500mg',
    manufacturer: 'Renata Limited',
    batchNumber: 'RN-ZTH-902',
    expiryDate: '2026-10-15',
    prescriptionRequired: true,
    description: 'Macrolide antibiotic for acute respiratory, skin and genital chlamydial infections.',
    status: 'OUT_OF_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-8',
    name: 'D-Rise 20,000 IU Capsule',
    genericName: 'Cholecalciferol (Vitamin D3)',
    category: 'Vitamins & Dietary Supplements',
    categoryId: 'cat-6',
    price: 15.00,
    costPrice: 9.80,
    stock: 140,
    lowStockThreshold: 35,
    unit: 'Box of 8 Softgels',
    dosage: '20,000 IU',
    manufacturer: 'Square Pharmaceuticals Ltd',
    batchNumber: 'SQ-VD3-401',
    expiryDate: '2027-12-31',
    prescriptionRequired: false,
    description: 'High potency Vitamin D3 supplement for bone density, calcium absorption and immune defence.',
    status: 'IN_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-9',
    name: 'Micropore Surgical Tape 1 Inch',
    genericName: 'Hypoallergenic Paper Tape',
    category: 'Surgical & First Aid',
    categoryId: 'cat-8',
    price: 6.50,
    costPrice: 4.10,
    stock: 95,
    lowStockThreshold: 30,
    unit: 'Roll with Dispenser',
    dosage: '1 inch x 10 yards',
    manufacturer: '3M Healthcare',
    batchNumber: '3M-MP-55',
    expiryDate: '2029-05-01',
    prescriptionRequired: false,
    description: 'Gentle, breathable paper surgical tape for secure wound dressing adhesion.',
    status: 'IN_STOCK',
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP-101',
    fullName: 'Taufiq Al-Hassan',
    phone: '+880 1711-000111',
    email: 'taufiq.admin@medishop.com',
    address: 'Plot 14, Road 7, Dhanmondi, Dhaka',
    position: 'Chief Executive Officer & Owner',
    department: 'Executive Management',
    joiningDate: '2023-01-01',
    salary: 120000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'ADMIN',
    permissions: ['all'],
    performance: {
      salesCompleted: 420,
      ordersProcessed: 680,
      tasksCompleted: 98,
      attendanceRate: 99.4,
      customerRating: 4.9,
      performanceNotes: 'System Administrator and visionary founder of MEDISHOP.'
    }
  },
  {
    id: 'emp-2',
    employeeId: 'EMP-102',
    fullName: 'Dr. Farhana Ahmed',
    phone: '+880 1819-223344',
    email: 'farhana.pharmacist@medishop.com',
    address: 'House 45, Sector 4, Uttara, Dhaka',
    position: 'Chief Clinical Pharmacist',
    department: 'Pharmacy & Dispensing',
    joiningDate: '2023-03-15',
    salary: 68000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    role: 'PHARMACIST',
    permissions: ['prescriptions', 'medicines', 'orders', 'customers', 'product_info', 'tasks'],
    performance: {
      salesCompleted: 310,
      ordersProcessed: 520,
      tasksCompleted: 88,
      attendanceRate: 98.2,
      customerRating: 4.95,
      performanceNotes: 'Outstanding prescription verification precision. Zero dispensing errors.'
    }
  },
  {
    id: 'emp-3',
    employeeId: 'EMP-103',
    fullName: 'Nusrat Jahan',
    phone: '+880 1912-334455',
    email: 'nusrat.manager@medishop.com',
    address: 'B-Block, Banani, Dhaka',
    position: 'Pharmacy Operations Manager',
    department: 'Store Operations',
    joiningDate: '2023-05-01',
    salary: 75000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'MANAGER',
    permissions: ['orders', 'sales', 'employees', 'inventory', 'reports', 'leaves', 'tasks'],
    performance: {
      salesCompleted: 240,
      ordersProcessed: 490,
      tasksCompleted: 92,
      attendanceRate: 97.5,
      customerRating: 4.8,
      performanceNotes: 'High leadership efficiency and smooth floor shift orchestration.'
    }
  },
  {
    id: 'emp-4',
    employeeId: 'EMP-104',
    fullName: 'Tanvir Hossain',
    phone: '+880 1611-445566',
    email: 'tanvir.sales@medishop.com',
    address: 'Mirpur-10, Dhaka',
    position: 'Senior Sales Executive',
    department: 'Sales & Counter POS',
    joiningDate: '2023-08-10',
    salary: 38000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'SALES_STAFF',
    permissions: ['sales', 'orders', 'customers', 'products', 'tasks'],
    performance: {
      salesCompleted: 480,
      ordersProcessed: 430,
      tasksCompleted: 75,
      attendanceRate: 96.0,
      customerRating: 4.85,
      performanceNotes: 'Top counter salesperson with high customer retention rate.'
    }
  },
  {
    id: 'emp-5',
    employeeId: 'EMP-105',
    fullName: 'Kamrul Islam',
    phone: '+880 1515-667788',
    email: 'kamrul.inventory@medishop.com',
    address: 'Kalyanpur, Dhaka',
    position: 'Inventory & Cold Chain Supervisor',
    department: 'Warehouse & Inventory',
    joiningDate: '2023-09-01',
    salary: 42000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    role: 'INVENTORY_STAFF',
    permissions: ['products', 'stock', 'purchases', 'suppliers', 'inventory_reports', 'tasks'],
    performance: {
      salesCompleted: 95,
      ordersProcessed: 210,
      tasksCompleted: 94,
      attendanceRate: 99.0,
      customerRating: 4.7,
      performanceNotes: 'Diligent batch tracker; maintains pristine 2-8°C cold chain records.'
    }
  },
  {
    id: 'emp-6',
    employeeId: 'EMP-106',
    fullName: 'Sabbir Rahman',
    phone: '+880 1718-990011',
    email: 'sabbir.delivery@medishop.com',
    address: 'Mohammadpur, Dhaka',
    position: 'Senior Fast-Track Delivery Rider',
    department: 'Logistics & Dispatch',
    joiningDate: '2024-02-15',
    salary: 32000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    role: 'DELIVERY_STAFF',
    permissions: ['assigned_orders', 'delivery_info', 'delivery_status', 'tasks'],
    performance: {
      salesCompleted: 0,
      ordersProcessed: 390,
      tasksCompleted: 89,
      attendanceRate: 98.8,
      customerRating: 4.9,
      performanceNotes: 'Average delivery turnaround under 38 minutes across Dhaka central.'
    }
  },
  {
    id: 'emp-7',
    employeeId: 'EMP-107',
    fullName: 'Shafiqul Alam',
    phone: '+880 1822-331199',
    email: 'shafiq.finance@medishop.com',
    address: 'Shantinagar, Dhaka',
    position: 'Senior Accountant & Auditor',
    department: 'Accounts & Finance',
    joiningDate: '2023-04-20',
    salary: 58000,
    status: 'ACTIVE',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    role: 'ACCOUNTANT',
    permissions: ['sales', 'expenses', 'purchases', 'salary', 'profit_loss', 'financial_reports', 'tasks'],
    performance: {
      salesCompleted: 120,
      ordersProcessed: 180,
      tasksCompleted: 96,
      attendanceRate: 97.8,
      customerRating: 4.8,
      performanceNotes: 'Exact reconciliation of tax declarations and vendor balances.'
    }
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Mohammad Rafiqul Islam',
    email: 'rafiqul.islam@gmail.com',
    phone: '+880 1712-445588',
    address: 'House 12, Road 5, Block C, Dhanmondi, Dhaka',
    ordersCount: 9,
    totalSpent: 420.50,
    registeredDate: '2024-01-12',
    status: 'ACTIVE',
    prescriptionsCount: 3,
    allergies: 'Penicillin allergy noted'
  },
  {
    id: 'cust-2',
    name: 'Dr. Shahana Parveen',
    email: 'shahana.doc@mednet.org',
    phone: '+880 1819-556677',
    address: 'Apt 4B, Green Lake View, Gulshan-2, Dhaka',
    ordersCount: 14,
    totalSpent: 890.00,
    registeredDate: '2023-11-04',
    status: 'ACTIVE',
    prescriptionsCount: 4
  },
  {
    id: 'cust-3',
    name: 'Anisur Rahman',
    email: 'anisur.r@yahoo.com',
    phone: '+880 1914-998877',
    address: 'Lane 3, Section 11, Mirpur, Dhaka',
    ordersCount: 4,
    totalSpent: 165.20,
    registeredDate: '2024-03-22',
    status: 'ACTIVE',
    prescriptionsCount: 1
  },
  {
    id: 'cust-4',
    name: 'Rubina Yasmin',
    email: 'rubina.yasmin@outlook.com',
    phone: '+880 1618-223399',
    address: 'Flat 6C, Concord Tower, Uttara, Dhaka',
    ordersCount: 7,
    totalSpent: 340.80,
    registeredDate: '2024-02-18',
    status: 'ACTIVE',
    prescriptionsCount: 2
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    prescriptionCode: 'RX-4091',
    customerName: 'Mohammad Rafiqul Islam',
    customerPhone: '+880 1712-445588',
    customerEmail: 'rafiqul.islam@gmail.com',
    doctorName: 'Prof. Dr. M. A. Jalil (Cardiologist)',
    hospitalClinic: 'National Heart Foundation, Dhaka',
    datePrescribed: '2026-09-02',
    submittedAt: '2026-09-03 14:20',
    status: 'PENDING_REVIEW',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80',
    medicinesPrescribed: ['Atorvastatin 10mg (1-0-0)', 'Moxaclav 625mg (1-0-1)', 'Pantoprazole 40mg'],
    pharmacistNotes: 'Patient flagged penicillin sensitivity; need to confirm Moxaclav tolerance before approving.',
    reviewedBy: 'Dr. Farhana Ahmed',
    reviewedAt: '2026-09-04 10:15'
  },
  {
    id: 'rx-2',
    prescriptionCode: 'RX-4092',
    customerName: 'Rubina Yasmin',
    customerPhone: '+880 1618-223399',
    customerEmail: 'rubina.yasmin@outlook.com',
    doctorName: 'Dr. Tariqul Islam (Endocrinologist)',
    hospitalClinic: 'BIRDEM General Hospital, Shahbag',
    datePrescribed: '2026-09-01',
    submittedAt: '2026-09-02 09:45',
    status: 'VERIFIED',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&auto=format&fit=crop&q=80',
    medicinesPrescribed: ['Lantus SoloStar 100 IU/ml (18 units at bedtime)', 'Metformin 500mg (1-0-1)'],
    pharmacistNotes: 'Verified with doctor registration BMDC-44120. Cold chain packing requested.',
    reviewedBy: 'Dr. Farhana Ahmed',
    reviewedAt: '2026-09-02 11:30'
  },
  {
    id: 'rx-3',
    prescriptionCode: 'RX-4093',
    customerName: 'Dr. Shahana Parveen',
    customerPhone: '+880 1819-556677',
    customerEmail: 'shahana.doc@mednet.org',
    doctorName: 'Dr. Shahana Parveen (Self)',
    hospitalClinic: 'Apollo Evercare Hospitals',
    datePrescribed: '2026-08-28',
    submittedAt: '2026-08-28 16:10',
    status: 'DISPENSED',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=700&auto=format&fit=crop&q=80',
    medicinesPrescribed: ['D-Rise 20,000 IU (1 cap weekly for 8 weeks)', 'Seclo 20mg'],
    pharmacistNotes: 'Valid registered medical practitioner prescription. Dispensed on order ORD-2026-087.',
    reviewedBy: 'Dr. Farhana Ahmed',
    reviewedAt: '2026-08-28 17:00'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-2026-091',
    customerName: 'Mohammad Rafiqul Islam',
    customerEmail: 'rafiqul.islam@gmail.com',
    customerPhone: '+880 1712-445588',
    shippingAddress: 'House 12, Road 5, Block C, Dhanmondi, Dhaka',
    items: [
      { productId: 'prod-1', productName: 'Napa Extra 500mg/65mg', unitPrice: 3.50, quantity: 2, totalPrice: 7.00 },
      { productId: 'prod-2', productName: 'Seclo 20mg Capsule', unitPrice: 7.00, quantity: 2, totalPrice: 14.00 },
      { productId: 'prod-8', productName: 'D-Rise 20,000 IU Capsule', unitPrice: 15.00, quantity: 1, totalPrice: 15.00 }
    ],
    subtotal: 36.00,
    discount: 3.60,
    tax: 1.80,
    deliveryFee: 3.00,
    total: 37.20,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING',
    orderStatus: 'PENDING',
    createdAt: '2026-09-04 18:30',
    updatedAt: '2026-09-04 18:30',
    notes: 'Please bring change for 50 bill.'
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-2026-090',
    customerName: 'Rubina Yasmin',
    customerEmail: 'rubina.yasmin@outlook.com',
    customerPhone: '+880 1618-223399',
    shippingAddress: 'Flat 6C, Concord Tower, Uttara, Dhaka',
    items: [
      { productId: 'prod-4', productName: 'Lantus SoloStar 100 IU/ml', unitPrice: 42.00, quantity: 1, totalPrice: 42.00, prescriptionRequired: true },
      { productId: 'prod-6', productName: 'Alatrol 10mg Tablet', unitPrice: 4.00, quantity: 2, totalPrice: 8.00 }
    ],
    subtotal: 50.00,
    discount: 5.00,
    tax: 2.50,
    deliveryFee: 0.00,
    total: 47.50,
    paymentMethod: 'BKASH',
    paymentStatus: 'PAID',
    orderStatus: 'OUT_FOR_DELIVERY',
    assignedDeliveryStaffId: 'emp-6',
    assignedDeliveryStaffName: 'Sabbir Rahman',
    prescriptionId: 'rx-2',
    createdAt: '2026-09-04 14:10',
    updatedAt: '2026-09-04 16:45',
    notes: 'Pack in insulated thermal bag with ice gel pack.'
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-2026-089',
    customerName: 'Dr. Shahana Parveen',
    customerEmail: 'shahana.doc@mednet.org',
    customerPhone: '+880 1819-556677',
    shippingAddress: 'Apt 4B, Green Lake View, Gulshan-2, Dhaka',
    items: [
      { productId: 'prod-5', productName: 'Atova 10mg', unitPrice: 12.00, quantity: 3, totalPrice: 36.00, prescriptionRequired: true },
      { productId: 'prod-9', productName: 'Micropore Surgical Tape 1 Inch', unitPrice: 6.50, quantity: 4, totalPrice: 26.00 }
    ],
    subtotal: 62.00,
    discount: 6.20,
    tax: 3.10,
    deliveryFee: 0.00,
    total: 58.90,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    assignedDeliveryStaffId: 'emp-6',
    assignedDeliveryStaffName: 'Sabbir Rahman',
    createdAt: '2026-09-03 11:20',
    updatedAt: '2026-09-03 14:05',
    notes: 'Doctor confirmed receipt and signed delivery sheet.'
  },
  {
    id: 'ord-4',
    orderNumber: 'ORD-2026-088',
    customerName: 'Anisur Rahman',
    customerEmail: 'anisur.r@yahoo.com',
    customerPhone: '+880 1914-998877',
    shippingAddress: 'Lane 3, Section 11, Mirpur, Dhaka',
    items: [
      { productId: 'prod-1', productName: 'Napa Extra 500mg/65mg', unitPrice: 3.50, quantity: 4, totalPrice: 14.00 },
      { productId: 'prod-6', productName: 'Alatrol 10mg Tablet', unitPrice: 4.00, quantity: 3, totalPrice: 12.00 }
    ],
    subtotal: 26.00,
    discount: 0.00,
    tax: 1.30,
    deliveryFee: 3.00,
    total: 30.30,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    assignedDeliveryStaffId: 'emp-6',
    assignedDeliveryStaffName: 'Sabbir Rahman',
    createdAt: '2026-09-02 09:15',
    updatedAt: '2026-09-02 12:40'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Square Pharmaceuticals Distribution Depot',
    contactPerson: 'Kazi Moinuddin (Key Account Mgr)',
    phone: '+880 1713-112233',
    email: 'supply.dhaka@squarepharma.com.bd',
    address: 'Square Centre, 48 Mohakhali C/A, Dhaka',
    medicinesSupplied: ['Seclo', 'Alatrol', 'D-Rise', 'Ace Plus', 'Ciprocin'],
    totalOrders: 42,
    totalPurchased: 450000,
    outstandingBalance: 32000,
    status: 'ACTIVE'
  },
  {
    id: 'sup-2',
    name: 'Beximco Pharma National Logistics',
    contactPerson: 'Ziaur Rahman',
    phone: '+880 1711-556677',
    email: 'depot.sales@beximco-pharma.com',
    address: '17 Dhanmondi R/A, Road 2, Dhaka',
    medicinesSupplied: ['Napa Extra', 'Atova', 'Bexitrol', 'Napa Rapid', 'Neoceptin'],
    totalOrders: 38,
    totalPurchased: 380000,
    outstandingBalance: 14500,
    status: 'ACTIVE'
  },
  {
    id: 'sup-3',
    name: 'Incepta Healthcare Distributors',
    contactPerson: 'Shabbir Hossain',
    phone: '+880 1819-778899',
    email: 'order@inceptapharma.com',
    address: '40 Shahid Tajuddin Ahmed Sarani, Tejgaon, Dhaka',
    medicinesSupplied: ['Moxaclav', 'Monas', 'Finix', 'Osartil', 'Pantobex'],
    totalOrders: 29,
    totalPurchased: 290000,
    outstandingBalance: 0,
    status: 'ACTIVE'
  }
];

export const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: 'po-1',
    purchaseNumber: 'PO-2026-041',
    supplierId: 'sup-1',
    supplierName: 'Square Pharmaceuticals Distribution Depot',
    orderDate: '2026-08-25',
    deliveryDate: '2026-08-27',
    items: [
      { productId: 'prod-2', productName: 'Seclo 20mg Capsule', quantity: 300, unitCost: 4.80, total: 1440.00, batchNumber: 'SQ-4491-A', expiryDate: '2028-03-15' },
      { productId: 'prod-6', productName: 'Alatrol 10mg Tablet', quantity: 400, unitCost: 2.60, total: 1040.00, batchNumber: 'SQ-ALT-021', expiryDate: '2028-01-25' }
    ],
    totalAmount: 2480.00,
    status: 'RECEIVED',
    paymentStatus: 'PAID'
  },
  {
    id: 'po-2',
    purchaseNumber: 'PO-2026-042',
    supplierId: 'sup-2',
    supplierName: 'Beximco Pharma National Logistics',
    orderDate: '2026-09-02',
    deliveryDate: '2026-09-06',
    items: [
      { productId: 'prod-1', productName: 'Napa Extra 500mg/65mg', quantity: 500, unitCost: 2.20, total: 1100.00, batchNumber: 'BX-2026-901', expiryDate: '2027-11-30' },
      { productId: 'prod-5', productName: 'Atova 10mg', quantity: 200, unitCost: 8.50, total: 1700.00, batchNumber: 'BX-ATV-88', expiryDate: '2027-09-30' }
    ],
    totalAmount: 2800.00,
    status: 'ORDERED',
    paymentStatus: 'PARTIAL'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'EMP-101',
    employeeName: 'Taufiq Al-Hassan',
    date: '2026-09-04',
    checkInTime: '08:45 AM',
    checkOutTime: '06:15 PM',
    status: 'PRESENT',
    workingHours: 9.5,
    notes: 'Executive store audit and review'
  },
  {
    id: 'att-2',
    employeeId: 'EMP-102',
    employeeName: 'Dr. Farhana Ahmed',
    date: '2026-09-04',
    checkInTime: '08:55 AM',
    status: 'PRESENT',
    workingHours: 8.0,
    notes: 'Prescription counter morning duty'
  },
  {
    id: 'att-3',
    employeeId: 'EMP-103',
    employeeName: 'Nusrat Jahan',
    date: '2026-09-04',
    checkInTime: '09:12 AM',
    status: 'LATE',
    workingHours: 7.8,
    notes: 'Traffic delay on Airport Road'
  },
  {
    id: 'att-4',
    employeeId: 'EMP-104',
    employeeName: 'Tanvir Hossain',
    date: '2026-09-04',
    checkInTime: '08:50 AM',
    status: 'PRESENT',
    workingHours: 8.5,
    notes: 'Sales counter'
  },
  {
    id: 'att-5',
    employeeId: 'EMP-105',
    employeeName: 'Kamrul Islam',
    date: '2026-09-04',
    checkInTime: '08:40 AM',
    status: 'PRESENT',
    workingHours: 8.7,
    notes: 'Warehouse shipment receiving'
  },
  {
    id: 'att-6',
    employeeId: 'EMP-106',
    employeeName: 'Sabbir Rahman',
    date: '2026-09-04',
    checkInTime: '09:00 AM',
    status: 'PRESENT',
    workingHours: 8.0,
    notes: 'Express deliveries'
  },
  {
    id: 'att-7',
    employeeId: 'EMP-107',
    employeeName: 'Shafiqul Alam',
    date: '2026-09-04',
    checkInTime: '08:58 AM',
    status: 'PRESENT',
    workingHours: 8.2,
    notes: 'August financial closing'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'EMP-104',
    employeeName: 'Tanvir Hossain',
    leaveType: 'CASUAL',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    totalDays: 3,
    reason: 'Family wedding event in Chittagong.',
    status: 'PENDING',
    appliedOn: '2026-09-03'
  },
  {
    id: 'leave-2',
    employeeId: 'EMP-106',
    employeeName: 'Sabbir Rahman',
    leaveType: 'SICK',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    totalDays: 2,
    reason: 'Severe seasonal flu with fever. Doctor recommended rest.',
    status: 'APPROVED',
    appliedOn: '2026-08-19',
    reviewedBy: 'Taufiq Al-Hassan',
    reviewDate: '2026-08-19',
    reviewNotes: 'Approved with medical certificate.'
  }
];

export const INITIAL_SALARIES: SalaryRecord[] = [
  {
    id: 'sal-1',
    salaryId: 'PAY-2026-08-101',
    employeeId: 'EMP-101',
    employeeName: 'Taufiq Al-Hassan',
    month: 'August 2026',
    basicSalary: 95000,
    allowance: 15000,
    bonus: 10000,
    overtime: 0,
    deduction: 0,
    tax: 8000,
    netSalary: 112000,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'sal-2',
    salaryId: 'PAY-2026-08-102',
    employeeId: 'EMP-102',
    employeeName: 'Dr. Farhana Ahmed',
    month: 'August 2026',
    basicSalary: 55000,
    allowance: 8000,
    bonus: 5000,
    overtime: 2500,
    deduction: 1000,
    tax: 3500,
    netSalary: 66000,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'sal-3',
    salaryId: 'PAY-2026-08-103',
    employeeId: 'EMP-103',
    employeeName: 'Nusrat Jahan',
    month: 'August 2026',
    basicSalary: 60000,
    allowance: 9000,
    bonus: 6000,
    overtime: 3000,
    deduction: 1500,
    tax: 4200,
    netSalary: 72300,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'sal-4',
    salaryId: 'PAY-2026-08-104',
    employeeId: 'EMP-104',
    employeeName: 'Tanvir Hossain',
    month: 'August 2026',
    basicSalary: 30000,
    allowance: 4000,
    bonus: 4000,
    overtime: 3500,
    deduction: 800,
    tax: 1200,
    netSalary: 39500,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'sal-5',
    salaryId: 'PAY-2026-08-105',
    employeeId: 'EMP-105',
    employeeName: 'Kamrul Islam',
    month: 'August 2026',
    basicSalary: 34000,
    allowance: 4500,
    bonus: 3500,
    overtime: 2800,
    deduction: 500,
    tax: 1500,
    netSalary: 42800,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'sal-6',
    salaryId: 'PAY-2026-08-106',
    employeeId: 'EMP-106',
    employeeName: 'Sabbir Rahman',
    month: 'August 2026',
    basicSalary: 24000,
    allowance: 5000,
    bonus: 3000,
    overtime: 4200,
    deduction: 400,
    tax: 800,
    netSalary: 35000,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  },
  {
    id: 'sal-7',
    salaryId: 'PAY-2026-08-107',
    employeeId: 'EMP-107',
    employeeName: 'Shafiqul Alam',
    month: 'August 2026',
    basicSalary: 46000,
    allowance: 7000,
    bonus: 5000,
    overtime: 1500,
    deduction: 700,
    tax: 2800,
    netSalary: 56000,
    paymentDate: '2026-08-31',
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER'
  }
];

export const INITIAL_EXPENSES: PharmacyExpense[] = [
  {
    id: 'exp-1',
    title: 'Pharmacy Prime Commercial Premises Rent',
    category: 'RENT',
    amount: 45000,
    date: '2026-09-01',
    paidTo: 'Dhanmondi Commercial Plaza Holdings',
    paymentMethod: 'Bank Cheque',
    receiptNumber: 'REC-RENT-901',
    recordedBy: 'Shafiqul Alam',
    notes: 'Monthly retail premise and cold-room store rent'
  },
  {
    id: 'exp-2',
    title: 'Precision Cold Chain Refrigerator Electricity & Power Backup',
    category: 'UTILITIES',
    amount: 14200,
    date: '2026-09-02',
    paidTo: 'Dhaka Electric Supply Company (DESCO)',
    paymentMethod: 'Online Bank Transfer',
    receiptNumber: 'DESCO-4491-9',
    recordedBy: 'Shafiqul Alam',
    notes: '24/7 dedicated electricity line for insulin and vaccine fridges'
  },
  {
    id: 'exp-3',
    title: 'Eco-friendly Biodegradable Pharmacy Bags & Rx Envelopes',
    category: 'PACKAGING',
    amount: 3800,
    date: '2026-09-03',
    paidTo: 'GreenPack Industries Ltd',
    paymentMethod: 'Cash',
    receiptNumber: 'GP-8832',
    recordedBy: 'Tanvir Hossain',
    notes: '3,000 custom branded MEDISHOP bags with child-safety advice'
  },
  {
    id: 'exp-4',
    title: 'Delivery Fleet Fuel and Two-Wheeler Maintenance',
    category: 'LOGISTICS',
    amount: 6500,
    date: '2026-09-03',
    paidTo: 'Padma Oil & Fleet Servicing',
    paymentMethod: 'Corporate Card',
    receiptNumber: 'POC-4410',
    recordedBy: 'Sabbir Rahman',
    notes: 'Fuel cards refill for 3 delivery motorcycles'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'HEALTH10',
    discountPercentage: 10,
    maxDiscountAmount: 15.00,
    minOrderAmount: 25.00,
    validFrom: '2026-08-01',
    validUntil: '2026-09-30',
    usageLimit: 500,
    timesUsed: 142,
    status: 'ACTIVE',
    description: 'Flat 10% discount on all wellness, vitamins and regular care products.'
  },
  {
    id: 'coup-2',
    code: 'TAUFIQCARE',
    discountPercentage: 15,
    maxDiscountAmount: 30.00,
    minOrderAmount: 50.00,
    validFrom: '2026-09-01',
    validUntil: '2026-10-15',
    usageLimit: 200,
    timesUsed: 49,
    status: 'ACTIVE',
    description: 'Special founder celebration voucher: 15% discount for orders above $50.'
  }
];

export const INITIAL_OFFERS: PromotionalOffer[] = [
  {
    id: 'off-1',
    title: 'Immunity & Vitality Booster Fest',
    subtitle: 'Up to 20% OFF on premium Vitamin D3, Zinc & Multivitamin packages',
    discountTag: '20% OFF',
    categorySlug: 'vitamins',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    status: 'ACTIVE',
    bannerBg: 'bg-emerald-600'
  },
  {
    id: 'off-2',
    title: 'Diabetic Care & Free Consultation',
    subtitle: 'Complimentary blood glucose strip on all 3-month insulin orders',
    discountTag: 'FREE TEST KIT',
    categorySlug: 'diabetes',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'ACTIVE',
    bannerBg: 'bg-blue-600'
  }
];

export const INITIAL_TASKS: StaffTask[] = [
  {
    id: 'tsk-1',
    title: 'Verify pending prescription RX-4091 for Penicillin allergy',
    description: 'Contact Dr. M.A. Jalil or patient regarding Moxaclav tolerance and verify BMDC code.',
    assignedToEmployeeId: 'emp-2',
    assignedToName: 'Dr. Farhana Ahmed',
    assignedBy: 'Taufiq Al-Hassan',
    priority: 'HIGH',
    dueDate: '2026-09-05',
    status: 'IN_PROGRESS',
    category: 'PRESCRIPTION'
  },
  {
    id: 'tsk-2',
    title: 'Count & calibrate cold chain vaccine fridge inventory',
    description: 'Record temperatures every 4 hours and check Lantus SoloStar remaining batch stock.',
    assignedToEmployeeId: 'emp-5',
    assignedToName: 'Kamrul Islam',
    assignedBy: 'Nusrat Jahan',
    priority: 'HIGH',
    dueDate: '2026-09-05',
    status: 'PENDING',
    category: 'INVENTORY'
  },
  {
    id: 'tsk-3',
    title: 'Deliver urgent thermal-insulated insulin order ORD-2026-090',
    description: 'Deliver to Rubina Yasmin at Concord Tower, Uttara before 7:00 PM.',
    assignedToEmployeeId: 'emp-6',
    assignedToName: 'Sabbir Rahman',
    assignedBy: 'Nusrat Jahan',
    priority: 'HIGH',
    dueDate: '2026-09-04',
    status: 'IN_PROGRESS',
    category: 'DELIVERY'
  },
  {
    id: 'tsk-4',
    title: 'Finalize August 2026 Withholding Tax & VAT Return',
    description: 'Prepare tax deduction schedule for employee salaries and vendor payouts.',
    assignedToEmployeeId: 'emp-7',
    assignedToName: 'Shafiqul Alam',
    assignedBy: 'Taufiq Al-Hassan',
    priority: 'MEDIUM',
    dueDate: '2026-09-07',
    status: 'IN_PROGRESS',
    category: 'AUDIT'
  },
  {
    id: 'tsk-5',
    title: 'Rearrange Vitamin D & Calcium counter promotional stand',
    description: 'Place D-Rise 20,000 IU promotional flyers and clear expired shelf testers.',
    assignedToEmployeeId: 'emp-4',
    assignedToName: 'Tanvir Hossain',
    assignedBy: 'Nusrat Jahan',
    priority: 'LOW',
    dueDate: '2026-09-06',
    status: 'COMPLETED',
    category: 'CUSTOMER_SERVICE',
    completedAt: '2026-09-04 15:30'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Customer Order Placed',
    message: 'Order ORD-2026-091 received from Mohammad Rafiqul Islam ($37.20).',
    type: 'ORDER',
    timestamp: '15 mins ago',
    read: false,
    targetRole: 'ALL'
  },
  {
    id: 'notif-2',
    title: 'Prescription Awaiting Clinical Review',
    message: 'Prescription RX-4091 uploaded. Requires clinical verification.',
    type: 'PRESCRIPTION',
    timestamp: '1 hour ago',
    read: false,
    targetRole: 'PHARMACIST'
  },
  {
    id: 'notif-3',
    title: 'Critical Low Stock Warning',
    message: 'Lantus SoloStar (Insulin) has only 14 pens left (Threshold: 20).',
    type: 'STOCK_LOW',
    timestamp: '3 hours ago',
    read: false,
    targetRole: 'INVENTORY_STAFF'
  },
  {
    id: 'notif-4',
    title: 'Urgent: Out of Stock Alert',
    message: 'Zithrin 500mg (Azithromycin) reached 0 units. Stock re-order necessary.',
    type: 'STOCK_OUT',
    timestamp: '5 hours ago',
    read: false,
    targetRole: 'ALL'
  },
  {
    id: 'notif-5',
    title: 'Salary Disbursed for August 2026',
    message: 'August 2026 payroll has been successfully processed into bank accounts.',
    type: 'SALARY',
    timestamp: '2 days ago',
    read: true,
    targetRole: 'ALL'
  },
  {
    id: 'notif-6',
    title: 'Founder Announcement from Taufiq',
    message: 'Quality Assurance Audit scheduled for next Tuesday. Please keep cold storage records verified.',
    type: 'ANNOUNCEMENT',
    timestamp: '1 day ago',
    read: false,
    targetRole: 'ALL'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'emp-1',
    userName: 'Taufiq Al-Hassan',
    userRole: 'ADMIN',
    action: 'LOGIN_SUCCESS',
    module: 'Authentication',
    details: 'Administrator session initiated via 2-Factor verified session',
    timestamp: '2026-09-04 08:45:10',
    ipAddress: '103.14.88.22',
    device: 'macOS Chrome 128 (Dhaka Secure Gateway)'
  },
  {
    id: 'log-2',
    userId: 'emp-2',
    userName: 'Dr. Farhana Ahmed',
    userRole: 'PHARMACIST',
    action: 'PRESCRIPTION_REVIEWED',
    module: 'Prescriptions',
    details: 'Verified prescription RX-4092 for Rubina Yasmin. Cold chain confirmed.',
    timestamp: '2026-09-04 10:15:22',
    ipAddress: '103.14.88.25',
    device: 'Windows 11 Workstation (Pharma Dispensing terminal #1)'
  },
  {
    id: 'log-3',
    userId: 'emp-5',
    userName: 'Kamrul Islam',
    userRole: 'INVENTORY_STAFF',
    action: 'STOCK_CHANGED',
    module: 'Inventory',
    details: 'Received 300 units Seclo 20mg (PO-2026-041) into Cold Warehouse Bay A',
    timestamp: '2026-09-04 11:30:04',
    ipAddress: '103.14.88.27',
    device: 'Honeywell Barcode Terminal #2'
  },
  {
    id: 'log-4',
    userId: 'emp-7',
    userName: 'Shafiqul Alam',
    userRole: 'ACCOUNTANT',
    action: 'SALARY_UPDATED',
    module: 'Payroll',
    details: 'Calculated and approved monthly payroll for 7 employees totaling $424,600',
    timestamp: '2026-08-31 17:40:55',
    ipAddress: '103.14.88.29',
    device: 'Windows 11 (Finance Office)'
  },
  {
    id: 'log-5',
    userId: 'emp-1',
    userName: 'Taufiq Al-Hassan',
    userRole: 'ADMIN',
    action: 'SETTINGS_CHANGED',
    module: 'System Settings',
    details: 'Updated free delivery minimum threshold to $50.00 and VAT rate to 5%',
    timestamp: '2026-08-30 14:12:00',
    ipAddress: '103.14.88.22',
    device: 'macOS Chrome 128'
  }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  pharmacyName: 'MEDISHOP by Taufiq',
  ownerName: 'Taufiq Al-Hassan',
  tagline: 'Trusted Prescription Pharmacy & Healthcare Logistics',
  email: 'support@medishop.com',
  phone: '+880 9610-MEDISHOP (+880 9610-633474)',
  emergencyHotline: '+880 1711-000111 (24/7 Oxygen & Emergency Meds)',
  address: 'Commercial Tower, Plot 14, Road 7, Dhanmondi, Dhaka-1205, Bangladesh',
  currency: '$',
  taxRate: 5.0,
  freeDeliveryThreshold: 50.0,
  deliveryCharge: 3.0,
  openingHours: '24 Hours Open (Emergency Dispensing & Fast-Track Delivery)',
  requirePrescriptionForControlledMeds: true,
  announcementBanner: 'Free express temperature-controlled medicine delivery across Dhaka on orders over $50!',
  showAnnouncement: true
};
