// frontend/js/products.js
// Gestionarea UI-ului pentru produse: randare, actualizare, interacțiuni

import { searchProducts } from "./api.js";
import { addToCart } from "./cart.js";
import { showAutoFeedback } from "./chat.js";

// State global pentru produse
let currentProducts = [];
let currentFilters = {};

/**
 * Inițializare modul produse
 */
export function initProducts() {
  console.log("📦 Products module initialized");

  // Încărcăm produse inițiale (toate small businesses)
  loadProducts({ smallBusinessOnly: true });
}

/**
 * Încarcă și afișează produse pe bază de filtre
 * @param {Object} filters - Filtre pentru căutare
 */
export async function loadProducts(filters = {}) {
  currentFilters = filters;

  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");
  const productsGrid = document.getElementById("productsGrid");

  // Show loading
  loadingState.style.display = "block";
  emptyState.style.display = "none";
  productsGrid.innerHTML = "";

  try {
    const products = await searchProducts(filters);
    currentProducts = products;

    // Hide loading
    loadingState.style.display = "none";

    if (products.length === 0) {
      emptyState.style.display = "block";
      // Solicităm feedback și pentru cazul când nu sunt produse
      showAutoFeedback(0);
    } else {
      renderProducts(products);
      // Solicităm feedback automat după afișarea produselor
      showAutoFeedback(products.length);
    }
  } catch (error) {
    console.error("Eroare la încărcarea produselor:", error);
    loadingState.style.display = "none";
    emptyState.style.display = "block";
  }
}

/**
 * Randează lista de produse în grid
 * @param {Array} products - Lista de produse
 */
function renderProducts(products) {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

/**
 * Creează un card de produs
 * @param {Object} product - Datele produsului
 * @returns {HTMLElement} Card-ul produsului
 */
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Formatăm prețul (din bani în RON)
  const price = (product.price / 100).toFixed(2);

  card.innerHTML = `
    <img 
      src="${product.image}" 
      alt="${product.name}" 
      class="product-image"
      loading="lazy"
    />
    <div class="product-info">
      <div class="product-vendor">
        <span class="vendor-badge">
          <span>✓</span>
          <span>Small Business</span>
        </span>
        ${product.vendorName} • ${product.city}
      </div>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer">
        <span class="product-price">${price} RON</span>
        <button class="add-to-cart-btn" data-product-id="${product.id}">
          Adaugă în coș
        </button>
      </div>
    </div>
  `;

  // Event: click pe card -> afișează detalii
  card.addEventListener("click", (e) => {
    // Nu deschidem modalul dacă s-a dat click pe butonul de add to cart
    if (!e.target.classList.contains("add-to-cart-btn")) {
      showProductModal(product);
    }
  });

  // Event: click pe butonul "Adaugă în coș"
  const addBtn = card.querySelector(".add-to-cart-btn");
  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);

    // Feedback vizual
    addBtn.textContent = "✓ Adăugat!";
    addBtn.style.background =
      "linear-gradient(135deg, #10b981 0%, #059669 100%)";

    setTimeout(() => {
      addBtn.textContent = "Adaugă în coș";
      addBtn.style.background = "";
    }, 1500);
  });

  return card;
}

/**
 * Afișează modalul cu detaliile produsului
 * @param {Object} product
 */
function showProductModal(product) {
  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("productModalBody");

  const price = (product.price / 100).toFixed(2);

  modalBody.innerHTML = `
    <img src="${product.image}" alt="${
    product.name
  }" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />
    <h2 style="margin-bottom: 8px;">${product.name}</h2>
    <p style="color: #666; margin-bottom: 16px;">
      <strong>${product.vendorName}</strong> • ${product.city}
    </p>
    <p style="margin-bottom: 16px;">${product.description}</p>
    <p style="margin-bottom: 8px;"><strong>Culoare:</strong> ${
      product.color
    }</p>
    <p style="margin-bottom: 16px;"><strong>Mărimi disponibile:</strong> ${product.sizes.join(
      ", "
    )}</p>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
      <span style="font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        ${price} RON
      </span>
      <button class="add-to-cart-btn" id="modalAddToCart" style="font-size: 16px; padding: 12px 24px;">
        Adaugă în coș
      </button>
    </div>
  `;

  modal.classList.add("active");

  // Event pentru butonul din modal
  document.getElementById("modalAddToCart").addEventListener("click", () => {
    addToCart(product);
    modal.classList.remove("active");
  });
}

/**
 * Închide modalul de produs
 */
function closeProductModal() {
  document.getElementById("productModal").classList.remove("active");
}

// Event listeners pentru modal
document
  .getElementById("productModalClose")
  .addEventListener("click", closeProductModal);
document
  .getElementById("productModalOverlay")
  .addEventListener("click", closeProductModal);

/**
 * Actualizează filtrele și reîncarcă produsele
 * @param {Object} newFilters
 */
export function updateFilters(newFilters) {
  currentFilters = { ...currentFilters, ...newFilters };
  loadProducts(currentFilters);
}

/**
 * Obține produsele curente
 * @returns {Array}
 */
export function getCurrentProducts() {
  return currentProducts;
}
