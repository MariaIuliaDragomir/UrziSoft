// backend/config/stripe.js
// Configurare Stripe SDK cu cheia secretă din environment variables

require('dotenv').config();
const Stripe = require('stripe');

// Inițializare Stripe client cu cheia secretă
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Export cheie publică pentru frontend
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

module.exports = {
  stripe,
  publishableKey
};
