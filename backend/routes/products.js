// backend/routes/products.js
// Endpoint pentru căutarea și filtrarea produselor

const express = require('express');
const router = express.Router();
const { searchProducts, getProductById } = require('../services/productService');

/**
 * POST /api/products/search
 * Body: { category, color, size, maxPrice, city, smallBusinessOnly }
 * Response: { products: [...] }
 */
router.post('/search', (req, res) => {
  try {
    const filters = req.body;
    const products = searchProducts(filters);
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Eroare la căutarea produselor:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la căutarea produselor'
    });
  }
});

/**
 * GET /api/products/:id
 * Response: { product: {...} }
 */
router.get('/:id', (req, res) => {
  try {
    const product = getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produsul nu a fost găsit'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Eroare la obținerea produsului:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la obținerea produsului'
    });
  }
});

module.exports = router;
