import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  PackageX,
  Layers,
  Search,
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalSkus: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await adminApi.get('/inventory', { params });
      if (res.data.success) {
        setInventory(res.data.data);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleQuickAdjust = async (item, adjustment) => {
    const newStock = Math.max(0, item.stock + adjustment);
    setUpdatingId(item.variantId);
    try {
      const res = await adminApi.patch(`/inventory/${item.productId}/variant/${item.variantId}`, {
        stock: newStock,
      });
      if (res.data.success) {
        // Update local state instantly
        setInventory((prev) =>
          prev.map((i) => {
            if (i.variantId === item.variantId) {
              const updatedStatus = newStock === 0 ? 'out_of_stock' : newStock <= 5 ? 'low_stock' : 'in_stock';
              return { ...i, stock: newStock, status: updatedStatus };
            }
            return i;
          })
        );
        showToast(`Updated SKU ${item.sku} stock to ${newStock}`);
      }
    } catch (err) {
      console.error('Failed to update stock', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

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
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight flex items-center space-x-3">
            <span>Variant Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time multi-variant inventory control, safety thresholds, and SKU fulfillment tracking.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl transition-all text-slate-700 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Units</span>
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-serif">{stats.totalUnits.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400">Across all catalog variants</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active SKUs</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 font-serif">{stats.totalSkus}</p>
          <span className="text-[11px] text-slate-400">Color × Size combinations</span>
        </div>

        <div className="bg-white border border-amber-200/80 p-5 rounded-2xl shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Low Stock SKUs</span>
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2 font-serif">{stats.lowStockCount}</p>
          <span className="text-[11px] text-amber-600/90">Fewer than 5 units left</span>
        </div>

        <div className="bg-white border border-rose-200/80 p-5 rounded-2xl shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <PackageX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2 font-serif">{stats.outOfStockCount}</p>
          <span className="text-[11px] text-rose-600/90">Requires restock</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All SKUs' },
            { id: 'low_stock', label: `Low Stock (${stats.lowStockCount})` },
            { id: 'out_of_stock', label: `Out of Stock (${stats.outOfStockCount})` },
            { id: 'in_stock', label: 'Healthy Stock' },
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

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                <th className="py-4 px-6">Product & Category</th>
                <th className="py-4 px-4">SKU</th>
                <th className="py-4 px-4">Color</th>
                <th className="py-4 px-4">Size</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-6 text-center">Current Stock</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    Loading inventory records...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No SKU inventory found matching your criteria.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.variantId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs leading-snug line-clamp-1">{item.productName}</p>
                          <span className="text-[10px] text-brand-600 font-medium">{item.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600 font-medium">{item.sku}</td>

                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: item.colorCode || '#888' }}
                        />
                        <span className="text-slate-700 text-xs">{item.color}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg font-semibold text-slate-800 text-[11px]">
                        {item.size}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">₹{item.sellingPrice?.toLocaleString()}</td>

                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-sm font-bold ${
                          item.stock === 0
                            ? 'text-rose-600'
                            : item.stock <= 5
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {item.status === 'out_of_stock' ? (
                        <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full font-semibold text-[10px] uppercase tracking-wider">
                          Out of Stock
                        </span>
                      ) : item.status === 'low_stock' ? (
                        <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-semibold text-[10px] uppercase tracking-wider">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-semibold text-[10px] uppercase tracking-wider">
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          disabled={updatingId === item.variantId || item.stock === 0}
                          onClick={() => handleQuickAdjust(item, -1)}
                          title="Decrease Stock (-1)"
                          className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-40 transition-colors shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          disabled={updatingId === item.variantId}
                          onClick={() => handleQuickAdjust(item, 5)}
                          title="Restock (+5)"
                          className="px-2.5 h-7 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-[11px] font-bold rounded-lg flex items-center space-x-1 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+5</span>
                        </button>
                        <button
                          disabled={updatingId === item.variantId}
                          onClick={() => handleQuickAdjust(item, 10)}
                          title="Restock (+10)"
                          className="px-2.5 h-7 bg-fashion-dark hover:bg-black text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 transition-colors disabled:opacity-40 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+10</span>
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

export default AdminInventory;
