import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const QuickViewModal = ({ product, onClose }) => {
  if (!product) return null;

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(
    product.availableColors && product.availableColors.length > 0 ? product.availableColors[0].name : ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';
  const isWished = isInWishlist(product._id);

  const handleAddToCart = async () => {
    try {
      const variant = (product.variants || []).find(
        (v) => (v.color === selectedColor || !selectedColor) && (v.size === selectedSize || !selectedSize)
      ) || { sku: `${product.slug}-${selectedColor}-${selectedSize}` };

      await addToCart({
        productId: product._id,
        product,
        variantSku: variant.sku,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-[3/4] bg-gray-100">
          <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          {product.discountPercentage > 0 && (
            <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Product Details Form */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-500 mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-gray-800">{product.ratingsAverage || '4.5'}</span>
              <span className="text-gray-400">({product.ratingsQuantity || 12} reviews)</span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 leading-tight">{product.name}</h2>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mt-3">
              <span className="text-2xl font-extrabold text-gray-900">
                ₹{product.sellingPrice?.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.sellingPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-3 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                </label>
                <div className="flex space-x-2">
                  {product.availableColors.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border ${
                        selectedColor === c.name ? 'ring-2 ring-brand-500 ring-offset-2 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Size: <span className="font-normal text-gray-500">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSize === s
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> <span>Add To Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWished ? 'bg-rose-50 text-brand-600 border-brand-200' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-brand-600' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/product/${product.slug}`);
              }}
              className="w-full text-center text-xs font-bold text-gray-600 hover:text-brand-600 py-1"
            >
              View Full Product Details →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
