import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist } = useWishlist();
  const products = wishlist.products || [];

  if (products.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-brand-600 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500">Save items you love by tapping the heart icon on any garment.</p>
        <Link to="/shop" className="inline-flex items-center space-x-2 bg-brand-600 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider">
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
        My Wishlist ({products.length} {products.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
