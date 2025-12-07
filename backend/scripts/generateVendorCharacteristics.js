// backend/scripts/generateVendorCharacteristics.js
// Script pentru a genera caracteristici automate pentru toți vendorii

const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "../data/products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

// Extragem toți vendorii unici
const vendors = {};
products.forEach((product) => {
  if (product.vendorId && !vendors[product.vendorId]) {
    vendors[product.vendorId] = {
      id: product.vendorId,
      name: product.vendorName,
      city: product.city,
      isSmallBusiness: product.isSmallBusiness,
    };
  }
});

console.log(`\n📊 Găsiți ${Object.keys(vendors).length} vendori unici\n`);

// Generăm caracteristici aleatorii dar realiste
const characteristics = {};

Object.keys(vendors).forEach((vendorId) => {
  const vendor = vendors[vendorId];
  const isSmall = vendor.isSmallBusiness;

  // Generăm caracteristici în funcție de isSmallBusiness
  if (isSmall) {
    // Firme mici: 1-25 angajați, <1M RON cifră afaceri
    characteristics[vendorId] = {
      employees: Math.floor(Math.random() * 20) + 1, // 1-20
      yearFounded: 2015 + Math.floor(Math.random() * 10), // 2015-2024
      annualRevenue: Math.floor(Math.random() * 800000) + 50000, // 50k-850k RON
      locationsCount: Math.random() > 0.7 ? 2 : 1, // Majoritatea au 1 locație
      hasOnlineStore: Math.random() > 0.3, // 70% au online
      hasPhysicalStores: Math.random() > 0.4, // 60% au fizic
      monthlyOrders: Math.floor(Math.random() * 200) + 20, // 20-220 comenzi/lună
    };
  } else {
    // Firme mari: 50-500 angajați, 1M-20M RON
    characteristics[vendorId] = {
      employees: Math.floor(Math.random() * 400) + 50, // 50-450
      yearFounded: 2000 + Math.floor(Math.random() * 15), // 2000-2014
      annualRevenue: Math.floor(Math.random() * 15000000) + 1000000, // 1M-16M RON
      locationsCount: Math.floor(Math.random() * 15) + 3, // 3-17 locații
      hasOnlineStore: true, // Toate au online
      hasPhysicalStores: true, // Toate au fizic
      monthlyOrders: Math.floor(Math.random() * 3000) + 500, // 500-3500 comenzi/lună
    };
  }
});

// Afișăm câteva exemple
console.log("📋 Exemple de caracteristici generate:\n");
const exampleVendors = Object.keys(vendors).slice(0, 5);
exampleVendors.forEach((vendorId) => {
  const vendor = vendors[vendorId];
  const chars = characteristics[vendorId];
  console.log(`${vendor.name} (${vendorId}):`);
  console.log(
    `  Tip: ${vendor.isSmallBusiness ? "Small Business" : "Large Business"}`
  );
  console.log(`  Angajați: ${chars.employees}`);
  console.log(
    `  Cifră afaceri: ${chars.annualRevenue.toLocaleString("ro-RO")} RON`
  );
  console.log(`  Fondată: ${chars.yearFounded}`);
  console.log(`  Locații: ${chars.locationsCount}`);
  console.log(
    `  Online: ${chars.hasOnlineStore ? "Da" : "Nu"}, Fizic: ${
      chars.hasPhysicalStores ? "Da" : "Nu"
    }`
  );
  console.log(`  Comenzi/lună: ${chars.monthlyOrders}`);
  console.log("");
});

// Generăm codul pentru businessSizeClassifier.js
console.log("\n📝 Cod generat pentru VENDOR_CHARACTERISTICS:\n");
console.log("const VENDOR_CHARACTERISTICS = {");

Object.keys(characteristics).forEach((vendorId) => {
  const chars = characteristics[vendorId];
  console.log(`  "${vendorId}": {`);
  console.log(`    employees: ${chars.employees},`);
  console.log(`    yearFounded: ${chars.yearFounded},`);
  console.log(`    annualRevenue: ${chars.annualRevenue},`);
  console.log(`    locationsCount: ${chars.locationsCount},`);
  console.log(`    hasOnlineStore: ${chars.hasOnlineStore},`);
  console.log(`    hasPhysicalStores: ${chars.hasPhysicalStores},`);
  console.log(`    monthlyOrders: ${chars.monthlyOrders},`);
  console.log(`  },`);
});

console.log("};\n");

console.log(
  `\n✅ Generat! Copiază codul de mai sus în businessSizeClassifier.js\n`
);
