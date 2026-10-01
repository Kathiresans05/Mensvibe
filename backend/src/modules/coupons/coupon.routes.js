const express = require('express');
const router = express.Router();
const { applyCoupon, getCoupons, createCoupon, deleteCoupon } = require('./coupon.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.post('/apply', protect, applyCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
