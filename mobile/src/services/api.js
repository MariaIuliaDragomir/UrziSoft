// mobile/src/services/api.js
// Servicii API pentru comunicarea cu backend-ul Express

import { API_BASE_URL } from "../config";

/**
 * Caută produse cu filtre
 */
export async function searchProducts(filters = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Eroare la căutarea produselor");
    }

    return data.products || [];
  } catch (error) {
    console.error("API Error - searchProducts:", error);
    throw error;
  }
}

/**
 * Obține detaliile unui produs
 */
export async function getProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Produs nu a fost găsit");
    }

    return data.product;
  } catch (error) {
    console.error("API Error - getProduct:", error);
    throw error;
  }
}

/**
 * Trimite mesaj la AI Agent
 */
export async function sendChatMessage(message, currentFilters = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        state: {
          filters: currentFilters,
        },
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Eroare la procesarea mesajului");
    }

    return {
      reply: data.reply,
      filters: data.filters,
    };
  } catch (error) {
    console.error("API Error - sendChatMessage:", error);
    throw error;
  }
}

/**
 * Creează Stripe Checkout Session
 */
export async function createCheckoutSession(items) {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Eroare la crearea sesiunii de plată");
    }

    return data.sessionId;
  } catch (error) {
    console.error("API Error - createCheckoutSession:", error);
    throw error;
  }
}

/**
 * Obține configurația Stripe
 */
export async function getStripeConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/config`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Eroare la obținerea config Stripe");
    }

    return data.publishableKey;
  } catch (error) {
    console.error("API Error - getStripeConfig:", error);
    throw error;
  }
}
