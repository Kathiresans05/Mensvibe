import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, CheckCircle2, XCircle, RefreshCw, Package, ChevronDown, ChevronUp, Clock, BadgeIndianRupee, MessageSquare } from 'lucide-react';
import adminApi from '../services/adminApi';

const STATUS_CONFIG = {
  RETURN_REQUESTED: { label: 'Return Requested', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  RETURN_APPROVED: { label: 'Return Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  RETURN_REJECTED: { label: 'Return Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  REFUNDED: { label: 'Refunded', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
};

const FILTERS = [
  { label: 'All Returns', value: 'all' },
  { label: 'Pending Review', value: 'return_requested' },
  { label: 'Approved', value: 'return_approved' },
  { label: 'Rejected', value: 'return_rejected' },
  { label: 'Refunded', value: 'refunded' },
];

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
      const res = await adminApi.get(`/admin/returns${params}`);
      if (res.data.success) setReturns(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const handleAction = async () => {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      if (actionModal.type === 'refund') {
        await adminApi.patch(`/admin/returns/${actionModal.orderId}/refund`, { refundNote: adminNote });
        showToast('Refund marked as processed');
      } else {
        await adminApi.patch(`/admin/returns/${actionModal.orderId}/action`, { action: actionModal.type, adminNote });
        showToast(actionModal.type === 'approve' ? 'Return approved' : 'Return rejected', actionModal.type === 'approve' ? 'success' : 'error');
      }
      setActionModal(null);
      setAdminNote('');
      fetchReturns();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Action failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const stats = {
    total: returns.length,
    pending: returns.filter(r => r.orderStatus === 'RETURN_REQUESTED').length,
    approved: returns.filter(r => r.orderStatus === 'RETURN_APPROVED').length,
    refunded: returns.filter(r => r.orderStatus === 'REFUNDED').length,
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Returns &amp; Refunds</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage customer return requests, inspection decisions and instant refunds</p>
        </div>
        <button
          onClick={fetchReturns}
          className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white rounded-xl border border-slate-200 shadow-2xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {[
          { label: 'Total Returns', value: stats.total, icon: RotateCcw, color: 'text-slate-700', bg: 'bg-slate-100' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-100' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { label: 'Refunded', value: stats.refunded, icon: BadgeIndianRupee, color: 'text-blue-700', bg: 'bg-blue-100' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold font-serif ${kpi.color}`}>{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === f.value
                ? 'bg-fashion-dark text-white border-fashion-dark shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Return List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : returns.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <RotateCcw className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No return requests found</p>
          <p className="text-xs text-slate-400 mt-1">Customer return requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map(ret => {
            const config = STATUS_CONFIG[ret.orderStatus] || STATUS_CONFIG.RETURN_REQUESTED;
            const isExpanded = expandedId === ret._id;
            const isPending = ret.orderStatus === 'RETURN_REQUESTED';
            const isApproved = ret.orderStatus === 'RETURN_APPROVED';
            return (
              <div key={ret._id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600 border border-slate-200">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-bold text-slate-900 font-mono">{ret.orderId}</p>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${config.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          <span>{config.label}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {ret.user?.name} &bull; {ret.user?.email} &bull; <span className="font-bold text-slate-900">₹{ret.totalAmount?.toLocaleString('en-IN')}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Updated: {new Date(ret.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isPending && (
                      <>
                        <button
                          onClick={() => setActionModal({ orderId: ret.orderId, type: 'approve' })}
                          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setActionModal({ orderId: ret.orderId, type: 'reject' })}
                          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    {isApproved && (
                      <button
                        onClick={() => setActionModal({ orderId: ret.orderId, type: 'refund' })}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-fashion-dark text-white text-xs font-semibold hover:bg-black transition-colors shadow-2xs"
                      >
                        <BadgeIndianRupee className="w-3.5 h-3.5" />
                        <span>Process Refund</span>
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ret._id)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/50">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ordered Items</h4>
                    <div className="space-y-2">
                      {ret.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                          <div className="flex items-center space-x-3">
                            <img src={item.image} alt="" className="w-10 h-14 object-cover rounded-lg border border-slate-200" />
                            <div>
                              <p className="text-xs font-semibold text-slate-900">{item.name}</p>
                              <p className="text-[10px] text-slate-500">{item.color} | {item.size} | Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-900">₹{item.total?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    {ret.statusTimeline?.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Status Timeline</h4>
                        <div className="space-y-3 relative pl-4 border-l border-slate-200 ml-2">
                          {ret.statusTimeline.slice(-4).reverse().map((tl, idx) => (
                            <div key={idx} className="relative">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-600 border-2 border-white shadow-2xs" />
                              <p className="text-xs font-bold text-slate-900">{tl.status.replace(/_/g, ' ')}</p>
                              {tl.comment && <p className="text-[10px] text-slate-500 mt-0.5">{tl.comment}</p>}
                              <p className="text-[10px] text-slate-400">{new Date(tl.timestamp).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                actionModal.type === 'approve' ? 'bg-emerald-100 text-emerald-700' : actionModal.type === 'reject' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {actionModal.type === 'approve' ? <CheckCircle2 className="w-5 h-5" />
                  : actionModal.type === 'reject' ? <XCircle className="w-5 h-5" />
                  : <BadgeIndianRupee className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 capitalize">
                  {actionModal.type === 'refund' ? 'Mark Refund as Processed' : `${actionModal.type} Return Request`}
                </h3>
                <p className="text-[11px] text-slate-500">Order: {actionModal.orderId}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Admin Note / Resolution Comment</span>
              </label>
              <textarea
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                rows={3}
                placeholder="Enter internal reasoning or confirmation message..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => { setActionModal(null); setAdminNote(''); }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-semibold transition-colors disabled:opacity-50 ${
                  actionModal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionModal.type === 'reject' ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-fashion-dark hover:bg-black'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-xl ${toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
