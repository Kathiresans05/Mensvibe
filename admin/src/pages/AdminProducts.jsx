import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import adminApi from '../services/adminApi';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gender: 'Women',
    mrp: '',
    sellingPrice: '',
    description: '',
    images: [''],
    availableColors: [{ name: 'Default', hex: '#111827' }],
    availableSizes: ['M', 'L'],
    variants: [],
  });

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        adminApi.get('/products?limit=100'),
        adminApi.get('/categories'),
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate variants automatically whenever sizes or colors change
  const generateVariants = () => {
    const variants = [];
    formData.availableColors.forEach((col) => {
      formData.availableSizes.forEach((sz) => {
        const sku = `${(formData.name || 'item').slice(0, 4).toUpperCase()}-${col.name.slice(0, 3).toUpperCase()}-${sz}`;
        variants.push({
          sku,
          color: col.name,
          colorCode: col.hex,
          size: sz,
          stock: 20, // default initial stock
        });
      });
    });
    setFormData({ ...formData, variants });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.images[0]) {
      alert('Please upload a product image');
      return;
    }
    setSubmitting(true);
    try {
      // Ensure variants exist
      const productPayload = {
        ...formData,
        mrp: Number(formData.mrp),
        sellingPrice: Number(formData.sellingPrice),
        variants: formData.variants.length > 0 ? formData.variants : [
          { sku: `${formData.name.slice(0, 4)}-DEF-M`, color: 'Default', size: 'M', stock: 25 }
        ],
      };

      const res = await adminApi.post('/products', productPayload);
      if (res.data.success) {
        setModalOpen(false);
        fetchProducts();
        alert('Product added successfully and image saved to Cloudinary!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">Fashion Catalog</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage single-brand collections, sizes, color variants & pricing</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              category: categories[0]?._id || '',
              gender: 'Women',
              mrp: '',
              sellingPrice: '',
              description: '',
              images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'],
              availableColors: [{ name: 'Black', hex: '#111827' }],
              availableSizes: ['S', 'M', 'L', 'XL'],
              variants: [],
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center space-x-3 bg-white border border-slate-200/90 px-4 py-2.5 rounded-xl max-w-md shadow-2xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name..."
          className="w-full text-xs bg-transparent text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Price / MRP</th>
                <th className="p-4 font-semibold">Discount</th>
                <th className="p-4 font-semibold">Total Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No products found in catalog.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const totalStock = (p.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
                  const img = p.images && p.images.length > 0 ? p.images[0] : '';

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <img src={img} alt="" className="w-10 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-500">{p.category?.name || 'General'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{p.gender}</td>
                      <td className="p-4 font-bold text-slate-900">
                        ₹{p.sellingPrice?.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-slate-400 line-through font-normal">₹{p.mrp}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.discountPercentage}% OFF
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            totalStock === 0
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : totalStock <= 10
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-serif text-xl font-bold text-slate-900">Add New Garment Design</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Classic Linen Shirt, Urban Cargo Pants"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">Category *</label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.parentCategory})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">Department *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">MRP (₹) *</label>
                  <input
                    type="number"
                    name="mrp"
                    required
                    value={formData.mrp}
                    onChange={handleInputChange}
                    placeholder="3999"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    required
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    placeholder="2499"
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Primary Image (Upload) *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, images: [reader.result] });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white transition-all file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-black cursor-pointer"
                />
                {formData.images[0] && (
                  <div className="mt-3 flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <img src={formData.images[0]} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                    <div>
                      <p className="text-[11px] font-semibold text-slate-800">Image Selected</p>
                      <p className="text-[10px] text-emerald-600 font-medium">✓ Will be stored in Cloudinary CDN</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1.5">Product Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Fabric composition, design details, washing instructions..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-500 transition-all"
                />
              </div>

              {/* Color & Size Config */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Variant Matrix Configuration</span>
                  <button
                    type="button"
                    onClick={generateVariants}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
                  >
                    ⚡ Auto-Generate SKUs
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Available Sizes</label>
                    <div className="flex flex-wrap gap-1">
                      {SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            const sizes = formData.availableSizes.includes(sz)
                              ? formData.availableSizes.filter((s) => s !== sz)
                              : [...formData.availableSizes, sz];
                            setFormData({ ...formData, availableSizes: sizes });
                          }}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                            formData.availableSizes.includes(sz)
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">Colors (Comma separated)</label>
                    <input
                      type="text"
                      defaultValue="Black, Red, Gold"
                      onChange={(e) => {
                        const colors = e.target.value.split(',').map((c) => ({ name: c.trim(), hex: '#111827' }));
                        setFormData({ ...formData, availableColors: colors });
                      }}
                      className="w-full p-2.5 bg-white rounded-lg border border-slate-200 text-slate-900 text-[11px] focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <span>Save & Publish Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
