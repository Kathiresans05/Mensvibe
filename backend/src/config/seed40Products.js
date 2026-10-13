const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Product = require('../modules/products/Product.model');
const Category = require('../modules/categories/Category.model');
const cloudinary = require('../config/cloudinary');

const categoriesData = [
  { name: 'Casual Shirts', slug: 'casual-shirts', parentCategory: 'Men', description: 'Premium casual and linen shirts for everyday elegance.' },
  { name: 'Formal Suits & Blazers', slug: 'formal-suits-blazers', parentCategory: 'Men', description: 'Tailored Italian cut suits, tuxedos and formal blazers.' },
  { name: 'Ethnic Kurtas & Sherwanis', slug: 'ethnic-kurtas-sherwanis', parentCategory: 'Men', description: 'Traditional silk kurtas, bundis and wedding sherwanis.' },
  { name: 'Oversized Tees & Polos', slug: 'tees-and-polos', parentCategory: 'Men', description: 'Heavyweight graphic t-shirts, vintage tees and luxury polos.' },
  { name: 'Denim & Cargo Trousers', slug: 'denim-cargo-trousers', parentCategory: 'Men', description: 'Selvedge denim jeans, relaxed chinos and tactical cargo pants.' },
  { name: 'Jackets & Streetwear', slug: 'jackets-streetwear', parentCategory: 'Men', description: 'Bomber jackets, leather biker jackets and winter trench coats.' },
  { name: 'Designer Dresses & Gowns', slug: 'designer-dresses-gowns', parentCategory: 'Women', description: 'Evening gowns, cocktail dresses and elegant maxi dresses.' },
  { name: 'Ethnic Sarees & Kurtis', slug: 'ethnic-sarees-kurtis', parentCategory: 'Women', description: 'Banarasi silk sarees, Anarkali suits and Chikankari kurtis.' },
  { name: 'Kids Festive & Casuals', slug: 'kids-festive-casuals', parentCategory: 'Kids', description: 'Comfortable cotton wear and party outfits for kids.' },
];

const productsData = [
  // --- MEN: CASUAL SHIRTS (5) ---
  {
    name: 'Cuban Collar Pure Linen Shirt',
    categorySlug: 'casual-shirts',
    gender: 'Men',
    mrp: 2999,
    sellingPrice: 1799,
    description: 'Crafted from 100% French flax linen, this relaxed-fit Cuban collar shirt offers breathability and refined resort style.',
    colors: [{ name: 'Sage Green', hex: '#8A9A86' }, { name: 'Sand Beige', hex: '#D2B48C' }, { name: 'Pure White', hex: '#F8F9FA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% French Linen' }, { title: 'Fit', value: 'Relaxed Fit' }, { title: 'Collar', value: 'Cuban / Camp Collar' }, { title: 'Care', value: 'Machine wash cold' }],
    isFeatured: true,
    isTrending: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 42
  },
  {
    name: 'Vintage Corduroy Overshirt',
    categorySlug: 'casual-shirts',
    gender: 'Men',
    mrp: 3499,
    sellingPrice: 2199,
    description: 'Textured 14-wale cotton corduroy overshirt with twin flap pockets and tortoise-shell buttons. Perfect for effortless layering.',
    colors: [{ name: 'Rust Orange', hex: '#C04000' }, { name: 'Olive Green', hex: '#4B5320' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Cotton Corduroy' }, { title: 'Fit', value: 'Regular / Layering Fit' }, { title: 'Sleeve', value: 'Long Sleeve' }],
    isFeatured: false,
    isTrending: true,
    ratingsAverage: 4.7,
    ratingsQuantity: 31
  },
  {
    name: 'Japanese Oxford Cotton Button-Down',
    categorySlug: 'casual-shirts',
    gender: 'Men',
    mrp: 2799,
    sellingPrice: 1699,
    description: 'Heavyweight organic Oxford cloth woven for longevity and comfort. Finished with mother-of-pearl buttons and box pleat.',
    colors: [{ name: 'Sky Blue', hex: '#87CEEB' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Charcoal', hex: '#36454F' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: 'Organic Oxford Cotton' }, { title: 'Collar', value: 'Button-Down' }, { title: 'Pattern', value: 'Solid' }],
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 58
  },
  {
    name: 'Camp Collar Hawaiian Botanical Print Shirt',
    categorySlug: 'casual-shirts',
    gender: 'Men',
    mrp: 2499,
    sellingPrice: 1499,
    description: 'Lightweight modal rayon printed with tropical jungle flora. Silky drape and cool hand-feel for holiday vibes.',
    colors: [{ name: 'Navy Multi', hex: '#1B263B' }, { name: 'Cream Black', hex: '#E0E1DD' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Viscose Rayon' }, { title: 'Pattern', value: 'Botanical Print' }, { title: 'Fit', value: 'Boxy Fit' }],
    isFeatured: true,
    ratingsAverage: 4.5,
    ratingsQuantity: 24
  },
  {
    name: 'Brushed Flannel Tartan Plaid Shirt',
    categorySlug: 'casual-shirts',
    gender: 'Men',
    mrp: 2899,
    sellingPrice: 1799,
    description: 'Double-brushed flannel shirt woven with authentic tartan checks. Extra warm and cozy for chillier evenings.',
    colors: [{ name: 'Crimson Red', hex: '#990000' }, { name: 'Forest Green', hex: '#228B22' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Brushed Cotton' }, { title: 'Pattern', value: 'Tartan Plaid' }, { title: 'Weight', value: '280 GSM' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 37
  },

  // --- MEN: FORMAL SUITS & BLAZERS (5) ---
  {
    name: 'Italian Merino Wool Tuxedo Suit (2-Piece)',
    categorySlug: 'formal-suits-blazers',
    gender: 'Men',
    mrp: 14999,
    sellingPrice: 8999,
    description: 'Handcrafted luxury tuxedo tailored in Super 120s Italian wool with silk satin shawl lapels and tapered trousers.',
    colors: [{ name: 'Midnight Black', hex: '#0A0A0A' }, { name: 'Royal Navy', hex: '#000080' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: 'Super 120s Italian Merino Wool' }, { title: 'Lapel', value: 'Satin Shawl Collar' }, { title: 'Pieces', value: 'Jacket + Trousers' }],
    isFeatured: true,
    isTrending: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 64
  },
  {
    name: 'Textured Houndstooth Tweed Blazer',
    categorySlug: 'formal-suits-blazers',
    gender: 'Men',
    mrp: 7999,
    sellingPrice: 4899,
    description: 'Heritage houndstooth wool-blend sports blazer featuring notch lapels, elbow patches, and brass crest buttons.',
    colors: [{ name: 'Charcoal Grey', hex: '#36454F' }, { name: 'Earthy Brown', hex: '#5C4033' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Material', value: 'Wool & Cashmere Blend' }, { title: 'Style', value: 'Double Vent British Cut' }],
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 28
  },
  {
    name: 'Slim Fit Double-Breasted Linen Blazer',
    categorySlug: 'formal-suits-blazers',
    gender: 'Men',
    mrp: 6999,
    sellingPrice: 4199,
    description: 'Contemporary double-breasted jacket made from pure breathable linen in a timeless tailored silhouette.',
    colors: [{ name: 'Ivory White', hex: '#FFFFF0' }, { name: 'Camel Tan', hex: '#C19A6B' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Material', value: '100% Pure Linen' }, { title: 'Buttons', value: '6-Button Double Breasted' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 19
  },
  {
    name: 'Formal Pleated Dress Trousers',
    categorySlug: 'formal-suits-blazers',
    gender: 'Men',
    mrp: 3299,
    sellingPrice: 1999,
    description: 'High-waisted gurkha style trousers with double forward pleats and adjustable side tabs. Timeless sartorial elegance.',
    colors: [{ name: 'Charcoal Grey', hex: '#2F4F4F' }, { name: 'Classic Navy', hex: '#000033' }, { name: 'Beige Khaki', hex: '#C3B091' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Waist', value: 'High Rise with Side Fasteners' }, { title: 'Fit', value: 'Tailored Taper' }],
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 44
  },
  {
    name: 'Velvet Evening Smoking Jacket',
    categorySlug: 'formal-suits-blazers',
    gender: 'Men',
    mrp: 9999,
    sellingPrice: 5999,
    description: 'Plush midnight velvet jacket with contrast satin lapels. Designed for gala evenings, cocktail parties, and formal soirees.',
    colors: [{ name: 'Deep Burgundy', hex: '#800020' }, { name: 'Emerald Green', hex: '#50C878' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: 'Premium Silk Velvet' }, { title: 'Lining', value: 'Jacquard Viscose' }],
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 22
  },

  // --- MEN: ETHNIC KURTAS & SHERWANIS (5) ---
  {
    name: 'Raw Silk Embroidered Bundi & Kurta Set',
    categorySlug: 'ethnic-kurtas-sherwanis',
    gender: 'Men',
    mrp: 7999,
    sellingPrice: 4599,
    description: 'Royal Chanderi silk kurta paired with intricate thread embroidered Nehru jacket (Bundi) and matching churidar pants.',
    colors: [{ name: 'Mustard Gold', hex: '#FFDB58' }, { name: 'Mint Green', hex: '#98FF98' }, { name: 'Crimson Red', hex: '#DC143C' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: 'Chanderi Silk & Raw Silk' }, { title: 'Occasion', value: 'Wedding & Festive' }, { title: 'Pieces', value: 'Kurta + Jacket + Churidar' }],
    isFeatured: true,
    isTrending: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 53
  },
  {
    name: 'Chikankari Handcrafted Georgette Kurta',
    categorySlug: 'ethnic-kurtas-sherwanis',
    gender: 'Men',
    mrp: 4499,
    sellingPrice: 2699,
    description: 'Authentic Lucknowi shadow-work Chikankari embroidery on soft georgette. Comes with cotton mulmul inner lining.',
    colors: [{ name: 'Pastel Peach', hex: '#FFDAB9' }, { name: 'Powder Blue', hex: '#B0E0E6' }, { name: 'Pristine White', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Embroidery', value: 'Handmade Lucknowi Chikankari' }, { title: 'Fabric', value: 'Georgette with Cotton Inner' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 39
  },
  {
    name: 'Royal Heritage Brocade Sherwani',
    categorySlug: 'ethnic-kurtas-sherwanis',
    gender: 'Men',
    mrp: 18999,
    sellingPrice: 11999,
    description: 'Opulent Banarasi zari brocade sherwani with antique metal buttons and hand-embroidered mandarin collar. Designed for grooms.',
    colors: [{ name: 'Antique Gold', hex: '#CFB53B' }, { name: 'Royal Ivory', hex: '#FFFFF0' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Work', value: 'Banarasi Zari Brocade' }, { title: 'Fit', value: 'Royal Tailored' }],
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 18
  },
  {
    name: 'Asymmetric Modern Indo-Western Kurta',
    categorySlug: 'ethnic-kurtas-sherwanis',
    gender: 'Men',
    mrp: 3999,
    sellingPrice: 2299,
    description: 'Contemporary drape kurta featuring an asymmetric overlap hem and metallic front zipper. Modern fusion style.',
    colors: [{ name: 'Jet Black', hex: '#000000' }, { name: 'Steel Grey', hex: '#708090' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Style', value: 'Indo-Western Asymmetric' }, { title: 'Fabric', value: 'Poly-Viscose Lycra' }],
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 27
  },
  {
    name: 'Pure Khadi Cotton Short Casual Kurta',
    categorySlug: 'ethnic-kurtas-sherwanis',
    gender: 'Men',
    mrp: 1999,
    sellingPrice: 1199,
    description: 'Breathable hand-spun Khadi cotton short kurta with roll-up sleeves and mandarin collar. Everyday comfort.',
    colors: [{ name: 'Indigo Blue', hex: '#4B0082' }, { name: 'Earth Ochre', hex: '#CC7722' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Handloom Khadi Cotton' }, { title: 'Length', value: 'Short / Hip Length' }],
    isFeatured: false,
    ratingsAverage: 4.5,
    ratingsQuantity: 61
  },

  // --- MEN: OVERSIZED TEES & POLOS (5) ---
  {
    name: 'Heavyweight Acid Wash Oversized T-Shirt',
    categorySlug: 'tees-and-polos',
    gender: 'Men',
    mrp: 1999,
    sellingPrice: 1099,
    description: '240 GSM combed cotton vintage acid-washed streetwear t-shirt with drop-shoulder cut and ribbed collar.',
    colors: [{ name: 'Washed Charcoal', hex: '#2B2B2B' }, { name: 'Vintage Olive', hex: '#556B2F' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Weight', value: '240 GSM Heavy Cotton' }, { title: 'Fit', value: 'Drop Shoulder Oversized' }],
    isFeatured: true,
    isTrending: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 88
  },
  {
    name: 'Mercerized Pima Cotton Luxury Polo',
    categorySlug: 'tees-and-polos',
    gender: 'Men',
    mrp: 2799,
    sellingPrice: 1699,
    description: 'Crafted from long-staple Peruvian Pima cotton with double mercerization for a silky luster and supreme softness.',
    colors: [{ name: 'Navy Blue', hex: '#000080' }, { name: 'Burgundy', hex: '#800020' }, { name: 'Crisp White', hex: '#FFFFFF' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Mercerized Pima Cotton' }, { title: 'Collar', value: 'Self-fabric Knit Polo Collar' }],
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 45
  },
  {
    name: 'Tokyo Cyberpunk Back-Print Graphic Tee',
    categorySlug: 'tees-and-polos',
    gender: 'Men',
    mrp: 1799,
    sellingPrice: 999,
    description: 'High-definition screen printed futuristic typography and neo-Tokyo illustration across the back. Bio-washed 100% cotton.',
    colors: [{ name: 'Pitch Black', hex: '#0B0B0B' }, { name: 'Ghost White', hex: '#F8F8FF' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Print', value: 'High Density Screen Print' }, { title: 'Fabric', value: '100% Bio-Washed Cotton' }],
    isFeatured: false,
    isTrending: true,
    ratingsAverage: 4.6,
    ratingsQuantity: 72
  },
  {
    name: 'Waffle Knit Thermal Long Sleeve Henley',
    categorySlug: 'tees-and-polos',
    gender: 'Men',
    mrp: 2299,
    sellingPrice: 1399,
    description: 'Breathable honeycomb waffle knit with 3-button placket. Warm yet lightweight base layer for weekend loungewear.',
    colors: [{ name: 'Oatmeal Heather', hex: '#D7C4B7' }, { name: 'Dark Moss', hex: '#4A5D4E' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Knit', value: 'Waffle Honeycomb Texture' }, { title: 'Neckline', value: '3-Button Henley' }],
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 33
  },
  {
    name: 'Retro Striped Knitted Resort Polo',
    categorySlug: 'tees-and-polos',
    gender: 'Men',
    mrp: 2999,
    sellingPrice: 1799,
    description: 'Italian 60s inspired open-collar sweater polo with horizontal jacquard stripes and ribbed hem. Effortless riviera chic.',
    colors: [{ name: 'Cream & Espresso', hex: '#FAF0E6' }, { name: 'Navy & Rust', hex: '#00205B' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Breathable Cotton Knit' }, { title: 'Style', value: 'Johnny Collar Knit' }],
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 29
  },

  // --- MEN: DENIM & CARGO TROUSERS (4) ---
  {
    name: '14oz Raw Japanese Selvedge Denim Jeans',
    categorySlug: 'denim-cargo-trousers',
    gender: 'Men',
    mrp: 5999,
    sellingPrice: 3499,
    description: 'Woven on vintage shuttle looms in Okayama. Pure indigo dyed unwashed denim designed to develop personalized fades with wear.',
    colors: [{ name: 'Deep Indigo', hex: '#1F2444' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Denim', value: '14oz Red-Line Selvedge' }, { title: 'Fit', value: 'Classic Straight Fit' }, { title: 'Hardware', value: 'Solid Copper Rivets' }],
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 57
  },
  {
    name: 'Multi-Pocket Tactical Cargo Pants',
    categorySlug: 'denim-cargo-trousers',
    gender: 'Men',
    mrp: 3499,
    sellingPrice: 1999,
    description: 'Durable ripstop cotton cargo pants with 8 utility pockets, knee articulation, and adjustable ankle bungee cords.',
    colors: [{ name: 'Olive Drab', hex: '#6B8E23' }, { name: 'Matte Black', hex: '#1C1C1C' }, { name: 'Desert Khaki', hex: '#C2B280' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: 'Reinforced Cotton Ripstop' }, { title: 'Pockets', value: '8 Functional Pockets' }],
    isFeatured: false,
    isTrending: true,
    ratingsAverage: 4.7,
    ratingsQuantity: 62
  },
  {
    name: 'Vintage Distressed Light Wash Jeans',
    categorySlug: 'denim-cargo-trousers',
    gender: 'Men',
    mrp: 3799,
    sellingPrice: 2199,
    description: '90s skater aesthetic baggy jeans with hand-sanded fading, subtle distressing at knees, and relaxed wide leg opening.',
    colors: [{ name: 'Ice Blue', hex: '#AFEEEE' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fit', value: 'Wide Leg / Relaxed Skater' }, { title: 'Wash', value: 'Stone Washed Bleach' }],
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 39
  },
  {
    name: 'Smart Stretch Tailored Chino Trousers',
    categorySlug: 'denim-cargo-trousers',
    gender: 'Men',
    mrp: 2999,
    sellingPrice: 1799,
    description: 'Sateen cotton twill infused with 3% spandex for 360-degree all-day comfort. Clean flat front styling for office and dining.',
    colors: [{ name: 'Slate Grey', hex: '#708090' }, { name: 'Navy', hex: '#000080' }, { name: 'British Khaki', hex: '#F0E68C' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '97% Cotton, 3% Elastane' }, { title: 'Fit', value: 'Slim Straight' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 41
  },

  // --- MEN: JACKETS & STREETWEAR (4) ---
  {
    name: 'Top Grain Nappa Leather Biker Jacket',
    categorySlug: 'jackets-streetwear',
    gender: 'Men',
    mrp: 12999,
    sellingPrice: 7999,
    description: 'Buttery soft genuine lambskin leather motorcycle jacket with asymmetrical silver hardware, quilted shoulder panels, and belted waist.',
    colors: [{ name: 'Classic Black', hex: '#111111' }, { name: 'Vintage Dark Brown', hex: '#3E2723' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Material', value: '100% Genuine Lambskin Leather' }, { title: 'Zippers', value: 'Heavy Duty YKK Metal Zips' }],
    isFeatured: true,
    isTrending: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 36
  },
  {
    name: '450 GSM French Terry Boxy Hoodie',
    categorySlug: 'jackets-streetwear',
    gender: 'Men',
    mrp: 3499,
    sellingPrice: 1999,
    description: 'Ultra-heavy 450 GSM combed cotton loopback fleece. Seamless double-layered hood, kangaroo pocket, and hidden stash pocket.',
    colors: [{ name: 'Washed Ash', hex: '#B2BEB5' }, { name: 'Jet Black', hex: '#000000' }, { name: 'Mocha Brown', hex: '#4A3B32' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '450 GSM French Terry Cotton' }, { title: 'Fit', value: 'Cropped Boxy Silhouette' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 74
  },
  {
    name: 'Classic Double-Breasted Wool Trench Coat',
    categorySlug: 'jackets-streetwear',
    gender: 'Men',
    mrp: 9999,
    sellingPrice: 5999,
    description: 'Timeless British military-inspired overcoat in heavy melton wool blend. Features storm flap, waist belt, and horn buttons.',
    colors: [{ name: 'Camel Tan', hex: '#C19A6B' }, { name: 'Charcoal Black', hex: '#1C1C1C' }],
    sizes: ['M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '70% Wool, 30% Polyamide' }, { title: 'Length', value: 'Knee-Length Overcoat' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 21
  },
  {
    name: 'Reversible Nylon Flight Bomber Jacket (MA-1)',
    categorySlug: 'jackets-streetwear',
    gender: 'Men',
    mrp: 4499,
    sellingPrice: 2799,
    description: 'Flight-grade water resistant nylon shell with emergency orange inner lining. Utility sleeve pocket and thick rib-knit trims.',
    colors: [{ name: 'Sage Olive', hex: '#556B2F' }, { name: 'Midnight Navy', hex: '#000080' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Shell', value: 'Water-Repellent Flight Nylon' }, { title: 'Insulation', value: 'Polyfill Warmth' }],
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 49
  },

  // --- WOMEN: DESIGNER DRESSES & GOWNS (5) ---
  {
    name: 'Emerald Green Silk Slip Maxi Dress',
    categorySlug: 'designer-dresses-gowns',
    gender: 'Women',
    mrp: 4999,
    sellingPrice: 2899,
    description: 'Sensual cowl neckline and fluid bias-cut silk silhouette. Delicate adjustable criss-cross back straps with a dramatic side slit.',
    colors: [{ name: 'Emerald Green', hex: '#046307' }, { name: 'Champagne Gold', hex: '#F7E7CE' }, { name: 'Noir Black', hex: '#111111' }],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: 'Silk Satin Charmeuse' }, { title: 'Neckline', value: 'Draped Cowl' }, { title: 'Cut', value: 'Bias-Cut Maxi' }],
    isFeatured: true,
    isTrending: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 67
  },
  {
    name: 'French Floral Embroidered Midi Sundress',
    categorySlug: 'designer-dresses-gowns',
    gender: 'Women',
    mrp: 3799,
    sellingPrice: 2199,
    description: 'Sweetheart neckline with smocked back bodice and delicate puff sleeves. Romantic prairie floral print on breathable cotton voile.',
    colors: [{ name: 'Blush Floral', hex: '#FFB6C1' }, { name: 'Cornflower Blue', hex: '#6495ED' }],
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Cotton Voile' }, { title: 'Silhouette', value: 'A-Line Midi' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 38
  },
  {
    name: 'Sequined Plunge Evening Cocktail Gown',
    categorySlug: 'designer-dresses-gowns',
    gender: 'Women',
    mrp: 8999,
    sellingPrice: 5499,
    description: 'Dazzling hand-sewn micro sequins that reflect ambient light. Flattering plunge neck with supportive cups and mermaid train.',
    colors: [{ name: 'Rose Gold', hex: '#B76E79' }, { name: 'Silver Star', hex: '#C0C0C0' }],
    sizes: ['S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Details', value: 'High Shine Micro Sequins' }, { title: 'Closure', value: 'Concealed Back Zipper' }],
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 25
  },
  {
    name: 'Ruched Velvet Off-Shoulder Bodycon Dress',
    categorySlug: 'designer-dresses-gowns',
    gender: 'Women',
    mrp: 3999,
    sellingPrice: 2399,
    description: 'Luxe stretch velvet that hugs curves in all the right places. Elegant fold-over bardot neckline and all-over side ruching.',
    colors: [{ name: 'Wine Merlot', hex: '#722F37' }, { name: 'Midnight Blue', hex: '#191970' }],
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Material', value: 'Stretch Poly-Velvet' }, { title: 'Fit', value: 'Figure Sculpting Bodycon' }],
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 41
  },
  {
    name: 'Bohemian Tiered Linen Wrap Dress',
    categorySlug: 'designer-dresses-gowns',
    gender: 'Women',
    mrp: 3499,
    sellingPrice: 1999,
    description: 'Adjustable wrap tie waist, ruffled flutter sleeves, and cascading tiered hemline. Organic, easy breezy resort lifestyle.',
    colors: [{ name: 'Terracotta', hex: '#E2725B' }, { name: 'Mustard Yellow', hex: '#E1AD01' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Washed Linen' }, { title: 'Style', value: 'True Wrap Dress' }],
    isFeatured: false,
    ratingsAverage: 4.6,
    ratingsQuantity: 30
  },

  // --- WOMEN: ETHNIC SAREES & KURTIS (3) ---
  {
    name: 'Banarasi Katan Silk Zari Saree',
    categorySlug: 'ethnic-sarees-kurtis',
    gender: 'Women',
    mrp: 9999,
    sellingPrice: 5899,
    description: 'Heirloom quality pure Katan silk saree woven with intricate kadwa floral jaal in gold and silver zari. Comes with unstitched blouse piece.',
    colors: [{ name: 'Royal Crimson', hex: '#990000' }, { name: 'Peacock Teal', hex: '#008080' }],
    sizes: ['Free Size'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Weave', value: 'Banarasi Handloom Kadwa' }, { title: 'Saree Length', value: '5.5 Meters + 0.8M Blouse' }],
    isFeatured: true,
    ratingsAverage: 5.0,
    ratingsQuantity: 48
  },
  {
    name: 'Flared Anarkali Kurta Set with Organza Dupatta',
    categorySlug: 'ethnic-sarees-kurtis',
    gender: 'Women',
    mrp: 5999,
    sellingPrice: 3499,
    description: 'Floor-touch flared Georgette Anarkali decorated with gota patti borders, churidar bottom, and scalloped hand-painted organza dupatta.',
    colors: [{ name: 'Baby Pink', hex: '#F4C2C2' }, { name: 'Lavender', hex: '#E6E6FA' }],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Set Includes', value: 'Anarkali + Churidar + Dupatta' }, { title: 'Flare', value: '4.5 Meters Ghera' }],
    isFeatured: false,
    ratingsAverage: 4.8,
    ratingsQuantity: 34
  },
  {
    name: 'Straight Cut Mulmul Cotton Daily Kurti',
    categorySlug: 'ethnic-sarees-kurtis',
    gender: 'Women',
    mrp: 1799,
    sellingPrice: 999,
    description: 'Ultra-lightweight Jaipur block printed 100% mulmul cotton kurti with side slits and pocket. Perfect for work and casual outings.',
    colors: [{ name: 'Indigo White', hex: '#3F51B5' }, { name: 'Maroon Gold', hex: '#800000' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% Mulmul Cotton' }, { title: 'Print', value: 'Sanganeri Hand Block Print' }],
    isFeatured: false,
    ratingsAverage: 4.5,
    ratingsQuantity: 52
  },

  // --- KIDS: FESTIVE & CASUALS (4) ---
  {
    name: 'Boys 3-Piece Gentleman Tuxedo Suit Set',
    categorySlug: 'kids-festive-casuals',
    gender: 'Kids',
    mrp: 3499,
    sellingPrice: 1999,
    description: 'Adorable formal set for young boys including tailored blazer, smart trousers, crisp cotton shirt, and matching clip-on bowtie.',
    colors: [{ name: 'Royal Navy Blue', hex: '#000080' }, { name: 'Dapper Charcoal', hex: '#333333' }],
    sizes: ['XS', 'S', 'M'],
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdc40b33?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Set', value: 'Blazer + Shirt + Pant + Bowtie' }, { title: 'Age Group', value: '3 - 10 Years' }],
    isFeatured: true,
    ratingsAverage: 4.9,
    ratingsQuantity: 44
  },
  {
    name: 'Girls Twirl Tutu Floral Princess Frock',
    categorySlug: 'kids-festive-casuals',
    gender: 'Kids',
    mrp: 2799,
    sellingPrice: 1599,
    description: 'Multi-layer soft tulle skirt with embroidered bodice and back satin bow tie. Zero itching guaranteed with 100% cotton inner lining.',
    colors: [{ name: 'Fairy Pink', hex: '#FFC0CB' }, { name: 'Snow White', hex: '#FFFFFF' }],
    sizes: ['XS', 'S', 'M'],
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519278409-1f56fdc40b33?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Layers', value: '4 Layers Soft Tulle with Cotton Lining' }, { title: 'Occasion', value: 'Birthday & Weddings' }],
    isFeatured: true,
    ratingsAverage: 4.8,
    ratingsQuantity: 39
  },
  {
    name: 'Boys Silk Kurta Pajama & Nehru Jacket Set',
    categorySlug: 'kids-festive-casuals',
    gender: 'Kids',
    mrp: 2999,
    sellingPrice: 1699,
    description: 'Festive Jacquard woven Nehru bundi jacket paired with comfortable silk-blend kurta and elasticated churidar pajama.',
    colors: [{ name: 'Turquoise & Gold', hex: '#40E0D0' }, { name: 'Maroon & Cream', hex: '#800000' }],
    sizes: ['XS', 'S', 'M'],
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519278409-1f56fdc40b33?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Components', value: 'Kurta + Nehru Jacket + Pajama' }, { title: 'Comfort', value: 'Soft elastic waistband' }],
    isFeatured: false,
    ratingsAverage: 4.7,
    ratingsQuantity: 28
  },
  {
    name: 'Kids Organic Cotton Dino Graphic Tee & Shorts Set',
    categorySlug: 'kids-festive-casuals',
    gender: 'Kids',
    mrp: 1499,
    sellingPrice: 849,
    description: 'Playground ready 100% GOTS certified organic cotton t-shirt with glow-in-the-dark dinosaur print and comfy drawstring French terry shorts.',
    colors: [{ name: 'Jungle Olive & Grey', hex: '#556B2F' }, { name: 'Electric Blue', hex: '#7DF9FF' }],
    sizes: ['XS', 'S', 'M'],
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [{ title: 'Fabric', value: '100% GOTS Organic Cotton' }, { title: 'Fit', value: 'Regular Playwear' }],
    isFeatured: false,
    ratingsAverage: 4.9,
    ratingsQuantity: 51
  }
];

async function seed40Products() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // 1. Delete all old products
    const delProd = await Product.deleteMany({});
    console.log(`Deleted ${delProd.deletedCount} old products.`);

    // 2. Delete old categories and create fresh 9 rich categories
    await Category.deleteMany({});
    console.log('Cleared old categories.');

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Created ${createdCategories.length} categories.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    async function uploadToCloudinary(sourceUrl, name) {
      try {
        const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const base64 = 'data:image/jpeg;base64,' + buf.toString('base64');
        const clRes = await cloudinary.uploader.upload(base64, {
          folder: 'mensvibe_products',
          resource_type: 'image',
        });
        return clRes.secure_url;
      } catch (err) {
        console.error(`Failed to upload ${name} to Cloudinary:`, err.message);
        return null;
      }
    }

    // 3. Upload all 40 unique dress photos to Cloudinary and prepare products
    console.log('Uploading 40 unique dress images to your Cloudinary account (folder: mensvibe_products)...');
    const finalProducts = [];

    for (let index = 0; index < productsData.length; index++) {
      const item = productsData[index];
      const categoryId = categoryMap[item.categorySlug];
      const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + (index + 1);

      console.log(`[${index + 1}/${productsData.length}] Uploading "${item.name}" to Cloudinary...`);
      const cloudUrl = await uploadToCloudinary(item.images[0], item.name);
      const productImages = cloudUrl ? [cloudUrl] : item.images;

      // Generate variant combinations
      const variants = [];
      const prefix = item.name.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'M');

      item.colors.forEach((col) => {
        item.sizes.forEach((sz) => {
          variants.push({
            sku: `${prefix}-${col.name.slice(0, 3).toUpperCase()}-${sz}-${index + 1}`,
            color: col.name,
            colorCode: col.hex,
            size: sz,
            stock: Math.floor(Math.random() * 25) + 15,
            reservedStock: 0,
          });
        });
      });

      const discountPercentage = Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100);

      finalProducts.push({
        name: item.name,
        slug,
        description: item.description,
        specifications: item.specs || [],
        category: categoryId,
        gender: item.gender,
        mrp: item.mrp,
        sellingPrice: item.sellingPrice,
        discountPercentage,
        images: productImages,
        availableColors: item.colors,
        availableSizes: item.sizes,
        variants,
        isFeatured: !!item.isFeatured,
        isTrending: !!item.isTrending,
        isNewArrival: index % 3 === 0,
        isPublished: true,
        ratingsAverage: item.ratingsAverage || 4.7,
        ratingsQuantity: item.ratingsQuantity || 30,
      });
    }

    console.log(`Inserting ${finalProducts.length} high-quality fashion products...`);
    const inserted = await Product.insertMany(finalProducts);
    console.log(`Successfully added ${inserted.length} distinct dresses with Cloudinary URLs to MongoDB!`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
}

seed40Products();
