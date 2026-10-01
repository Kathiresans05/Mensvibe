import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle2, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const appliedCoupon = location.state?.appliedCoupon || null;
  const deliveryCharge = location.state?.deliveryCharge ?? (cartSubtotal >= 999 ? 0 : 99);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const items = cart.items || [];

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      setError('Please fill all required delivery address fields.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product?._id || item.product,
          name: item.product?.name || item.name,
          variantSku: item.variantSku,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.price || item.product?.sellingPrice,
        })),
        shippingAddress: address,
        paymentMethod,
        couponApplied: appliedCoupon ? { code: appliedCoupon.code, discountAmount } : undefined,
        deliveryCharge,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        clearCart();
        navigate(`/order-success/${res.data.order.orderId}`, { state: { order: res.data.order } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <Link to="/cart" className="flex items-center text-xs font-bold text-gray-600 hover:text-brand-600 space-x-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </Link>
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Secure Checkout</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Step 1 Address + Step 3 Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">1</span>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={address.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">Flat / House No. / Street *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="Building, street, apartment details"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  value={address.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit pincode"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleInputChange}
                  placeholder="Nearby landmark"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                Payment Option
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash On Delivery */}
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50/40' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Cash on Delivery (COD)</span>
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">Pay in cash or scan UPI upon doorstep delivery</p>
                  </div>
                </div>
              </label>

              {/* Online Payment (UPI, Cards, NetBanking) */}
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE' ? 'border-brand-600 bg-brand-50/40' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                      <CreditCard className="w-4 h-4 text-brand-600" />
                      <span>Instant Online Payment (Razorpay / UPI / Cards)</span>
                    </span>
                    <p className="text-[11px] text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm, Credit/Debit Cards, NetBanking</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right: Order Summary Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
              Items in Order ({items.length})
            </h3>

            {/* Items scroll */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-10 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{item.product?.name || item.name}</p>
                      <p className="text-[11px] text-gray-500">{item.color} / {item.size} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{((item.price || item.product?.sellingPrice || 0) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 pt-4 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-gray-900">₹{deliveryCharge}</span>
                )}
              </div>

              <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-100">
                <span>Total Payable</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : `Confirm & Place Order (₹${grandTotal.toLocaleString('en-IN')})`}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
