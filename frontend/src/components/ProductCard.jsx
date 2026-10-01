import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0].name : ''
  );
  const isWished = isInWishlist(product._id);

  const fallbackImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image Container with Badges and Overlay Actions */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link to={`/product/${product.slug}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-md ${
            isWished
              ? 'bg-rose-50 text-brand-600 ring-2 ring-brand-500'
              : 'bg-white/90 text-gray-600 hover:text-brand-600 hover:bg-white'
          }`}
          title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-brand-600' : ''}`} />
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold py-2.5 px-3 rounded-xl shadow-lg hover:bg-brand-600 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Rating and Reviews */}
        <div className="flex items-center space-x-1.5 text-xs text-gray-500">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="ml-1 font-semibold text-gray-800 text-[11px]">
              {product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '4.5'}
            </span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-[11px] text-gray-400">
            {product.ratingsQuantity || 12} reviews
          </span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-xs font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Available Colors Swatches */}
        {product.availableColors && product.availableColors.length > 0 && (
          <div className="flex items-center space-x-1.5 pt-0.5">
            {product.availableColors.map((col, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedColor(col.name)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === col.name ? 'ring-2 ring-brand-500 ring-offset-1 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: col.hex || '#000' }}
                title={col.name}
              />
            ))}
            {product.availableColors.length > 3 && (
              <span className="text-[10px] text-gray-400 font-medium pl-0.5">
                +{product.availableColors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Available Sizes preview */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-gray-400 font-medium">Sizes:</span>
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.slice(0, 4).map((sz, idx) => (
                <span key={idx} className="text-[9px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                  {sz}
                </span>
              ))}
              {product.availableSizes.length > 4 && (
                <span className="text-[9px] text-gray-400">+{product.availableSizes.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Pricing Block */}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-bold text-gray-900">
              ₹{product.sellingPrice?.toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
