// backend/services/businessSizeClassifier.js
// Clasificare automată a mărimii business-ului bazat pe caracteristici

/**
 * Caracteristici pentru fiecare vendor
 * Generate automat bazat pe tipul de business (small/large) din products.json
 * Toate cele 63 de vendori unici au acum caracteristici realiste
 */
const VENDOR_CHARACTERISTICS = {
  vendor_blackline_bucuresti: {
    employees: 395,
    yearFounded: 2014,
    annualRevenue: 9471704,
    locationsCount: 5,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1351,
  },
  vendor_urbanfit_cluj: {
    employees: 2,
    yearFounded: 2015,
    annualRevenue: 804416,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 162,
  },
  vendor_industhome_brasov: {
    employees: 227,
    yearFounded: 2004,
    annualRevenue: 1715889,
    locationsCount: 6,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 564,
  },
  vendor_travelgo_iasi: {
    employees: 7,
    yearFounded: 2022,
    annualRevenue: 522050,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 83,
  },
  vendor_soundmax_timis: {
    employees: 106,
    yearFounded: 2012,
    annualRevenue: 1478366,
    locationsCount: 9,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1707,
  },
  vendor_knitmania_oradea: {
    employees: 15,
    yearFounded: 2020,
    annualRevenue: 244409,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 182,
  },
  vendor_aromahome_sibiu: {
    employees: 5,
    yearFounded: 2015,
    annualRevenue: 150242,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 168,
  },
  vendor_fitline_bucuresti: {
    employees: 365,
    yearFounded: 2012,
    annualRevenue: 9762525,
    locationsCount: 11,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1258,
  },
  vendor_steelplus_constanta: {
    employees: 78,
    yearFounded: 2012,
    annualRevenue: 15985291,
    locationsCount: 16,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 2126,
  },
  vendor_softnest_bacau: {
    employees: 11,
    yearFounded: 2020,
    annualRevenue: 471731,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 48,
  },
  vendor_winterline_cluj: {
    employees: 123,
    yearFounded: 2003,
    annualRevenue: 11850541,
    locationsCount: 13,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1132,
  },
  vendor_techup_bucuresti: {
    employees: 320,
    yearFounded: 2006,
    annualRevenue: 11133359,
    locationsCount: 17,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 2037,
  },
  vendor_hydrate_iasi: {
    employees: 2,
    yearFounded: 2017,
    annualRevenue: 427623,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 129,
  },
  vendor_fitgear_brasov: {
    employees: 223,
    yearFounded: 2006,
    annualRevenue: 13523548,
    locationsCount: 13,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 955,
  },
  vendor_handcraft_sibiu: {
    employees: 19,
    yearFounded: 2023,
    annualRevenue: 654000,
    locationsCount: 1,
    hasOnlineStore: false,
    hasPhysicalStores: true,
    monthlyOrders: 158,
  },
  vendor_silverlinx_bucuresti: {
    employees: 247,
    yearFounded: 2005,
    annualRevenue: 3549210,
    locationsCount: 10,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 3173,
  },
  vendor_techpoint_constanta: {
    employees: 262,
    yearFounded: 2006,
    annualRevenue: 8127088,
    locationsCount: 12,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 953,
  },
  vendor_sleepease_bacau: {
    employees: 16,
    yearFounded: 2018,
    annualRevenue: 585397,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 39,
  },
  vendor_naturline_oradea: {
    employees: 9,
    yearFounded: 2015,
    annualRevenue: 725288,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 54,
  },
  vendor_cottonline_cluj: {
    employees: 54,
    yearFounded: 2006,
    annualRevenue: 4707008,
    locationsCount: 15,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 827,
  },
  vendor_streetstyle_bucuresti: {
    employees: 236,
    yearFounded: 2014,
    annualRevenue: 10604894,
    locationsCount: 16,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 866,
  },
  vendor_cookmate_cluj: {
    employees: 14,
    yearFounded: 2020,
    annualRevenue: 470771,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 194,
  },
  vendor_soundsphere_timis: {
    employees: 169,
    yearFounded: 2005,
    annualRevenue: 15983933,
    locationsCount: 12,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 709,
  },
  vendor_casehouse_oradea: {
    employees: 2,
    yearFounded: 2019,
    annualRevenue: 429578,
    locationsCount: 1,
    hasOnlineStore: false,
    hasPhysicalStores: false,
    monthlyOrders: 140,
  },
  vendor_bluefit_bucuresti: {
    employees: 105,
    yearFounded: 2010,
    annualRevenue: 4734777,
    locationsCount: 8,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1736,
  },
  vendor_decorly_sibiu: {
    employees: 15,
    yearFounded: 2021,
    annualRevenue: 367978,
    locationsCount: 1,
    hasOnlineStore: false,
    hasPhysicalStores: false,
    monthlyOrders: 190,
  },
  vendor_walkme_constanta: {
    employees: 368,
    yearFounded: 2001,
    annualRevenue: 3836008,
    locationsCount: 12,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 3406,
  },
  vendor_paperjoy_bacau: {
    employees: 1,
    yearFounded: 2023,
    annualRevenue: 778903,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 192,
  },
  vendor_greenhome_iasi: {
    employees: 5,
    yearFounded: 2023,
    annualRevenue: 631796,
    locationsCount: 1,
    hasOnlineStore: false,
    hasPhysicalStores: true,
    monthlyOrders: 158,
  },
  vendor_bagstudio_cluj: {
    employees: 2,
    yearFounded: 2023,
    annualRevenue: 145915,
    locationsCount: 2,
    hasOnlineStore: false,
    hasPhysicalStores: false,
    monthlyOrders: 194,
  },
  vendor_elegance_sibiu: {
    employees: 438,
    yearFounded: 2012,
    annualRevenue: 3062904,
    locationsCount: 6,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1437,
  },
  vendor_relaxhome_brasov: {
    employees: 7,
    yearFounded: 2019,
    annualRevenue: 597374,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 175,
  },
  vendor_warmknit_oradea: {
    employees: 19,
    yearFounded: 2015,
    annualRevenue: 604549,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 187,
  },
  vendor_sunglasshub_bucuresti: {
    employees: 324,
    yearFounded: 2004,
    annualRevenue: 12890492,
    locationsCount: 4,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1445,
  },
  vendor_timeless_cluj: {
    employees: 116,
    yearFounded: 2006,
    annualRevenue: 9416118,
    locationsCount: 5,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 2655,
  },
  vendor_glamourline_sibiu: {
    employees: 19,
    yearFounded: 2017,
    annualRevenue: 412584,
    locationsCount: 1,
    hasOnlineStore: false,
    hasPhysicalStores: false,
    monthlyOrders: 78,
  },
  vendor_kitchenpro_cluj: {
    employees: 316,
    yearFounded: 2003,
    annualRevenue: 6039990,
    locationsCount: 14,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 644,
  },
  vendor_outdoorlife_brasov: {
    employees: 229,
    yearFounded: 2000,
    annualRevenue: 15608443,
    locationsCount: 12,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 3215,
  },
  vendor_homeart_sibiu: {
    employees: 16,
    yearFounded: 2024,
    annualRevenue: 638502,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 91,
  },
  vendor_streethype_bucuresti: {
    employees: 329,
    yearFounded: 2001,
    annualRevenue: 5465700,
    locationsCount: 3,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1688,
  },
  vendor_naturblend_oradea: {
    employees: 3,
    yearFounded: 2022,
    annualRevenue: 732877,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 160,
  },
  vendor_cozyfeet_bacau: {
    employees: 3,
    yearFounded: 2017,
    annualRevenue: 548633,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 51,
  },
  vendor_beautyflora_sibiu: {
    employees: 5,
    yearFounded: 2018,
    annualRevenue: 801975,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 135,
  },
  vendor_studykids_cluj: {
    employees: 122,
    yearFounded: 2010,
    annualRevenue: 4453493,
    locationsCount: 9,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1773,
  },
  vendor_kidlight_bucuresti: {
    employees: 292,
    yearFounded: 2012,
    annualRevenue: 14647313,
    locationsCount: 8,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 3061,
  },
  vendor_gametech_constanta: {
    employees: 178,
    yearFounded: 2012,
    annualRevenue: 14742774,
    locationsCount: 8,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1500,
  },
  vendor_softtouch_iasi: {
    employees: 6,
    yearFounded: 2019,
    annualRevenue: 201929,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 171,
  },
  vendor_beads_sibiu: {
    employees: 13,
    yearFounded: 2024,
    annualRevenue: 844024,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 102,
  },
  vendor_ridex_cluj: {
    employees: 403,
    yearFounded: 2014,
    annualRevenue: 1019308,
    locationsCount: 13,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1354,
  },
  vendor_workspace_bacau: {
    employees: 4,
    yearFounded: 2015,
    annualRevenue: 390485,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 217,
  },
  vendor_softcotton_cluj: {
    employees: 12,
    yearFounded: 2023,
    annualRevenue: 107563,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 69,
  },
  vendor_sportflex_bucuresti: {
    employees: 357,
    yearFounded: 2000,
    annualRevenue: 4544984,
    locationsCount: 8,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 3242,
  },
  vendor_homearoma_sibiu: {
    employees: 7,
    yearFounded: 2023,
    annualRevenue: 317394,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 116,
  },
  vendor_sportmax_constanta: {
    employees: 77,
    yearFounded: 2014,
    annualRevenue: 5862925,
    locationsCount: 10,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1760,
  },
  vendor_naturline_iasi: {
    employees: 7,
    yearFounded: 2018,
    annualRevenue: 59719,
    locationsCount: 1,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 188,
  },
  vendor_steelwave_constanta: {
    employees: 207,
    yearFounded: 2006,
    annualRevenue: 11466268,
    locationsCount: 8,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 984,
  },
  vendor_basix_bucuresti: {
    employees: 164,
    yearFounded: 2013,
    annualRevenue: 15001968,
    locationsCount: 9,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 3047,
  },
  vendor_gardenlife_iasi: {
    employees: 11,
    yearFounded: 2018,
    annualRevenue: 801165,
    locationsCount: 2,
    hasOnlineStore: true,
    hasPhysicalStores: false,
    monthlyOrders: 177,
  },
  vendor_soundpulse_timis: {
    employees: 338,
    yearFounded: 2005,
    annualRevenue: 14246334,
    locationsCount: 4,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 2043,
  },
  vendor_cleanhome_iasi: {
    employees: 393,
    yearFounded: 2000,
    annualRevenue: 4383940,
    locationsCount: 13,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 833,
  },
  vendor_lightup_iasi: {
    employees: 121,
    yearFounded: 2008,
    annualRevenue: 3579881,
    locationsCount: 15,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1840,
  },
  vendor_travelpro_brasov: {
    employees: 265,
    yearFounded: 2013,
    annualRevenue: 11497178,
    locationsCount: 3,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 1880,
  },
  vendor_autogrip_iasi: {
    employees: 223,
    yearFounded: 2001,
    annualRevenue: 4089817,
    locationsCount: 17,
    hasOnlineStore: true,
    hasPhysicalStores: true,
    monthlyOrders: 2616,
  },
};

/**
 * Clasifică mărimea business-ului bazat pe caracteristici
 * Returnează un scor: 100 = cel mai mic business, 0 = cel mai mare
 *
 * Criterii conform UE:
 * - Micro: <10 angajați, <2M EUR cifră afaceri
 * - Mică: <50 angajați, <10M EUR cifră afaceri
 * - Medie: <250 angajați, <50M EUR cifră afaceri
 * - Mare: >250 angajați sau >50M EUR
 *
 * @param {string} vendorId - ID-ul vendorului
 * @returns {number} Scor 0-100 (100 = cel mai mic business)
 */
function calculateSmallBusinessScore(vendorId) {
  const characteristics = VENDOR_CHARACTERISTICS[vendorId];

  // Dacă nu avem date, presupunem business mediu (scor 50)
  if (!characteristics) {
    return 50;
  }

  let score = 0;

  // 1. Număr angajați (30 puncte max)
  // <5 = 30p, 5-10 = 25p, 10-25 = 20p, 25-50 = 15p, 50-100 = 10p, 100-250 = 5p, >250 = 0p
  if (characteristics.employees < 5) {
    score += 30;
  } else if (characteristics.employees < 10) {
    score += 25;
  } else if (characteristics.employees < 25) {
    score += 20;
  } else if (characteristics.employees < 50) {
    score += 15;
  } else if (characteristics.employees < 100) {
    score += 10;
  } else if (characteristics.employees < 250) {
    score += 5;
  }
  // >250 = 0 puncte

  // 2. Cifră de afaceri (25 puncte max)
  // <100k = 25p, 100k-500k = 20p, 500k-1M = 15p, 1M-5M = 10p, 5M-10M = 5p, >10M = 0p
  const revenue = characteristics.annualRevenue;
  if (revenue < 100000) {
    score += 25;
  } else if (revenue < 500000) {
    score += 20;
  } else if (revenue < 1000000) {
    score += 15;
  } else if (revenue < 5000000) {
    score += 10;
  } else if (revenue < 10000000) {
    score += 5;
  }
  // >10M = 0 puncte

  // 3. Vechime (15 puncte max)
  // <3 ani = 15p, 3-5 ani = 12p, 5-10 ani = 8p, 10-20 ani = 5p, >20 ani = 2p
  const currentYear = new Date().getFullYear();
  const age = currentYear - characteristics.yearFounded;
  if (age < 3) {
    score += 15;
  } else if (age < 5) {
    score += 12;
  } else if (age < 10) {
    score += 8;
  } else if (age < 20) {
    score += 5;
  } else {
    score += 2;
  }

  // 4. Număr locații (10 puncte max)
  // 1 locație = 10p, 2-3 = 7p, 4-6 = 4p, >6 = 0p
  if (characteristics.locationsCount === 1) {
    score += 10;
  } else if (characteristics.locationsCount <= 3) {
    score += 7;
  } else if (characteristics.locationsCount <= 6) {
    score += 4;
  }

  // 5. Comenzi lunare (10 puncte max)
  // <50 = 10p, 50-100 = 8p, 100-300 = 6p, 300-1000 = 4p, >1000 = 0p
  const orders = characteristics.monthlyOrders;
  if (orders < 50) {
    score += 10;
  } else if (orders < 100) {
    score += 8;
  } else if (orders < 300) {
    score += 6;
  } else if (orders < 1000) {
    score += 4;
  }

  // 6. Bonus pentru business 100% digital sau 100% fizic (10 puncte max)
  // Afacerile foarte mici tind să fie doar online sau doar fizice
  const isOnlineOnly =
    characteristics.hasOnlineStore && !characteristics.hasPhysicalStores;
  const isPhysicalOnly =
    !characteristics.hasOnlineStore && characteristics.hasPhysicalStores;

  if (isOnlineOnly || isPhysicalOnly) {
    score += 10;
  } else if (
    characteristics.hasOnlineStore &&
    characteristics.hasPhysicalStores
  ) {
    score += 5; // Prezență mixtă = business mai mare
  }

  // Total maxim posibil: 100 puncte
  return Math.min(100, score);
}

/**
 * Determină categoria de business
 * @param {number} score - Scorul calculat (0-100)
 * @returns {string} 'micro' | 'small' | 'medium' | 'large'
 */
function getBusinessCategory(score) {
  if (score >= 80) return "micro"; // 80-100: Micro business
  if (score >= 60) return "small"; // 60-79: Small business
  if (score >= 30) return "medium"; // 30-59: Medium business
  return "large"; // 0-29: Large business
}

/**
 * Verifică dacă un vendor este small business (micro sau small)
 * @param {string} vendorId
 * @returns {boolean}
 */
function isSmallBusiness(vendorId) {
  const score = calculateSmallBusinessScore(vendorId);
  return score >= 60; // Micro (80+) sau Small (60-79)
}

/**
 * Adaugă caracteristici noi pentru un vendor
 * @param {string} vendorId
 * @param {Object} characteristics
 */
function addVendorCharacteristics(vendorId, characteristics) {
  VENDOR_CHARACTERISTICS[vendorId] = characteristics;
}

/**
 * Obține toate caracteristicile pentru un vendor
 * @param {string} vendorId
 * @returns {Object|null}
 */
function getVendorCharacteristics(vendorId) {
  return VENDOR_CHARACTERISTICS[vendorId] || null;
}

module.exports = {
  calculateSmallBusinessScore,
  getBusinessCategory,
  isSmallBusiness,
  addVendorCharacteristics,
  getVendorCharacteristics,
  VENDOR_CHARACTERISTICS,
};
