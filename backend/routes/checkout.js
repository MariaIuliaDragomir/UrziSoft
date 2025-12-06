// backend/routes/checkout.js
// Endpoint pentru crearea Stripe Checkout Session

const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../services/stripeService");
const { publishableKey } = require("../config/stripe");

/**
 * POST /api/checkout/session
 * Body: { items: [{ productId, quantity, selectedSize }] }
 * Response: { sessionId: "cs_test_..." }
 */
router.post("/session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Coșul este gol",
      });
    }

    const sessionId = await createCheckoutSession(items);

    res.json({
      success: true,
      sessionId,
    });
  } catch (error) {
    console.error("Eroare la crearea checkout session:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Eroare la procesarea plății",
    });
  }
});

/**
 * GET /api/checkout/config
 * Returnează cheia publică Stripe pentru frontend
 */
router.get("/config", (req, res) => {
  console.log("📤 Frontend cere Stripe config");

  if (!publishableKey) {
    console.error("❌ STRIPE_PUBLISHABLE_KEY lipsește din .env!");
    return res.status(500).json({
      success: false,
      error: "Stripe nu este configurat. Verifică fișierul .env!",
    });
  }

  console.log(
    `✅ Trimit publishable key: ${publishableKey.substring(0, 20)}...`
  );

  res.json({
    success: true,
    publishableKey,
  });
});

module.exports = router;
