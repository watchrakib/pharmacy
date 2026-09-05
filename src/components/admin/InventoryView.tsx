import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product } from '../../types';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ThermometerSnowflake,
  Edit,
  ArrowDown,
  ArrowUp,
  FileText,
  X,
  Plus
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { products, updateProductStock, settings } = usePharmacy();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out' | 'cold'>('all');

  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(50);
  const [adjustmentType, setAdjustmentType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [adjustmentReason, setAdjustmentReason] = useState('Supplier Stock In Delivery');

  const filtered = products.filter(p => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.genericName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'low') return matchesSearch && p.stock > 0 && p.stock <= p.lowStockThreshold;
    if (filter === 'out') return matchesSearch && p.stock === 0;
    if (filter === 'cold') return matchesSearch && ((p.storageTemperature || '').toLowerCase().includes('cold') || (p.storageTemperature || '').includes('2°c') || (p.storageTemperature || '').includes('2°C'));
    return matchesSearch;
  });

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    const currentStock = adjustingProduct.stock;
    const change = adjustmentType === 'ADD' ? adjustmentQuantity : -adjustmentQuantity;
    const newStock = Math.max(0, currentStock + change);

    updateProductStock(adjustingProduct.id, newStock, `${adjustmentType === 'ADD' ? 'Restocked' : 'Written off'}: ${adjustmentReason}`);
    setAdjustingProduct(null);
  };

  const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);
  const lowCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Inventory & Cold Chain Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time physical stock reconciliation, batch control, and temperature-sensitive storage monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-500">Warehouse Valuation: </span>
            <span className="font-bold font-mono text-emerald-800">
              {settings.currency}{(totalStockValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total SKUs in Warehouse</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{products.length}</p>
          <span className="text-[10px] text-slate-400">All registered medicine formulations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Low Stock Warning Limit</span>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{lowCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Items require purchase order</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Completely Depleted Stock</span>
          <p className="text-2xl font-bold font-mono text-rose-600 mt-1">{outCount}</p>
          <span className="text-[10px] text-rose-700 font-medium">Out of stock for online orders</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory by medicine name or batch #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Inventory
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'low' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Low Stock ({lowCount})
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'out' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Out of Stock ({outCount})
          </button>
          <button
            onClick={() => setFilter('cold')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === 'cold' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Cold Chain Storage
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Pharmaceutical</th>
                <th className="p-3">Batch & Expiry</th>
                <th className="p-3">Storage Specs</th>
                <th className="p-3 text-right">Unit Cost</th>
                <th className="p-3 text-right">Current Units</th>
                <th className="p-3 text-right">Inventory Value</th>
                <th className="p-3 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const isCold = (p.storageTemperature || '').toLowerCase().includes('cold') || (p.storageTemperature || '').includes('2°c') || (p.storageTemperature || '').includes('2°C');
                const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;
                const isOut = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-slate-500 text-[11px]">{p.genericName} • {p.strength}</p>
                      <span className="text-slate-400 text-[10px]">{p.manufacturer}</span>
                    </td>

                    <td className="p-3 font-mono">
                      <span className="font-medium text-slate-800">{p.batchNumber}</span>
                      <p className="text-[10px] text-slate-500">Exp: {p.expiryDate}</p>
                    </td>

                    <td className="p-3">
                      {isCold ? (
                        <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                          {p.storageTemperature}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">
                          {p.storageTemperature || 'Room temp (≤25°C)'}
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right font-mono text-slate-600">
                      {settings.currency}{p.costPrice.toFixed(2)}
                    </td>

                    <td className="p-3 text-right font-mono">
                      <span className={`text-base font-bold ${
                        isOut ? 'text-rose-700' : isLow ? 'text-amber-600' : 'text-slate-900'
                      }`}>
                        {p.stock}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Min alert: {p.lowStockThreshold}
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {settings.currency}{(p.stock * p.costPrice).toFixed(2)}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProduct(p);
                          setAdjustmentQuantity(50);
                          setAdjustmentType('ADD');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-md font-semibold cursor-pointer text-xs transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Physical Stock Reconciliation</h3>
              <button onClick={() => setAdjustingProduct(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
              <p className="font-bold text-slate-900">{adjustingProduct.name}</p>
              <p className="text-[11px] text-slate-500">Batch {adjustingProduct.batchNumber} • Current: {adjustingProduct.stock} units</p>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('ADD')}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      adjustmentType === 'ADD'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    Stock In (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType('REMOVE')}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      adjustmentType === 'REMOVE'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    Stock Out / Damage (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Number of Units</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustmentQuantity}
                  onChange={e => setAdjustmentQuantity(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reason / Justification</label>
                <input
                  type="text"
                  required
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  placeholder="e.g. Delivery from Square Pharma, Damaged vial..."
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                <span>New Projected Stock:</span>
                <span className="font-bold font-mono text-emerald-400 text-base">
                  {adjustmentType === 'ADD'
                    ? adjustingProduct.stock + adjustmentQuantity
                    : Math.max(0, adjustingProduct.stock - adjustmentQuantity)}{' '}
                  units
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
