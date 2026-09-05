import React from 'react';
import { Order } from '../../types';
import { usePharmacy } from '../../context/PharmacyContext';
import { Printer, X, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = usePharmacy();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 relative print:m-0 print:p-4 print:shadow-none print:max-w-none print:w-full">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
          <div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Tax Invoice & Delivery Note
            </span>
            <span className="text-slate-500 text-sm ml-2">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-950 uppercase">{settings.pharmacyName}</h1>
              <p className="text-xs text-slate-500">{settings.tagline}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">{settings.address}</p>
              <p className="text-xs text-slate-500">Phone: {settings.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-slate-800 font-mono">{order.orderNumber}</span>
              <p className="text-xs text-slate-500 mt-1">Date: {order.createdAt}</p>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                Payment: {order.paymentMethod.replace('_', ' ')} ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Customer / Delivery Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Patient / Customer Info</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{order.customerName}</p>
              <p className="flex items-center gap-1 text-slate-600 mt-1"><Mail className="w-3.5 h-3.5" /> {order.customerEmail}</p>
              <p className="flex items-center gap-1 text-slate-600"><Phone className="w-3.5 h-3.5" /> {order.customerPhone}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold uppercase text-[10px]">Delivery Destination</p>
              <p className="flex items-start gap-1 text-slate-800 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{order.shippingAddress}</span>
              </p>
              {order.assignedDeliveryStaffName && (
                <p className="text-slate-600 mt-2">
                  <strong>Assigned Rider:</strong> {order.assignedDeliveryStaffName}
                </p>
              )}
            </div>
          </div>

          {/* Medicines & Items Table */}
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Item / Medicine Description</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right">Unit Price</th>
                <th className="p-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-2.5">
                    <p className="font-semibold text-slate-800">{item.productName}</p>
                    {item.prescriptionRequired && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-200 font-medium">
                        Prescription Verified
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 text-center font-mono font-medium">{item.quantity}</td>
                  <td className="p-2.5 text-right font-mono">{settings.currency}{item.unitPrice.toFixed(2)}</td>
                  <td className="p-2.5 text-right font-mono font-semibold text-slate-900">{settings.currency}{item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pricing Totals */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono">{settings.currency}{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono">-{settings.currency}{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>VAT / Tax ({settings.taxRate}%)</span>
                <span className="font-mono">{settings.currency}{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-mono">{order.deliveryFee === 0 ? 'FREE' : `${settings.currency}${order.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="font-mono text-blue-700">{settings.currency}{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs text-amber-900">
              <strong>Order Notes:</strong> {order.notes}
            </div>
          )}

          {/* Footer Safety Notice */}
          <div className="border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400 space-y-1">
            <p className="flex items-center justify-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Certified Dispensed Pharmaceuticals • Batch Inspected • Keep Out of Reach of Children
            </p>
            <p>Thank you for trusting MEDISHOP by Taufiq. Emergency 24/7 hotline: {settings.emergencyHotline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
