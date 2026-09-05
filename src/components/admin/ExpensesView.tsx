import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Receipt, PlusCircle, Search, DollarSign, Calendar, X } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, settings } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [category, setCategory] = useState<'RENT' | 'UTILITIES' | 'SALARIES' | 'LOGISTICS' | 'PACKAGING' | 'EQUIPMENT' | 'OTHER'>('UTILITIES');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const categories = ['RENT', 'UTILITIES', 'SALARIES', 'LOGISTICS', 'PACKAGING', 'EQUIPMENT', 'OTHER'];

  const filtered = expenses.filter(exp => {
    const matchesCat = categoryFilter === 'all' || exp.category === categoryFilter;
    const matchesSearch = (exp.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || ((exp.notes || '').toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    addExpense({
      category,
      title: title.trim(),
      amount: Number(amount),
      date,
      notes: notes.trim()
    });

    setTitle('');
    setAmount(5000);
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Store Expenses & Overheads</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record operating expenditures: pharmacy lease, cold storage refrigeration electricity, logistics, and supplies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Record Expense
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-medium text-slate-500">Cumulative Monthly Operating Expenditure</span>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1">
            {settings.currency}{(totalExpense ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Verified by Accounting Office</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses by title or memo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              categoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Overhead
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                categoryFilter === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Expense Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Disbursed Date</th>
                <th className="p-3">Logged By</th>
                <th className="p-3">Notes & Reference</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-bold text-slate-900">{exp.title}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600">{exp.date}</td>
                  <td className="p-3 text-slate-700">{exp.recordedBy}</td>
                  <td className="p-3 text-slate-500 italic max-w-xs truncate">{exp.notes || '—'}</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-700 text-sm">
                    {settings.currency}{(exp.amount ?? 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Record Store Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Expense Title / Description</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Cold Chain Generator Fuel, Store Rent"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Amount ({settings.currency})</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Receipt / Voucher Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Invoice #9910 paid via company cheque..."
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
