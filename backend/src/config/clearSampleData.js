const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Product = require('../modules/products/Product.model');
const Category = require('../modules/categories/Category.model');
const Review = require('../modules/reviews/Review.model');
const Coupon = require('../modules/coupons/Coupon.model');
const User = require('../modules/auth/User.model');
const Banner = require('../modules/banners/Banner.model');

async function clearSampleData() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dress_fashion_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete sample products
    const prodRes = await Product.deleteMany({});
    console.log(`🗑️ Deleted ${prodRes.deletedCount} sample products.`);

    // Delete sample categories
    const catRes = await Category.deleteMany({});
    console.log(`🗑️ Deleted ${catRes.deletedCount} sample categories.`);

    // Delete sample reviews
    const revRes = await Review.deleteMany({});
    console.log(`🗑️ Deleted ${revRes.deletedCount} sample reviews.`);

    // Delete sample coupons
    const coupRes = await Coupon.deleteMany({});
    console.log(`🗑️ Deleted ${coupRes.deletedCount} sample coupons.`);

    // Verify Admin & Banners are preserved
    const adminCount = await User.countDocuments({ role: 'admin' });
    const bannerCount = await Banner.countDocuments();
    console.log(`🛡️ Preserved ${adminCount} Admin User(s) and ${bannerCount} MensVibe Hero Banner(s).`);

    console.log('✅ Sample database records cleared successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error clearing sample data:', err);
    process.exit(1);
  }
}

clearSampleData();
