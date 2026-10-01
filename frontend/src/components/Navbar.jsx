import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'MEN', path: '/shop?gender=Men' },
    { name: 'WOMEN', path: '/shop?gender=Women' },
    { name: 'KIDS', path: '/shop?gender=Kids' },
    { name: 'NEW ARRIVALS', path: '/shop?isNewArrival=true', highlight: true },
    { name: 'OFFERS', path: '/shop?sort=discount', badge: 'SALE' },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar (Scrolls away with page to save screen space) */}
      <div className="bg-[#0B0F19] text-white text-[11px] py-2 overflow-hidden border-b border-gray-800 tracking-wider select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="flex items-center space-x-8 px-4 font-medium">
              <span className="flex items-center space-x-1.5">
                <span className="text-amber-400">✨</span>
                <span>FREE EXPRESS SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999</span>
              </span>
              <span className="text-rose-400/60">✦</span>
              <span className="flex items-center space-x-1.5">
                <span className="text-rose-400">🏷️</span>
                <span className="text-rose-300 font-semibold">USE CODE: WELCOME10 FOR FLAT 10% OFF</span>
              </span>
              <span className="text-rose-400/60">✦</span>
              <span className="flex items-center space-x-1.5">
                <span className="text-emerald-400">⚡</span>
                <span>7-DAY EASY DOORSTEP RETURNS & EXCHANGES</span>
              </span>
              <span className="text-rose-400/60">✦</span>
              <span className="flex items-center space-x-1.5">
                <span className="text-amber-300">👑</span>
                <span>100% AUTHENTIC HANDCRAFTED LUXURY APPAREL</span>
              </span>
              <span className="text-rose-400/60">✦</span>
              <span className="flex items-center space-x-1.5">
                <span className="text-sky-400">🛍️</span>
                <span>CASH ON DELIVERY (COD) AVAILABLE ACROSS INDIA</span>
              </span>
              <span className="text-rose-400/60">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-700 hover:text-brand-600 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-center group">
              <span className="font-display text-xl sm:text-3xl font-bold tracking-wider sm:tracking-widest text-gray-900 group-hover:text-brand-600 transition-colors">
                MensVibe
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-gray-400 -mt-0.5 sm:-mt-1 uppercase">
                Luxury Fashion
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-sm font-semibold tracking-wider text-gray-800 hover:text-brand-600 transition-colors py-2 group"
              >
                {link.name}
                {link.badge && (
                  <span className="absolute -top-1 -right-6 bg-red-600 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold uppercase tracking-normal animate-pulse">
                    {link.badge}
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Profile */}
          <div className="flex items-center space-x-1 sm:space-x-5">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirts, chinos, tees, blazers..."
                className="w-52 lg:w-64 pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-brand-600 transition-colors flex-shrink-0"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {(wishlist.products || []).length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {(wishlist.products || []).length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-brand-600 transition-colors flex-shrink-0"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative group flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center cursor-pointer p-0.5 sm:p-1">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-100 border border-brand-200 text-brand-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/my-orders"
                      className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-600"
                    >
                      <Package className="w-4 h-4 mr-2.5 text-gray-400" /> My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2.5 text-red-500" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-gray-700 hover:text-brand-600 bg-gray-50 hover:bg-gray-100 px-3.5 py-2 rounded-full border border-gray-200 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-brand-50 hover:text-brand-600"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-red-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;
