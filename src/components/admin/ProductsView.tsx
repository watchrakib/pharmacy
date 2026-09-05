import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product } from '../../types';
import {
  Pill,
  Search,
  PlusCircle,
  AlertTriangle,
  FileCheck2,
  Edit2,
  Trash2,
  X,
  Boxes,
  ThermometerSnowflake,
  ShieldAlert
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, settings } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    strength: '500mg',
    dosageForm: 'TABLET' as 'TABLET' | 'CAPSULE' | 'SYRUP' | 'INJECTION' | 'CREAM' | 'DROPS',
    price: 15.0,
    costPrice: 10.5,
    stock: 200,
    lowStockThreshold: 30,
    batchNumber: 'B-2026-X',
    expiryDate: '2028-06-30',
    requiresPrescription: false,
    storageTemperature: 'Below 25°C',
    description: 'Oral formulation for patient treatment.'
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.genericName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.manufacturer || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock > 0 && p.stock <= p.lowStockThreshold) ||
      (stockFilter === 'out' && p.stock === 0) ||
      (stockFilter === 'rx' && p.requiresPrescription);
    return matchesSearch && matchesCat && matchesStock;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      genericName: '',
      category: categories[0]?.name || 'Antibiotics',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      strength: '500mg',
      dosageForm: 'TABLET',
      price: 15.0,
      costPrice: 10.5,
      stock: 200,
      lowStockThreshold: 30,
      batchNumber: `SQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2028-06-30',
      requiresPrescription: false,
      storageTemperature: 'Below 25°C Room Temp',
      description: 'Clinically certified pharmaceutical formulation.'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      genericName: p.genericName,
      category: p.category,
      manufacturer: p.manufacturer,
      strength: p.strength || p.dosage || '500mg',
      dosageForm: p.dosageForm || 'TABLET',
      price: p.price,
      costPrice: p.costPrice,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      batchNumber: p.batchNumber,
      expiryDate: p.expiryDate,
      requiresPrescription: p.requiresPrescription,
      storageTemperature: p.storageTemperature || 'Below 25°C',
      description: p.description
    });
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        genericName: formData.genericName,
        category: formData.category,
        manufacturer: formData.manufacturer,
        strength: formData.strength,
        dosageForm: formData.dosageForm,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        requiresPrescription: formData.requiresPrescription,
        storageTemperature: formData.storageTemperature,
        description: formData.description
      });
    } else {
      addProduct({
        name: formData.name,
        genericName: formData.genericName,
        category: formData.category,
        manufacturer: formData.manufacturer,
        strength: formData.strength,
        dosageForm: formData.dosageForm,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        requiresPrescription: formData.requiresPrescription,
        storageTemperature: formData.storageTemperature,
        description: formData.description,
        isFeatured: false
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Products & Medicine Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage pharmaceutical formulations, batch numbers, DGDA compliance, prescription mandates, and expiry tracking.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Medicine
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand, generic, batch or pharma..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none"
            >
              <option value="all">All Stock Statuses</option>
              <option value="low">Low Stock Only</option>
              <option value="out">Out of Stock Only</option>
              <option value="rx">Prescription Required (Rx)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Medicine & Generic</th>
                <th className="p-3">Category & Form</th>
                <th className="p-3">Batch & Expiry</th>
                <th className="p-3 text-right">Price / Cost</th>
                <th className="p-3 text-right">Stock Level</th>
                <th className="p-3">Rx Mandate</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => (
                <tr key={prod.id} className="hover:bg-slate-50/60">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{prod.name}</p>
                        <p className="text-[11px] text-slate-500 italic">
                          {prod.genericName} • {prod.strength}
                        </p>
                        <span className="text-[10px] text-slate-400">{prod.manufacturer}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 capitalize">{(prod.dosageForm || prod.dosage || prod.unit || 'Medicine').toLowerCase()}</p>
                  </td>

                  <td className="p-3 font-mono">
                    <span className="text-slate-800 font-medium">{prod.batchNumber}</span>
                    <p className={`text-[10px] ${new Date(prod.expiryDate) < new Date('2027-01-01') ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                      Exp: {prod.expiryDate}
                    </p>
                  </td>

                  <td className="p-3 text-right font-mono">
                    <p className="font-bold text-slate-900">{settings.currency}{prod.price.toFixed(2)}</p>
                    <span className="text-[10px] text-slate-400">Cost: {settings.currency}{prod.costPrice.toFixed(2)}</span>
                  </td>

                  <td className="p-3 text-right font-mono">
                    <span className={`font-bold text-sm ${
                      prod.stock === 0 ? 'text-rose-700' :
                      prod.stock <= prod.lowStockThreshold ? 'text-amber-600' :
                      'text-slate-800'
                    }`}>
                      {prod.stock}
                    </span>
                    {prod.stock <= prod.lowStockThreshold && (
                      <span className="block text-[10px] text-amber-600 font-sans font-semibold">
                        Low Stock Alert
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {prod.requiresPrescription ? (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <FileCheck2 className="w-3 h-3" /> Rx Required
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                        OTC General
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                        title="Edit Medicine Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${prod.name} from catalog?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-slate-100"
                        title="Archive Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 relative text-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingProduct ? `Edit ${editingProduct.name}` : 'Register New Drug / Medicine'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Napa Extra, Seclo"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Generic Chemical Name</label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={e => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Paracetamol + Caffeine"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={e => setFormData({ ...formData, dosageForm: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="TABLET">Tablet</option>
                    <option value="CAPSULE">Capsule</option>
                    <option value="SYRUP">Syrup</option>
                    <option value="INJECTION">Injection</option>
                    <option value="CREAM">Cream / Ointment</option>
                    <option value="DROPS">Drops</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Strength</label>
                  <input
                    type="text"
                    required
                    value={formData.strength}
                    onChange={e => setFormData({ ...formData, strength: e.target.value })}
                    placeholder="e.g. 500mg / 20mg"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={formData.manufacturer}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Storage Condition</label>
                  <input
                    type="text"
                    value={formData.storageTemperature}
                    onChange={e => setFormData({ ...formData, storageTemperature: e.target.value })}
                    placeholder="e.g. 2°C - 8°C Cold Chain / Below 25°C"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Retail Price ({settings.currency})</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Cost Price ({settings.currency})</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Low Alert Limit</label>
                  <input
                    type="number"
                    required
                    value={formData.lowStockThreshold}
                    onChange={e => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    required
                    value={formData.batchNumber}
                    onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-800 cursor-pointer" htmlFor="rxCheckbox">
                    Requires Doctor's Prescription (Rx Only)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    If checked, customer orders must upload and get pharmacist verification before fulfillment.
                  </p>
                </div>
                <input
                  id="rxCheckbox"
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={e => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
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
                  {editingProduct ? 'Update Medicine' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
