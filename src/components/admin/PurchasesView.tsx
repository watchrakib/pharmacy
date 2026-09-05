import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { PurchaseOrder } from '../../types';
import { FileText, PlusCircle, CheckCircle, Clock, XCircle, Search, Package, X } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { purchases, suppliers, products, createPurchaseOrder, receivePurchaseOrder, settings } = usePharmacy();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // PO Form State
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(200);
  const [batchNumber, setBatchNumber] = useState('SQ-2026-N');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');

  const filtered = purchases.filter(p =>
    (p.poNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.supplierName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === supplierId);
    const prod = products.find(p => p.id === selectedProductId);
    if (!sup || !prod) return;

    const unitCost = prod.costPrice;
    const total = unitCost * quantity;

    createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          quantity,
          unitCost,
          total,
          batchNumber,
          expiryDate
        }
      ],
      totalAmount: total,
      status: 'ORDERED',
      notes: `Restock replenishment order for ${prod.name}`
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Purchase Orders (PO) & Restocking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Procure medicines from pharmaceutical distributors. Receiving a PO automatically restocks warehouse inventory.
          </p>
        </div>

        <button
          onClick={() => {
            if (products[0]) setSelectedProductId(products[0].id);
            if (suppliers[0]) setSupplierId(suppliers[0].id);
            setBatchNumber(`B-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Create Purchase Order
        </button>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">PO Number</th>
                <th className="p-3">Distributor</th>
                <th className="p-3">Ordered Items</th>
                <th className="p-3 font-mono">Date Issued</th>
                <th className="p-3 text-right">Total Payable</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(po => (
                <tr key={po.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-slate-900">{po.poNumber}</td>
                  <td className="p-3 font-semibold text-slate-800">{po.supplierName}</td>
                  <td className="p-3">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="text-[11px] text-slate-700">
                        {item.productName} &times; <strong>{item.quantity}</strong> units (Batch: {item.batchNumber})
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-mono text-slate-500">{po.orderDate}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                    {settings.currency}{(po.totalAmount ?? 0).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                      po.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {po.status}
                    </span>
                    {po.receivedDate && (
                      <p className="text-[9px] text-slate-400 mt-0.5">Recv: {po.receivedDate}</p>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {po.status === 'ORDERED' ? (
                      <button
                        onClick={() => receivePurchaseOrder(po.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold cursor-pointer shadow-xs text-xs"
                        title="Mark received and update inventory quantities"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Receive into Stock
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Restocked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Purchase Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 relative text-xs">
            <div className="flex items-center justify-between border-b pb-2 mb-3">
              <h3 className="font-bold text-sm text-slate-900">Issue Purchase Requisition</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Pharmaceutical Distributor</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Medicine to Restock</label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current Stock: {p.stock} units - Cost: {settings.currency}{p.costPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Reorder Quantity</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Expected Batch #</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={e => setBatchNumber(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Batch Expiry Date</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between">
                <span>Estimated PO Value:</span>
                <span className="font-bold font-mono text-emerald-400 text-base">
                  {settings.currency}
                  {((products.find(p => p.id === selectedProductId)?.costPrice || 10) * quantity).toLocaleString()}
                </span>
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
                  Confirm & Dispatch PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
