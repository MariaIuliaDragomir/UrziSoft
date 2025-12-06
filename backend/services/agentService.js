// backend/services/agentService.js
// Logica AI Agent: înțelegere intenții, generare întrebări, actualizare filtre

/**
 * Procesează mesajul utilizatorului și generează răspuns + filtre
 * Aceasta e o implementare simplificată pentru hackathon.
 * În producție, aici ai integra un LLM real (Claude, GPT, etc.)
 * 
 * @param {string} message - Mesajul utilizatorului
 * @param {Object} state - Starea conversației (filtre anterioare, context)
 * @returns {Object} { reply, filters, newState }
 */
function processMessage(message, state = {}) {
  const messageLower = message.toLowerCase();
  
  // Inițializăm starea dacă e prima interacțiune
  if (!state.filters) {
    state.filters = { smallBusinessOnly: true };
  }
  if (!state.conversationStep) {
    state.conversationStep = 'initial';
  }
  
  let reply = '';
  let filters = { ...state.filters };
  let newState = { ...state };
  
  // ========== DETECTARE INTENȚIE INIȚIALĂ ==========
  
  // Detectăm categoria de produs
  if (messageLower.includes('tricou')) {
    filters.category = 'tricou';
    newState.conversationStep = 'asked_category';
  } else if (messageLower.includes('bluza') || messageLower.includes('bluză')) {
    filters.category = 'bluza';
    newState.conversationStep = 'asked_category';
  } else if (messageLower.includes('hanorac')) {
    filters.category = 'hanorac';
    newState.conversationStep = 'asked_category';
  }
  
  // Detectăm culoarea
  const colors = ['portocaliu', 'albastru', 'verde', 'rosu', 'roșu', 'negru', 'alb', 'gri'];
  for (const color of colors) {
    if (messageLower.includes(color)) {
      filters.color = color.replace('ș', 's'); // normalizare
      newState.hasColor = true;
      break;
    }
  }
  
  // Detectăm mărimea
  const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
  for (const size of sizes) {
    if (messageLower.includes(size) || messageLower.includes(size.toUpperCase())) {
      filters.size = size.toUpperCase();
      newState.hasSize = true;
      break;
    }
  }
  
  // Detectăm orașul
  const cities = ['cluj', 'bucurești', 'brasov', 'brașov', 'timisoara', 'timișoara', 'sibiu'];
  for (const city of cities) {
    if (messageLower.includes(city)) {
      filters.city = city;
      newState.hasCity = true;
      break;
    }
  }
  
  // Detectăm bugetul (ex: "maxim 100 lei", "sub 80 ron")
  const budgetMatch = messageLower.match(/(\d+)\s*(lei|ron)/);
  if (budgetMatch) {
    filters.maxPrice = parseInt(budgetMatch[1]) * 100; // convertim în bani
    newState.hasBudget = true;
  }
  
  // ========== GENERARE RĂSPUNS CONVERSAȚIONAL ==========
  
  if (newState.conversationStep === 'asked_category' && !newState.hasAskedDetails) {
    // Prima interacțiune: am detectat categoria, întrebăm detalii
    reply = `Super! Caut ${filters.category || 'produse'} de la producători locali. `;
    
    const questions = [];
    if (!newState.hasColor) questions.push('Ce culoare preferi?');
    if (!newState.hasSize) questions.push('Ce mărime porți? (S, M, L, XL)');
    if (!newState.hasBudget) questions.push('Ai un buget maxim în minte?');
    if (!newState.hasCity) questions.push('Vrei produse dintr-un oraș anume?');
    
    if (questions.length > 0) {
      reply += questions.join(' ');
      newState.hasAskedDetails = true;
    } else {
      reply = 'Perfect! Uite ce am găsit pentru tine: 👇';
      newState.conversationStep = 'showing_results';
    }
    
  } else if (newState.hasAskedDetails) {
    // Utilizatorul răspunde la întrebări
    const stillMissing = [];
    if (!newState.hasColor && !filters.color) stillMissing.push('culoarea');
    if (!newState.hasSize && !filters.size) stillMissing.push('mărimea');
    
    if (stillMissing.length === 0) {
      reply = 'Perfect! Am actualizat căutarea. Vezi produsele în stânga! 🎯';
      newState.conversationStep = 'showing_results';
    } else {
      reply = `Am înregistrat! ${stillMissing.length > 0 ? 'Mai am nevoie de: ' + stillMissing.join(', ') : 'Gata!'}`;
    }
    
  } else if (messageLower.includes('salut') || messageLower.includes('bună') || messageLower.includes('hey')) {
    // Mesaj de salut
    reply = 'Bună! 👋 Sunt agentul tău de cumpărături pentru produse locale. Spune-mi ce cauți și te ajut să găsești produse de la micii producători din România!';
    newState.conversationStep = 'greeted';
    
  } else if (newState.conversationStep === 'showing_results') {
    // Utilizatorul vrea să modifice căutarea
    reply = 'Am actualizat filtrele! Vezi produsele noi în listă. 🔄';
    
  } else {
    // Fallback: nu am înțeles mesajul
    reply = 'Pot să te ajut să găsești tricouri, bluze sau hanorace de la producători locali. Ce te interesează?';
  }
  
  return {
    reply,
    filters,
    newState
  };
}

module.exports = {
  processMessage
};
