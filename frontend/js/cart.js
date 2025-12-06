// frontend/js/cart.js
// Gestionarea coșului de cumpărături: adăugare, ștergere, checkout Stripe

import { createCheckoutSession, getStripeConfig } from './api.js';

// State coș
let cartItems = [];
let stripePublishableKey = null;
let stripe = null;

/**
 * Inițializare modul coș
 */
export async function initCart() {
  console.log('🛒 Cart module initialized');
  
  // Încărcăm coșul din localStorage (persistență între refresh-uri)
  loadCartFromStorage();
  
  // Încărcăm configurația Stripe
  try {
    stripePublishableKey = await getStripeConfig();
    stripe = Stripe(stripePublishableKey);
    console.log('✅ Stripe initialized');
  } catch (error) {
    console.error('Eroare la inițializarea Stripe:', error);
  }
  
  // Event listeners pentru modal
  document.getElementById('cartButton').addEventListener('click', openCartModal);
  document.getElementById('cartModalClose').addEventListener('click', closeCartModal);
  document.getElementById('cartModalOverlay').addEventListener('click', closeCartModal);
  
  // Event listener pentru checkout
  document.getElementById('checkoutButton').addEventListener('click', handleCheckout);
  
  // Actualizăm UI-ul
  updateCartUI();
}

/**
 * Adaugă produs în coș
 * @param {Object} product 
 * @param {string} selectedSize - opțional
 */
export function addToCart(product, selectedSize = 'M') {
  // Verificăm dacă produsul există deja în coș
  const existingItem = cartItems.find(item => item.productId === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorName: product.vendorName,
      vendorId: product.vendorId,
      selectedSize,
      quantity: 1
    });
  }
  
  saveCartToStorage();
  updateCartUI();
  
  console.log('✅ Produs adăugat în coș:', product.name);
}

/**
 * Șterge produs din coș
 * @param {string} productId 
 */
export function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.productId !== productId);
  saveCartToStorage();
  updateCartUI();
}

/**
 * Actualizează UI-ul coșului (count, modal)
 */
function updateCartUI() {
  // Actualizăm count-ul din header
  const cartCount = document.getElementById('cartCount');
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Actualizăm conținutul modalului
  updateCartModal();
}

/**
 * Actualizează conținutul modalului de coș
 */
function updateCartModal() {
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  
  if (cartItems.length === 0) {
    cartEmpty.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    cartSummary.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    
    // Renderăm items
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(item => {
      const itemElement = createCartItemElement(item);
      cartItemsContainer.appendChild(itemElement);
    });
    
    // Calculăm totalul
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotalRON = (subtotal / 100).toFixed(2);
    
    document.getElementById('cartSubtotal').textContent = `${subtotalRON} RON`;
    document.getElementById('cartTotal').textContent = `${subtotalRON} RON`;
  }
}

/**
 * Creează elementul HTML pentru un item din coș
 * @param {Object} item 
 * @returns {HTMLElement}
 */
function createCartItemElement(item) {
  const div = document.createElement('div');
  div.className = 'cart-item';
  
  const price = (item.price / 100).toFixed(2);
  const totalPrice = ((item.price * item.quantity) / 100).toFixed(2);
  
  div.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
    <div class="cart-item-info">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-vendor">${item.vendorName} • Mărime: ${item.selectedSize}</div>
      <div class="cart-item-price">${price} RON × ${item.quantity} = ${totalPrice} RON</div>
    </div>
    <button class="cart-item-remove" data-product-id="${item.productId}">🗑️</button>
  `;
  
  // Event: ștergere item
  div.querySelector('.cart-item-remove').addEventListener('click', () => {
    removeFromCart(item.productId);
  });
  
  return div;
}

/**
 * Deschide modalul de coș
 */
function openCartModal() {
  document.getElementById('cartModal').classList.add('active');
}

/**
 * Închide modalul de coș
 */
function closeCartModal() {
  document.getElementById('cartModal').classList.remove('active');
}

/**
 * Procesează checkout-ul cu Stripe
 */
async function handleCheckout() {
  if (cartItems.length === 0) {
    alert('Coșul este gol!');
    return;
  }
  
  if (!stripe) {
    alert('Stripe nu este inițializat. Verifică configurația!');
    return;
  }
  
  const checkoutButton = document.getElementById('checkoutButton');
  checkoutButton.disabled = true;
  checkoutButton.textContent = 'Procesez...';
  
  try {
    // Creăm sesiunea de checkout
    const sessionId = await createCheckoutSession(cartItems);
    
    // Redirecționăm către Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Eroare Stripe redirect:', error);
      alert('Eroare la redirecționarea către plată: ' + error.message);
    }
    
  } catch (error) {
    console.error('Eroare checkout:', error);
    alert('Eroare la procesarea plății. Te rog încearcă din nou!');
  } finally {
    checkoutButton.disabled = false;
    checkoutButton.innerHTML = `
      <span>Plătește cu Stripe</span>
      <span class="stripe-badge">🔒</span>
    `;
  }
}

/**
 * Salvează coșul în localStorage
 */
function saveCartToStorage() {
  localStorage.setItem('agentCommerceCart', JSON.stringify(cartItems));
}

/**
 * Încarcă coșul din localStorage
 */
function loadCartFromStorage() {
  const saved = localStorage.getItem('agentCommerceCart');
  if (saved) {
    try {
      cartItems = JSON.parse(saved);
    } catch (error) {
      console.error('Eroare la încărcarea coșului:', error);
      cartItems = [];
    }
  }
}

/**
 * Golește coșul (util după checkout)
 */
export function clearCart() {
  cartItems = [];
  saveCartToStorage();
  updateCartUI();
}
