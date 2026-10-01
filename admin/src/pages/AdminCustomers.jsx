import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  X,
  Phone,
  Mail,
} from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;

      const res = await adminApi.get('/admin/customers', { params });
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleToggleStatus = async (customer) => {
    setUpdatingId(customer._id);
    try {
      const res = await adminApi.patch(`/admin/customers/${customer._id}/status`);
      if (res.data.success) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === customer._id ? { ...c, isActive: res.data.data.isActive } : c))
        );
      }
    } catch (err) {
      console.error('Failed to toggle customer status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Registered customer accounts, lifetime order history, shipping profiles, and account controls.
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl transition-all text-slate-700 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </form>
        <span className="text-xs text-slate-500 font-medium hidden md:inline">
          Total Customers: <strong className="text-slate-900">{customers.length}</strong>
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4 text-center">Total Orders</th>
                <th className="py-4 px-4">Lifetime Spend</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    Loading customer accounts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700 font-bold text-xs shadow-2xs">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-xs leading-snug">{c.name}</p>
                          <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{c.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                      {c.phone ? (
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{c.phone}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold">
                        {c.totalOrders || 0}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 text-xs">
                      ₹{c.totalSpend?.toLocaleString() || 0}
                    </td>

                    <td className="py-4 px-4 text-slate-500 text-[11px]">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>

                    <td className="py-4 px-4">
                      {c.isActive ? (
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-semibold text-[10px] uppercase tracking-wider flex items-center space-x-1 w-max">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full font-semibold text-[10px] uppercase tracking-wider flex items-center space-x-1 w-max">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Blocked</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors flex items-center space-x-1.5 shadow-2xs"
                        >
                          <MapPin className="w-3 h-3 text-brand-600" />
                          <span>Details</span>
                        </button>

                        <button
                          disabled={updatingId === c._id}
                          onClick={() => handleToggleStatus(c)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all disabled:opacity-40 border ${
                            c.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {c.isActive ? 'Block' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-sm">
                  {selectedCustomer.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{selectedCustomer.name}</h3>
                  <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
                <p className="text-xl font-bold font-serif text-slate-900 mt-1">{selectedCustomer.totalOrders || 0}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Spend</span>
                <p className="text-xl font-bold font-serif text-brand-600 mt-1">₹{selectedCustomer.totalSpend?.toLocaleString() || 0}</p>
              </div>
            </div>

            {/* Saved Addresses */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Saved Shipping Addresses ({selectedCustomer.addresses?.length || 0})</span>
              </h4>

              {selectedCustomer.addresses?.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                  No delivery addresses saved yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCustomer.addresses.map((addr, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        <span className="text-[11px] text-slate-500">{addr.phone}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-fashion-dark hover:bg-black text-white font-semibold text-xs rounded-xl transition-all shadow-2xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
