// backend/services/stripeService.js
// Serviciu pentru integrarea cu Stripe: creare checkout session

const { stripe } = require('../config/stripe');
const { getProductById } = require('./productService');

/**
 * Creează o Stripe Checkout Session pentru coșul utilizatorului
 * 
 * Flow:
 * 1. Primim items = [{ productId, quantity, selectedSize }]
 * 2. Validăm fiecare produs din baza noastră
 * 3. Construim line_items pentru Stripe
 * 4. Creăm o checkout session
 * 5. Returnăm sessionId pentru redirect
 * 
 * @param {Array} items - Lista de produse din coș
 * @returns {Promise<string>} Session ID pentru Stripe Checkout
 */
async function createCheckoutSession(items) {
  if (!items || items.length === 0) {
    throw new Error('Coșul este gol');
  }
  
  // Construim line_items pentru Stripe
  const lineItems = [];
  
  for (const item of items) {
    const product = getProductById(item.productId);
    
    if (!product) {
      throw new Error(`Produsul ${item.productId} nu există`);
    }
    
    // În producție reală, stripe_price_id ar trebui să fie creat în Stripe Dashboard
    // Pentru MVP hackathon, creăm price-ul on-the-fly sau folosim price_data
    lineItems.push({
      price_data: {
        currency: product.currency.toLowerCase(),
        product_data: {
          name: product.name,
          description: `${product.vendorName} - ${product.city}`,
          images: [product.image],
          metadata: {
            vendor_id: product.vendorId,
            product_id: product.id,
            selected_size: item.selectedSize || 'M'
          }
        },
        unit_amount: product.price, // Stripe acceptă prețul în bani (ex: 8900 = 89 RON)
      },
      quantity: item.quantity || 1
    });
  }
  
  // Creăm Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/`,
    metadata: {
      order_type: 'multi_vendor', // Pentru tracking în viitor
      total_vendors: new Set(items.map(i => getProductById(i.productId)?.vendorId)).size
    }
  });
  
  return session.id;
}

module.exports = {
  createCheckoutSession
};
