const Cart = require('./Cart.model');
const Product = require('../products/Product.model');

// @desc    Get current user's cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update item in cart
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, variantSku, color, size, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check variant stock
    const variant = product.variants.find((v) => v.sku === variantSku || (v.color === color && v.size === size));
    if (!variant || variant.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Selected size/color is out of stock' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color && item.size === size
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        variantSku: variant.sku,
        color,
        size,
        quantity: Number(quantity),
        price: product.sellingPrice,
      });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
const removeCartItem = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items.pull(req.params.itemId);
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { new: true }
    );
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
