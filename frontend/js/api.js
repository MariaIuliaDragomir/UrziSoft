// frontend/js/api.js
// Modul pentru toate comunicările cu backend-ul
// Centralizăm toate fetch-urile aici pentru consistență și ușurință în debugging

const API_BASE_URL = "http://localhost:3001/api";

/**
 * Caută produse cu filtre specifice
 * @param {Object} filters - Filtre pentru produse
 * @returns {Promise<Array>} Lista de produse
 */
export async function searchProducts(filters = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Eroare la căutarea produselor");
    }

    return data.products;
  } catch (error) {
    console.error("Eroare searchProducts:", error);
    throw error;
  }
}

/**
 * Obține detaliile unui produs specific
 * @param {string} productId
 * @returns {Promise<Object>} Datele produsului
 */
export async function getProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Produsul nu a fost găsit");
    }

    return data.product;
  } catch (error) {
    console.error("Eroare getProduct:", error);
    throw error;
  }
}

/**
 * Trimite mesaj către AI Agent
 * @param {string} message - Mesajul utilizatorului
 * @param {Object} state - Starea conversației
 * @returns {Promise<Object>} Răspuns agent cu { reply, filters, newState }
 */
export async function sendMessageToAgent(message, state = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, state }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Eroare la comunicarea cu agentul");
    }

    return {
      reply: data.reply,
      filters: data.filters,
      newState: data.newState,
    };
  } catch (error) {
    console.error("Eroare sendMessageToAgent:", error);
    throw error;
  }
}

/**
 * Cere feedback de la agent după afișarea rezultatelor
 * @param {number} resultsCount - Numărul de produse găsite
 * @param {Object} state - Starea conversației
 * @returns {Promise<Object>} Mesaj de feedback + stare nouă
 */
export async function requestFeedback(resultsCount, state = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resultsCount,
        filters: state.filters || {},
        state,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Eroare la generarea feedback-ului");
    }

    return {
      feedbackMessage: data.feedbackMessage,
      options: data.options || [],
      newState: data.newState,
    };
  } catch (error) {
    console.error("Eroare requestFeedback:", error);
    throw error;
  }
}

/**
 * Trimite răspunsul utilizatorului la feedback
 * @param {string} feedbackResponse - Răspunsul utilizatorului (satisfied/show_more/etc)
 * @param {Object} state - Starea conversației
 * @returns {Promise<Object>} Reply, action și stare nouă
 */
export async function sendFeedbackResponse(feedbackResponse, state = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/agent/feedback-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedbackResponse, state }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Eroare la procesarea feedback-ului");
    }

    return {
      reply: data.reply,
      action: data.action,
      newState: data.newState,
    };
  } catch (error) {
    console.error("Eroare sendFeedbackResponse:", error);
    throw error;
  }
}

/**
 * Creează o sesiune Stripe Checkout
 * @param {Array} items - Lista de produse din coș
 * @returns {Promise<string>} Session ID pentru Stripe
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
    console.error("Eroare createCheckoutSession:", error);
    throw error;
  }
}

/**
 * Obține configurația Stripe (cheia publică)
 * @returns {Promise<string>} Publishable key
 */
export async function getStripeConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/checkout/config`);
    const data = await response.json();
    return data.publishableKey;
  } catch (error) {
    console.error("Eroare getStripeConfig:", error);
    throw error;
  }
}
