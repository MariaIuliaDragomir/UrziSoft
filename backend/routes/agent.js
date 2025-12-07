// backend/routes/agent.js
// Endpoint pentru conversația cu AI Agent

const express = require("express");
const router = express.Router();
const {
  processMessage,
  generateFeedback,
  processFeedbackResponse,
} = require("../services/agentService");

/**
 * POST /api/agent/message
 * Body: { message: "vreau un tricou portocaliu", state: {...} }
 * Response: { reply: "...", filters: {...}, newState: {...} }
 */
router.post("/message", (req, res) => {
  try {
    const { message, state } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Mesajul este obligatoriu",
      });
    }

    // Procesăm mesajul prin agent
    const result = processMessage(message, state || {});

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Eroare la procesarea mesajului:", error);
    res.status(500).json({
      success: false,
      error: "Eroare la procesarea mesajului",
      reply: "Ne pare rău, am întâmpinat o eroare. Te rog încearcă din nou!",
    });
  }
});

/**
 * POST /api/agent/feedback
 * Body: { resultsCount: 5, filters: {...}, state: {...} }
 * Response: { feedbackMessage: "...", options: [...], newState: {...} }
 */
router.post("/feedback", (req, res) => {
  try {
    const { resultsCount, filters, state } = req.body;

    if (typeof resultsCount !== "number") {
      return res.status(400).json({
        success: false,
        error: "resultsCount este obligatoriu",
      });
    }

    const result = generateFeedback(resultsCount, filters || {}, state || {});

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Eroare la generarea feedback:", error);
    res.status(500).json({
      success: false,
      error: "Eroare la generarea feedback",
    });
  }
});

/**
 * POST /api/agent/feedback-response
 * Body: { feedbackResponse: "satisfied", state: {...} }
 * Response: { reply: "...", action: "...", newState: {...} }
 */
router.post("/feedback-response", (req, res) => {
  try {
    const { feedbackResponse, state } = req.body;

    if (!feedbackResponse || typeof feedbackResponse !== "string") {
      return res.status(400).json({
        success: false,
        error: "feedbackResponse este obligatoriu",
      });
    }

    const result = processFeedbackResponse(feedbackResponse, state || {});

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Eroare la procesarea feedback-ului:", error);
    res.status(500).json({
      success: false,
      error: "Eroare la procesarea feedback-ului",
    });
  }
});

module.exports = router;
