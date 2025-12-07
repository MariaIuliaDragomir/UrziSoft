// frontend/js/chat.js
// Gestionarea interacțiunii cu AI Agent: mesaje, răspunsuri, actualizare filtre

import {
  sendMessageToAgent,
  requestFeedback,
  sendFeedbackResponse,
} from "./api.js";
import { updateFilters } from "./products.js";

// State conversație
let conversationState = {};

/**
 * Inițializare modul chat
 */
export function initChat() {
  console.log("💬 Chat module initialized");

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");

  // Event: trimitere mesaj
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    // Afișăm mesajul utilizatorului
    addMessage(message, "user");

    // Curățăm input-ul
    chatInput.value = "";

    // Trimitem mesajul către agent
    await handleAgentResponse(message);
  });
}

/**
 * Trimite mesaj către agent și procesează răspunsul
 * @param {string} message
 */
async function handleAgentResponse(message) {
  try {
    // Afișăm indicator de typing
    showTypingIndicator();

    // Apelăm API-ul agentului
    const response = await sendMessageToAgent(message, conversationState);

    // Ascundem typing indicator
    hideTypingIndicator();

    // Actualizăm starea conversației
    conversationState = response.newState;

    // Afișăm răspunsul agentului
    addMessage(response.reply, "agent");

    // Dacă agentul a returnat filtre noi, actualizăm produsele
    if (response.filters && Object.keys(response.filters).length > 0) {
      console.log("🔍 Actualizez filtre:", response.filters);
      updateFilters(response.filters);
    }
  } catch (error) {
    console.error("Eroare la comunicarea cu agentul:", error);
    hideTypingIndicator();
    addMessage(
      "Ne pare rău, am întâmpinat o eroare. Te rog încearcă din nou!",
      "agent"
    );
  }
}

/**
 * Adaugă un mesaj în chat
 * @param {string} text - Conținutul mesajului
 * @param {string} type - 'user' sau 'agent'
 */
function addMessage(text, type = "agent") {
  const chatMessages = document.getElementById("chatMessages");

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}-message`;

  const avatar = type === "agent" ? "🤖" : "👤";

  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <p>${text}</p>
    </div>
  `;

  chatMessages.appendChild(messageDiv);

  // Scroll automat la ultimul mesaj
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Afișează indicator că agentul scrie
 */
function showTypingIndicator() {
  const chatMessages = document.getElementById("chatMessages");

  const typingDiv = document.createElement("div");
  typingDiv.className = "message agent-message";
  typingDiv.id = "typingIndicator";

  typingDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content" style="font-style: italic; color: #999;">
      <p>Scrie...</p>
    </div>
  `;

  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Ascunde indicator de typing
 */
function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Resetează conversația (útil pentru testing)
 */
export function resetConversation() {
  conversationState = {};
  const chatMessages = document.getElementById("chatMessages");

  // Păstrăm doar mesajul inițial de welcome
  chatMessages.innerHTML = `
    <div class="message agent-message">
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <p>Bună! 👋 Sunt agentul tău pentru produse locale din România.</p>
        <p>Spune-mi ce cauți și te ajut să găsești produse de la micii producători! De exemplu: "vreau un tricou portocaliu" sau "caut o bluză verde din Cluj".</p>
      </div>
    </div>
  `;
}

/**
 * Afișează feedback automat după ce produsele sunt afișate
 * @param {number} resultsCount - Numărul de produse găsite
 */
export async function showAutoFeedback(resultsCount) {
  try {
    // Cereem feedback de la agent
    const response = await requestFeedback(resultsCount, conversationState);

    // Actualizăm starea conversației
    if (response.newState) {
      conversationState = response.newState;
    }

    // Afișăm mesajul de feedback cu butoane doar dacă există
    if (response.feedbackMessage) {
      // Delay mic pentru a lăsa utilizatorul să vadă produsele
      setTimeout(() => {
        addMessageWithButtons(response.feedbackMessage, response.options || []);
      }, 1000);
    }
  } catch (error) {
    console.error("Eroare la afișarea feedback-ului:", error);
  }
}

/**
 * Adaugă un mesaj cu butoane de opțiuni în chat
 * @param {string} text - Conținutul mesajului
 * @param {Array} options - Lista de opțiuni {text, value}
 */
function addMessageWithButtons(text, options = []) {
  const chatMessages = document.getElementById("chatMessages");

  const messageDiv = document.createElement("div");
  messageDiv.className = "message agent-message";

  let buttonsHtml = "";
  if (options.length > 0) {
    buttonsHtml =
      '<div class="feedback-buttons" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px;">';
    options.forEach((option) => {
      buttonsHtml += `
        <button 
          class="feedback-btn" 
          data-value="${option.value}"
          style="
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          "
          onmouseover="this.style.background='#f0f0f0'"
          onmouseout="this.style.background='white'"
        >
          ${option.text}
        </button>
      `;
    });
    buttonsHtml += "</div>";
  }

  messageDiv.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <p>${text}</p>
      ${buttonsHtml}
    </div>
  `;

  chatMessages.appendChild(messageDiv);

  // Adăugăm event listeners pentru butoane
  if (options.length > 0) {
    const buttons = messageDiv.querySelectorAll(".feedback-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const value = e.target.dataset.value;
        await handleFeedbackResponse(value);

        // Dezactivăm toate butoanele după ce utilizatorul a răspuns
        buttons.forEach((b) => {
          b.disabled = true;
          b.style.opacity = "0.5";
          b.style.cursor = "not-allowed";
        });
      });
    });
  }

  // Scroll automat la ultimul mesaj
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Procesează răspunsul utilizatorului la feedback
 * @param {string} feedbackValue - Valoarea răspunsului (satisfied/show_more/etc)
 */
async function handleFeedbackResponse(feedbackValue) {
  try {
    // Trimitem răspunsul către backend
    const response = await sendFeedbackResponse(
      feedbackValue,
      conversationState
    );

    // Actualizăm starea conversației
    if (response.newState) {
      conversationState = response.newState;
    }

    // Afișăm răspunsul agentului
    addMessage(response.reply, "agent");

    // Executăm acțiunea specifică
    if (
      response.action === "remove_filters" ||
      response.action === "clear_filters"
    ) {
      // Actualizăm filtrele și reîncărcăm produsele
      if (response.newState.filters) {
        updateFilters(response.newState.filters);
      }
    } else if (response.action === "reset") {
      // Resetăm filtrele
      updateFilters({ smallBusinessOnly: true });
    }
    // Pentru "satisfied" și "close_conversation" nu facem nimic special
  } catch (error) {
    console.error("Eroare la procesarea feedback-ului:", error);
    addMessage(
      "Ne pare rău, am întâmpinat o eroare. Te rog încearcă din nou!",
      "agent"
    );
  }
}

/**
 * Exportăm starea conversației pentru a putea fi accesată din alte module
 */
export function getConversationState() {
  return conversationState;
}

export function setConversationState(newState) {
  conversationState = newState;
}
