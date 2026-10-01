const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  color: { type: String, required: true },
  colorCode: { type: String, default: '#000000' },
  size: { type: String, required: true, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'] },
  stock: { type: Number, required: true, default: 0, min: 0 },
  reservedStock: { type: Number, default: 0, min: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    specifications: [
      {
        title: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Kids', 'Unisex'],
      default: 'Women',
    },
    mrp: {
      type: Number,
      required: [true, 'Please provide MRP'],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Please provide selling price'],
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    availableColors: [
      {
        name: { type: String, required: true },
        hex: { type: String, default: '#000000' },
      },
    ],
    availableSizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'],
      },
    ],
    variants: [variantSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate discount percentage before saving
productSchema.pre('save', function (next) {
  if (this.mrp && this.sellingPrice && this.mrp > this.sellingPrice) {
    this.discountPercentage = Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  } else {
    this.discountPercentage = 0;
  }
  next();
});

// Indexes for high performance search & filters
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, gender: 1, sellingPrice: 1 });

module.exports = mongoose.model('Product', productSchema);
