const express = require('express');
const router = express.Router();

const { createReview, getProductReviews } = require('./review.controller');
const { protect } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.post('/upload', protect, upload.array('images', 4), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
  }
  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.status(200).json({ success: true, urls });
});

router.route('/product/:productId').get(getProductReviews);
router.route('/:productId').post(protect, upload.array('images', 4), createReview);

module.exports = router;
