const Product = require('./Product.model');
const cloudinary = require('../../config/cloudinary');

const uploadImageIfNeeded = async (img) => {
  if (typeof img === 'string' && img.startsWith('data:image')) {
    const uploadRes = await cloudinary.uploader.upload(img, {
      folder: 'mensvibe_products',
    });
    return uploadRes.secure_url;
  }
  return img;
};

// @desc    Get products with filters, sorting, search & pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      gender,
      minPrice,
      maxPrice,
      sizes,
      colors,
      sort,
      isFeatured,
      isTrending,
      isNewArrival,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isPublished: true };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isTrending === 'true') query.isTrending = true;
    if (isNewArrival === 'true') query.isNewArrival = true;

    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    if (sizes) {
      const sizeArr = sizes.split(',');
      query['availableSizes'] = { $in: sizeArr };
    }

    if (colors) {
      const colorArr = colors.split(',');
      query['availableColors.name'] = { $in: colorArr };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { sellingPrice: 1 };
    else if (sort === 'price_desc') sortOption = { sellingPrice: -1 };
    else if (sort === 'rating') sortOption = { ratingsAverage: -1 };
    else if (sort === 'discount') sortOption = { discountPercentage: -1 };
    else if (sort === 'popular') sortOption = { ratingsQuantity: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug parentCategory')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true })
      .populate('category', 'name slug parentCategory');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, images, ...rest } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    let processedImages = [];
    if (images && Array.isArray(images)) {
      processedImages = await Promise.all(images.map(uploadImageIfNeeded));
    }

    const product = await Product.create({
      name,
      slug,
      images: processedImages,
      ...rest,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = await Promise.all(updateData.images.map(uploadImageIfNeeded));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
