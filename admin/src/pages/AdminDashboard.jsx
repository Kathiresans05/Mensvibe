import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Shirt,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.get('/admin/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentOrders(res.data.recentOrders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-brand-600',
      bg: 'bg-brand-50 border-brand-100',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
    },
    {
      title: 'Active Catalog Items',
      value: stats?.totalProducts || 0,
      icon: Shirt,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
    },
  ];

  const inventoryKpis = [
    {
      title: 'Pending Fulfillment',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Delivered Orders',
      value: stats?.deliveredOrders || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Low Stock Alerts',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Total Stocked Units',
      value: stats?.totalStock || 0,
      icon: Boxes,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Fashion Store Overview</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Real-time performance, customer orders & operations snapshot</p>
        </div>
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Catalog Synced</span>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-xl border ${kpi.bg} ${kpi.color} transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryKpis.map((ik, idx) => {
          const Icon = ik.icon;
          return (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center space-x-3.5">
              <div className={`p-2.5 rounded-lg border ${ik.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">{ik.title}</p>
                <p className="text-lg font-bold text-slate-900 tracking-tight">{ik.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">Recent Orders</h3>
            <p className="text-[11px] text-slate-500">Latest customer purchases awaiting fulfillment</p>
          </div>
          <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
            View All ({recentOrders.length})
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">No customer orders recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Payment</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-slate-900">{ord.orderId}</td>
                    <td className="py-3.5 font-medium text-slate-800">{ord.user?.name || ord.shippingAddress?.fullName || 'Guest'}</td>
                    <td className="py-3.5 font-bold text-slate-900">₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ord.orderStatus === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
