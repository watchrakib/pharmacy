import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Truck, PlusCircle, Search, Phone, Mail, MapPin, DollarSign, X } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, settings } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('+880 ');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const filtered = suppliers.filter(s =>
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.phone || '').includes(searchQuery)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSupplier({
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      balance: 0
    });

    setName('');
    setContactPerson('');
    setPhone('+880 ');
    setEmail('');
    setAddress('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Pharmaceutical Suppliers & Vendors</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorized pharmaceutical manufacturing partners, distributors, contact reps, and account payable balances.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search suppliers by pharma name, rep, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Pharmaceutical Manufacturer</th>
                <th className="p-3">Territory Representative</th>
                <th className="p-3">Contact Details</th>
                <th className="p-3">Distributor Depot Address</th>
                <th className="p-3 text-right">Payable Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(sup => (
                <tr key={sup.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span>{sup.name}</span>
                  </td>

                  <td className="p-3 font-medium text-slate-800">{sup.contactPerson}</td>

                  <td className="p-3 space-y-0.5">
                    <p className="flex items-center gap-1 text-slate-700">
                      <Phone className="w-3 h-3 text-slate-400" /> {sup.phone}
                    </p>
                    <p className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" /> {sup.email}
                    </p>
                  </td>

                  <td className="p-3 text-slate-600 max-w-xs truncate">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {sup.address}
                    </span>
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                    {settings.currency}{(sup.balance ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Pharmaceutical Distributor</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Company / Manufacturer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Beximco Pharmaceuticals Ltd."
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Representative Name</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="e.g. Md. Shafiul Islam"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Direct Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Official Order Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="orders@pharma.com"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Depot / Billing Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Tejgaon Industrial Area, Dhaka"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
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
                  Save Distributor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
