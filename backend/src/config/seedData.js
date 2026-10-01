const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });
const Product = require('../modules/products/Product.model');
const Category = require('../modules/categories/Category.model');

const categoriesToCreate = [
  { name: 'Shirts', slug: 'shirts', parentCategory: 'Men' },
  { name: 'Dresses', slug: 'dresses', parentCategory: 'Women' },
  { name: 'Kids T-Shirts', slug: 'kids-tshirts', parentCategory: 'Kids' }
];

const menImages = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
];
const womenImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=600&q=80'
];
const kidsImages = [
  'https://images.unsplash.com/photo-1519278409-1f56fdc40b33?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80'
];

const generateProducts = (count, gender, categoryId, images, prefix) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const mrp = Math.floor(Math.random() * 2000) + 1000;
    const sellingPrice = mrp - Math.floor(Math.random() * 500);
    products.push({
      name: `${prefix} Product ${i}`,
      slug: `${prefix.toLowerCase()}-product-${i}-${Date.now()}`,
      description: `Amazing ${gender.toLowerCase()} clothing item with premium quality.`,
      category: categoryId,
      gender: gender,
      mrp,
      sellingPrice,
      images: [images[i % images.length]],
      availableColors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }],
      availableSizes: ['M', 'L'],
      variants: [
        { sku: `${prefix}-M-${i}`, color: 'Black', size: 'M', stock: 20 },
        { sku: `${prefix}-L-${i}`, color: 'Black', size: 'L', stock: 20 }
      ],
      isPublished: true,
      ratingsAverage: 4.5,
      ratingsQuantity: Math.floor(Math.random() * 50)
    });
  }
  return products;
};

const runSeeder = async () => {
  try {
    // Load env variables from root backend folder
    require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected for Seeding');

    // Create Categories
    await Category.deleteMany();
    const createdCats = await Category.insertMany(categoriesToCreate);
    const menCatId = createdCats.find(c => c.parentCategory === 'Men')._id;
    const womenCatId = createdCats.find(c => c.parentCategory === 'Women')._id;
    const kidsCatId = createdCats.find(c => c.parentCategory === 'Kids')._id;

    // Create Products
    await Product.deleteMany();
    const menProducts = generateProducts(25, 'Men', menCatId, menImages, 'Men');
    const womenProducts = generateProducts(15, 'Women', womenCatId, womenImages, 'Women');
    const kidsProducts = generateProducts(10, 'Kids', kidsCatId, kidsImages, 'Kids');

    await Product.insertMany([...menProducts, ...womenProducts, ...kidsProducts]);
    console.log('Successfully seeded 25 Mens, 15 Womens, 10 Kids products.');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runSeeder();
