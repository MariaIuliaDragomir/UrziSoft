// mobile/src/config/index.js
// Configurare aplicație - endpoint-uri și chei API

// Backend API URL
// Pentru development: folosește IP-ul calculatorului tău (nu localhost!)
// Exemplu: export const API_BASE_URL = 'http://192.168.1.100:3000/api';
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api" // Schimbă cu IP-ul tău local pentru device real
  : "https://your-production-api.com/api";

// Stripe Publishable Key (se va încărca dinamic de la backend)
export let STRIPE_PUBLISHABLE_KEY = "pk_test_..."; // Placeholder

// Funcție pentru a încărca configurația Stripe
export async function loadStripeConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/config`);
    const data = await response.json();
    if (data.success && data.publishableKey) {
      STRIPE_PUBLISHABLE_KEY = data.publishableKey;
      return data.publishableKey;
    }
  } catch (error) {
    console.error("Eroare la încărcarea config Stripe:", error);
  }
  return null;
}
