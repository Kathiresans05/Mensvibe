const Order = require('../orders/Order.model');
const Product = require('../products/Product.model');
const User = require('../auth/User.model');

// @desc    Get dashboard KPI metrics & sales analytics
// @route   GET /api/admin/dashboard-stats
const getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Orders stats
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter((o) => o.orderStatus === 'ORDER_PLACED' || o.orderStatus === 'CONFIRMED').length;
    const deliveredOrders = allOrders.filter((o) => o.orderStatus === 'DELIVERED').length;

    // Inventory metrics
    const products = await Product.find();
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach((p) => {
      let pStock = 0;
      p.variants.forEach((v) => {
        pStock += v.stock;
      });
      totalStock += pStock;
      if (pStock === 0) outOfStockCount++;
      else if (pStock <= 5) lowStockCount++;
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        totalStock,
        lowStockCount,
        outOfStockCount,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all customers with order statistics
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await User.find(query).sort({ createdAt: -1 });

    // Aggregate orders for these customers
    const userIds = customers.map((c) => c._id);
    const orders = await Order.find({ user: { $in: userIds } });

    const customerList = customers.map((customer) => {
      const userOrders = orders.filter((o) => o.user.toString() === customer._id.toString());
      const totalSpend = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || 'N/A',
        addresses: customer.addresses || [],
        isActive: customer.isActive !== false,
        createdAt: customer.createdAt,
        totalOrders: userOrders.length,
        totalSpend,
      };
    });

    res.status(200).json({
      success: true,
      count: customerList.length,
      data: customerList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle customer active/blocked status
// @route   PATCH /api/admin/customers/:id/status
// @access  Private/Admin
const updateCustomerStatus = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer.isActive = !customer.isActive;
    await customer.save();

    res.status(200).json({
      success: true,
      message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: customer._id,
        isActive: customer.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all return requests
// @route   GET /api/admin/returns
// @access  Private/Admin
const getReturnRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {
      orderStatus: {
        $in: ['RETURN_REQUESTED', 'RETURN_APPROVED', 'RETURN_REJECTED', 'REFUNDED'],
      },
    };

    if (status && status !== 'all') {
      query.orderStatus = status.toUpperCase();
    }

    const returns = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject a return request
// @route   PATCH /api/admin/returns/:orderId/action
// @access  Private/Admin
const handleReturnAction = async (req, res, next) => {
  try {
    const { action, adminNote } = req.body; // action: 'approve' | 'reject'

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus !== 'RETURN_REQUESTED') {
      return res.status(400).json({
        success: false,
        message: 'Order is not in RETURN_REQUESTED state',
      });
    }

    if (action === 'approve') {
      order.orderStatus = 'RETURN_APPROVED';
      order.statusTimeline.push({
        status: 'RETURN_APPROVED',
        timestamp: new Date(),
        comment: adminNote || 'Return approved by admin. Refund will be processed within 5-7 business days.',
      });
    } else if (action === 'reject') {
      order.orderStatus = 'RETURN_REJECTED';
      order.statusTimeline.push({
        status: 'RETURN_REJECTED',
        timestamp: new Date(),
        comment: adminNote || 'Return request rejected by admin.',
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Use approve or reject.' });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Return request ${action}d successfully`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark refund as processed
// @route   PATCH /api/admin/returns/:orderId/refund
// @access  Private/Admin
const markRefundProcessed = async (req, res, next) => {
  try {
    const { refundNote } = req.body;

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus !== 'RETURN_APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Return must be approved before marking refund as processed',
      });
    }

    order.orderStatus = 'REFUNDED';
    order.paymentStatus = 'REFUNDED';
    order.statusTimeline.push({
      status: 'REFUNDED',
      timestamp: new Date(),
      comment: refundNote || 'Refund successfully processed to original payment method.',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Refund marked as processed',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getCustomers,
  updateCustomerStatus,
  getReturnRequests,
  handleReturnAction,
  markRefundProcessed,
};
