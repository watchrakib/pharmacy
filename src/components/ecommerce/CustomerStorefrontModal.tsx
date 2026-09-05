import React, { useState } from 'react';
import { usePharmacy } from '../../context/PharmacyContext';
import { Product, OrderItem } from '../../types';
import {
  X,
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Upload,
  CheckCircle,
  Pill,
  ShieldCheck,
  Truck,
  PhoneCall
} from 'lucide-react';

interface CustomerStorefrontModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerStorefrontModal: React.FC<CustomerStorefrontModalProps> = ({ isOpen, onClose }) => {
  const { products, categories, createOrder, settings } = usePharmacy();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Checkout form
  const [customerName, setCustomerName] = useState('Rubina Sultana');
  const [customerPhone, setCustomerPhone] = useState('+880 1715-998877');
  const [customerEmail, setCustomerEmail] = useState('rubina.sultana@gmail.com');
  const [shippingAddress, setShippingAddress] = useState('Apartment 5B, Skyview Horizon, Road 11, Banani, Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'BKASH' | 'CARD'>('CASH_ON_DELIVERY');
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.genericName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    }).filter(Boolean) as { product: Product; quantity: number }[]);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal >= settings.freeDeliveryThreshold || subtotal === 0 ? 0 : settings.deliveryCharge;
  const tax = Number(((subtotal * settings.taxRate) / 100).toFixed(2));
  const total = subtotal + deliveryFee + tax;

  const requiresPrescription = cart.some(item => item.product.prescriptionRequired);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderItems: OrderItem[] = cart.map(c => ({
      productId: c.product.id,
      productName: c.product.name,
      unitPrice: c.product.price,
      quantity: c.quantity,
      totalPrice: c.product.price * c.quantity,
      dosage: c.product.dosage,
      prescriptionRequired: c.product.prescriptionRequired
    }));

    const newOrder = createOrder({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: orderItems,
      subtotal,
      discount: 0,
      tax,
      deliveryFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      orderStatus: 'PENDING',
      notes: prescriptionAttached ? 'Prescription scan uploaded by customer' : undefined
    });

    setOrderSuccess(newOrder.orderNumber);
    setCart([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 text-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Store Top Bar */}
        <div className="bg-emerald-700 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base sm:text-lg">{settings.pharmacyName} Online Store</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-full">
                Customer E-Commerce Experience
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCheckout(!showCheckout)}
              className="relative p-2 bg-emerald-800 hover:bg-emerald-900 rounded-lg text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
              {cart.length > 0 && (
                <span className="font-mono text-emerald-300 ml-1">
                  {settings.currency}{subtotal.toFixed(2)}
                </span>
              )}
            </button>
            <button onClick={onClose} className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Announcement Header */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-1 font-medium">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            {settings.announcementBanner}
          </span>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            Fast 2-hour doorstep delivery • Cold chain guarantee
          </span>
        </div>

        {/* Store Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {orderSuccess ? (
            <div className="text-center py-12 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
              <p className="text-sm text-slate-600">
                Your order <strong className="text-slate-900 font-mono">{orderSuccess}</strong> has been routed into the MEDISHOP Admin & Pharmacist queues.
              </p>
              <div className="bg-white border border-slate-200 p-4 rounded-xl text-left text-xs text-slate-600 space-y-1">
                <p><strong>Customer:</strong> {customerName}</p>
                <p><strong>Address:</strong> {shippingAddress}</p>
                <p><strong>Payment:</strong> {paymentMethod.replace('_', ' ')}</p>
                <p className="text-emerald-700 font-medium">Our pharmacy staff will prepare and dispatch your medicines.</p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setOrderSuccess(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : showCheckout ? (
            /* Checkout View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Delivery & Patient Information</h3>
                  <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Patient Full Name</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Phone Number (For Rider Coordination)</label>
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Complete Delivery Address</label>
                      <textarea
                        required
                        rows={2}
                        value={shippingAddress}
                        onChange={e => setShippingAddress(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    {requiresPrescription && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Prescription Required for some medicines in your cart</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          Bangladesh Pharmacy Council regulations mandate a valid doctor prescription for scheduled drugs.
                        </p>
                        <label className="flex items-center gap-2 text-slate-700 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={prescriptionAttached}
                            onChange={e => setPrescriptionAttached(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="font-medium">Attach doctor's prescription file (Simulated Upload)</span>
                        </label>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Payment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
                          { id: 'BKASH', label: 'bKash / Mobile' },
                          { id: 'CARD', label: 'Debit / Credit Card' }
                        ].map(method => (
                          <button
                            type="button"
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`p-2 rounded-lg border text-center font-medium transition-all ${
                              paymentMethod === method.id
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="w-1/3 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md cursor-pointer"
                      >
                        Confirm Order ({settings.currency}{total.toFixed(2)})
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 border-b pb-2">Order Items ({cart.length})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {cart.map(item => (
                    <div key={item.product.id} className="pt-2 flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold text-slate-800">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500">{item.product.unit}</p>
                        <p className="text-slate-600 mt-1">
                          {item.quantity} × {settings.currency}{item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {settings.currency}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-3 space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">{settings.currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT ({settings.taxRate}%)</span>
                    <span className="font-mono">{settings.currency}{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-mono">{deliveryFee === 0 ? 'FREE' : `${settings.currency}${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total Amount</span>
                    <span className="font-mono text-emerald-700">{settings.currency}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Product Catalog View */
            <div className="space-y-6">
              {/* Search and Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search medicine brand or generic..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All Medicines
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name.split('&')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medicine Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => {
                  const inCart = cart.find(c => c.product.id === product.id);

                  return (
                    <div
                      key={product.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow group relative"
                    >
                      <div>
                        <div className="h-36 bg-slate-100 rounded-lg overflow-hidden mb-3 relative">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.prescriptionRequired && (
                            <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              Rx Required
                            </span>
                          )}
                          <span className={`absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            product.stock === 0 ? 'bg-rose-100 text-rose-700' :
                            product.stock <= product.lowStockThreshold ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {product.stock === 0 ? 'Out of Stock' : `${product.stock} in Stock`}
                          </span>
                        </div>

                        <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">{product.category}</span>
                        <h4 className="font-bold text-sm text-slate-900 mt-0.5">{product.name}</h4>
                        <p className="text-xs text-slate-500 italic">{product.genericName} • {product.dosage}</p>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{product.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">Unit: {product.unit}</span>
                          <span className="text-base font-bold font-mono text-slate-900">
                            {settings.currency}{product.price.toFixed(2)}
                          </span>
                        </div>

                        {product.stock === 0 ? (
                          <span className="text-xs text-slate-400 font-medium">Unavailable</span>
                        ) : inCart ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 rounded-lg p-1">
                            <button
                              onClick={() => updateCartQty(product.id, -1)}
                              className="p-1 hover:bg-emerald-200 rounded text-emerald-800"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono text-xs font-bold px-1.5 text-emerald-900">{inCart.quantity}</span>
                            <button
                              onClick={() => updateCartQty(product.id, 1)}
                              className="p-1 hover:bg-emerald-200 rounded text-emerald-800"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Store Bottom Bar */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Genuine Certified Medicines
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              Pharmacist Helpline: {settings.phone}
            </span>
          </div>

          {cart.length > 0 && !showCheckout && !orderSuccess && (
            <button
              onClick={() => setShowCheckout(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs cursor-pointer"
            >
              Proceed to Checkout ({settings.currency}{total.toFixed(2)})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
