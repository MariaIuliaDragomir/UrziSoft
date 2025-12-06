// frontend/js/app.js
// Entry point principal - inițializare aplicație

import { initProducts } from './products.js';
import { initChat } from './chat.js';
import { initCart } from './cart.js';

/**
 * Inițializare aplicație
 * Flow: Products → Chat → Cart
 */
async function initApp() {
  console.log('🚀 Agent Commerce - Starting...');
  
  try {
    // Inițializăm toate modulele
    initProducts();
    initChat();
    await initCart();
    
    console.log('✅ Aplicație inițializată cu succes!');
  } catch (error) {
    console.error('❌ Eroare la inițializarea aplicației:', error);
  }
}

// Start aplicație când DOM-ul este gata
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
