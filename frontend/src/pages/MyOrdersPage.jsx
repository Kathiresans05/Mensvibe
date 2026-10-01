import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock, ChevronDown, ChevronUp, ShoppingBag, ArrowRight, RotateCcw, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STEPS = ['ORDER_PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [returnModal, setReturnModal] = useState(null); // { orderId }
  const [returnReason, setReturnReason] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleReturnRequest = async () => {
    if (!returnModal) return;
    setReturnLoading(true);
    try {
      const res = await api.post(`/orders/${returnModal.orderId}/return`, { reason: returnReason });
      if (res.data.success) {
        showToast('Return request submitted! We will review it shortly.');
        setReturnModal(null);
        setReturnReason('');
        // Refresh orders
        const refreshed = await api.get('/orders/my-orders');
        if (refreshed.data.success) setOrders(refreshed.data.orders);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to submit return request', 'error');
    } finally {
      setReturnLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Please Sign In</h2>
        <p className="text-xs text-gray-500">Sign in to your MensVibe account to view and track your orders.</p>
        <Link to="/login" className="inline-block bg-brand-600 text-white text-xs font-bold px-8 py-3.5 rounded-full uppercase tracking-wider">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 w-1/3 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">My Orders</h1>
        <p className="text-xs text-gray-500 mt-1">Track current shipments and view order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Orders Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            When you place an order, its real-time shipping milestones and tracking will appear right here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-brand-600 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.orderId;
            const currentStepIdx = STATUS_STEPS.indexOf(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Header */}
                <div className="p-6 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-400 font-medium">Order ID:</span>
                      <span className="text-xs font-bold text-gray-900 font-mono">{order.orderId}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="text-sm font-black text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    </div>

                    {order.orderStatus === 'DELIVERED' && (
                      <button
                        onClick={() => setReturnModal({ orderId: order.orderId })}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return</span>
                      </button>
                    )}

                    {['RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'REFUNDED'].includes(order.orderStatus) && (
                      <span className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    )}

                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-brand-600 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Status Timeline Visualizer */}
                <div className="p-6 border-b border-gray-100">
                  <div className="relative flex items-center justify-between max-w-2xl mx-auto pt-2 pb-4">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: currentStepIdx >= 0 ? `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` : '0%',
                      }}
                    ></div>

                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center group">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-gray-400 border-gray-300'
                            } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className="text-[9px] font-bold mt-1 text-gray-600 capitalize text-center max-w-[60px] truncate">
                            {step.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {order.trackingInfo?.trackingNumber && (
                    <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        <span>Courier: <strong>{order.trackingInfo.courierName || 'BlueDart'}</strong> (AWB: {order.trackingInfo.trackingNumber})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items List (Expanded) */}
                {isExpanded && (
                  <div className="p-6 space-y-4 bg-gray-50/40 animate-fadeIn">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Ordered Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt="" className="w-12 h-16 object-cover rounded-lg bg-gray-100" />
                            <div>
                              <p className="text-xs font-bold text-gray-900">{item.name}</p>
                              <p className="text-[11px] text-gray-500">Color: {item.color} | Size: {item.size} | Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-900">₹{item.total?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-xs text-gray-500">
                      <strong>Delivery to:</strong> {order.shippingAddress?.fullName}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>

      {/* Return Request Modal */}
      {returnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Request Return</span>
              </h3>
              <button onClick={() => { setReturnModal(null); setReturnReason(''); }} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Order: <span className="font-bold text-gray-900">{returnModal.orderId}</span></p>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">Reason for Return</label>
              <select
                value={returnReason}
                onChange={e => setReturnReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Select a reason...</option>
                <option value="Wrong item delivered">Wrong item delivered</option>
                <option value="Damaged/defective product">Damaged/defective product</option>
                <option value="Size/fit issue">Size/fit issue</option>
                <option value="Not as described">Not as described</option>
                <option value="Changed my mind">Changed my mind</option>
              </select>
            </div>
            <p className="text-[11px] text-gray-400 italic">Returns accepted within 7 days of delivery. Items must be unused with original tags.</p>
            <div className="flex space-x-3">
              <button onClick={() => { setReturnModal(null); setReturnReason(''); }} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleReturnRequest}
                disabled={returnLoading || !returnReason}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 disabled:opacity-50 transition-colors"
              >
                {returnLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-xl ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'
        }`}>
          {toast.msg}
        </div>
      )}
  </>
  );
};

export default MyOrdersPage;

