const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getCustomers,
  updateCustomerStatus,
  getReturnRequests,
  handleReturnAction,
  markRefundProcessed,
} = require('./admin.controller');
const {
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
} = require('../reviews/review.controller');
const { protect, adminOnly } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.use(protect, adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.get('/customers', getCustomers);
router.patch('/customers/:id/status', updateCustomerStatus);

// Returns & Refunds
router.get('/returns', getReturnRequests);
router.patch('/returns/:orderId/action', handleReturnAction);
router.patch('/returns/:orderId/refund', markRefundProcessed);

// Reviews
router.get('/reviews', getAllReviewsAdmin);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

const cloudinary = require('../../config/cloudinary');
const fs = require('fs');

// Image Upload Endpoint (Cloudinary)
router.post('/upload', upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'mensvibe_products',
      });
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    });

    const fileUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      urls: fileUrls,
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    next(error);
  }
});

module.exports = router;

