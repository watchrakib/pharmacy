import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Tag, PlusCircle, Trash2, CheckCircle2, Gift, X } from 'lucide-react';

export const CouponsOffersView: React.FC = () => {
  const { coupons, addCoupon, toggleCoupon, deleteCoupon, settings } = usePharmacy();
  const [showAddModal, setShowAddModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(500);
  const [maxDiscount, setMaxDiscount] = useState<number>(200);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      minOrderAmount: Number(minOrder),
      maxDiscountAmount: Number(maxDiscount),
      validUntil,
      isActive: true
    });

    setCode('');
    setDiscountPercent(10);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Coupons & Promotional Offers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage checkout promo vouchers, minimum cart thresholds, and patient discount campaigns.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Create Promo Coupon
        </button>
      </div>

      {/* Grid of Coupons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(cp => (
          <div
            key={cp.id}
            className={`p-5 rounded-xl border relative flex flex-col justify-between transition-colors ${
              cp.isActive
                ? 'bg-white border-emerald-200 shadow-2xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-black text-sm tracking-wider text-slate-900">
                      {cp.code}
                    </span>
                    <span className="block text-[10px] text-slate-400">Promo Voucher</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  cp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {cp.isActive ? 'ACTIVE' : 'EXPIRED'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="text-xl font-black text-emerald-700 font-mono">
                  {cp.discountPercent}% OFF
                </p>
                <p>Min Order: {settings.currency}{cp.minOrderAmount}</p>
                <p>Max Cap: {settings.currency}{cp.maxDiscountAmount}</p>
                <p className="text-slate-400 text-[11px]">Valid Until: {cp.validUntil}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => toggleCoupon(cp.id)}
                className={`text-xs font-semibold hover:underline cursor-pointer ${
                  cp.isActive ? 'text-amber-700' : 'text-emerald-700'
                }`}
              >
                {cp.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete coupon ${cp.code}?`)) deleteCoupon(cp.id);
                }}
                className="p-1 text-slate-400 hover:text-rose-700 rounded transition-colors"
                title="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Create Promotional Coupon</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. HEALTH15, EIDCARE"
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    required
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Min Order ({settings.currency})</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={minOrder}
                    onChange={e => setMinOrder(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Cap ({settings.currency})</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={maxDiscount}
                    onChange={e => setMaxDiscount(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Valid Until</label>
                  <input
                    type="date"
                    required
                    value={validUntil}
                    onChange={e => setValidUntil(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
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
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
