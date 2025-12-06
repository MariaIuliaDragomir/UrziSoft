// backend/config/stripe.js
// Configurare Stripe SDK cu validare

require("dotenv").config();
const Stripe = require("stripe");

// Validăm că avem cheia secretă
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ EROARE CRITICĂ: STRIPE_SECRET_KEY lipsește din .env!");
  console.error("👉 Adaugă în .env: STRIPE_SECRET_KEY=sk_test_...");
  process.exit(1); // Oprim serverul dacă lipsește
}

if (!process.env.STRIPE_PUBLISHABLE_KEY) {
  console.error("❌ EROARE CRITICĂ: STRIPE_PUBLISHABLE_KEY lipsește din .env!");
  console.error("👉 Adaugă în .env: STRIPE_PUBLISHABLE_KEY=pk_test_...");
  process.exit(1);
}

// Inițializare Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // Fixăm versiunea API pentru stabilitate
});

// Testăm conexiunea la pornirea serverului
stripe.balance
  .retrieve()
  .then(() => {
    console.log("✅ Stripe conectat cu succes!");
  })
  .catch((err) => {
    console.error("❌ Eroare la conectarea cu Stripe:", err.message);
  });

const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

module.exports = {
  stripe,
  publishableKey,
};
