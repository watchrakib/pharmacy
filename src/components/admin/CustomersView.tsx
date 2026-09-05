import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  ShoppingBag,
  HeartPulse,
  Eye,
  X
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, orders, settings } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.address || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Patient & Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered patients, drug allergy profiles, verified delivery addresses, and lifetime purchases.
          </p>
        </div>

        <span className="text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg">
          {customers.length} Verified Patients
        </span>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, phone, address..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Patient Profile</th>
                <th className="p-3">Contact Information</th>
                <th className="p-3">Residential Address</th>
                <th className="p-3">Clinical Allergy Flag</th>
                <th className="p-3 text-right">Orders</th>
                <th className="p-3 text-right">Lifetime Spend</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <span className="text-[10px] text-slate-400">Patient since {cust.registeredAt}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 space-y-0.5">
                    <p className="flex items-center gap-1 text-slate-700">
                      <Phone className="w-3 h-3 text-slate-400" /> {cust.phone}
                    </p>
                    <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" /> {cust.email}
                    </p>
                  </td>

                  <td className="p-3 text-slate-600 max-w-xs truncate">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {cust.address}
                    </span>
                  </td>

                  <td className="p-3">
                    {cust.allergies && (Array.isArray(cust.allergies) ? cust.allergies.length > 0 : String(cust.allergies).trim().length > 0) ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <AlertTriangle className="w-3 h-3" />
                        {Array.isArray(cust.allergies) ? cust.allergies.join(', ') : cust.allergies}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">No Known Allergies (NKA)</span>
                    )}
                  </td>

                  <td className="p-3 text-right font-mono font-medium text-slate-800">
                    {cust.totalOrders ?? cust.ordersCount ?? 0} orders
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {settings.currency}{cust.totalSpent.toFixed(2)}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                      title="View Patient Order History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Patient Clinical File: {selectedCustomer.name}</h3>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p><strong>Direct Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Email Address:</strong> {selectedCustomer.email}</p>
                <p><strong>Primary Residence:</strong> {selectedCustomer.address}</p>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="font-bold text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Allergy Record: {selectedCustomer.allergies ? (Array.isArray(selectedCustomer.allergies) ? selectedCustomer.allergies.join(', ') : selectedCustomer.allergies) : 'None reported'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Order & Prescription History:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orders
                    .filter(o => o.customerId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone)
                    .map(ord => (
                      <div key={ord.id} className="p-2.5 rounded-lg border border-slate-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold font-mono text-slate-900">{ord.orderNumber}</p>
                          <p className="text-[10px] text-slate-400">{ord.createdAt} • {ord.items.length} items</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-slate-900">
                            {settings.currency}{ord.total.toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-emerald-700 font-semibold">{ord.orderStatus}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold cursor-pointer"
              >
                Close Patient File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
