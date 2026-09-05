import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Sliders, Save, CheckCircle2, ShieldCheck, Store, Bell, HelpCircle } from 'lucide-react';

export const WebsiteSettingsView: React.FC = () => {
  const { settings, updateSettings } = usePharmacy();
  const [formData, setFormData] = useState({ ...settings });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Website & Pharmacy Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure e-commerce branding, official DGDA drug license credentials, tax policies, and storefront announcement broadcasts.
          </p>
        </div>

        {savedNotice && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Settings Updated Successfully!
          </span>
        )}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* Brand & Identity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Store className="w-4 h-4 text-emerald-600" />
            Pharmacy Commercial Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Pharmacy Trade Name</label>
              <input
                type="text"
                required
                value={formData.pharmacyName}
                onChange={e => setFormData({ ...formData, pharmacyName: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Marketing Slogan</label>
              <input
                type="text"
                required
                value={formData.slogan}
                onChange={e => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Primary Support Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Customer Care Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Registered HQ Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">DGDA Pharmacy License #</label>
              <input
                type="text"
                required
                value={formData.drugLicenseNumber}
                onChange={e => setFormData({ ...formData, drugLicenseNumber: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
          </div>
        </div>

        {/* E-Commerce Commerce Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            Billing & Delivery Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Standard VAT Rate (%)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.taxRate}
                onChange={e => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Free Delivery Threshold ({formData.currency})</label>
              <input
                type="number"
                step="50"
                required
                value={formData.freeDeliveryThreshold}
                onChange={e => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Storefront Announcement Banner</label>
            <input
              type="text"
              value={formData.announcementBanner}
              onChange={e => setFormData({ ...formData, announcementBanner: e.target.value })}
              placeholder="e.g. Free Dhaka metro delivery on orders over $500!"
              className="w-full border border-slate-300 rounded-lg p-2 text-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-colors cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" />
            Save Website Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
