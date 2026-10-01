import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  X,
  Share2,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  ThumbsUp,
  Image as ImageIcon,
  Camera,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [added, setAdded] = useState(false);

  // Reviews state
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    reviewText: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      const res = await api.get(`/reviews/product/${productId}`);
      if (res.data.success) {
        setReviews(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const combined = [...selectedFiles, ...files].slice(0, 3);
    setSelectedFiles(combined);
    const previews = combined.map((f) => URL.createObjectURL(f));
    setFilePreviews(previews);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setSelectedImage(prod.images && prod.images.length > 0 ? prod.images[0] : '');
          if (prod.availableColors && prod.availableColors.length > 0) {
            setSelectedColor(prod.availableColors[0].name);
          }
          if (prod.availableSizes && prod.availableSizes.length > 0) {
            setSelectedSize(prod.availableSizes[0]);
          }
          fetchReviews(prod._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const formData = new FormData();
      formData.append('rating', Number(reviewForm.rating));
      formData.append('title', reviewForm.title || '');
      formData.append('reviewText', reviewForm.reviewText || '');

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post(`/reviews/${product._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setReviewSuccess('Thank you! Your verified review has been submitted.');
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess('');
          setReviewForm({ rating: 5, title: '', reviewText: '' });
          setSelectedFiles([]);
          setFilePreviews([]);
        }, 1800);
        fetchReviews(product._id);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-200 aspect-[3/4] rounded-3xl"></div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 w-3/4 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-1/4 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The garment you are looking for is currently unavailable.</p>
        <Link to="/shop" className="inline-block bg-brand-600 text-white text-xs font-bold px-6 py-3 rounded-full">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product._id);

  // Variant matching
  const currentVariant = (product.variants || []).find(
    (v) => (v.color === selectedColor || !selectedColor) && (v.size === selectedSize || !selectedSize)
  );
  const currentStock = currentVariant ? currentVariant.stock : 10;

  const handleAdd = async (goToCheckout = false) => {
    try {
      const sku = currentVariant ? currentVariant.sku : `${product.slug}-${selectedColor}-${selectedSize}`;
      await addToCart({
        productId: product._id,
        product,
        variantSku: sku,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });

      if (goToCheckout) {
        navigate('/checkout');
      } else {
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart');
    }
  };

  const checkPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus('Delivery available in 2-4 business days. COD eligible.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit postal code.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-gray-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery (Left) & Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: Gallery (Thumbnails + Main Image) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[600px] no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover object-top" />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Actions & Config */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Ratings */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <span className="bg-brand-50 text-brand-700 font-bold px-2.5 py-0.5 rounded-full uppercase">
                {product.category?.name || 'Exclusive'}
              </span>
              <a href="#reviews-section" className="flex items-center space-x-1.5 hover:opacity-80 transition-opacity">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  <span>
                    {reviews.length > 0
                      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
                      : (product.ratingsAverage ? product.ratingsAverage.toFixed(1) : '5.0')}
                  </span>
                </div>
                <span className="text-gray-400 font-medium">({reviews.length} reviews)</span>
              </a>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 pb-4 border-b border-gray-100">
            <span className="text-3xl font-black text-gray-900">
              ₹{product.sellingPrice?.toLocaleString('en-IN')}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-base text-gray-400 line-through">
                ₹{product.mrp?.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-emerald-600 font-bold">Inclusive of all taxes</span>
          </div>

          {/* Color Selector */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Color: <span className="font-semibold text-brand-600">{selectedColor}</span>
              </label>
              <div className="flex items-center space-x-3">
                {product.availableColors.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === col.name ? 'ring-2 ring-brand-500 ring-offset-2 scale-110 border-white' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector + Size Chart Modal Trigger */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Select Size: <span className="font-semibold text-brand-600">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSizeChart(true)}
                  className="text-xs text-brand-600 font-bold hover:underline flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.availableSizes.map((sz, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                      selectedSize === sz
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Live stock indicator */}
              <p className="text-[11px] text-gray-500 pt-1">
                {currentStock <= 5 && currentStock > 0 ? (
                  <span className="text-amber-600 font-bold">Hurry! Only {currentStock} left in stock.</span>
                ) : currentStock === 0 ? (
                  <span className="text-red-600 font-bold">Out of stock in this variant.</span>
                ) : (
                  <span className="text-emerald-600 font-medium">In Stock — Ready to ship</span>
                )}
              </p>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-700 font-bold hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all ${
                  isWished ? 'bg-rose-50 text-brand-600 border-brand-200' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-brand-600' : ''}`} />
              </button>
            </div>

            {/* Add to Bag and Buy Now Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleAdd(false)}
                disabled={currentStock === 0}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50'
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
                onClick={() => handleAdd(true)}
                disabled={currentStock === 0}
                className="py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 space-y-2.5">
            <label className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Check Delivery Pincode</span>
            </label>
            <form onSubmit={checkPincode} className="flex space-x-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit pincode"
                className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button type="submit" className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black">
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-[11px] font-semibold text-emerald-700">{pincodeStatus}</p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-brand-600" />
              <span>7-Day Return & Exchange</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>100% Quality Inspected</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Product Details</h3>
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews-section" className="pt-12 border-t border-gray-100 space-y-8 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">Client Testimonials</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Ratings &amp; Reviews</h2>
            <p className="text-xs text-gray-500 mt-1">Authentic experiences and craftsmanship reviews from our verified clients</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
              } else {
                setShowReviewModal(true);
              }
            }}
            className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-sm"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown & Summary Card */}
        <div className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center md:text-left space-y-2">
            <div className="flex items-baseline justify-center md:justify-start space-x-2">
              <span className="text-5xl font-black font-serif text-gray-900">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
                  : '5.0'}
              </span>
              <span className="text-lg text-gray-400 font-serif">/ 5.0</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Based on {reviews.length} customer review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Star percentage breakdown */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : star === 5 ? 100 : 0;
              return (
                <div key={star} className="flex items-center space-x-3 text-xs">
                  <span className="w-8 text-gray-600 font-bold flex items-center space-x-1">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-400 font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        {loadingReviews ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200/80 rounded-3xl p-8 space-y-3">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">No Reviews Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Be the first to share your experience wearing this atelier design with fellow collectors.
            </p>
            <button
              onClick={() => {
                if (!isAuthenticated) navigate('/login');
                else setShowReviewModal(true);
              }}
              className="inline-flex items-center space-x-2 text-brand-600 font-bold text-xs hover:underline mt-2"
            >
              <span>Share Your Review</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-xs hover:border-gray-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-bold flex items-center justify-center text-xs">
                        {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-gray-900">{rev.user?.name || 'Verified Client'}</p>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-200 fill-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.title && (
                    <h4 className="text-xs font-bold text-gray-900 font-serif">{rev.title}</h4>
                  )}
                  <p className="text-xs text-gray-600 leading-relaxed">{rev.reviewText}</p>

                  {rev.images && rev.images.length > 0 && (
                    <div className="flex items-center space-x-2 pt-2">
                      {rev.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Customer review photo"
                          className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-2xs"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <Ruler className="w-4 h-4 text-brand-600" />
                <span>Standard Garment Size Guide (Inches)</span>
              </h3>
              <button onClick={() => setShowSizeChart(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-800 font-bold">
                  <th className="p-2.5 rounded-l-lg">Size</th>
                  <th className="p-2.5">Bust/Chest</th>
                  <th className="p-2.5">Waist</th>
                  <th className="p-2.5">Hip</th>
                  <th className="p-2.5 rounded-r-lg">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                <tr><td className="p-2 font-bold text-gray-900">S</td><td>36</td><td>32</td><td>38</td><td>42</td></tr>
                <tr><td className="p-2 font-bold text-gray-900">M</td><td>38</td><td>34</td><td>40</td><td>43</td></tr>
                <tr><td className="p-2 font-bold text-gray-900">L</td><td>40</td><td>36</td><td>42</td><td>44</td></tr>
                <tr><td className="p-2 font-bold text-gray-900">XL</td><td>42</td><td>38</td><td>44</td><td>45</td></tr>
                <tr><td className="p-2 font-bold text-gray-900">XXL</td><td>44</td><td>40</td><td>46</td><td>45</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-gray-400 italic">
              *All measurements are in inches. Body measurements may vary by ±0.5 inches depending on silhouette.
            </p>
          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900">Review Your Garment</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{product.name}</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-gray-900">Review Submitted</h4>
                <p className="text-xs text-emerald-700">{reviewSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="flex flex-col flex-1 min-h-0">
                {/* Scrollable Form Body */}
                <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4 text-xs">
                  {reviewError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                      {reviewError}
                    </div>
                  )}

                  {/* Rating selection */}
                  <div className="space-y-1 text-center py-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Overall Rating *
                    </label>
                    <div className="flex items-center justify-center space-x-2 pt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              s <= (hoverRating || reviewForm.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 block pt-1">
                      {reviewForm.rating === 5
                        ? '5.0 - Exceptional Luxury'
                        : reviewForm.rating === 4
                        ? '4.0 - High Quality'
                        : reviewForm.rating === 3
                        ? '3.0 - Satisfactory'
                        : 'Needs Improvement'}
                    </span>
                  </div>

                  <div>
                    <label className="text-gray-700 font-semibold block mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.reviewText}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                      placeholder="Write your review about the dress quality, fabric feel, and fitting..."
                      className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-semibold block mb-1.5">
                      Upload Garment Photos (Optional)
                    </label>

                    {/* Drag & Drop / Click Upload Box */}
                    <div className="relative border-2 border-dashed border-gray-200 hover:border-brand-500/70 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-white group">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Upload photos"
                      />
                      <div className="space-y-1">
                        <div className="w-9 h-9 mx-auto bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Camera className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-gray-800">
                          Tap to take photos or choose from device
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Upload up to 3 photos of fit, fabric, or styling (JPG, PNG, WEBP)
                        </p>
                      </div>
                    </div>

                    {/* Thumbnail Previews */}
                    {filePreviews.length > 0 && (
                      <div className="flex items-center space-x-3 pt-3">
                        {filePreviews.map((preview, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-2xs group"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-rose-600 text-white rounded-full transition-colors"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {filePreviews.length < 3 && (
                          <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-500/70 flex flex-col items-center justify-center text-gray-400 hover:text-brand-600 cursor-pointer text-xs font-bold transition-colors">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/jpg"
                              multiple
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <span className="text-lg leading-none">+</span>
                            <span className="text-[9px] uppercase font-bold mt-0.5">Add</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Modal Footer (Submit Button Always Visible) */}
                <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 flex justify-end space-x-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold transition-all disabled:opacity-50 shadow-sm"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
