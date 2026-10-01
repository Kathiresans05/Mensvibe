const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'Shop Now',
    },
    linkUrl: {
      type: String,
      default: '/shop',
    },
    desktopImage: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
