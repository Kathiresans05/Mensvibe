import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, X, ChevronRight } from 'lucide-react';
import adminApi from '../services/adminApi';

const STATUS_OPTIONS = [
  'ORDER_PLACED',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Modal Form State
  const [updateForm, setUpdateForm] = useState({
    orderStatus: '',
    courierName: '',
    trackingNumber: '',
    comment: '',
  });

  const fetchOrders = async () => {
    try {
      const url = statusFilter ? `/orders/admin/all?status=${statusFilter}` : '/orders/admin/all';
      const res = await adminApi.get(url);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await adminApi.put(`/orders/admin/${selectedOrder.orderId}/status`, updateForm);
      if (res.data.success) {
        setSelectedOrder(null);
        fetchOrders();
        alert('Order status updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Order Fulfillment</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage dispatch status, courier assignations, and package deliveries
          </p>
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 shadow-2xs font-medium"
        >
          <option value="">All Order Statuses</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer & Address</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{ord.orderId}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{ord.shippingAddress?.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.phone})
                      </p>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">({ord.paymentMethod})</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.orderStatus === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setUpdateForm({
                            orderStatus: ord.orderStatus,
                            courierName: ord.trackingInfo?.courierName || 'BlueDart',
                            trackingNumber: ord.trackingInfo?.trackingNumber || '',
                            comment: '',
                          });
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs"
                      >
                        Fulfill / Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-serif text-lg font-bold text-slate-900">Update Order #{selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">New Fulfillment Status *</label>
                <select
                  value={updateForm.orderStatus}
                  onChange={(e) => setUpdateForm({ ...updateForm, orderStatus: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all font-medium"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Courier Service Name</label>
                <input
                  type="text"
                  value={updateForm.courierName}
                  onChange={(e) => setUpdateForm({ ...updateForm, courierName: e.target.value })}
                  placeholder="e.g. BlueDart, Delhivery, Shiprocket"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Tracking Number / AWB</label>
                <input
                  type="text"
                  value={updateForm.trackingNumber}
                  onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                  placeholder="e.g. BD987654321IN"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Internal Note / Comment</label>
                <input
                  type="text"
                  value={updateForm.comment}
                  onChange={(e) => setUpdateForm({ ...updateForm, comment: e.target.value })}
                  placeholder="e.g. Picked up by courier executive"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-sm"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
