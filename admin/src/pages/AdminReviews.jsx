import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  RefreshCw,
  CheckCircle2,
  EyeOff,
  Eye,
  Trash2,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/admin/reviews');
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (review) => {
    setUpdatingId(review._id);
    try {
      const newStatus = !review.isApproved;
      const res = await adminApi.patch(`/admin/reviews/${review._id}/status`, {
        isApproved: newStatus,
      });
      if (res.data.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === review._id ? { ...r, isApproved: newStatus } : r))
        );
        showToast(newStatus ? 'Review approved & visible online' : 'Review hidden from store');
      }
    } catch (err) {
      console.error('Failed to update review status', err);
      showToast('Failed to update review status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this customer review?')) {
      try {
        await adminApi.delete(`/admin/reviews/${id}`);
        setReviews((prev) => prev.filter((r) => r._id !== id));
        showToast('Review permanently deleted');
      } catch (err) {
        console.error('Failed to delete review', err);
        showToast('Failed to delete review');
      }
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewText?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.product?.name?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'approved') return r.isApproved;
    if (statusFilter === 'hidden') return !r.isApproved;
    if (statusFilter === '5stars') return r.rating === 5;
    if (statusFilter === 'lowstars') return r.rating <= 3;
    return true;
  });

  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0) / totalReviews).toFixed(1) : '5.0';
  const verifiedCount = reviews.filter((r) => r.isVerifiedPurchase).length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-fashion-dark text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 z-50 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Customer Reviews &amp; Ratings</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor client feedback, moderate verified reviews, and maintain atelier reputation.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl transition-all text-slate-700 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Reviews</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-slate-900">{totalReviews}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-amber-600">{avgRating} <span className="text-xs font-sans text-slate-400 font-normal">/ 5.0</span></p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved Online</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-emerald-600">{approvedCount}</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Buyers</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-brand-600">{verifiedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer, product, review..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'approved', label: 'Approved' },
            { id: 'hidden', label: 'Hidden / Pending' },
            { id: '5stars', label: '5 Stars' },
            { id: 'lowstars', label: 'Critical (≤3 Stars)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-fashion-dark text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Client</th>
                <th className="py-4 px-4">Rating &amp; Review</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    Loading review entries...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No reviews found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Product */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.product?.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
                          alt={rev.product?.name || 'Garment'}
                          className="w-10 h-12 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="max-w-[180px]">
                          <p className="font-semibold text-slate-900 text-xs line-clamp-1">
                            {rev.product?.name || 'Aura Signature Item'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-slate-900 text-xs">{rev.user?.name || 'Anonymous Client'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{rev.user?.email || ''}</p>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating & Review */}
                    <td className="py-4 px-4 max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-[11px] font-bold text-slate-700 ml-1">
                            {rev.rating}.0
                          </span>
                        </div>

                        {rev.title && (
                          <p className="font-semibold text-slate-900 text-xs">{rev.title}</p>
                        )}
                        <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                          {rev.reviewText}
                        </p>

                        {rev.images?.length > 0 && (
                          <div className="flex items-center space-x-1.5 pt-1">
                            {rev.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt="User photo"
                                className="w-7 h-7 object-cover rounded-md border border-slate-200"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {rev.isApproved ? (
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-semibold text-[10px] uppercase tracking-wider inline-flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full font-semibold text-[10px] uppercase tracking-wider inline-flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          disabled={updatingId === rev._id}
                          onClick={() => handleToggleStatus(rev)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all border shadow-2xs ${
                            rev.isApproved
                              ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                          }`}
                        >
                          {rev.isApproved ? 'Hide' : 'Approve'}
                        </button>

                        <button
                          onClick={() => handleDelete(rev._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
};

export default AdminReviews;
