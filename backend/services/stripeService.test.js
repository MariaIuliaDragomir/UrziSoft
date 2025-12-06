// backend/services/stripeService.test.js
// Test izolat pentru gateway-ul Stripe

const { createCheckoutSession } = require("./stripeService");
const { stripe } = require("../config/stripe");

// Mock pentru Stripe SDK
jest.mock("../config/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}));

// Mock pentru productService
jest.mock("./productService", () => ({
  getProductById: jest.fn((id) => {
    const mockProducts = {
      "tricou-orange-1": {
        id: "tricou-orange-1",
        name: "Tricou Orange Sunset",
        price: 8900, // 89 RON în bani
        currency: "RON",
        image: "https://example.com/tricou.jpg",
        vendorName: "UrziClothing",
        vendorId: "vendor-1",
        city: "Cluj-Napoca",
      },
      "hanorac-albastru-2": {
        id: "hanorac-albastru-2",
        name: "Hanorac Albastru Ocean",
        price: 14900,
        currency: "RON",
        image: "https://example.com/hanorac.jpg",
        vendorName: "TrendyWear",
        vendorId: "vendor-2",
        city: "București",
      },
    };
    return mockProducts[id];
  }),
}));

describe("Stripe Gateway - Test Izolat", () => {
  beforeEach(() => {
    // Resetăm mock-urile înainte de fiecare test
    jest.clearAllMocks();
  });

  test("✅ Creează checkout session cu succes pentru un singur produs", async () => {
    // Arrange: Pregătim datele de test
    const mockSessionId = "cs_test_123456789";
    stripe.checkout.sessions.create.mockResolvedValue({
      id: mockSessionId,
      url: "https://checkout.stripe.com/pay/cs_test_123456789",
    });

    const items = [
      {
        productId: "tricou-orange-1",
        quantity: 2,
        selectedSize: "L",
      },
    ];

    // Act: Apelăm funcția
    const sessionId = await createCheckoutSession(items);

    // Assert: Verificăm rezultatul
    expect(sessionId).toBe(mockSessionId);
    expect(stripe.checkout.sessions.create).toHaveBeenCalledTimes(1);

    const callArgs = stripe.checkout.sessions.create.mock.calls[0][0];
    expect(callArgs.mode).toBe("payment");
    expect(callArgs.line_items).toHaveLength(1);
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(8900);
    expect(callArgs.line_items[0].quantity).toBe(2);
  });

  test("✅ Creează checkout session pentru coș multi-vendor", async () => {
    const mockSessionId = "cs_test_multivendor";
    stripe.checkout.sessions.create.mockResolvedValue({
      id: mockSessionId,
    });

    const items = [
      { productId: "tricou-orange-1", quantity: 1, selectedSize: "M" },
      { productId: "hanorac-albastru-2", quantity: 1, selectedSize: "L" },
    ];

    const sessionId = await createCheckoutSession(items);

    expect(sessionId).toBe(mockSessionId);

    const callArgs = stripe.checkout.sessions.create.mock.calls[0][0];
    expect(callArgs.line_items).toHaveLength(2);
    expect(callArgs.metadata.order_type).toBe("multi_vendor");
    expect(callArgs.metadata.total_vendors).toBe(2);
  });

  test("❌ Aruncă eroare dacă coșul este gol", async () => {
    await expect(createCheckoutSession([])).rejects.toThrow("Coșul este gol");
    await expect(createCheckoutSession(null)).rejects.toThrow("Coșul este gol");
  });

  test("❌ Aruncă eroare dacă produsul nu există", async () => {
    const items = [{ productId: "produs-inexistent", quantity: 1 }];

    await expect(createCheckoutSession(items)).rejects.toThrow(
      "Produsul produs-inexistent nu există"
    );
  });

  test("✅ Verifică configurația corectă a Stripe session", async () => {
    stripe.checkout.sessions.create.mockResolvedValue({
      id: "cs_test_config",
    });

    const items = [{ productId: "tricou-orange-1", quantity: 1 }];
    await createCheckoutSession(items);

    const config = stripe.checkout.sessions.create.mock.calls[0][0];

    // Verificăm URL-urile de success/cancel
    expect(config.success_url).toContain("/success.html");
    expect(config.success_url).toContain("{CHECKOUT_SESSION_ID}");
    expect(config.cancel_url).toBeDefined();

    // Verificăm metadata
    expect(config.metadata).toBeDefined();
    expect(config.metadata.order_type).toBe("multi_vendor");
  });

  test("✅ Formatează corect line_items pentru Stripe", async () => {
    stripe.checkout.sessions.create.mockResolvedValue({
      id: "cs_test_format",
    });

    const items = [
      { productId: "tricou-orange-1", quantity: 3, selectedSize: "XL" },
    ];

    await createCheckoutSession(items);

    const lineItem =
      stripe.checkout.sessions.create.mock.calls[0][0].line_items[0];

    expect(lineItem.price_data).toMatchObject({
      currency: "ron",
      unit_amount: 8900,
    });

    expect(lineItem.price_data.product_data).toMatchObject({
      name: "Tricou Orange Sunset",
      description: "UrziClothing - Cluj-Napoca",
      metadata: {
        vendor_id: "vendor-1",
        product_id: "tricou-orange-1",
        selected_size: "XL",
      },
    });

    expect(lineItem.quantity).toBe(3);
  });

  test("🔥 Simulare eroare Stripe API", async () => {
    stripe.checkout.sessions.create.mockRejectedValue(
      new Error("Stripe API error: Invalid API key")
    );

    const items = [{ productId: "tricou-orange-1", quantity: 1 }];

    await expect(createCheckoutSession(items)).rejects.toThrow(
      "Stripe API error"
    );
  });

  test("✅ Verifică gestionarea mai multor produse identice", async () => {
    stripe.checkout.sessions.create.mockResolvedValue({
      id: "cs_test_duplicate",
    });

    // Coș cu același produs adăugat de 2 ori (ar trebui combinat în frontend)
    const items = [
      { productId: "tricou-orange-1", quantity: 2, selectedSize: "M" },
      { productId: "tricou-orange-1", quantity: 1, selectedSize: "L" },
    ];

    await createCheckoutSession(items);

    const lineItems =
      stripe.checkout.sessions.create.mock.calls[0][0].line_items;
    // În implementarea actuală, fiecare item devine un line_item separat
    expect(lineItems).toHaveLength(2);
  });
});

describe("Stripe Gateway - Test de Integrare (opțional)", () => {
  // Acest test va rula doar dacă STRIPE_SECRET_KEY este setat
  // Altfel, îl sărește automat
  const shouldRunIntegrationTests =
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY.startsWith("sk_test_");

  const itif = (condition) => (condition ? it : it.skip);

  itif(shouldRunIntegrationTests)(
    "🔥 REAL API: Creează o sesiune Stripe reală",
    async () => {
      // ⚠️ ATENȚIE: Acest test face un request real la Stripe API
      // Rulează doar în test mode (sk_test_)

      // Unmock pentru acest test specific
      jest.unmock("../config/stripe");
      jest.unmock("./productService");

      const realStripeService = require("./stripeService");

      const items = [
        { productId: "tricou-orange-1", quantity: 1, selectedSize: "M" },
      ];

      try {
        const sessionId = await realStripeService.createCheckoutSession(items);
        expect(sessionId).toMatch(/^cs_test_/);
        console.log("✅ Sesiune Stripe creată cu succes:", sessionId);
      } catch (error) {
        console.error("❌ Eroare la testul real:", error.message);
        throw error;
      }
    },
    10000
  ); // Timeout mai mare pentru API real
});
