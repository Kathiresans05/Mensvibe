import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Heart, ArrowRight, ShoppingBag, Tag, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, cartSubtotal } = useCart();
  const { toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const items = cart.items || [];
  const deliveryThreshold = 999;
  const deliveryCharge = cartSubtotal >= deliveryThreshold || cartSubtotal === 0 ? 0 : 99;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await api.post('/coupons/apply', {
        code: couponCode.trim(),
        cartTotal: cartSubtotal,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Looks like you haven't added any designer couture to your bag yet. Explore our fresh collections today.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
        Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const image = product.images && product.images.length > 0 ? product.images[0] : item.image || '';

            return (
              <div
                key={item._id || item.variantSku}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Image & Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'}
                    alt={product.name || item.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <Link to={`/product/${product.slug}`} className="text-sm font-bold text-gray-900 hover:text-brand-600 line-clamp-1">
                      {product.name || item.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      Color: <span className="font-semibold text-gray-800">{item.color}</span> | Size: <span className="font-semibold text-gray-800">{item.size}</span>
                    </p>
                    <p className="text-sm font-black text-gray-900 pt-1">
                      ₹{((item.price || product.sellingPrice || 0) * item.quantity).toLocaleString('en-IN')}
                      <span className="text-[11px] font-normal text-gray-400 ml-1.5">
                        (₹{item.price || product.sellingPrice} each)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                    <button
                      onClick={() => updateQuantity(item._id || item.variantSku, item.quantity - 1)}
                      className="w-7 h-7 rounded bg-white text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center text-xs shadow-xs"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id || item.variantSku, item.quantity + 1)}
                      className="w-7 h-7 rounded bg-white text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center text-xs shadow-xs"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        toggleWishlist(product);
                        removeItem(item._id || item.variantSku);
                      }}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Move to Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item._id || item.variantSku)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            {/* Coupon Code Applicator */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-600" />
                <span>Apply Coupon / Promo Code</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 font-mono">{appliedCoupon.code} Applied</span>
                    <p className="text-[11px] text-emerald-600">You saved ₹{appliedCoupon.discountAmount}!</p>
                  </div>
                  <button onClick={removeCoupon} className="text-xs font-bold text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WELCOME10"
                    className="w-full text-xs uppercase font-mono px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] font-semibold text-red-600">{couponError}</p>}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-3 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-gray-900">₹{deliveryCharge}</span>
                )}
              </div>

              {deliveryCharge > 0 && (
                <p className="text-[10px] text-brand-600 italic">
                  Add ₹{(deliveryThreshold - cartSubtotal).toLocaleString('en-IN')} more to unlock FREE shipping!
                </p>
              )}

              <div className="flex justify-between text-sm font-black text-gray-900 pt-3 border-t border-gray-100">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout', { state: { appliedCoupon, deliveryCharge } })}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Encrypted Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
