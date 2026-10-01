import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, Check, X, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import api from '../services/api';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
const COLORS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#FBBF24' },
  { name: 'Pink', hex: '#EC4899' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State from URL params
  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'popular';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const selectedSizes = searchParams.get('sizes') ? searchParams.get('sizes').split(',') : [];
  const selectedColors = searchParams.get('colors') ? searchParams.get('colors').split(',') : [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const toggleArrayFilter = (key, item) => {
    const nextParams = new URLSearchParams(searchParams);
    let items = nextParams.get(key) ? nextParams.get(key).split(',') : [];
    if (items.includes(item)) {
      items = items.filter((i) => i !== item);
    } else {
      items.push(item);
    }
    if (items.length === 0) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, items.join(','));
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs text-gray-400 font-medium">Home / Shop {gender ? `/ ${gender}` : ''}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-1">
            {keyword ? `Search Results for "${keyword}"` : gender ? `${gender}'s Fashion Collection` : 'All Apparel & Dresses'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">Showing {totalCount} items curated for you</p>
        </div>

        {/* Sort Controls & Mobile Filter Trigger */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 text-xs font-semibold px-4 py-2 rounded-xl text-gray-700 shadow-sm"
          >
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Refine By</span>
            </span>
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Department</h4>
            <div className="space-y-1.5">
              {['Women', 'Men', 'Kids'].map((g) => (
                <button
                  key={g}
                  onClick={() => updateFilter('gender', gender === g ? '' : g)}
                  className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors ${
                    gender === g ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{g}</span>
                  {gender === g && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Category</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateFilter('category', category === cat._id ? '' : cat._id)}
                  className={`w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors ${
                    category === cat._id ? 'bg-brand-50 text-brand-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  {category === cat._id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Price Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Size</h4>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleArrayFilter('sizes', sz)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Color</h4>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((col) => {
                const isSelected = selectedColors.includes(col.name);
                return (
                  <button
                    key={col.name}
                    onClick={() => toggleArrayFilter('colors', col.name)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      isSelected ? 'ring-2 ring-brand-500 ring-offset-2 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                );
              })}
            </div>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-gray-200 aspect-[3/4] rounded-2xl"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl">
                👗
              </div>
              <h3 className="text-lg font-bold text-gray-900">No matching designs found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your filters or explore other categories to discover beautiful fashion apparel.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-gray-900 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-brand-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default ShopPage;
