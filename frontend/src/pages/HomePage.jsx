import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Award, TrendingUp, ShieldCheck, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import api from '../services/api';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories?activeOnly=true'),
          api.get('/products?limit=8'),
        ]);

        if (catRes.data.success && Array.isArray(catRes.data.categories) && catRes.data.categories.length > 0) {
          // Prioritize Men's categories first for MensVibe identity
          const sorted = [...catRes.data.categories].sort((a, b) => {
            const isAMen = (a.parentCategory === 'Men' || (a.name && a.name.toLowerCase().includes('men')));
            const isBMen = (b.parentCategory === 'Men' || (b.name && b.name.toLowerCase().includes('men')));
            if (isAMen && !isBMen) return -1;
            if (!isAMen && isBMen) return 1;
            return 0;
          });
          setCategories(sorted);
        } else {
          setCategories([]);
        }

        if (prodRes.data.success && Array.isArray(prodRes.data.products) && prodRes.data.products.length > 0) {
          setNewArrivals(prodRes.data.products);
          setTrending(prodRes.data.products.slice(0, 4));
        } else {
          setNewArrivals([]);
          setTrending([]);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setCategories([]);
        setNewArrivals([]);
        setTrending([]);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. Hero Banner Slider */}
      <HeroSlider />

      {/* 2. Shop By Category - Real Categories from DB */}
      {categories.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div>
              <div className="flex items-center space-x-1.5 text-brand-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> <span>EXPLORE COLLECTIONS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mt-0.5">Shop By Category</h2>
            </div>
            
            {/* Controls: Swipe hint on mobile & smooth scroll arrows on desktop */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-medium text-gray-400 sm:hidden">Swipe ➔</span>
              <button
                onClick={() => scrollCategories('left')}
                className="hidden sm:flex w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-brand-50 hover:border-brand-200 text-gray-700 hover:text-brand-600 items-center justify-center transition-all shadow-xs"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCategories('right')}
                className="hidden sm:flex w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-brand-50 hover:border-brand-200 text-gray-700 hover:text-brand-600 items-center justify-center transition-all shadow-xs"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Swipeable Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-start space-x-4 sm:space-x-6 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {categories.map((cat, index) => (
              <Link
                key={cat._id || index}
                to={`/shop?category=${encodeURIComponent(cat._id || cat.name)}&gender=${encodeURIComponent(cat.parentCategory || 'All')}`}
                className="group flex flex-col items-center text-center flex-shrink-0 w-20 sm:w-24 select-none"
              >
                {/* Instagram-style Perfect Circle Luxury Gradient Ring */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-full p-[2px] bg-gradient-to-tr from-brand-500 via-rose-400 to-amber-300 group-hover:from-brand-600 group-hover:to-rose-500 transition-all duration-300 shadow-xs group-hover:scale-105 flex-shrink-0">
                  <div className="w-full h-full p-[2px] bg-white rounded-full aspect-square flex-shrink-0 overflow-hidden">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=300&q=80'}
                      alt={cat.name}
                      className="w-full h-full aspect-square object-cover object-center rounded-full group-hover:opacity-95 transition-opacity"
                    />
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-gray-800 group-hover:text-brand-600 transition-colors mt-1.5 text-center line-clamp-2 leading-tight h-7 sm:h-8 flex items-start justify-center px-1 max-w-[80px] sm:max-w-[92px]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 3. New Arrivals Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> <span>FRESH STYLES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-1">New Arrivals</h2>
          </div>
          <Link
            to="/shop?isNewArrival=true"
            className="mt-3 sm:mt-0 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center group"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 rounded-2xl bg-gray-50/70 border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Fresh MensVibe Drops Coming Soon</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Our latest collection is currently being curated. Upload products from the Admin Panel to display them here.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-block px-5 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-xs"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>

      {/* 4. Promotional Banner Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B0F19] via-[#1E1B4B] to-[#312E81] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl">
          <div className="space-y-3 text-center md:text-left z-10 max-w-lg">
            <span className="bg-brand-500/30 border border-brand-400/40 text-brand-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              EXCLUSIVE PREMIERE OFFER
            </span>
            <h3 className="text-2xl sm:text-4xl font-display font-bold">The MensVibe Edition</h3>
            <p className="text-xs sm:text-sm text-indigo-100">
              Get flat 10% off on all premium menswear and casual collections. Use coupon code <span className="font-mono font-bold text-yellow-300">WELCOME10</span> at checkout.
            </p>
          </div>
          <div className="mt-6 md:mt-0 z-10">
            <Link
              to="/shop"
              className="bg-white text-indigo-950 hover:bg-brand-500 hover:text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105 inline-block"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 5. Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> <span>WHAT EVERYONE IS BUYING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-1">Trending Right Now</h2>
          </div>
          <Link
            to="/shop?isTrending=true"
            className="mt-3 sm:mt-0 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center group"
          >
            <span>Explore Trending Collection</span>
            <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {trending.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 rounded-2xl bg-gray-50/70 border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Trending Styles Coming Soon</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Featured trending products will appear here once published from the Admin Dashboard.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-block px-5 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-xs"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>

      {/* 6. Brand Quality & Customer Trust Guarantee */}
      <section className="bg-brand-50/50 py-16 border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold tracking-widest text-brand-600 uppercase">THE MENSVIBE PROMISE</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">Why Customers Love Us</h2>
            <p className="text-xs text-gray-500">
              Unlike marketplaces with unknown third-party sellers, MensVibe manufactures and strictly checks every single garment before delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-brand-100/60 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">100% In-House Quality Check</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every thread, seam, and button is inspected by our master tailors before being packed in luxury gift packaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-100/60 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Guaranteed Fabric Authenticity</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Certified pure mulberry silks, authentic Egyptian linens, and organic comb cottons guaranteed with lab certifications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-brand-100/60 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">Free Doorstep Size Exchanges</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Ordered the wrong size? Our courier partner will deliver your replacement and collect the original at the same time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal Popup */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default HomePage;
