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
    state.conversationStep = "initial";
  }

  let reply = "";
  let filters = { ...state.filters };
  let newState = { ...state };

  // ========== DETECTARE INTENȚIE INIȚIALĂ ==========

  // Detectăm categoria de produs
  const categoryMap = {
    tricou: ["tricou", "tricouri"],
    bluza: ["bluza", "bluză", "bluze"],
    hanorac: ["hanorac", "hanorace"],
    pulover: ["pulover", "pulovere"],
    cardigan: ["cardigan"],
    incaltaminte: [
      "ghete",
      "ghetă",
      "încălțăminte",
      "incaltaminte",
      "adidași",
      "adidasi",
      "pantofi",
    ],
    jacheta: ["jacheta", "jachetă", "geci", "geaca", "geacă"],
    pantaloni: ["pantaloni", "pantalon"],
    trening: ["trening", "treninguri"],
    rochie: ["rochie", "rochii"],
    fusta: ["fustă", "fusta", "fuste"],
    sapca: ["șapcă", "sapca", "șepci", "șapcă"],
    bijuterii: [
      "bijuterii",
      "bijuterie",
      "inel",
      "inele",
      "brățară",
      "bratara",
      "bratari",
      "colier",
      "coliere",
      "cercei",
    ],
    geanta: ["geantă", "geanta", "genti"],
    rucsac: ["rucsac", "rucsacuri", "ghiozdan"],
    ceas: ["ceas", "ceasuri"],
    ochelari: ["ochelari", "ochelari de soare"],
    decor: [
      "decorațiuni",
      "decoratiuni",
      "decor",
      "vază",
      "vaza",
      "vaze",
      "tablou",
      "tablouri",
    ],
    iluminat: ["lampa", "lampă", "iluminat", "veioza", "lumini"],
    lumanari: ["lumanare", "lumânare", "lumanari", "lumânări", "lumânare"],
    aromaterapie: ["aromaterapie", "difuzor", "uleiuri"],
    perna: ["pernă", "perna", "perne"],
    termos: ["termos", "termosuri"],
    sticla: ["sticlă", "sticla", "sticle", "bidon"],
    papetarie: [
      "papetarie",
      "papetărie",
      "notebook",
      "caiet",
      "jurnal",
      "agenda",
      "agendă",
    ],
    cosmetice: ["cosmetice", "cosmetică", "crema", "cremă", "balsam"],
    audio: ["casca", "cască", "casti", "căști", "audio", "boxa", "boxă"],
    accesorii_pc: ["mouse", "tastatura", "tastatură", "accesorii pc"],
    accesorii_telefon: ["husa", "husă", "telefon", "accesorii telefon"],
    bucatarie: ["bucătărie", "bucatarie", "ustensile"],
    sport: ["sport", "fitness", "yoga"],
    electrocasnice: ["electrocasnice"],
  };

  // Căutăm categoria
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((keyword) => messageLower.includes(keyword))) {
      filters.category = category;
      newState.conversationStep = "asked_category";
      break;
    }
  }

  // Detectăm culoarea
  const colors = [
    "portocaliu",
    "albastru",
    "verde",
    "rosu",
    "roșu",
    "negru",
    "alb",
    "gri",
    "galben",
    "mov",
    "roz",
    "maro",
    "bej",
    "turcoaz",
    "bleu",
    "mustar",
    "lila",
    "indigo",
    "corai",
    "oliv",
    "carmeniu",
    "safir",
    "smarald",
    "burgundy",
    "cyan",
    "magenta",
    "lavanda",
    "crem",
  ];
  for (const color of colors) {
    if (messageLower.includes(color)) {
      filters.color = color.replace("ș", "s"); // normalizare
      newState.hasColor = true;
      break;
    }
  }

  // Detectăm mărimea (cu word boundaries pentru a evita false positives)
  const sizes = ["xs", "s", "m", "l", "xl", "xxl"];
  for (const size of sizes) {
    // Folosim regex cu word boundary pentru a evita detecții false (ex: "l" în "lei")
    const sizeRegex = new RegExp(`\\b${size}\\b`, "i");
    if (sizeRegex.test(messageLower)) {
      filters.size = size.toUpperCase();
      newState.hasSize = true;
      break;
    }
  }

  // Detectăm orașul
  const cities = [
    "cluj",
    "bucurești",
    "brasov",
    "brașov",
    "timisoara",
    "timișoara",
    "sibiu",
    "iasi",
    "iași",
    "constanta",
    "constanța",
    "oradea",
    "galati",
    "galați",
    "pitesti",
    "pitești",
    "baia mare",
    "baiamare",
    "satu mare",
    "satumare",
    "arad",
    "ploiesti",
    "ploiesti",
    "drobeta",
    "drobeta turnu severin",
    "turnu severin",
    "suceava",
    "botosani",
    "botoșani",
    "targu mures",
    "târgu mureș",
    "targu jiu",
    "târgu jiu",
    "ramnicu valcea",
    "râmnicu vâlcea",
    "calarasi",
    "călărași",
    "alba iulia",
    "alba",
    "iulua",
    "pascani",
    "pașcani",
    "turda",
    "medias",
    "mediaș",
    "cisnadie",
    "cîșnădie",
    "fagaras",
    "făgăraș",
    "curtea de arges",
    "curtea de argeș",
    "argeș",
    "tulcea",
    "reghin",
    "mangalia",
    "slatina",
    "calafat",
    "tecuci",
  ];
  for (const city of cities) {
    if (messageLower.includes(city)) {
      filters.city = city;
      newState.hasCity = true;
      break;
    }
  }

  // Detectăm bugetul (ex: "maxim 100 lei", "sub 80 ron", "100 lei", "buget 50 ron", "până în 200")
  // Încercăm mai multe variante de pattern-uri
  let budgetMatch = messageLower.match(/(\d+)\s*(lei|ron)/i);

  if (!budgetMatch) {
    // Încercăm pattern-uri cu "până la/în", "maxim", "sub", "buget"
    budgetMatch = messageLower.match(
      /(până\s+(la|în|in)|pana\s+(la|în|in)|maxim|sub|buget)\s*(\d+)/i
    );
    if (budgetMatch) {
      const price = parseInt(budgetMatch[4]);
      filters.maxPrice = price * 100; // convertim în bani
      newState.hasBudget = true;
    }
  } else {
    // Am găsit format cu "lei" sau "ron"
    const price = parseInt(budgetMatch[1]);
    filters.maxPrice = price * 100; // convertim în bani
    newState.hasBudget = true;
  }

  // Ultimă încercare: doar un număr urmat de context de buget
  if (!newState.hasBudget) {
    const contextMatch = messageLower.match(
      /(buget|maxim|pana|până).{0,10}(\d+)|(\d+).{0,10}(lei|ron|buget)/i
    );
    if (contextMatch) {
      const price = parseInt(contextMatch[2] || contextMatch[3]);
      if (price && price > 10 && price < 10000) {
        // sanity check: între 10 și 10000 RON
        filters.maxPrice = price * 100;
        newState.hasBudget = true;
      }
    }
  }

  // ========== GENERARE RĂSPUNS CONVERSAȚIONAL ==========

  if (
    newState.conversationStep === "asked_category" &&
    !newState.hasAskedDetails
  ) {
    // Prima interacțiune: am detectat categoria, întrebăm detalii
    const categoryName = filters.category || "produse";
    reply = `Bună! Caut ${categoryName} de la producători locali. `;

    const questions = [];

    // Întrebăm doar despre culoare dacă categoria suportă culori
    const colorCategories = [
      "tricou",
      "bluza",
      "hanorac",
      "pulover",
      "geaca",
      "pantaloni",
      "trening",
      "rochie",
      "fusta",
      "sapca",
      "rucsac",
      "geanta",
      "incaltaminte",
      "lumanari",
      "cosmetice",
    ];
    if (!newState.hasColor && colorCategories.includes(filters.category)) {
      questions.push("Ce culoare preferi?");
    }

    // Întrebăm despre mărime doar pentru haine și încălțăminte
    const sizeCategories = [
      "tricou",
      "bluza",
      "hanorac",
      "pulover",
      "cardigan",
      "jacheta",
      "pantaloni",
      "trening",
      "rochie",
      "fusta",
      "incaltaminte",
      "sapca",
      "rucsac",
      "geanta",
      "lumanari",
      "cosmetice",
    ];
    if (!newState.hasSize && sizeCategories.includes(filters.category)) {
      questions.push("Ce mărime? (S, M, L, XL)");
    }

    if (!newState.hasBudget) questions.push("Care e bugetul tău?");
    if (!newState.hasCity) questions.push("Preferi din vreun oraș anume?");

    if (questions.length > 0) {
      reply += questions.join(" ");
      newState.hasAskedDetails = true;
    } else {
      reply = "Caut produsele potrivite...";
      newState.conversationStep = "showing_results";
    }
  } else if (newState.hasAskedDetails) {
    // Utilizatorul răspunde la întrebări
    const updates = [];
    if (filters.color && !state.filters.color)
      updates.push(`culoare ${filters.color}`);
    if (filters.size && !state.filters.size)
      updates.push(`mărime ${filters.size}`);
    if (filters.maxPrice && !state.filters.maxPrice)
      updates.push(`buget până în ${filters.maxPrice / 100} RON`);
    if (filters.city && !state.filters.city)
      updates.push(`din ${filters.city}`);

    if (updates.length > 0) {
      reply = `Am actualizat: ${updates.join(", ")}. Verific stocul...`;
      newState.conversationStep = "showing_results";
    } else {
      reply = "Caut în catalog...";
      newState.conversationStep = "showing_results";
    }
  } else if (
    messageLower.includes("salut") ||
    messageLower.includes("bună") ||
    messageLower.includes("hey") ||
    messageLower.includes("hello")
  ) {
    // Mesaj de salut
    reply =
      "Bună! 👋 Îți caut produse de la micii producători din România. Ce anume cauți?";
    newState.conversationStep = "greeted";
  } else if (newState.conversationStep === "showing_results") {
    // Utilizatorul vrea să modifice căutarea
    reply = "Actualizez căutarea...";
  } else {
    // Fallback: nu am înțeles mesajul
    reply =
      "Îți pot găsi diverse produse de la producători locali. Încearcă să-mi spui ce cauți! (ex: hanorac verde, jurnal, lumânări, etc.)";
  }

  return {
    reply,
    filters,
    newState,
  };
}

/**
 * Generează mesaj de feedback după afișarea rezultatelor
 * @param {number} resultsCount - Numărul de rezultate găsite
 * @param {Object} filters - Filtrele curente aplicate
 * @param {Object} state - Starea conversației
 * @returns {Object} { feedbackMessage, options, newState }
 */
function generateFeedback(resultsCount, filters = {}, state = {}) {
  let feedbackMessage = "";
  let options = [];
  let newState = { ...state, awaitingFeedback: true };

  // Construim context despre filtrele active
  const activeFilters = [];
  if (filters.category) activeFilters.push(filters.category);
  if (filters.color) activeFilters.push(`culoare ${filters.color}`);
  if (filters.maxPrice) activeFilters.push(`sub ${filters.maxPrice / 100} lei`);
  if (filters.city) activeFilters.push(`din ${filters.city}`);

  const filterContext =
    activeFilters.length > 0 ? ` pentru ${activeFilters.join(", ")}` : "";

  if (resultsCount === 0) {
    feedbackMessage = `Hmm, nu am găsit nimic${filterContext}. 😕 Hai să încercăm altfel!`;
    options = [
      { text: "🔍 Relaxează filtrele", value: "show_more" },
      { text: "🔄 Caută altceva", value: "search_new" },
    ];
  } else if (resultsCount === 1) {
    feedbackMessage = `Am găsit un produs${filterContext}. Pare ceea ce căutai? 🤔`;
    options = [
      { text: "✅ Da, perfect!", value: "satisfied" },
      { text: "👀 Vreau mai multe opțiuni", value: "show_more" },
      { text: "🔄 Caută altceva", value: "search_new" },
    ];
  } else if (resultsCount < 5) {
    feedbackMessage = `Am găsit ${resultsCount} produse${filterContext}. Ai găsit ceva interesant? 😊`;
    options = [
      { text: "✅ Da, mulțumesc!", value: "satisfied" },
      { text: "👀 Mai multe opțiuni", value: "show_more" },
      { text: "🔄 Caută altceva", value: "search_new" },
    ];
  } else if (resultsCount <= 10) {
    feedbackMessage = `Super! Am găsit ${resultsCount} produse${filterContext}. Vrei să restrâng căutarea? 🎯`;
    options = [
      { text: "✅ Am găsit ce căutam", value: "satisfied" },
      { text: "🎯 Filtrează mai mult", value: "refine" },
    ];
  } else {
    feedbackMessage = `Wow! Am găsit ${resultsCount} produse${filterContext}! 🎉 Te ajut să găsești mai ușor?`;
    options = [
      { text: "✅ E perfect așa", value: "satisfied" },
      { text: "🎯 Ajută-mă să filtrezi", value: "refine" },
    ];
  }

  return {
    feedbackMessage,
    options,
    newState,
  };
}

/**
 * Procesează răspunsul la feedback
 * @param {string} feedbackResponse - Răspunsul utilizatorului (satisfied/show_more/refine/etc)
 * @param {Object} state - Starea curentă
 * @returns {Object} { reply, action, newState }
 */
function processFeedbackResponse(feedbackResponse, state = {}) {
  let reply = "";
  let action = null;
  let newState = { ...state, awaitingFeedback: false };

  switch (feedbackResponse) {
    case "satisfied":
      reply =
        "Super! 🎉 Mă bucur că te-am putut ajuta să găsești produse de la micii producători locali. Dacă mai ai nevoie de ceva, sunt aici!";
      action = "close_conversation";
      newState.conversationStep = "completed";
      break;

    case "show_more":
      reply =
        "Înțeles! Relaxez filtrele pentru a-ți arăta mai multe opțiuni... 🔍";
      action = "remove_filters";
      // Eliminăm filtre în ordine de importanță
      if (state.filters) {
        const newFilters = { ...state.filters };
        const removedFilters = [];

        // Eliminăm filtrul de culoare mai întâi (cel mai restrictiv)
        if (newFilters.color) {
          removedFilters.push(`culoare ${newFilters.color}`);
          delete newFilters.color;
        }
        // Apoi mărimea
        else if (newFilters.size) {
          removedFilters.push(`mărimea ${newFilters.size}`);
          delete newFilters.size;
        }
        // Apoi bugetul
        else if (newFilters.maxPrice) {
          removedFilters.push(`limita de preț`);
          delete newFilters.maxPrice;
        }
        // La final orașul
        else if (newFilters.city) {
          removedFilters.push(`orașul ${newFilters.city}`);
          delete newFilters.city;
        }

        if (removedFilters.length > 0) {
          reply = `Am eliminat filtrul pentru ${removedFilters.join(
            ", "
          )}. Iată mai multe opțiuni! ✨`;
        }
        newState.filters = newFilters;
      }
      newState.conversationStep = "showing_results";
      break;

    case "show_all":
      const category = state.filters?.category || "produse";
      reply = `Bine! Îți arăt toate ${category}le disponibile de la producătorii locali! 🛍️`;
      action = "clear_filters";
      // Păstrăm doar categoria, eliminăm restul
      if (state.filters) {
        newState.filters = {
          category: state.filters.category,
          smallBusinessOnly: state.filters.smallBusinessOnly,
        };
      }
      newState.conversationStep = "showing_results";
      break;

    case "refine":
      reply =
        "Perfect! 🎯 Spune-mi ce preferi și te ajut să găsești exact ce cauți!\n\nPoți menționa:\n• Culoarea (ex: roșu, albastru, verde)\n• Bugetul (ex: până în 100 lei)\n• Mărimea (ex: M, L, XL)\n• Orașul (ex: Cluj, București)";
      action = "ask_details";
      newState.conversationStep = "refining";
      newState.hasAskedDetails = true;
      break;

    case "search_new":
      reply =
        "Sigur! 🔄 Ce anume vrei să cauți?\n\nÎmi poți spune ce tip de produs cauți (ex: tricou, geantă, lumânări, bijuterii, etc.)";
      action = "reset";
      newState.filters = { smallBusinessOnly: true };
      newState.conversationStep = "initial";
      break;

    default:
      reply =
        "Nu am înțeles răspunsul. 🤔 Poți să-mi spui ce anume cauți sau să folosești butoanele de mai sus?";
      action = "continue";
      break;
  }

  return {
    reply,
    action,
    newState,
  };
}

module.exports = {
  processMessage,
  generateFeedback,
  processFeedbackResponse,
};
