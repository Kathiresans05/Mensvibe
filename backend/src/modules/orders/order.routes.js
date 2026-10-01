const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  requestReturn,
} = require('./order.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.post('/:orderId/return', requestReturn);
router.get('/admin/all', adminOnly, getAllOrdersAdmin);
router.put('/admin/:orderId/status', adminOnly, updateOrderStatusAdmin);
router.get('/:orderId', getOrderById);

module.exports = router;
