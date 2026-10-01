const express = require('express');
const router = express.Router();
const { getInventory, updateVariantStock } = require('./inventory.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.use(protect, adminOnly);

router.get('/', getInventory);
router.patch('/:productId/variant/:variantId', updateVariantStock);

module.exports = router;
