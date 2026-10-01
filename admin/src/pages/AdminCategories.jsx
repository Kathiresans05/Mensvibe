import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderTree, X } from 'lucide-react';
import adminApi from '../services/adminApi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: 'Women',
    image: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories');
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.post('/categories', formData);
      if (res.data.success) {
        setModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await adminApi.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Fashion Collections & Categories</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Configure hierarchical apparel classifications & styles</p>
        </div>

        <button
          onClick={() => {
            setFormData({ name: '', parentCategory: 'Women', image: '', description: '' });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-4">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200 mt-1 inline-block">
                  {cat.parentCategory}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat._id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-serif text-lg font-bold text-slate-900">Create Category</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shirts, Trendy Pants, Kurtas"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Parent Department *</label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
