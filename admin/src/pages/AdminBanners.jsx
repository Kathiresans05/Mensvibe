import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, X } from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'SHOP NOW',
    linkUrl: '/shop',
    desktopImage: '',
    order: 0,
  });

  const fetchBanners = async () => {
    try {
      const res = await adminApi.get('/banners/admin/all');
      if (res.data.success) setBanners(res.data.banners);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.post('/banners', formData);
      if (res.data.success) {
        setModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating banner');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await adminApi.delete(`/banners/${id}`);
        fetchBanners();
      } catch (err) {
        alert('Failed to delete banner');
      }
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Homepage Hero Banners</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Configure high-resolution visual storytelling campaigns and promotional sliders</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              subtitle: '',
              buttonText: 'SHOP NOW',
              linkUrl: '/shop',
              desktopImage: '',
              order: banners.length,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-fashion-dark hover:bg-black text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-2xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[16/8] bg-slate-100">
              <img src={b.desktopImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                <div>
                  <h3 className="text-base font-serif font-bold text-white leading-snug">{b.title}</h3>
                  <p className="text-xs text-slate-200 mt-0.5">{b.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-slate-100 bg-white">
              <span className="text-xs text-slate-500">
                Redirects to: <strong className="text-slate-800 font-medium">{b.linkUrl}</strong>
              </span>
              <button
                onClick={() => handleDelete(b._id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Create Hero Banner</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. THE ROYAL SILK COLLECTION"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Subtitle / Campaign Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Handcrafted Heritage Festive 2026"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Desktop Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.desktopImage}
                  onChange={(e) => setFormData({ ...formData, desktopImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Link URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
