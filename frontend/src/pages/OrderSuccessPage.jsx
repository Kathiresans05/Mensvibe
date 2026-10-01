import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, Home } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">ORDER CONFIRMED</span>
        <h1 className="text-3xl font-display font-bold text-gray-900">Thank You for Your Order!</h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          We have received your order and our artisan tailors are preparing your garments with love and care.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="text-sm font-bold text-gray-900 font-mono">{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Payment</p>
            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {order?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
            <Truck className="w-4 h-4" />
            <span>Estimated Delivery: 2-4 Business Days</span>
          </div>
          <p className="text-[11px] text-gray-400">
            A confirmation receipt and tracking updates will be shared via SMS & Email.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/my-orders"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all"
        >
          <Package className="w-4 h-4" />
          <span>Track in My Orders</span>
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
