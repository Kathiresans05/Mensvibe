const Review = require('./Review.model');
const Order = require('../orders/Order.model');
const Product = require('../products/Product.model');

// @desc    Create a new review
// @route   POST /api/reviews/:productId
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    let { rating, title, reviewText, images } = req.body;
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    // Check if user has purchased this product (must have a delivered order)
    const hasPurchased = await Order.findOne({
      user: userId,
      'items.product': productId,
      orderStatus: 'DELIVERED',
    });

    // Handle images from multer or JSON
    let finalImages = [];
    if (req.files && req.files.length > 0) {
      finalImages = req.files.map((file) => `/uploads/${file.filename}`);
    } else if (req.file) {
      finalImages = [`/uploads/${req.file.filename}`];
    } else if (images) {
      if (Array.isArray(images)) {
        finalImages = images;
      } else if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          finalImages = Array.isArray(parsed) ? parsed : [images];
        } catch {
          finalImages = [images];
        }
      }
    }

    const review = await Review.create({
      rating: Number(rating) || 5,
      title: title || '',
      reviewText,
      images: finalImages,
      product: productId,
      user: userId,
      isVerifiedPurchase: !!hasPurchased,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review status (Approve/Hide)
// @route   PATCH /api/admin/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = req.body.isApproved;
    await review.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
