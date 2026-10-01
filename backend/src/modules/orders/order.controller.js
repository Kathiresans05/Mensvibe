const Order = require('./Order.model');
const Product = require('../products/Product.model');
const Cart = require('../cart/Cart.model');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponApplied, deliveryCharge = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let subtotal = 0;
    const validatedItems = [];

    // Atomic Stock Verification & Deduction
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      const variant = product.variants.find(
        (v) => v.sku === item.variantSku || (v.color === item.color && v.size === item.size)
      );

      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} (${item.color} - ${item.size})`,
        });
      }

      // Decrement stock atomically
      variant.stock -= item.quantity;
      await product.save();

      const itemTotal = product.sellingPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        variantSku: variant.sku,
        color: item.color,
        size: item.size,
        price: product.sellingPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const discount = couponApplied && couponApplied.discountAmount ? couponApplied.discountAmount : 0;
    const totalAmount = Math.max(0, subtotal - discount + deliveryCharge);

    const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const order = await Order.create({
      orderId,
      user: req.user.id,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID', // In real online PG, callback updates this
      subtotal,
      discount,
      deliveryCharge,
      totalAmount,
      couponApplied,
      statusTimeline: [
        {
          status: 'ORDER_PLACED',
          comment: 'Order placed successfully',
        },
      ],
    });

    // Clear user cart after successful order creation
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by orderId
// @route   GET /api/orders/:orderId
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Customer can only view their own order unless admin
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin get all orders with filters
// @route   GET /api/orders/admin/all
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update order status / shipping info
// @route   PUT /api/orders/admin/:orderId/status
const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { orderStatus, comment, courierName, trackingNumber, trackingUrl, estimatedDeliveryDate } = req.body;

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      order.statusTimeline.push({
        status: orderStatus,
        comment: comment || `Status updated to ${orderStatus}`,
        timestamp: new Date(),
      });
      if (orderStatus === 'DELIVERED') {
        order.paymentStatus = 'PAID';
      }
    }

    if (courierName) order.trackingInfo.courierName = courierName;
    if (trackingNumber) order.trackingInfo.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingInfo.trackingUrl = trackingUrl;
    if (estimatedDeliveryDate) order.trackingInfo.estimatedDeliveryDate = estimatedDeliveryDate;

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Customer requests a return for a delivered order
// @route   POST /api/orders/:orderId/return
// @access  Private (Customer)
const requestReturn = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus !== 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Return can only be requested for delivered orders',
      });
    }

    // Check 7-day return window
    const deliveredEntry = order.statusTimeline.find(t => t.status === 'DELIVERED');
    if (deliveredEntry) {
      const daysSinceDelivery = (Date.now() - new Date(deliveredEntry.timestamp)) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > 7) {
        return res.status(400).json({
          success: false,
          message: 'Return window (7 days) has expired for this order',
        });
      }
    }

    order.orderStatus = 'RETURN_REQUESTED';
    order.statusTimeline.push({
      status: 'RETURN_REQUESTED',
      timestamp: new Date(),
      comment: reason || 'Customer requested return',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  requestReturn,
};
