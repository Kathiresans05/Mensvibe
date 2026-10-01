const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Banner = require('../modules/banners/Banner.model');

async function updateBanners() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dress_fashion_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Remove old/mixed banners to ensure clean set of 4 banners
    await Banner.deleteMany({});

    const bannersData = [
      {
        order: 1,
        title: 'The Resort & Linen Capsule',
        subtitle: 'Relaxed Striped Shirts, Tailored Linen Trousers & Effortless Style',
        buttonText: 'Explore Men\'s Collection',
        linkUrl: '/shop?gender=Men',
        desktopImage: '/banners/hero_slide_1.jpg',
        mobileImage: '/banners/hero_slide_1.jpg',
        isActive: true,
      },
      {
        order: 2,
        title: 'Trendy Pants & Urban Chinos',
        subtitle: 'Pleated Trousers, Relaxed Korean Fits & Premium Cargo Pants',
        buttonText: 'Shop Trendy Pants',
        linkUrl: '/shop?keyword=pants',
        desktopImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1920&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85',
        isActive: true,
      },
      {
        order: 3,
        title: 'Royal Heritage Kurtas',
        subtitle: 'Handwoven Jacquard Silk & Celebratory Festive Wear for Men',
        buttonText: 'Explore Ethnic',
        linkUrl: '/shop?gender=Men',
        desktopImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1920&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=85',
        isActive: true,
      },
      {
        order: 4,
        title: 'Casual Vibes & Linens',
        subtitle: 'Breathable Cotton Shirts, Relaxed Fits & Contemporary Streetwear',
        buttonText: 'Discover Casuals',
        linkUrl: '/shop?gender=Men',
        desktopImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1920&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=85',
        isActive: true,
      },
    ];

    await Banner.insertMany(bannersData);

    const banners = await Banner.find().sort({ order: 1 });
    console.log(`✅ Successfully seeded ${banners.length} MensVibe Banners:`);
    banners.forEach((b) => console.log(`[Slide #${b.order}] ${b.title} -> ${b.subtitle}`));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating banners:', err);
    process.exit(1);
  }
}

updateBanners();
