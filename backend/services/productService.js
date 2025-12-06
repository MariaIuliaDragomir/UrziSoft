// backend/services/productService.js
// Serviciu pentru gestionarea produselor: citire, filtrare, căutare

const fs = require("fs");
const path = require("path");

// Citim produsele o singură dată la pornirea serverului (pentru performanță)
const productsPath = path.join(__dirname, "../data/products.json");
let productsCache = null;

/**
 * Încarcă produsele din fișierul JSON
 * @returns {Array} Lista de produse
 */
function loadProducts() {
  if (!productsCache) {
    const data = fs.readFileSync(productsPath, "utf-8");
    productsCache = JSON.parse(data);
  }
  return productsCache;
}

/**
 * Caută produse pe bază de filtre
 * @param {Object} filters - Obiect cu filtre (category, color, size, maxPrice, city, smallBusinessOnly)
 * @returns {Array} Produse care corespund filtrelor
 */
function searchProducts(filters = {}) {
  let products = loadProducts();

  // Filtrare implicită: doar small businesses
  // (în spiritul hackathon-ului "Going Big with Small Businesses")
  if (filters.smallBusinessOnly !== false) {
    products = products.filter((p) => p.isSmallBusiness === true);
  }

  // Filtru: categorie (ex: "tricou", "bluza", "hanorac")
  if (filters.category) {
    const categoryLower = filters.category.toLowerCase();
    products = products.filter(
      (p) => p.category.toLowerCase() === categoryLower
    );
  }

  // Filtru: culoare (match exact pentru a evita confuzii: alb != albastru)
  if (filters.color) {
    const normalizeColor = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ș/g, "s")
        .replace(/ț/g, "t");

    const filterColor = normalizeColor(filters.color);
    products = products.filter((p) => {
      const productColor = normalizeColor(p.color);
      return productColor === filterColor;
    });
  }

  // Filtru: mărime disponibilă
  if (filters.size) {
    const sizeUpper = filters.size.toUpperCase();
    products = products.filter((p) => p.sizes && p.sizes.includes(sizeUpper));
  }

  // Filtru: preț maxim (în bani, ex: 10000 = 100 RON)
  if (filters.maxPrice) {
    products = products.filter((p) => p.price <= filters.maxPrice);
  }

  // Filtru: oraș (match exact, cu normalizare diacritice)
  if (filters.city) {
    const normalizeCity = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ș/g, "s")
        .replace(/ț/g, "t");

    const filterCity = normalizeCity(filters.city);
    products = products.filter((p) => {
      if (!p.city) return false;
      const productCity = normalizeCity(p.city);
      return productCity === filterCity;
    });
  }

  return products;
}

/**
 * Obține un produs specific după ID
 * @param {string} productId
 * @returns {Object|null} Produsul sau null dacă nu există
 */
function getProductById(productId) {
  const products = loadProducts();
  return products.find((p) => p.id === productId) || null;
}

module.exports = {
  searchProducts,
  getProductById,
  loadProducts,
};
