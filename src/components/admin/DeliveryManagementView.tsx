import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Order, OrderStatus } from '../../types';
import { Bike, MapPin, Phone, CheckCircle, Clock, Navigation, AlertCircle } from 'lucide-react';

export const DeliveryManagementView: React.FC = () => {
  const { orders, employees, updateOrderStatus, assignDeliveryStaff, settings } = usePharmacy();
  const [filterRider, setFilterRider] = useState('all');

  const deliveryOrders = orders.filter(o => o.orderStatus !== 'CANCELLED');
  const riders = employees.filter(e => e.role === 'DELIVERY_STAFF');

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const filtered = deliveryOrders.filter(o => (filterRider === 'all' ? true : o.assignedStaffId === filterRider));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Delivery Management & Fleet Dispatch</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign bike couriers, monitor transit milestones: Pending → Picked Up → On the Way → Delivered.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRider}
            onChange={e => setFilterRider(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none"
          >
            <option value="all">All Delivery Fleet</option>
            {riders.map(r => (
              <option key={r.employeeId} value={r.employeeId}>{r.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dispatch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(ord => {
          const isDelivered = ord.orderStatus === 'DELIVERED';
          const isEnRoute = ord.orderStatus === 'OUT_FOR_DELIVERY';
          const isProcessing = ord.orderStatus === 'PROCESSING';

          return (
            <div
              key={ord.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs flex flex-col justify-between transition-colors ${
                isDelivered ? 'border-emerald-200' : isEnRoute ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{ord.customerName}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isDelivered ? 'bg-emerald-100 text-emerald-800' :
                    isEnRoute ? 'bg-blue-100 text-blue-800 animate-pulse' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ord.customerPhone}</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{ord.deliveryAddress}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Amount: {settings.currency}{ord.total.toFixed(2)} ({ord.paymentMethod})
                  </p>
                </div>

                {/* Assigned Rider */}
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Assigned Courier:</span>
                  <select
                    value={ord.assignedStaffId || ''}
                    onChange={e => {
                      const r = riders.find(rider => rider.employeeId === e.target.value);
                      if (r) assignDeliveryStaff(ord.id, r.employeeId, r.fullName);
                    }}
                    className="border border-slate-300 rounded px-2 py-0.5 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="">Unassigned</option>
                    {riders.map(r => (
                      <option key={r.employeeId} value={r.employeeId}>{r.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transit Status Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'PROCESSING')}
                  className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                    ord.orderStatus === 'PROCESSING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Packaged
                </button>
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'OUT_FOR_DELIVERY')}
                  className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                    ord.orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  On the Way
                </button>
                <button
                  onClick={() => handleUpdateStatus(ord.id, 'DELIVERED')}
                  className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                    ord.orderStatus === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Delivered
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
