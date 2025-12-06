// frontend/js/chat.js
// Gestionarea interacțiunii cu AI Agent: mesaje, răspunsuri, actualizare filtre

import { sendMessageToAgent } from "./api.js";
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

    // ÎNTOTDEAUNA actualizăm produsele când primim filtre (chiar dacă sunt mai puține)
    // Acest lucru asigură că "înapoi" funcționează corect
    if (response.filters) {
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
