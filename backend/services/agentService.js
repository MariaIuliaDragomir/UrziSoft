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
  ];
  for (const color of colors) {
    if (messageLower.includes(color)) {
      filters.color = color.replace("ș", "s"); // normalizare
      newState.hasColor = true;
      break;
    }
  }

  // Detectăm mărimea
  const sizes = ["xs", "s", "m", "l", "xl", "xxl"];
  for (const size of sizes) {
    if (
      messageLower.includes(size) ||
      messageLower.includes(size.toUpperCase())
    ) {
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
  ];
  for (const city of cities) {
    if (messageLower.includes(city)) {
      filters.city = city;
      newState.hasCity = true;
      break;
    }
  }

  // Detectăm bugetul (ex: "maxim 100 lei", "sub 80 ron", "100 lei", "buget 50 ron")
  const budgetMatch = messageLower.match(/(\d+)\s*(lei|ron)/);
  if (budgetMatch) {
    filters.maxPrice = parseInt(budgetMatch[1]) * 100; // convertim în bani
    newState.hasBudget = true;
  }

  // Detectăm și numere simple care pot reprezenta bugetul
  if (
    !newState.hasBudget &&
    messageLower.match(/buget|maxim|pana la|până la/)
  ) {
    const numberMatch = messageLower.match(/(\d+)/);
    if (numberMatch) {
      filters.maxPrice = parseInt(numberMatch[1]) * 100;
      newState.hasBudget = true;
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

module.exports = {
  processMessage,
};
