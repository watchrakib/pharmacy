import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Search,
  Printer,
  Bike,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  MapPin,
  Phone,
  Calendar,
  XCircle,
  PlusCircle,
  X
} from 'lucide-react';
import { OrderInvoiceModal } from '../common/OrderInvoiceModal';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, assignDeliveryStaff, employees, settings } = usePharmacy();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  const deliveryPersonnel = employees.filter(e => e.role === 'DELIVERY_STAFF');

  const filteredOrders = orders.filter(ord => {
    const matchesStatus = statusFilter === 'all' || ord.orderStatus === statusFilter;
    const matchesSearch =
      (ord.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerPhone || '').includes(searchQuery) ||
      (ord.deliveryAddress || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleAssignRider = (orderId: string, riderId: string) => {
    const rider = employees.find(e => e.employeeId === riderId);
    if (rider) {
      assignDeliveryStaff(orderId, rider.employeeId, rider.fullName);
    }
    setAssigningOrder(null);
  };

  const statusList: { key: string; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'CANCELLED', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pharmacy Orders & Dispensing</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track web store prescriptions, counter orders, delivery rider assignments, and instant invoice printing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-3 py-1.5 rounded-lg">
            {orders.length} Total Orders Registered
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer name, phone, address..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {statusList.map(st => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === st.key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer & Delivery</th>
                <th className="p-3">Items Dispensed</th>
                <th className="p-3">Prescription</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status & Dispatch</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(ord => (
                <tr key={ord.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono">
                    <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">{ord.createdAt}</p>
                  </td>

                  <td className="p-3">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {ord.customerPhone}
                    </p>
                    <p className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5 line-clamp-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {ord.deliveryAddress}
                    </p>
                  </td>

                  <td className="p-3">
                    <span className="font-semibold text-slate-800">{ord.items.length} items</span>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {ord.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </p>
                  </td>

                  <td className="p-3">
                    {ord.prescriptionRequired ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.prescriptionStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                        ord.prescriptionStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        <FileCheck2 className="w-3 h-3" />
                        {ord.prescriptionStatus || 'PENDING'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Not required</span>
                    )}
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                    {settings.currency}{ord.total.toFixed(2)}
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      ord.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase">{ord.paymentMethod}</p>
                  </td>

                  <td className="p-3">
                    <select
                      value={ord.orderStatus}
                      onChange={e => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                        ord.orderStatus === 'DELIVERED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        ord.orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        ord.orderStatus === 'PENDING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        ord.orderStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <div className="mt-1">
                      {ord.assignedStaffName ? (
                        <p className="text-[10px] text-slate-600 flex items-center gap-1">
                          <Bike className="w-3 h-3 text-emerald-600" /> Rider: {ord.assignedStaffName}
                        </p>
                      ) : (
                        <button
                          onClick={() => setAssigningOrder(ord)}
                          className="text-[10px] text-emerald-600 hover:underline font-semibold cursor-pointer"
                        >
                          + Assign Rider
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold cursor-pointer text-xs shadow-xs"
                      title="Print Official Pharmacy Tax Invoice"
                    >
                      <Printer className="w-3 h-3" />
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Rider Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-sm w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Assign Delivery Staff</h3>
              <button onClick={() => setAssigningOrder(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 mb-3">
              Assign dispatch for order <strong>{assigningOrder.orderNumber}</strong> to:
            </p>

            <div className="space-y-2">
              {deliveryPersonnel.map(rider => (
                <button
                  key={rider.employeeId}
                  onClick={() => handleAssignRider(assigningOrder.id, rider.employeeId)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">{rider.fullName}</p>
                    <p className="text-[10px] text-slate-500">{rider.phone} • {rider.employeeId}</p>
                  </div>
                  <Bike className="w-4 h-4 text-emerald-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && (
        <OrderInvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
};
