// backend/services/agentService.js
// AI Agent cu Google Gemini + Function Calling pentru Agentic Commerce

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inițializare Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Tool (Function) pentru căutarea de produse
 * Agentul va folosi acest tool automat când utilizatorul cere produse
 */
const searchProductsTool = {
  name: 'search_products',
  description: 'Caută produse de la small businesses locale din România. Folosește acest tool când utilizatorul cere un anumit tip de produs.',
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Categoria de produs (ex: tricou, bluza, hanorac)',
        enum: ['tricou', 'bluza', 'hanorac']
      },
      color: {
        type: 'string',
        description: 'Culoarea produsului (ex: portocaliu, albastru, verde, rosu, negru, alb, gri)'
      },
      size: {
        type: 'string',
        description: 'Mărimea dorită',
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      maxPrice: {
        type: 'number',
        description: 'Prețul maxim în RON (va fi convertit în bani automat)'
      },
      city: {
        type: 'string',
        description: 'Orașul de unde utilizatorul vrea produse (ex: Cluj, București, Brașov, Timișoara, Sibiu)'
      }
    },
    required: ['category']
  }
};

/**
 * System prompt pentru agent - definește comportamentul
 */
const SYSTEM_PROMPT = `Ești un AI Shopping Agent pentru small businesses din România. Rolul tău este să ajuți utilizatorii să găsească produse locale de calitate.

REGULI IMPORTANTE:
1. Ești prietenos, conversațional și entuziast despre produsele locale
2. Când utilizatorul cere un produs, ÎNTOTDEAUNA folosește tool-ul search_products pentru a căuta
3. Pune întrebări de clarificare DOAR dacă lipsesc informații esențiale
4. Filtrezi IMPLICIT doar small businesses locale din România
5. Ești scurt și la obiect - nu scrii paragrafe lungi
6. Folosești emoji-uri dar nu exagera
7. Când ai rezultate, anunță utilizatorul că produsele apar în stânga

EXEMPLE DE COMPORTAMENT BUN:
User: "Vreau un tricou portocaliu"
Agent: [FOLOSEȘTE tool search_products cu category=tricou, color=portocaliu]
       "Perfect! Am găsit tricouri portocalii de la producători locali. Vezi produsele în stânga! 🎨"

User: "Caut ceva din Cluj"
Agent: "Ce anume cauți din Cluj? Tricouri, bluze sau hanorace? 🤔"

User: "Mărime M maxim 80 lei"
Agent: [FOLOSEȘTE tool search_products cu ultimele filtre + size=M, maxPrice=80]
       "Am actualizat căutarea! Vezi produsele care se potrivesc bugetului și mărimii tale. 👕"

COMPORTAMENT GREȘIT (NU FACE AȘA):
- Nu genera liste lungi de produse în chat
- Nu repeta aceleași întrebări
- Nu scrie paragrafe lungi
- Nu inventa produse care nu există

Începe conversația friendly și ajută utilizatorul să găsească exact ce caută!`;

/**
 * Procesează mesajul utilizatorului folosind Gemini cu function calling
 * 
 * @param {string} message - Mesajul utilizatorului
 * @param {Object} state - Starea conversației
 * @returns {Promise<Object>} { reply, filters, newState }
 */
async function processMessage(message, state = {}) {
  try {
    // Inițializăm starea
    if (!state.conversationHistory) {
      state.conversationHistory = [];
    }
    if (!state.filters) {
      state.filters = { smallBusinessOnly: true };
    }

    // Configurăm modelul cu tool calling
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [{
        functionDeclarations: [searchProductsTool]
      }]
    });

    // Construim istoricul conversației pentru context
    const history = state.conversationHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Pornim chat session cu istoric
    const chat = model.startChat({
      history,
      systemInstruction: SYSTEM_PROMPT
    });

    // Trimitem mesajul utilizatorului
    const result = await chat.sendMessage(message);
    const response = result.response;

    let reply = '';
    let filters = { ...state.filters };
    let toolCalled = false;

    // Verificăm dacă agentul vrea să folosească tool-ul
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      // Agentul a decis să caute produse!
      const functionCall = functionCalls[0];
      
      if (functionCall.name === 'search_products') {
        toolCalled = true;
        const args = functionCall.args;
        
        // Actualizăm filtrele din argumentele tool-ului
        if (args.category) filters.category = args.category;
        if (args.color) filters.color = args.color;
        if (args.size) filters.size = args.size;
        if (args.maxPrice) filters.maxPrice = args.maxPrice * 100; // convertim în bani
        if (args.city) filters.city = args.city;

        // Simulăm răspunsul de la tool (în realitate, produsele sunt căutate de frontend)
        const toolResponse = {
          success: true,
          message: `Am găsit produse care corespund: ${JSON.stringify(args)}`
        };

        // Trimitem răspunsul tool-ului înapoi la agent
        const result2 = await chat.sendMessage([{
          functionResponse: {
            name: 'search_products',
            response: toolResponse
          }
        }]);

        reply = result2.response.text();
      }
    } else {
      // Agentul răspunde direct (conversație normală)
      reply = response.text();
    }

    // Actualizăm istoricul conversației
    const newHistory = [
      ...state.conversationHistory,
      { role: 'user', content: message },
      { role: 'model', content: reply }
    ];

    // Păstrăm doar ultimele 10 mesaje pentru a nu depăși limita de context
    const trimmedHistory = newHistory.slice(-10);

    return {
      reply: reply.trim(),
      filters: toolCalled ? filters : state.filters,
      newState: {
        ...state,
        conversationHistory: trimmedHistory,
        filters: toolCalled ? filters : state.filters
      }
    };

  } catch (error) {
    console.error('Eroare Gemini API:', error);
    
    // Fallback la un răspuns generic dacă API-ul eșuează
    return {
      reply: 'Îmi pare rău, am avut o problemă tehnică. Te rog încearcă din nou! 😊',
      filters: state.filters || { smallBusinessOnly: true },
      newState: state
    };
  }
}

module.exports = {
  processMessage
};