const Product = require('../products/Product.model');

// @desc    Get complete inventory summary & variant stock list
// @route   GET /api/inventory
// @access  Private/Admin
const getInventory = async (req, res, next) => {
  try {
    const { search, status, category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'variants.sku': { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 });

    let totalUnits = 0;
    let totalSkus = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const inventoryList = [];

    products.forEach((product) => {
      product.variants.forEach((v) => {
        totalUnits += v.stock;
        totalSkus += 1;

        let stockStatus = 'in_stock';
        if (v.stock <= 0) {
          stockStatus = 'out_of_stock';
          outOfStockCount += 1;
        } else if (v.stock <= 5) {
          stockStatus = 'low_stock';
          lowStockCount += 1;
        }

        // Apply status filter if supplied
        if (!status || status === 'all' || status === stockStatus) {
          inventoryList.push({
            productId: product._id,
            productName: product.name,
            productSlug: product.slug,
            image: product.images?.[0] || '',
            category: product.category?.name || 'Uncategorized',
            sellingPrice: product.sellingPrice,
            mrp: product.mrp,
            variantId: v._id,
            sku: v.sku,
            color: v.color,
            colorCode: v.colorCode,
            size: v.size,
            stock: v.stock,
            reservedStock: v.reservedStock || 0,
            availableStock: Math.max(0, v.stock - (v.reservedStock || 0)),
            status: stockStatus,
            updatedAt: product.updatedAt,
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUnits,
        totalSkus,
        lowStockCount,
        outOfStockCount,
      },
      count: inventoryList.length,
      data: inventoryList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock for a specific product variant
// @route   PATCH /api/inventory/:productId/variant/:variantId
// @access  Private/Admin
const updateVariantStock = async (req, res, next) => {
  try {
    const { productId, variantId } = req.params;
    const { stock, adjustment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    if (typeof stock === 'number') {
      variant.stock = Math.max(0, stock);
    } else if (typeof adjustment === 'number') {
      variant.stock = Math.max(0, variant.stock + adjustment);
    } else {
      return res.status(400).json({ success: false, message: 'Provide either stock or adjustment number' });
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId: product._id,
        variantId: variant._id,
        sku: variant.sku,
        newStock: variant.stock,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventory,
  updateVariantStock,
};
