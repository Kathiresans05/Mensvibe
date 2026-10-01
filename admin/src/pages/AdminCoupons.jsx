import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TicketPercent, X } from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '999',
    maxDiscountAmount: '500',
    validUntil: '',
  });

  const fetchCoupons = async () => {
    try {
      const res = await adminApi.get('/coupons');
      if (res.data.success) setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
        validUntil: formData.validUntil ? new Date(formData.validUntil) : new Date(Date.now() + 30 * 86400000),
      };

      const res = await adminApi.post('/coupons', payload);
      if (res.data.success) {
        setModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await adminApi.delete(`/coupons/${id}`);
        fetchCoupons();
      } catch (err) {
        alert('Failed to delete coupon');
      }
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Promotions &amp; Coupons</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Create and manage marketing discount codes and promotional vouchers</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              code: '',
              discountType: 'percentage',
              discountValue: '15',
              minOrderValue: '1499',
              maxDiscountAmount: '500',
              validUntil: '',
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-fashion-dark hover:bg-black text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-2xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200/70">
                  <TicketPercent className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-slate-900 font-mono tracking-wider">{c.code}</span>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p className="font-bold text-emerald-600 text-sm">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
              </p>
              <p className="text-[11px] text-slate-500">Min Order Value: ₹{c.minOrderValue}</p>
              <p className="text-[11px] text-slate-400">
                Expires on: {new Date(c.validUntil).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Create Promo Code</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE15"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="15"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    placeholder="999"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="500"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-fashion-dark hover:bg-black text-white font-semibold shadow-2xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
