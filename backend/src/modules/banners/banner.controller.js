const Banner = require('./Banner.model');

// @desc    Get active banners for storefront
// @route   GET /api/banners
const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin/all
const getAllBannersAdmin = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner (Admin)
// @route   POST /api/banners
const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner (Admin)
// @route   PUT /api/banners/:id
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner (Admin)
// @route   DELETE /api/banners/:id
const deleteBanner = async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
};
